"use client";

import { useMemo } from "react";
import { JournalEntry } from "@/components/journals/journal-board";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type JournalListProps = {
  entries: JournalEntry[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  search: string;
  onSearchChange: (value: string) => void;
};

const moodTokens: Record<JournalEntry["mood"], { tone: string; label: string }> =
  {
    Centered: { tone: "bg-emerald-500/15 text-emerald-600", label: "Centered" },
    Stressed: { tone: "bg-rose-500/15 text-rose-600", label: "Stressed" },
    Hopeful: { tone: "bg-sky-500/15 text-sky-600", label: "Hopeful" },
    Reflective: {
      tone: "bg-violet-500/15 text-violet-600",
      label: "Reflective",
    },
  };

export function JournalList({
  entries,
  selectedId,
  onSelect,
  search,
  onSearchChange,
}: JournalListProps) {
  const counts = useMemo(() => {
    return entries.reduce<Record<string, number>>((acc, entry) => {
      entry.tags.forEach((tag) => {
        acc[tag] = (acc[tag] ?? 0) + 1;
      });
      return acc;
    }, {});
  }, [entries]);

  return (
    <section className="flex w-80 flex-col border-r border-zinc-200 bg-white/80 backdrop-blur-md dark:border-zinc-800 dark:bg-black/40">
      <div className="flex flex-col gap-3 border-b border-zinc-200 p-4 dark:border-zinc-800">
        <div className="text-xs font-medium uppercase tracking-wide text-zinc-400">
          Your journals
        </div>
        <div className="flex gap-2">
          <Button className="flex-1">New entry</Button>
          <Button variant="ghost" className="px-3">
            Import
          </Button>
        </div>
        <label className="relative">
          <input
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search reflections..."
            className="w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-700 shadow-sm transition focus:border-zinc-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200"
          />
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-400">
            ⌘K
          </span>
        </label>
      </div>
      <div className="flex-1 overflow-y-auto px-3 py-4">
        <div className="mb-4 flex flex-wrap gap-2">
          {Object.entries(counts).map(([tag, count]) => (
            <span
              key={tag}
              className="rounded-full border border-dashed border-zinc-200 px-2 py-1 text-xs text-zinc-500 dark:border-zinc-700 dark:text-zinc-400"
            >
              #{tag} · {count}
            </span>
          ))}
        </div>
        <ul className="space-y-2">
          {entries.map((entry) => {
            const mood = moodTokens[entry.mood];
            const isActive = entry.id === selectedId;

            return (
              <li key={entry.id}>
                <button
                  type="button"
                  onClick={() => onSelect(entry.id)}
                  className={cn(
                    "w-full rounded-lg border border-transparent px-3 py-3 text-left transition",
                    isActive
                      ? "border-zinc-900 bg-zinc-900 text-zinc-50 dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900"
                      : "hover:border-zinc-200 hover:bg-white dark:hover:border-zinc-800 dark:hover:bg-zinc-900",
                  )}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 font-medium",
                        mood.tone,
                        isActive && "bg-white/20 text-white dark:text-zinc-900",
                      )}
                    >
                      {mood.label}
                    </span>
                    <span
                      className={cn(
                        "text-zinc-400",
                        isActive && "text-zinc-200 dark:text-zinc-600",
                      )}
                    >
                      {entry.updatedAt}
                    </span>
                  </div>
                  <div className="mt-2 text-sm font-semibold">
                    {entry.title}
                  </div>
                  <p
                    className={cn(
                      "mt-1 text-xs text-zinc-500",
                      isActive && "text-zinc-200 dark:text-zinc-600",
                    )}
                  >
                    {entry.summary}
                  </p>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

