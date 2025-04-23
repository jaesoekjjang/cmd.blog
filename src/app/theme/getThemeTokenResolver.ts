type Resolver = () => string;

type Tokens = "terminalPromptPrefix" | "terminalPromptCommand";

export function getThemeTokenResolver(): {
  [key in Tokens]: Resolver;
} {
  if (typeof document === "undefined") {
    return {
      terminalPromptPrefix: () => "",
      terminalPromptCommand: () => "",
    };
  }

  const documentEl = getComputedStyle(document.documentElement);

  return {
    terminalPromptPrefix: () =>
      documentEl.getPropertyValue("--terminal-prompt-prefix"),
    terminalPromptCommand: () =>
      documentEl.getPropertyValue("--terminal-output-command"),
  };
}
