import { TopBar } from "@/components/layout/top-bar";
import { JournalBoard } from "@/components/journals/journal-board";

export default function JournalsPage() {
  return (
    <>
      <TopBar title="Journal workspace" />
      <main className="flex flex-1 flex-col overflow-hidden">
        <JournalBoard />
      </main>
    </>
  );
}

