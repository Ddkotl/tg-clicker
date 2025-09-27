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
  },
};
