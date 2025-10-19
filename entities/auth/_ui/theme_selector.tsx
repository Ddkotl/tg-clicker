import { RadioGroup, RadioGroupItem } from "@/shared/components/ui/radio-group";
import { color_themes } from "@/features/themes/color_thems";
import { Theme } from "@/features/themes/theme_context";
import { Label } from "@/shared/components/ui/label";
import { useTranslation } from "@/features/translations/use_translation";

export function ThemeSelector({ theme, setTheme }: { theme: Theme; setTheme: (t: Theme) => void }) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-2">
      <Label>{t("theme.select")}</Label>
      <RadioGroup
        defaultValue={theme}
        onValueChange={(value) => {
          document.documentElement.classList.remove(
            "theme-red",
            "theme-purple",
            "theme-green",
            "theme-yellow",
            "theme-blue",
          );
          document.documentElement.classList.add(`theme-${value}`);
          setTheme(value as Theme);
        }}
        className="flex gap-2 justify-between"
      >
        {color_themes.map((theme) => (
          <div key={theme.value} className="flex flex-col items-center gap-2">
            <RadioGroupItem value={theme.value} id={theme.value} />
            <Label htmlFor={theme.value} className="cursor-pointer">
              <span className={`w-10 h-1 ${theme.color}`}></span>
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
}
