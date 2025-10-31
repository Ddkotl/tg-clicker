"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Theme = "red" | "blue" | "green" | "purple" | "yellow";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    // ✅ Инициализация темы синхронно — без мигалки при рендере
    if (typeof window !== "undefined") {
      return (localStorage.getItem("theme") as Theme) || "blue";
    }
    return "blue";
  });

  useEffect(() => {
    // ✅ Синхронизируем с localStorage
    localStorage.setItem("theme", theme);

    // ✅ Управляем классами на уровне <html>, чтобы Tailwind-темы работали глобально
    const root = document.documentElement;
    const currentThemeClass = Array.from(root.classList).find((cls) => cls.startsWith("theme-"));
    if (currentThemeClass) root.classList.remove(currentThemeClass);
    root.classList.add(`theme-${theme}`);
  }, [theme]);

  // ❌ Больше не нужен loading state — всё делается синхронно
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <div suppressHydrationWarning className={`theme-${theme} min-h-screen transition-colors duration-300`}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within a ThemeProvider");
  return context;
}
