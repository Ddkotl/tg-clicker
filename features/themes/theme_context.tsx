"use client";

import Image from "next/image";
import { createContext, useContext, useState, ReactNode, useEffect } from "react";

export type Theme = "red" | "blue" | "green" | "purple" | "yellow";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("blue");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored_theme = localStorage.getItem("theme");
    if (stored_theme) {
      setTheme(stored_theme as Theme);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (theme) {
      localStorage.setItem("theme", theme);
    }
  }, [theme]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Image priority src="/loading.png" width={300} height={300} alt="loading" />
      </div>
    );
  }
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <div className={`theme-${theme} min-h-screen`}>{children}</div>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within a ThemeProvider");
  return context;
}
