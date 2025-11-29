import { EnemyType } from "@/_generated/prisma";
import { Fight } from "@/features/fights/_ui/fight";

export default async function EnemyFightPage({ params }: { params: Promise<{ enemy_type: EnemyType }> }) {
  const awaited_enemy_type = (await params).enemy_type;
  return <Fight enemy_type={awaited_enemy_type} />;
}
