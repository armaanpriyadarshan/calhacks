"use client";

import { useMemo, useState } from "react";
import { JournalList } from "@/components/journals/journal-list";
import { JournalEditor } from "@/components/journals/journal-editor";

export type JournalEntry = {
  id: string;
  title: string;
  summary: string;
  mood: "Centered" | "Stressed" | "Hopeful" | "Reflective";
  tags: string[];
  updatedAt: string;
  content: string;
};

const sampleEntries: JournalEntry[] = [
  {
    id: "1",
    title: "Morning grounding practice",
    summary: "Reflected on breathing exercises and set intentions.",
    mood: "Centered",
    tags: ["mindfulness", "routine"],
    updatedAt: "Today • 8:45 AM",
    content:
      "Started the day with a slow breathing sequence. Noted how the tension in my shoulders eased after focusing on longer exhales. Set an intention to move slowly and ask for help when I feel overwhelmed.",
  },
  {
    id: "2",
    title: "Midweek overwhelm",
    summary: "Processing workload stress and noting triggers.",
    mood: "Stressed",
    tags: ["work", "stress"],
    updatedAt: "Yesterday • 9:12 PM",
    content:
      "Felt a spike of anxiety after my calendar filled up. The pressure of back-to-back calls makes it hard to pause for basic needs. Writing helped me notice a repeating pattern of saying yes too quickly.",
  },
  {
    id: "3",
    title: "Support group reflections",
    summary: "Journaled about connecting with peers in the anxiety group.",
    mood: "Hopeful",
    tags: ["community", "therapy"],
    updatedAt: "Monday • 7:05 PM",
    content:
      "Tonight's group call was grounding. Hearing others describe similar spirals reminded me I am not alone. I want to follow up with Maya about the breathing technique she mentioned.",
  },
  {
    id: "4",
    title: "Weekend rewind",
    summary: "Capturing highlights and low points from the weekend.",
    mood: "Reflective",
    tags: ["weekend", "gratitude"],
    updatedAt: "Sunday • 5:22 PM",
    content:
      "Saturday morning felt light. Coffee with Jordan was slow and easy, but by evening I noticed my mind drifting into what-ifs again. Planning to schedule a longer hike next weekend to stay present.",
  },
];

export function JournalBoard() {
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState(sampleEntries[0]?.id ?? "");
  const [drafts, setDrafts] = useState<Record<string, string>>({});

  const visibleEntries = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return sampleEntries;
    return sampleEntries.filter((entry) => {
      return (
        entry.title.toLowerCase().includes(query) ||
        entry.summary.toLowerCase().includes(query) ||
        entry.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    });
  }, [search]);

  const activeEntry = useMemo(() => {
    return (
      visibleEntries.find((entry) => entry.id === selectedId) ??
      visibleEntries[0]
    );
  }, [selectedId, visibleEntries]);

  const editorContent = drafts[activeEntry?.id ?? ""] ?? activeEntry?.content;

  const handleContentChange = (value: string) => {
    if (!activeEntry) return;
    setDrafts((prev) => ({
      ...prev,
      [activeEntry.id]: value,
    }));
  };

  return (
    <div className="flex flex-1 overflow-hidden">
      <JournalList
        entries={visibleEntries}
        search={search}
        onSearchChange={setSearch}
        selectedId={activeEntry?.id ?? null}
        onSelect={setSelectedId}
      />
      <JournalEditor
        entry={activeEntry}
        content={editorContent ?? ""}
        onContentChange={handleContentChange}
      />
    </div>
  );
}

