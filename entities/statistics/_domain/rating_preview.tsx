import Link from "next/link";

export function RatingPreview({ title, type, data }: { title: string; type: string; data: any[] }) {
  return (
    <div className="p-3 rounded bg-white/5">
      <h3>{title}</h3>
      {data.map((p, i) => (
        <div key={p.user.id}>
          {i + 1}. {p.user.profile?.nikname}
        </div>
      ))}

      <Link href={`/ranking/${type}`} className="text-blue-400">
        → Показать полный рейтинг
      </Link>
    </div>
  );
}
