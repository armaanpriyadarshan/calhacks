"use client";

import { useMemo, useState } from "react";
import { JournalEntry } from "@/components/journals/journal-board";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const formattingActions = [
  { label: "Bold", shortcut: "⌘B" },
  { label: "Italic", shortcut: "⌘I" },
  { label: "Highlight", shortcut: "⌘H" },
  { label: "Checklist", shortcut: "⌘⇧C" },
  { label: "AI Assist", shortcut: "⌘⎵" },
];

const emotionPalette = [
  { name: "Calm", tone: "bg-emerald-200 text-emerald-700" },
  { name: "Grateful", tone: "bg-amber-200 text-amber-700" },
  { name: "Hopeful", tone: "bg-sky-200 text-sky-700" },
  { name: "Tender", tone: "bg-rose-200 text-rose-700" },
  { name: "Restless", tone: "bg-purple-200 text-purple-700" },
];

type JournalEditorProps = {
  entry: JournalEntry | undefined;
  content: string;
  onContentChange: (value: string) => void;
};

export function JournalEditor({
  entry,
  content,
  onContentChange,
}: JournalEditorProps) {
  const [selectedEmotion, setSelectedEmotion] = useState("Hopeful");

  const memoizedContent = useMemo(() => content, [content]);

  if (!entry) {
    return (
      <section className="flex flex-1 flex-col items-center justify-center bg-white/60 p-16 text-center dark:bg-black/40">
        <div className="max-w-sm space-y-4">
          <h2 className="text-xl font-semibold">
            Create your first reflection
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Choose a prompt, capture how you feel, and let the AI companion help
            you find patterns when you are ready.
          </p>
          <Button className="w-full">Start journaling</Button>
        </div>
      </section>
    );
  }

  return (
    <section className="flex flex-1 flex-col bg-white/80 backdrop-blur-md dark:bg-black/40">
      <div className="flex flex-col gap-4 border-b border-zinc-200 px-8 py-6 dark:border-zinc-800">
        <div className="flex flex-wrap items-center gap-3 text-sm text-zinc-500">
          <span className="rounded-full border border-dashed border-zinc-200 px-2 py-1 dark:border-zinc-800">
            Last edited {entry.updatedAt.toLowerCase()}
          </span>
          <span>•</span>
          <div className="flex items-center gap-2">
            {emotionPalette.map((emotion) => (
              <button
                key={emotion.name}
                type="button"
                onClick={() => setSelectedEmotion(emotion.name)}
                className={cn(
                  "rounded-full px-3 py-1 text-xs font-medium transition",
                  emotion.name === selectedEmotion
                    ? emotion.tone
                    : "bg-transparent text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900",
                )}
              >
                {emotion.name}
              </button>
            ))}
          </div>
        </div>
        <div>
          <input
            defaultValue={entry.title}
            className="w-full border-none bg-transparent text-2xl font-semibold text-zinc-900 outline-none placeholder:text-zinc-400 dark:text-zinc-100"
            placeholder="Untitled reflection"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {formattingActions.map((action) => (
            <Button key={action.label} variant="ghost" size="sm">
              <span>{action.label}</span>
              <span className="ml-2 text-xs text-zinc-400">
                {action.shortcut}
              </span>
            </Button>
          ))}
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-6 overflow-y-auto px-8 py-8">
        <textarea
          value={memoizedContent}
          onChange={(event) => onContentChange(event.target.value)}
          className="min-h-[320px] flex-1 resize-none rounded-lg border border-transparent bg-transparent text-base leading-7 text-zinc-700 outline-none transition placeholder:text-zinc-400 focus:border-zinc-300 focus:bg-white dark:text-zinc-200 dark:focus:border-zinc-700 dark:focus:bg-black"
          placeholder="Capture what is present for you right now..."
        />
        <div className="space-y-3 rounded-lg border border-dashed border-zinc-200 p-6 text-sm text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
          <div className="font-medium text-zinc-600 dark:text-zinc-300">
            AI reflections
          </div>
          <p>
            Your journal will be analyzed for patterns, emotional trends, and
            insights. When you are ready, run an analysis to surface themes,
            prompts, and suggestions for communities that align with your needs.
          </p>
          {/* TODO: Connect to LangChain/MCP analysis endpoint. */}
          <Button className="w-fit" variant="outline">
            Draft an analysis
          </Button>
        </div>
      </div>
    </section>
  );
}
