import { generateFileSystem } from "@/app/actions/generateFileSystem";
import { Terminal } from "@/app/components/terminal/Terminal";

export default function TerminalPage() {
  const fileSystem = generateFileSystem();

  return (
    <main className="flex flex-col row-start-2 items-center sm:items-start w-full max-w-3xl mx-auto">
      <Terminal fileSystem={fileSystem} />
    </main>
  );
}
