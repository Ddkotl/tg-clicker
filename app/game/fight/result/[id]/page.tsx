export default async function FightResultPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <div>Fight Result Page for fight ID: {id}</div>;
}
