import { ReactNode } from "react";
import { Sidebar } from "@/components/layout/sidebar";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-zinc-50 text-zinc-900 dark:bg-black dark:text-zinc-100">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">{children}</div>
    </div>
  );
}
