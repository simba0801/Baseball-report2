"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/hooks";

export function Header() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface dark:bg-slate-900 flex justify-between items-center w-full px-6 py-3 border-none bg-surface_container_low dark:bg-slate-800">
      <div className="flex items-center gap-4">
        <span className="text-lg font-black text-[#005e93] dark:text-sky-400 font-['Inter'] tracking-tight">
          Baseball Report
        </span>
      </div>

      <div className="flex items-center gap-6">
        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-8">
          <Link
            href="/"
            className="text-[#005e93] font-bold border-b-2 border-[#005e93] font-['Inter'] font-medium tracking-tight"
          >
            Home
          </Link>
          <Link
            href="/player/info"
            className="text-slate-500 dark:text-slate-400 font-['Inter'] font-medium tracking-tight hover:bg-sky-50 transition-colors"
          >
            Player Info
          </Link>
          <Link
            href="/record/input"
            className="text-slate-500 dark:text-slate-400 font-['Inter'] font-medium tracking-tight hover:bg-sky-50 transition-colors"
          >
            Record Input
          </Link>
          <Link
            href="/record/results"
            className="text-slate-500 dark:text-slate-400 font-['Inter'] font-medium tracking-tight hover:bg-sky-50 transition-colors"
          >
            Results
          </Link>
        </nav>

        {/* User Menu */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleLogout}
            className="material-symbols-outlined text-slate-500 cursor-pointer p-2 hover:bg-sky-50 rounded-full transition-colors"
            title="Logout"
          >
            logout
          </button>
          <img
            className="w-8 h-8 rounded-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDQfzzoOoLh1KODiYIsobHuazQSRg-tzcMfM80u5MQTMFuqQnn3Us7I9xaUpX9qotWsOiqAPtzJhsicPfy_VFRmTD7rs7dUdo9hhRXJHEOAr4um1WehH0f3nDbOLc5Mu08ummq82hcs3KWqT7Ve7--MLhFtTX9gTm0VGj7JImi02R4gLasa8IRv8Sr4MInKIqAQGiqdW8DW8ACtBjd9ZOHXjn-Qp0GCK9lCieXjH6bvDYACIfEgf-JT2U0KmLvdbnobaF5M4h_Z90M"
            alt="User profile avatar"
          />
        </div>
      </div>
    </header>
  );
}
