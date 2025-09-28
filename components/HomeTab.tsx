"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function HomeTab() {
  return (
    <div className="friends-tab-con  flex flex-col gap-2 transition-all duration-300">
      {/* Блок боя */}
      <Card className="p-1 gap-2 bg-card border border-border shadow-lg">
        <CardHeader className="px-1">
          <CardTitle className="text-blue-400 text-lg font-bold">
            ⚔️ Готов к бою?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 px-1 text-sm leading-relaxed">
          <p>
            <b>Архидемон:</b> С возвращением, демон{" "}
            <b className="text-red-400">викинг15</b>! Сражайся сегодня так, как
            в последний раз! Соотношение сил: демоны –{" "}
            <span className="text-red-400 font-semibold">698</span>, ангелы –{" "}
            <span className="text-blue-400 font-semibold">709</span>.
          </p>

          <p>
            Силы ангелов и демонов в стране{" "}
            <a href="#" className="underline text-blue-400 hover:text-blue-300">
              Эритрея
            </a>{" "}
            равны, ведётся война.
          </p>

          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="p-2 bg-muted rounded-lg text-center">
              Потери ангелов: <b>0</b>
            </div>
            <div className="p-2 bg-muted rounded-lg text-center">
              Потери демонов: <b>0</b>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Навигация */}
      <div className="grid grid-cols-2 gap-3 ">
        {["Факты", "Бой", "Штаб", "Город", "Агент", "Рейтинг"].map((item) => (
          <Button
            key={item}
            className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-semibold py-6 rounded-xl shadow-md transition-all duration-200"
          >
            {item}
          </Button>
        ))}
      </div>
    </div>
  );
}
