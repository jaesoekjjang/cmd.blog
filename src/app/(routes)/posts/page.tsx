import { generateFileSystem } from "@/app/actions/generateFileSystem";
import { Terminal } from "@/app/components/terminal/Terminal";

export default async function TerminalPage() {
  const fileSystem = await generateFileSystem();

  return (
    <main className="flex flex-col row-start-2 justify-center items-center w-full mx-auto px-12">
      <Terminal fileSystem={fileSystem} />
    </main>
  );
}
