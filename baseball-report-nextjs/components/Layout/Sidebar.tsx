"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarLink {
  label: string;
  href: string;
  icon: string;
}

const SIDEBAR_LINKS: SidebarLink[] = [
  { label: "Home", href: "/", icon: "home" },
  { label: "Player Info", href: "/player/info", icon: "person" },
  { label: "Record Input", href: "/record/input", icon: "edit_note" },
  { label: "Results", href: "/record/results", icon: "analytics" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex flex-col h-screen p-4 border-r border-slate-100 dark:border-slate-800 h-full w-64 fixed left-0 top-0 bg-surface_dim dark:bg-slate-950 z-40 pt-20">
      <div className="mb-8 px-4">
        <p className="text-xl font-bold text-[#005e93]">Scout Portal</p>
        <p className="text-[0.6875rem] uppercase tracking-[0.05rem] text-on-surface-variant">
          Precision Data
        </p>
      </div>

      <nav className="space-y-2">
        {SIDEBAR_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ease-in-out font-['Inter'] uppercase tracking-[0.05rem] text-[0.6875rem] ${
              pathname === link.href
                ? "text-[#005e93] dark:text-sky-300 font-bold bg-[#e9f6fd] dark:bg-sky-900/20"
                : "text-slate-600 dark:text-slate-400 hover:bg-[#e9f6fd] dark:hover:bg-slate-900/30"
            }`}
          >
            <span className="material-symbols-outlined">{link.icon}</span>
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
