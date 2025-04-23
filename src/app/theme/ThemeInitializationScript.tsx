export function ThemeInitializationScript() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: themeInitializationScript,
      }}
    />
  );
}

const themeInitializationScript = `
  (function() {
    try {
      const storedTheme = localStorage.getItem('theme');
      if (storedTheme === 'dark' || (!storedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch (e) {
      console.error('Failed to set initial theme', e);
    }
  })();
`;
