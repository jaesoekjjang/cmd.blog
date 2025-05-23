export default function TerminalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-items-center font-[family-name:var(--font-geist-sans)]">
      {children}
    </div>
  );
}
