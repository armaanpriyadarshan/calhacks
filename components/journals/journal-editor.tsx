"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { JournalEntry } from "@/components/journals/journal-board";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const formattingActions = [
  { id: "bold", label: "Bold", shortcut: "⌘B" },
  { id: "italic", label: "Italic", shortcut: "⌘I" },
  { id: "highlight", label: "Highlight", shortcut: "⌘H" },
  { id: "checklist", label: "Checklist", shortcut: "⌘⇧C" },
  { id: "ai-assist", label: "AI Assist", shortcut: "⌘⎵" },
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
  const editorRef = useRef<HTMLDivElement | null>(null);

  const normalizedContent = useMemo(() => {
    if (!content) return "";
    if (/<(p|br|div|span|strong|em|mark|input)/i.test(content)) {
      return content;
    }
    return content
      .split("\n")
      .map((line) => {
        if (line.length === 0) return "<br />";
        return line
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;");
      })
      .join("<br />");
  }, [content]);

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;
    if (document.activeElement === editor) return;
    editor.innerHTML = normalizedContent;
  }, [normalizedContent]);

  const handleEditorInput = useCallback(() => {
    const editor = editorRef.current;
    if (!editor) return;
    onContentChange(editor.innerHTML);
  }, [onContentChange]);

  const placeCursorAtEnd = useCallback((target: HTMLElement | null) => {
    if (!target) return;
    const selection = window.getSelection();
    if (!selection) return;
    const range = document.createRange();
    range.selectNodeContents(target);
    range.collapse(false);
    selection.removeAllRanges();
    selection.addRange(range);
  }, []);

  const createChecklistItem = useCallback((initialHTML?: string) => {
    const container = document.createElement("div");
    container.className = "journal-checklist";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "journal-checkbox";

    const span = document.createElement("span");
    span.className = "journal-checklist-text";
    span.contentEditable = "true";
    if (initialHTML && initialHTML !== "<br>") {
      span.innerHTML = initialHTML;
    }

    container.appendChild(checkbox);
    container.appendChild(span);

    return { container, span };
  }, []);

  const getActiveBlock = useCallback(() => {
    const editor = editorRef.current;
    if (!editor) return null;
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return null;
    let node = selection.anchorNode as Node | null;
    if (!node) return null;
    if (node.nodeType === Node.TEXT_NODE) {
      node = node.parentElement;
    }
    let element = node as HTMLElement | null;
    while (element && element.parentElement !== editor) {
      element = element?.parentElement ?? null;
    }
    if (!element || element === editor) return null;
    return element;
  }, []);

  const toggleChecklist = useCallback(() => {
    const editor = editorRef.current;
    if (!editor) return;
    const block = getActiveBlock();

    if (block && block.classList.contains("journal-checklist")) {
      const textSpan = block.querySelector(
        ".journal-checklist-text",
      ) as HTMLElement | null;
      const paragraph = document.createElement("p");
      const html = textSpan?.innerHTML ?? "";
      paragraph.innerHTML = html.trim().length > 0 ? html : "<br />";
      block.replaceWith(paragraph);
      placeCursorAtEnd(paragraph);
      handleEditorInput();
      return;
    }

    const content = block ? block.innerHTML : undefined;
    const { container, span } = createChecklistItem(content);

    if (block) {
      block.replaceWith(container);
    } else {
      editor.appendChild(container);
    }

    placeCursorAtEnd(span);
    handleEditorInput();
  }, [createChecklistItem, getActiveBlock, handleEditorInput, placeCursorAtEnd]);

  const applyFormatting = useCallback(
    (actionId: string) => {
      const editor = editorRef.current;
      if (!editor) return;

      editor.focus();

      switch (actionId) {
        case "bold":
          document.execCommand("styleWithCSS", false, "true");
          document.execCommand("bold");
          break;
        case "italic":
          document.execCommand("styleWithCSS", false, "true");
          document.execCommand("italic");
          break;
        case "highlight": {
          const selection = window.getSelection();
          if (!selection || selection.rangeCount === 0) break;
          const range = selection.getRangeAt(0);
          if (range.collapsed) {
            document.execCommand("insertHTML", false, "<mark>highlight</mark>");
            break;
          }
          const mark = document.createElement("mark");
          mark.appendChild(range.extractContents());
          range.insertNode(mark);
          const newRange = document.createRange();
          newRange.selectNodeContents(mark);
          selection.removeAllRanges();
          selection.addRange(newRange);
          break;
        }
        case "checklist": {
          toggleChecklist();
          break;
        }
        case "ai-assist": {
          // TODO: Replace placeholder prompt with LangChain-generated insight.
          const suggestion =
            '<p class="journal-assist text-sm text-zinc-500 italic">🧠 Prompt idea: What helped shift your mood today?</p>';
          document.execCommand("insertHTML", false, suggestion);
          break;
        }
        default:
          break;
      }
      handleEditorInput();
    },
    [handleEditorInput, toggleChecklist],
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (event.key !== "Enter" || event.shiftKey) return;

      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) return;

      const anchorNode = selection.anchorNode as HTMLElement | null;
      const checklistItem = anchorNode
        ? anchorNode.parentElement?.closest(".journal-checklist")
        : null;

      if (checklistItem) {
        event.preventDefault();

        const textSpan = checklistItem.querySelector(
          ".journal-checklist-text",
        ) as HTMLElement | null;
        const textContent = textSpan?.textContent?.trim() ?? "";

        if (textContent.length === 0) {
          const paragraph = document.createElement("p");
          paragraph.innerHTML = "<br />";
          checklistItem.replaceWith(paragraph);
          placeCursorAtEnd(paragraph);
          handleEditorInput();
          return;
        }

        const { container: newItem, span } = createChecklistItem();
        checklistItem.parentNode?.insertBefore(newItem, checklistItem.nextSibling);
        placeCursorAtEnd(span);
        handleEditorInput();
      }
    },
    [createChecklistItem, handleEditorInput, placeCursorAtEnd],
  );

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
            <Button
              key={action.id}
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => applyFormatting(action.id)}
            >
              <span>{action.label}</span>
              <span className="ml-2 text-xs text-zinc-400">
                {action.shortcut}
              </span>
            </Button>
          ))}
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-6 overflow-y-auto px-8 py-8">
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onInput={handleEditorInput}
          onKeyDown={handleKeyDown}
          className="journal-editor min-h-[320px] flex-1 rounded-lg border border-transparent bg-transparent text-base leading-7 text-zinc-700 outline-none transition focus:border-zinc-300 focus:bg-white dark:text-zinc-200 dark:focus:border-zinc-700 dark:focus:bg-black"
          data-placeholder="Capture what is present for you right now..."
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
