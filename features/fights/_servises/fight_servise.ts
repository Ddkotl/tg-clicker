import { profileRepository } from "@/entities/profile/index.server";
import { FIGHT_CHARGE_REGEN_INTERVAL, FIGHT_COOLDOWN, FIGHT_MAX_CHARGES } from "@/shared/game_config/fight/fight_const";
import {
  FighterSnapshot,
  FightLog,
  FightResLossesSchema,
  FightResRewards,
  FightSnapshot,
} from "@/entities/fights/_domain/types";
import { fightRepository } from "@/entities/fights/index.server";
import { EnemyType, FactsStatus, FactsType, FightResult, FightStatus, FightType } from "@/_generated/prisma";
import { recalcHp } from "@/features/hp_regen/recalc_hp";
import { recalcQi } from "@/features/qi_regen/recalc_qi";
import dayjs from "dayjs";
import { dataBase, TransactionType } from "@/shared/connect/db_connect";
import { img_paths } from "@/shared/lib/img_paths";
import { SupportedLang } from "@/features/translations/translate_type";
import { translate } from "@/features/translations/server/translate_fn";
import { getPastedIntervals } from "@/shared/game_config/getPastedIntervals";
import { checkUserDeals } from "@/entities/user/_repositories/check_user_deals";
import { statisticRepository } from "@/entities/statistics/index.server";
import { factsRepository } from "@/entities/facts/index.server";
import { IsCooldown } from "@/shared/game_config/isColdown";

export class FightService {
  constructor(
    private profileRepo = profileRepository,
    private fightRepo = fightRepository,
    private factsRepo = factsRepository,
  ) {}

  async restoreFightCharges({ userId, tx }: { userId: string; tx?: TransactionType }) {
    let profile = await this.profileRepo.getByUserId({ userId: userId, tx: tx });
    if (!profile) throw new Error("Profile not found");

    const now = new Date().getTime();
    const lastRecovery = profile.last_charge_recovery?.getTime() ?? now;
    const { past_intervals, new_last_action_date } = getPastedIntervals({
      now_ms: now,
      last_action_ms: lastRecovery,
      interval_ms: FIGHT_CHARGE_REGEN_INTERVAL,
    });
    const newCharges = Math.min(FIGHT_MAX_CHARGES, profile.fight_charges + past_intervals);

    if (newCharges > profile.fight_charges) {
      profile = await this.profileRepo.updateFightCharges({
        userId: userId,
        tx: tx,
        fight_charges: newCharges,
        last_charge_recovery: newCharges === FIGHT_MAX_CHARGES ? new Date() : new_last_action_date,
      });
    }
    if (!profile) throw new Error("Profile not updated");
    return profile;
  }

