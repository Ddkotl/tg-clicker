import { profileRepository } from "@/entities/profile/index.server";
import { FIGHT_CHARGE_REGEN_INTERVAL, FIGHT_COOLDOWN, MAX_CHARGES } from "@/shared/game_config/fight/fight_const";
import { FighterSnapshot, FightLog, FightResRewards, FightSnapshot } from "@/entities/fights/_domain/types";
import { fightRepository } from "@/entities/fights/index.server";
import { EnemyType, FightResult, FightType } from "@/_generated/prisma";
import { recalcHp } from "@/features/hp_regen/recalc_hp";
import { recalcQi } from "@/features/qi_regen/recalc_qi";
import dayjs from "dayjs";

export class FightService {
  constructor(
    private profileRepo = profileRepository,
    private fightRepo = fightRepository,
  ) {}

  async restoreFightCharges(userId: string) {
    let profile = await this.profileRepo.getByUserId({ userId: userId });
    if (!profile) return null;

    const now = new Date();
    const lastRecovery = profile.last_charge_recovery ?? now;
    const diff_time = now.getTime() - lastRecovery.getTime();

    if (diff_time < FIGHT_CHARGE_REGEN_INTERVAL) return profile;

    const chargesToAdd = Math.floor(diff_time / FIGHT_CHARGE_REGEN_INTERVAL);
    const newCharges = Math.min(MAX_CHARGES, profile.fight_charges + chargesToAdd);
    const newLastChargeRecovery = new Date(lastRecovery.getTime() + chargesToAdd * FIGHT_CHARGE_REGEN_INTERVAL);

    if (newCharges > profile.fight_charges) {
      profile = await this.profileRepo.updateFightCharges({
        userId: userId,
        fight_charges: newCharges,
        last_charge_recovery: newLastChargeRecovery,
      });
    }

    return profile;
  }

  private async canFight(userId: string) {
    const profile = await this.restoreFightCharges(userId);
    if (!profile) return null;

    const now = new Date();
    if (profile.last_fight_time) {
      const diff = now.getTime() - profile.last_fight_time.getTime();
      if (diff < FIGHT_COOLDOWN) {
        return null;
      }
    }

    if (profile.fight_charges <= 0) {
      return null;
    }

    return profile;
  }
  private async simulateBattle(player: FighterSnapshot, enemy: FighterSnapshot) {
    const log: FightLog = [];

    let playerHp = player.currentHp;
    let enemyHp = enemy.currentHp;

    let totalPlayerDamage = 0;
    let totalEnemyDamage = 0;

    for (let round = 1; round <= 10; round++) {
      // Если кто-то уже умер — прекращаем
      if (playerHp <= 0 || enemyHp <= 0) break;

      // === Player attacks ===
      const playerDamage = Math.max(1, player.power - enemy.protection);
      enemyHp -= playerDamage;
      totalPlayerDamage += playerDamage;

      log.push({
        timestamp: new Date().toISOString(),
        attacker: "player",
        damage: playerDamage,
        attackerHpAfter: playerHp,
        defenderHpAfter: Math.max(0, enemyHp),
        text: `Round ${round}: ${player.name} attacks ${enemy.name} for ${playerDamage} damage.`,
      });

      if (enemyHp <= 0) break;

      // === Enemy attacks ===
      const enemyDamage = Math.max(1, enemy.power - player.protection);
      playerHp -= enemyDamage;
      totalEnemyDamage += enemyDamage;

      log.push({
        timestamp: new Date().toISOString(),
        attacker: "enemy",
        damage: enemyDamage,
        attackerHpAfter: enemyHp,
        defenderHpAfter: Math.max(0, playerHp),
        text: `Round ${round}: ${enemy.name} attacks ${player.name} for ${enemyDamage} damage.`,
      });
    }

    // === Determine result ===
    let result: FightResult;

    if (playerHp <= 0 && enemyHp > 0) {
      result = "LOSE";
    } else if (enemyHp <= 0 && playerHp > 0) {
      result = "WIN";
    } else if (totalPlayerDamage > totalEnemyDamage) {
      result = "WIN";
    } else if (totalEnemyDamage > totalPlayerDamage) {
      result = "LOSE";
    } else {
      // Damage equal → compare HP
      if (playerHp > enemyHp) result = "WIN";
      else if (enemyHp > playerHp) result = "LOSE";
      else result = "DRAW";
    }

    return {
      result,
      log,
    };
  }

