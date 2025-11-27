import { FightResults } from "@/entities/fights/_ui/fight_results";

export default async function FightResultPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <FightResults fightId={id} />;
}
