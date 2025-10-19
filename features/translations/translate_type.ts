import { en_lang } from "@/features/translations/langs/en";

export type SupportedLang = "en" | "ru";

export type NestedKeyOf<ObjectType extends object> = {
  [Key in keyof ObjectType & string]: ObjectType[Key] extends object ? `${Key}.${NestedKeyOf<ObjectType[Key]>}` : Key;
}[keyof ObjectType & string];

export type Messages = typeof en_lang;

export type TranslationKey = NestedKeyOf<Messages>;
