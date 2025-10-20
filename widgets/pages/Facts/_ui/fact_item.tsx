import { Facts, FactsType } from "@/_generated/prisma";
import { TranslationKey } from "@/features/translations/translate_type";
import { MeditationFact } from "./meditation_fact";

type FactItemProps = {
  fact: Facts;
  t: (key: TranslationKey, vars?: Record<string, string | number>) => string;
};

export function FactItem({ fact, t }: FactItemProps) {
  switch (fact.type) {
    case FactsType.MEDITATION:
      return <MeditationFact fact={fact} t={t} />;
    default:
      return null;
  }
}
