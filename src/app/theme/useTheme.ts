import { useContext } from "react";
import { ThemeContext } from "./context";

export function useTheme() {
  const context = useContext(ThemeContext);

  if (context === undefined) {
    throw new Error("useTheme은 ThemeProvider 내에서만 사용할 수 있습니다.");
  }
  return context;
}
