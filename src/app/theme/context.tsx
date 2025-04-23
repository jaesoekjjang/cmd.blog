"use client";

import { createContext, useEffect, useState } from "react";

export type Theme = "light" | "dark";
export const THEME_KEY = "theme";

type ThemeContextType = [theme: Theme, toggleTheme: () => void];

export const ThemeContext = createContext<ThemeContextType>([
  "light",
  () => {},
]);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const storedTheme = localStorage.getItem(THEME_KEY) as Theme | null;
    let initialTheme: Theme;

    if (storedTheme === "light" || storedTheme === "dark") {
      initialTheme = storedTheme;
    } else {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;
      initialTheme = prefersDark ? "dark" : "light";
    }

    setTheme(initialTheme);
    document.documentElement.classList.toggle("dark", initialTheme === "dark");
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);

    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    localStorage.setItem(THEME_KEY, newTheme);
  };

  return (
    <ThemeContext.Provider value={[theme, toggleTheme]}>
      {children}
    </ThemeContext.Provider>
  );
}
