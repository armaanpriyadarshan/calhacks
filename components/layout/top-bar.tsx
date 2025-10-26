"use client";

import Image from "next/image";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";

type User = {
  name: string;
  avatarUrl: string;
  status: "online" | "away" | "focus";
};

type TopBarProps = {
  title: string;
  user?: User;
};

const statusColors: Record<User["status"], string> = {
  online: "bg-emerald-500",
  away: "bg-amber-500",
  focus: "bg-blue-500",
};

export function TopBar({ title, user }: TopBarProps) {
  const person = useMemo<User>(
    () =>
      // TODO: Replace fallback user with data from NextAuth/Supabase session.
      user ?? {
        name: "Taylor Brooks",
        avatarUrl: "/vercel.svg",
        status: "online",
      },
    [user],
  );

  return (
    <header className="flex h-16 items-center justify-between border-b border-zinc-200 bg-white/70 px-6 backdrop-blur-md dark:border-zinc-800 dark:bg-black/40">
      <div>
        <h1 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          {title}
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Quiet space to reflect and connect.
        </p>
      </div>
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm">
          Command palette
        </Button>
          <div className="flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1.5 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="relative h-8 w-8 overflow-hidden rounded-full">
            <Image
              src={person.avatarUrl}
              alt={person.name}
              sizes="32px"
              fill
              className="object-cover"
            />
            <span
              className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border border-white ${statusColors[person.status]}`}
            />
          </div>
          <div className="text-sm">
            <div className="font-medium text-zinc-900 dark:text-zinc-100">
              {person.name}
            </div>
            <div className="text-xs text-zinc-500 dark:text-zinc-400">
              {person.status === "focus" ? "Focus mode" : "Available"}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
