"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Journals", href: "/journals", description: "Reflect and write." },
  {
    name: "Discover",
    href: "/discover",
    description: "Connect with peers and communities.",
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-64 flex-col border-r border-zinc-200 bg-white/60 px-4 py-6 backdrop-blur-md dark:border-zinc-800 dark:bg-black/40">
      <div className="mb-8">
        <Link href="/" className="block">
          <div className="text-sm uppercase tracking-wide text-zinc-400">
            Calm Collective
          </div>
          <p className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
            Mindful Journal
          </p>
        </Link>
      </div>
      <nav className="flex flex-col gap-1">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group rounded-lg px-3 py-2 transition-colors",
                isActive
                  ? "bg-zinc-900 text-zinc-100 dark:bg-zinc-100 dark:text-zinc-900"
                  : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-200",
              )}
            >
              <div className="text-sm font-medium">{item.name}</div>
              <div
                className={cn(
                  "text-xs",
                  isActive
                    ? "text-zinc-200 dark:text-zinc-700"
                    : "text-zinc-400 group-hover:text-zinc-500 dark:text-zinc-500 dark:group-hover:text-zinc-400",
                )}
              >
                {item.description}
              </div>
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto space-y-4 border-t border-zinc-200 pt-6 text-sm text-zinc-500 dark:border-zinc-800 dark:text-zinc-500">
        <p className="font-medium text-zinc-700 dark:text-zinc-300">Today</p>
        <div className="rounded-lg border border-dashed border-zinc-200 p-4 dark:border-zinc-800">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            “Taking a moment to breathe is the first step toward clarity.”
          </p>
        </div>
      </div>
    </aside>
  );
}