  private async canFight({ userId, tx }: { userId: string; tx?: TransactionType }) {
    const profile = await this.restoreFightCharges({ userId: userId, tx: tx });
    if (!profile) throw new Error("Profile not found");
    const user_deals = await checkUserDeals({ userId: userId, tx: tx });
    if (!user_deals || user_deals === null || user_deals !== "ок") throw new Error("User deals check failed");
    if (profile.last_fight_time) {
      const is_cooldown = IsCooldown({
        cooldown_time: FIGHT_COOLDOWN,
        last_action_time: profile.last_fight_time.getTime(),
      });
      if (is_cooldown) {
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
      else result = "LOSE";
    }

    return {
      result,
      log,
      totalPlayerDamage,
      totalEnemyDamage,
      playerHp,
      enemyHp,
    };
  }

  private async generateEnemy({
    playerSnapshot,
    enemyType,
    lang,
  }: {
    playerSnapshot: FighterSnapshot;
    enemyType: EnemyType;
    lang: SupportedLang;
  }) {
    const enemy: FighterSnapshot = {
      name: translate(`fight.oponents.${enemyType}`, lang),
      power: Math.max(1, playerSnapshot.power + Math.floor(Math.random() * 5 - 2)),
      protection: Math.max(1, playerSnapshot.protection + Math.floor(Math.random() * 5 - 2)),
      speed: Math.max(1, playerSnapshot.speed + Math.floor(Math.random() * 5 - 2)),
      skill: Math.max(1, playerSnapshot.skill + Math.floor(Math.random() * 5 - 2)),
      qi_param: Math.max(1, playerSnapshot.qi_param + Math.floor(Math.random() * 5 - 2)),
      avatar_url: img_paths.fight_list.demonic_beast(),
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
  private async calculateLosses(player: FighterSnapshot) {
    return {
      qi: player.power,
      qiStone: Math.floor(player.power / 5),
    };
  }

  async startFight({
    userId,
    enemyType,
    fightType,
    lang,
    tx,
  }: {
    userId: string;
    enemyType: EnemyType;
    fightType: FightType;
    lang: SupportedLang;
    tx?: TransactionType;
  }) {
    const hp = await recalcHp({ userId: userId, tx: tx });
    if (hp === null) return null;
    const qi = await recalcQi({ userId: userId, tx: tx });
    if (qi === null) return null;
    const restore = await this.restoreFightCharges({ userId: userId, tx: tx });
    if (!restore) return restore;

    const attackerSnapshot: FighterSnapshot = {
      userId: restore.userId,
      avatar_url: restore.avatar_url || img_paths.fractions.adept_m(),
      name: restore.nikname ?? "Unknown",
      power: restore.power,
      protection: restore.protection,
      speed: restore.speed,
      skill: restore.skill,
      qi_param: qi.qi_param,
      currentHp: restore.current_hitpoint,
      maxHp: restore.max_hitpoint,
    };
    const enemySnapshot: FighterSnapshot = await this.generateEnemy({
      playerSnapshot: attackerSnapshot,
      enemyType: EnemyType.DEMONIC_BEAST,
      lang: lang,
    });

    const fightSnapshot: FightSnapshot = {
      player: attackerSnapshot,
      enemy: enemySnapshot,
    };

    const fight = await this.fightRepo.createOrUpdateFight({
      attackerId: userId,
      enemyType: enemyType,
      fightType: fightType,
      fightSnapshot: fightSnapshot,
      tx: tx,
    });

    return fight;
  }
  async getOrRefreshPendingFight({
    attackserId,
    status,
    lang,
    tx,
  }: {
    attackserId: string;
    status: FightStatus;
    lang: SupportedLang;
    tx?: TransactionType;
  }) {
    const hp = await recalcHp({ userId: attackserId, tx: tx });
    if (hp === null) return null;
    let fight = await this.fightRepo.getFightByAttackserId({
      attackserId: attackserId,
      status: status,
      tx: tx,
    });

    const snapshotExpired =
      !fight ||
      dayjs().diff(dayjs(fight.startedAt), "second") > 10 ||
      hp !== (fight.snapshot as FightSnapshot)?.player.currentHp;

    if (snapshotExpired) {
      if (fight) {
        fight = await this.startFight({
          userId: attackserId,
          enemyType: fight.enemyType,
          fightType: fight.type,
          lang,
          tx,
        });
      }
    }

    return fight;
  }

  async getFinidhedFight({ fightId, tx }: { fightId: string; tx?: TransactionType }) {
    const db_client = tx ? tx : dataBase;
    const fight = await this.fightRepo.getFightById({ fightId: fightId, tx: db_client });
    return fight;
  }

  async atack({ userId, lang }: { userId: string; lang: SupportedLang }) {
    return await dataBase.$transaction(async (tx) => {
      const check = await this.canFight({ userId: userId, tx: tx });
      if (!check) throw new Error("Failed canFight");
      const fight = await this.getOrRefreshPendingFight({
        attackserId: userId,
        status: FightStatus.PENDING,
        lang: lang,
        tx: tx,
      });
      if (!fight) throw new Error("Failed getOrRefreshPendingFight");
      const profile = await this.profileRepo.spendFightCharge({ userId: userId, tx: tx });
      if (!profile) throw new Error("Failed spendFightCharge");
      const snapshot: FightSnapshot = fight.snapshot as FightSnapshot;
      const { log, result } = await this.simulateBattle(snapshot.player, snapshot.enemy);
      const isWin = result === FightResult.WIN;
      const rewards: FightResRewards = await this.calculateRewards(snapshot.enemy);
      const losses: FightResLossesSchema = await this.calculateLosses(snapshot.player);
      const up_res = await this.profileRepo.updateResources({
        userId: userId,
        resources: {
          exp: isWin ? rewards.exp : 0,
          qi: isWin ? { add: rewards.qi } : { remove: losses.qi },
          qi_stone: isWin ? { add: rewards.qiStone } : { remove: losses.qiStone },
          glory: isWin ? rewards.glory : 0,
        },
        tx: tx,
      });
      if (!up_res) throw new Error("Failed updateResources");
      const daily_stat = await statisticRepository.updateUserDailyStats({
        userId: userId,
        data: {
          exp: isWin ? rewards.exp : 0,
          fights_total: 1,
          fights_wins: isWin ? rewards.exp : 0,
        },
        tx: tx,
      });
      if (!daily_stat) throw new Error("Failed updateUserDailyStats");
      const overal_stat = await statisticRepository.updateUserOverallStats({
        userId: userId,
        data: {
          exp: isWin ? rewards.exp : 0,
          fights_total: 1,
          fights_wins: isWin ? rewards.exp : 0,
        },
        tx: tx,
      });
      if (!overal_stat) throw new Error("Failed updateUserOverallStats");
      const fact = await this.factsRepo.createFact({
        userId: userId,
        fact_type: isWin ? FactsType.FIGHTS_WIN : FactsType.FIGHTS_LOSE,
        fact_status: FactsStatus.CHECKED,
        fight_result: result,
        rewards: isWin ? rewards : undefined,
        fight_id: fight.id,
        fightLog: log,
        losses: isWin ? undefined : losses,
        fight_atacker_id: fight.attackerId,
        enemy_type: fight.enemyType,
        defender_id: fight.defenderId,
        tx: tx,
      });
      if (!fact) throw new Error("Failed createFact");
      const finished_fight = await this.fightRepo.finishFight({
        fightId: fight.id,
        fightLog: log,
        result: result,
        rewards: rewards,
        tx: tx,
      });
      return { finished_fight, up_res, fact, overal_stat, daily_stat };
    });
  }
}

export const fightService = new FightService();
