"use client";
import { createContext, useContext, useEffect } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { APP_CONFIG } from "@/config/constants";

type Theme = typeof APP_CONFIG.theme.light | typeof APP_CONFIG.theme.dark;

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useLocalStorage<Theme>(
    "theme",
    APP_CONFIG.theme.light
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    if (theme === APP_CONFIG.theme.dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(
      theme === APP_CONFIG.theme.light
        ? APP_CONFIG.theme.dark
        : APP_CONFIG.theme.light
    );
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
