import { en_lang } from "@/features/translations/langs/en";
import { ru_lang } from "./langs/ru";

export type Messages = typeof en_lang;
export const translated_messages = { en: en_lang, ru: ru_lang };
export type SupportedLang = keyof typeof translated_messages;

export type NestedKeyOf<ObjectType extends object> = {
  [Key in keyof ObjectType & string]: ObjectType[Key] extends object ? `${Key}.${NestedKeyOf<ObjectType[Key]>}` : Key;
}[keyof ObjectType & string];

export type TranslationKey = NestedKeyOf<Messages>;
