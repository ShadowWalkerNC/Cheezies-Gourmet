import { createContext, useContext, useEffect } from "react";

const ThemeContext = createContext({ theme: "light", toggleTheme: () => {} });

export function ThemeProvider({ children }) {
  useEffect(() => {
    // Always force light mode — dark mode breaks the brand aesthetic
    const root = document.documentElement;
    root.classList.remove("dark");
    root.setAttribute("data-theme", "light");
    localStorage.removeItem("cheezies_theme");
  }, []);

  return (
    <ThemeContext.Provider value={{ theme: "light", toggleTheme: () => {} }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}