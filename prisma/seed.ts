import { faker } from "@faker-js/faker";
import { PrismaClient, MissionType, FactsType, FactsStatus } from "@/_generated/prisma";

const prisma = new PrismaClient();

function randomEnum<T extends Record<string, unknown>>(e: T): T[keyof T] {
  const values = Object.values(e);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return values[Math.floor(Math.random() * values.length)] as any;
}

async function createUser() {
  const user = await prisma.user.create({
    data: {
      telegram_id: faker.string.uuid(),
      username: faker.internet.username(),
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      photo_url: faker.image.avatar(),
      language_code: "en",
      allows_write_to_pm: true,
      auth_date: Date.now().toString(),
    },
  });

  await prisma.profile.create({
    data: {
      userId: user.id,
      fraktion: faker.helpers.arrayElement(["ADEPT", "NOVICE"]),
      nikname: faker.internet.displayName(),
      gender: faker.helpers.arrayElement(["MALE", "FEMALE"]),
      avatar_url: faker.image.avatar(),
      player_motto: faker.word.words({ count: 3 }),
      lvl: faker.number.int({ min: 1, max: 60 }),
      exp: faker.number.int({ min: 0, max: 30000 }),
      qi: faker.number.int({ min: 50, max: 500 }),
      qi_stone: faker.number.int({ min: 20, max: 600 }),
      spirit_cristal: faker.number.int({ min: 0, max: 200 }),
      glory: faker.number.int({ min: 0, max: 2000 }),
      power: faker.number.int({ min: 1, max: 50 }),
      protection: faker.number.int({ min: 1, max: 50 }),
      speed: faker.number.int({ min: 1, max: 50 }),
      skill: faker.number.int({ min: 1, max: 50 }),
      qi_param: faker.number.int({ min: 1, max: 50 }),
    },
  });

  await prisma.userStatistic.create({
    data: {
      userId: user.id,
      wins: faker.number.int({ min: 0, max: 200 }),
      loses: faker.number.int({ min: 0, max: 200 }),
      meditated_hours: faker.number.int({ min: 0, max: 500 }),
      spirit_path_minutes: faker.number.int({ min: 0, max: 700 }),
      mined_qi_stone: faker.number.int({ min: 0, max: 300 }),
      mined_count: faker.number.int({ min: 0, max: 1000 }),
      fights_total: faker.number.int({ min: 0, max: 500 }),
      fights_wins: faker.number.int({ min: 0, max: 250 }),
      fights_loses: faker.number.int({ min: 0, max: 250 }),
      pve_shadow_wins: faker.number.int({ min: 0, max: 200 }),
      demonic_beasts_wins: faker.number.int({ min: 0, max: 200 }),
    },
  });

  await prisma.meditation.create({
    data: {
      userId: user.id,
      on_meditation: false,
      meditation_hours: faker.number.int({ min: 0, max: 300 }),
      meditation_revard: faker.number.int({ min: 0, max: 100 }),
    },
  });

  await prisma.spiritPath.create({
    data: {
      userId: user.id,
      on_spirit_paths: false,
      spirit_paths_minutes: faker.number.int({ min: 0, max: 1000 }),
      spirit_paths_reward: faker.number.int({ min: 0, max: 200 }),
      minutes_today: faker.number.int({ min: 0, max: 60 }),
    },
  });

  await prisma.mine.create({
    data: {
      userId: user.id,
      energy: faker.number.int({ min: 0, max: 25 }),
    },
  });

  await prisma.userQiSkills.create({
    data: {
      userId: user.id,
      qi_veil: faker.number.int({ min: 0, max: 10 }),
      seal_of_mind: faker.number.int({ min: 0, max: 10 }),
      circulation_of_life: faker.number.int({ min: 0, max: 10 }),
      spatial_vault: faker.number.int({ min: 0, max: 10 }),
    },
  });

  // ===== facts =====
  const factsCount = faker.number.int({ min: 3, max: 10 });

  for (let i = 0; i < factsCount; i++) {
    await prisma.facts.create({
      data: {
        userId: user.id,
        type: randomEnum(FactsType),
        status: randomEnum(FactsStatus),
        qi_reward: faker.number.int({ min: 0, max: 50 }),
        qi_stone_reward: faker.number.int({ min: 0, max: 50 }),
        spirit_cristal_reward: faker.number.int({ min: 0, max: 50 }),
        exp_reward: faker.number.int({ min: 0, max: 200 }),
      },
    });
  }

  // ===== missions =====
  for (const type of Object.values(MissionType)) {
    await prisma.mission.create({
      data: {
        userId: user.id,
        type,
        target_value: faker.number.int({ min: 1, max: 10 }),
        progress: faker.number.int({ min: 0, max: 10 }),
        reward_exp: faker.number.int({ min: 0, max: 200 }),
      },
    });
  }

  return user.id;
}

async function main() {
  console.log("Seeding 500 users...");
  for (let i = 0; i < 500; i++) {
    await createUser();
    if (i % 20 === 0) console.log(`→ Created: ${i}`);
  }
  console.log("Done!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
