import { PrismaClient, FactsStatus, FactsType, Fraktion, Gender } from "../_generated/prisma";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Start seeding...");

  for (let i = 1; i <= 500; i++) {
    const user = await prisma.user.create({
      data: {
        telegram_id: `tg_id_${i}`,
        username: `user${i}`,
        first_name: `First${i}`,
        last_name: `Last${i}`,
        language_code: "en",
        allows_write_to_pm: true,
        profile: {
          create: {
            nikname: `Player${i}`,
            fraktion: i % 2 === 0 ? Fraktion.ADEPT : Fraktion.NOVICE,
            gender: i % 2 === 0 ? Gender.MALE : Gender.FEMALE,
            lvl: Math.floor(Math.random() * 10) + 1,
            exp: Math.floor(Math.random() * 500),
            qi: 100,
            qi_stone: 50,
            spirit_stone: 50,
          },
        },
        user_statistic: {
          create: {
            wins: Math.floor(Math.random() * 10),
            loses: Math.floor(Math.random() * 10),
            meditated_hours: Math.floor(Math.random() * 20),
            mined_qi_stone: Math.floor(Math.random() * 100),
            mined_count: Math.floor(Math.random() * 50),
          },
        },
        meditation: {
          create: {
            on_meditation: i % 2 === 0,
            start_meditation: new Date(),
            meditation_hours: Math.floor(Math.random() * 5),
            meditation_revard: Math.floor(Math.random() * 20),
          },
        },
        mine: {
          create: {
            energy: 50,
            last_mine_at: new Date(Date.now() - Math.floor(Math.random() * 1000000)),
            last_energy_at: new Date(Date.now() - Math.floor(Math.random() * 1000000)),
          },
        },
      },
    });

    // Создаём несколько фактов для пользователя
    await prisma.facts.createMany({
      data: [
        {
          userId: user.id,
          type: FactsType.MEDITATION,
          status: FactsStatus.NO_CHECKED,
          qi_reward: Math.floor(Math.random() * 50),
          exp_reward: Math.floor(Math.random() * 20),
          active_hours: Math.floor(Math.random() * 5),
        },
        {
          userId: user.id,
          type: FactsType.MINE,
          status: FactsStatus.NO_CHECKED,
          qi_stone_reward: Math.floor(Math.random() * 50),
          exp_reward: Math.floor(Math.random() * 20),
        },
      ],
    });

    console.log(`✅ Created user ${user.username}`);
  }

  console.log("🌱 Seeding finished!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
