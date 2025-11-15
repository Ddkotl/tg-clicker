import Link from "next/link";

export function OpponentsList() {
  const sections = [
    {
      title: "На славу",
      items: ["26,27,28 уровень", "26 уровень", "27 уровень", "28 уровень"],
    },
    {
      title: "Основные",
      items: ["Отмеченные", "Зомби (7, 56)", "21,22,23,24,25,26,27,28 уровень"],
    },
    {
      title: "События",
      items: ["Оборотни", "Битва (15 Ноя 15:00)"],
    },
    {
      title: "Дополнительно",
      items: ["Младшие", "Старшие", "По имени", "По уровню", "Бить своих"],
    },
  ];

  return (
    <div className="flex flex-col gap-6 p-4">
      {sections.map((section) => (
        <div key={section.title}>
          <h2 className="text-lg font-bold mb-2">{section.title}</h2>
          <ul className="flex flex-col gap-1 pl-4 list-disc">
            {section.items.map((item) => (
              <li key={item}>
                <Link
                  href={`/fight/filter?value=${encodeURIComponent(item)}`}
                  className="text-left w-full block px-2 py-1 rounded-md transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