  private async generateEnemy(playerSnapshot: FighterSnapshot) {
    const enemy: FighterSnapshot = {
      name: "Демонический зверь",
      power: Math.max(1, playerSnapshot.power + Math.floor(Math.random() * 5 - 2)),
      protection: Math.max(1, playerSnapshot.protection + Math.floor(Math.random() * 5 - 2)),
      speed: Math.max(1, playerSnapshot.speed + Math.floor(Math.random() * 5 - 2)),
      skill: Math.max(1, playerSnapshot.skill + Math.floor(Math.random() * 5 - 2)),
      currentHp: 50 + Math.floor(Math.random() * 20),
      maxHp: 50 + Math.floor(Math.random() * 20),
    };
    return enemy;
  }
  private async calculateRewards(enemy: FighterSnapshot) {
    return {
      exp: enemy.power,
      qi: enemy.power,
      qiStone: Math.floor(enemy.power / 5),
      glory: 1,
    };
  }

  async startFight({ userId, enemyType, fightType }: { userId: string; enemyType: EnemyType; fightType: FightType }) {
    const hp = await recalcHp(userId);
    if (hp === null) return null;
    const qi = await recalcQi(userId);
    if (qi === null) return null;
    const restore = await this.restoreFightCharges(userId);
    if (!restore) return restore;

    const check = await this.canFight(userId);
    if (!check) return check;

    // Use transaction: create fight, spend charge, calculate battle, finish fight, update profile and stats
    const profile = await this.profileRepo.spendFightCharge({ userId: userId });
    if (!profile) return null;
    const attackerSnapshot: FighterSnapshot = {
      userId: profile.userId,
      name: profile.nikname ?? "Unknown",
      power: profile.power,
      protection: profile.protection,
      speed: profile.speed,
      skill: profile.skill,
      currentHp: profile.current_hitpoint,
      maxHp: profile.max_hitpoint,
    };
    const enemySnapshot: FighterSnapshot = await this.generateEnemy(attackerSnapshot);

    const fightSnapshot: FightSnapshot = {
      player: attackerSnapshot,
      enemy: enemySnapshot,
    };

    const fight = await this.fightRepo.createFight({
      attackerId: userId,
      enemyType: enemyType,
      fightType: fightType,
      fightSnapshot: fightSnapshot,
    });

    return fight;
  }

  async atack(userId: string) {
    let fight = await this.fightRepo.getPendingFightByAtackserId({ attackserId: userId });
    if (!fight) return fight;
    if (dayjs().diff(dayjs(fight.startedAt), "second") >= 10) {
      fight = await this.startFight({ userId: userId, enemyType: fight.enemyType, fightType: fight.type });
    }
    if (!fight) return fight;
    const snapshot: FightSnapshot = fight.snapshot as FightSnapshot;
    const { log, result } = await this.simulateBattle(snapshot.player, snapshot.enemy);
    if (result === FightResult.WIN) {
      const rewards: FightResRewards = await this.calculateRewards(snapshot.enemy);
      await this.profileRepo.updateResources({
        userId: userId,
        resources: {
          exp: rewards.exp,
          qi: rewards.qi,
          qi_stone: rewards.qiStone,
          spirit_cristal: rewards.spiritCristal,
          glory: rewards.glory,
        },
      });

      const finished_fight = await this.fightRepo.finishFight({
        fightId: fight.id,
        fightLog: log,
        result: "WIN",
        rewards: rewards,
      });
      return finished_fight;
    } else {
      const finished_fight = await this.fightRepo.finishFight({
        fightId: fight.id,
        fightLog: log,
        result: "LOSE",
        rewards: { exp: 0, qi: 0, qiStone: 0, glory: 0 },
      });
      return finished_fight;
    }
  }
}

export const fightService = new FightService();
