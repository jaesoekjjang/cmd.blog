import { generateFileSystem } from '@/app/actions/generateFileSystem';
import { Terminal } from '@/app/components/terminal/Terminal';

export const dynamic = 'force-static';

export default async function TerminalPage() {
  const fileSystem = await generateFileSystem();

  return (
    <main className="row-start-2 mx-auto flex w-full flex-col items-center justify-center px-12">
      <Terminal fileSystem={fileSystem} />
    </main>
  );
}
