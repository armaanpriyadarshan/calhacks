"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Suggestion = {
  id: string;
  kind: "person" | "group";
  title: string;
  subtitle: string;
  overlap: number;
  tags: string[];
  activeNow: boolean;
};

type Message = {
  id: string;
  author: string;
  role: "self" | "companion" | "peer";
  content: string;
  timestamp: string;
};

const suggestions: Suggestion[] = [
  {
    id: "s1",
    kind: "person",
    title: "Maya R.",
    subtitle: "Uses the “Anchor Breath” from your Monday entry.",
    overlap: 82,
    tags: ["mindfulness", "social anxiety"],
    activeNow: true,
  },
  {
    id: "s2",
    kind: "group",
    title: "Sunday Reset Circle",
    subtitle: "Weekly check-in for overwhelmed planners.",
    overlap: 74,
    tags: ["routines", "burnout"],
    activeNow: false,
  },
  {
    id: "s3",
    kind: "group",
    title: "Quiet Leaders",
    subtitle: "Space for thoughtful managers navigating stress.",
    overlap: 69,
    tags: ["leadership", "anxiety"],
    activeNow: true,
  },
  {
    id: "s4",
    kind: "person",
    title: "Evan L.",
    subtitle: "Journals about pacing work and rest cycles.",
    overlap: 64,
    tags: ["balance", "focus"],
    activeNow: false,
  },
];

const sampleMessages: Message[] = [
  {
    id: "m1",
    author: "Maya",
    role: "peer",
    timestamp: "10:02",
    content:
      "I tried the morning grounding you described and it kept me steady before a hard conversation.",
  },
  {
    id: "m2",
    author: "Taylor (you)",
    role: "self",
    timestamp: "10:03",
    content:
      "Love that! I still feel rattled on Wednesday afternoons when the meetings pile up.",
  },
  {
    id: "m3",
    author: "Maya",
    role: "peer",
    timestamp: "10:04",
    content:
      "We have a micro-break reminder in our group chat. Want me to share it? It helped me re-center.",
  },
  {
    id: "m4",
    author: "Calm AI",
    role: "companion",
    timestamp: "10:05",
    content:
      "I am noticing shared themes around overcommitment. Would you like a gentle prompt to help you set boundaries this afternoon?",
  },
];

const filters = [
  { id: "all", label: "All", description: "Every suggestion" },
  { id: "people", label: "People", description: "1:1 matches" },
  { id: "groups", label: "Groups", description: "Communities & circles" },
];

