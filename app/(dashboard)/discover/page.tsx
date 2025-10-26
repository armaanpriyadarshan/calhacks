import { TopBar } from "@/components/layout/top-bar";
import { DiscoverHub } from "@/components/discover/discover-hub";

export default function DiscoverPage() {
  return (
    <>
      <TopBar title="Discover communities" />
      <main className="flex flex-1 flex-col overflow-hidden">
        <DiscoverHub />
      </main>
    </>
  );
}

