import { Messages } from "@/types/translate_type";

export const ru_lang: Messages = {
  loading: "загрузка",
  reboot: "Перезагрузить",
  auth_error: "Произошла ошибка аутентификации",
  auth_congratulation: "{nikname}, поздравляю с успешной регистрацией.",
  greeting: "Привет, {name}!",
  registration: {
    title: "Завершите настройку профиля",
    nickname: "Введите имя персонажа",
    faction: "Выберите фракцию",
  },
  button: {
    save: "Сохранить",
    saving: "Сохранение...",
  },
  validation: {
    check: "идет проверка",
    min: "минимом {number} символа",
    nickname_taken: "имя {nickname} уже занято",
    nickname_free: "имя {nickname} свободно",
  },
  gender: { gender: "Пол", male: "мужской", female: "женский" },
  fraction: {
    adept: "Адепт горы",
    novice: "Послушник долины",
    adepts: "Адепты горы",
    novices: "Послушники долины",
  },
  theme: {
    select: "Выберите цветовую тему",
  },
  home: {
    ready_to_battle: "⚔️ Готов к битве?",
    mentor: "Наставник:",
    welcome_wanderer: "Добро пожаловать, странник",
    balance_of_pover:
      "Сегодня твой путь приведёт к великим свершениям! Баланс сил:",
    adepts_loses: "Потери Адептов:",
    novise_loses: "Потери Послушников:",
    navigation: {
      chronicles: "Хроники",
      battle: "Схватка",
      headquarters: "Штаб",
      city: "Город",
      secret_agent: "Тайный агент",
      rating: "Рейтинг",
    },
  },
  profile: {
    no_motto_adept: "Скала не дрогнет – и я тоже.",
    no_motto_novice: "Ветер перемен лишь помогает моему пути.",
    lvl: "Уровень",
    development: "Развитие",
    equipment: "Снаряжение",
    friends: "Друзья",
    statistics: "Статистика",
    questionnaire: "Анкета",
    description: "Описание",
    avatars: "Аватары",
    invite: "Пригласить друга",
  },
};