export function DiscoverHub() {
  const [filter, setFilter] = useState("all");
  const [previewId, setPreviewId] = useState(suggestions[0]?.id ?? "");

  const filteredSuggestions = useMemo(() => {
    if (filter === "all") return suggestions;
    return suggestions.filter((item) =>
      filter === "people" ? item.kind === "person" : item.kind === "group",
    );
  }, [filter]);

  const resolvedPreviewId = useMemo(() => {
    if (filteredSuggestions.length === 0) return "";
    const exists = filteredSuggestions.some((item) => item.id === previewId);
    return exists ? previewId : filteredSuggestions[0].id;
  }, [filteredSuggestions, previewId]);

  const preview = filteredSuggestions.find(
    (item) => item.id === resolvedPreviewId,
  );

  return (
    <div className="flex flex-1 overflow-hidden">
      <section className="flex w-96 shrink-0 flex-col border-r border-zinc-200 bg-white/80 backdrop-blur-md dark:border-zinc-800 dark:bg-black/40">
        <div className="border-b border-zinc-200 px-6 py-6 dark:border-zinc-800">
          <div className="text-xs font-medium uppercase tracking-wide text-zinc-400">
            Suggested matches
          </div>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            Based on recurring themes in your recent reflections.
          </p>
          <div className="mt-4 flex gap-2">
            {filters.map((item) => (
              <Button
                key={item.id}
                variant={filter === item.id ? "default" : "ghost"}
                size="sm"
                onClick={() => setFilter(item.id)}
              >
                {item.label}
              </Button>
            ))}
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-4 py-6">
          <div className="space-y-3">
            {filteredSuggestions.map((item) => (
              <article
                key={item.id}
                className={cn(
                  "cursor-pointer rounded-xl border border-transparent bg-white/70 p-4 transition hover:border-zinc-200 hover:bg-white dark:bg-zinc-950/60 dark:hover:border-zinc-800 dark:hover:bg-zinc-900/80",
                  resolvedPreviewId === item.id &&
                    "border-zinc-900 bg-zinc-900 text-zinc-50 shadow-sm dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900",
                )}
                onClick={() => setPreviewId(item.id)}
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="rounded-full bg-zinc-100 px-2 py-0.5 font-medium text-zinc-500 dark:bg-zinc-800 dark:text-zinc-300">
                    {item.kind === "person" ? "Person" : "Community"}
                  </span>
                  <span className="text-zinc-400">
                    {item.overlap}% overlap
                  </span>
                </div>
                <h3 className="mt-2 text-sm font-semibold">{item.title}</h3>
                <p className="mt-1 text-xs text-zinc-500">{item.subtitle}</p>
                <div className="mt-3 flex flex-wrap gap-2 text-xs">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className={cn(
                        "rounded-full border border-dashed border-current px-2 py-0.5",
                        resolvedPreviewId === item.id
                          ? "text-zinc-200 dark:text-zinc-700"
                          : "text-zinc-400 dark:text-zinc-500",
                      )}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
                <div className="mt-4 flex items-center justify-between text-xs text-zinc-400">
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "h-2.5 w-2.5 rounded-full",
                        item.activeNow
                          ? "bg-emerald-500"
                          : "bg-zinc-300 dark:bg-zinc-600",
                      )}
                    />
                    {item.activeNow ? "Active now" : "Checks in daily"}
                  </div>
                  <Button size="sm" variant="ghost">
                    Preview
                  </Button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="flex flex-1 flex-col bg-white/80 backdrop-blur-md dark:bg-black/40">
        <div className="flex flex-col gap-3 border-b border-zinc-200 px-8 py-6 dark:border-zinc-800">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-xs uppercase tracking-wide text-zinc-400">
                Conversation preview
              </div>
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                {preview?.title ?? "Select a suggestion"}
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">
                Queue for later
              </Button>
              <Button size="sm">Open space</Button>
            </div>
          </div>
          <div className="rounded-xl border border-dashed border-zinc-200 p-4 text-sm text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
            AI digest of shared themes will appear here. You will receive a
            summary of alignment factors, journaling patterns, and suggested
            prompts to explore together.
          </div>
        </div>
        <div className="flex flex-1 flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto px-8 py-6">
            <div className="space-y-4">
              {sampleMessages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "max-w-lg rounded-xl border border-zinc-100 bg-white p-4 text-sm leading-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900",
                    message.role === "self" &&
                      "ml-auto border-zinc-900 bg-zinc-900 text-zinc-50 dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900",
                    message.role === "companion" &&
                      "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-200",
                  )}
                >
                  <div className="mb-1 flex items-center justify-between text-xs uppercase tracking-wide">
                    <span
                      className={cn(
                        "font-medium",
                        message.role === "self" && "text-zinc-200 dark:text-zinc-600",
                        message.role === "companion" && "text-emerald-600 dark:text-emerald-300",
                      )}
                    >
                      {message.author}
                    </span>
                    <span className="text-zinc-400">{message.timestamp}</span>
                  </div>
                  <p>{message.content}</p>
                </div>
              ))}
            </div>
          </div>
          <footer className="border-t border-zinc-200 px-8 py-6 dark:border-zinc-800">
            <div className="rounded-xl border border-zinc-200 bg-white px-4 py-3 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span>Leave a gentle note...</span>
                <span>Shift + Enter to send</span>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-end gap-2 text-xs text-zinc-400">
              <Button variant="ghost" size="sm">
                Add journaling prompt
              </Button>
              <Button size="sm">Send invitation</Button>
            </div>
          </footer>
        </div>
      </section>
    </div>
  );
}
