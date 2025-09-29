"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function HomeTab() {
  return (
    <div className="friends-tab-con flex flex-col gap-2 transition-all duration-300">
      {/* Блок битвы */}
      <Card className="p-1 gap-2 bg-card border border-border shadow-lg">
        <CardHeader className="px-1">
          <CardTitle className="text-orange-400 text-lg font-bold">
            ⚔️ Готов к битве ци?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 px-1 text-sm leading-relaxed">
          <p>
            <b className="text-orange-400">Мастер Горы Тайшань:</b> С возвращением, адепт{" "}
            <b className="text-orange-400">викинг15</b>! Пусть твоё ци сегодня течёт как разгневанный дракон! Соотношение сил: Адепты Горы –{" "}
            <span className="text-orange-400 font-semibold">698</span>, Послушники Долины –{" "}
            <span className="text-cyan-400 font-semibold">709</span>.
          </p>

          <p>
            Силы двух великих школ в{" "}
            <a href="#" className="underline text-cyan-400 hover:text-cyan-300">
              Землях Ци
            </a>{" "}
            сравнялись, и битва за источники энергии началась.
          </p>

          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="p-2 bg-muted rounded-lg text-center">
              Потери Послушников: <b>0</b>
            </div>
            <div className="p-2 bg-muted rounded-lg text-center">
              Потери Адептов: <b>0</b>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Навигация */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { name: "Свитки Знаний", icon: "📜" },
          { name: "Поток Ци", icon: "🌀" },
          { name: "Обитель Мастера", icon: "🏯" },
          { name: "Нефритовый Город", icon: "🏙️" },
          { name: "Тень в Тумане", icon: "🌫️" },
          { name: "Ступени Просветления", icon: "🪜" }
        ].map((item) => (
          <Button
            key={item.name}
            className="bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white font-semibold py-6 rounded-xl shadow-md transition-all duration-200 flex items-center justify-center gap-2"
          >
            <span>{item.icon}</span>
            <span className="text-xs">{item.name}</span>
          </Button>
        ))}
      </div>

      {/* Дополнительная информация о фракциях */}
      <Card className="p-3 bg-gradient-to-br from-orange-50 to-cyan-50 dark:from-orange-950/20 dark:to-cyan-950/20 border border-orange-200 dark:border-orange-800">
        <CardContent className="p-2">
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="text-center">
              <div className="font-bold text-orange-600 dark:text-orange-400">Адепты Горы</div>
              <div className="text-orange-500">Сила воли • Контроль • Мощь</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-cyan-600 dark:text-cyan-400">Послушники Долины</div>
              <div className="text-cyan-500">Гармония • Гибкость • Баланс</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
