"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Header, Sidebar, Card, StatCard, Button } from "@/components";
import { useRecords } from "@/hooks";
import { GameStats } from "@/types";

export default function HomePage() {
  const { stats, records, isLoading } = useRecords();
  const [displayStats, setDisplayStats] = useState<GameStats | null>(null);

  useEffect(() => {
    if (stats) {
      setDisplayStats(stats);
    }
  }, [stats]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar />

      {/* Main Content */}
      <main className="lg:ml-64 pt-20 pb-24 lg:pb-8 px-6 md:px-10 max-w-7xl">
        {/* Welcome Section */}
        <section className="mb-10 mt-6">
          <h1 className="text-[1.75rem] font-extrabold text-on-surface tracking-tight mb-2 font-headline">
            Welcome back, admin! 👋
          </h1>
          <p className="text-on-surface-variant font-body">
            Your scouting dashboard is synchronized and ready for data entry.
          </p>
        </section>

        {/* Statistical Summary Bento Grid */}
        {displayStats && (
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <StatCard
              label="Total Games"
              value={displayStats.total_games}
              trend={{
                value: 12,
                label: "vs last month",
                positive: true,
              }}
            />

            <StatCard
              label="Total Pitches"
              value={displayStats.total_pitches}
              progressBar={{
                current: displayStats.total_strikes,
                total: displayStats.total_pitches,
              }}
              variant="secondary"
            />

            <StatCard
              label="Avg. Speed"
              value={142}
              unit="km/h"
              variant="primary"
            />
          </section>
        )}

        {/* Main Menu Cards Grid */}
        <section className="mb-12">
          <h2 className="text-[0.6875rem] uppercase font-bold tracking-[0.1rem] text-on-surface-variant mb-6">
            Operations Hub
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Login/Profile */}
            <Link href="/auth/login">
              <Card className="p-6 flex items-center gap-5 text-left cursor-pointer hover:bg-sky-50 active:scale-95 group transition-all">
                <div className="w-12 h-12 rounded-lg bg-surface-container flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                  <span
                    className="material-symbols-outlined text-2xl"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    lock
                  </span>
                </div>
                <div>
                  <p className="font-bold text-on-surface">Login/Profile</p>
                  <p className="text-sm text-on-surface-variant">
                    Manage credentials
                  </p>
                </div>
              </Card>
            </Link>

            {/* Player Registration */}
            <Link href="/player/register">
              <Card className="p-6 flex items-center gap-5 text-left cursor-pointer hover:bg-sky-50 active:scale-95 group transition-all">
                <div className="w-12 h-12 rounded-lg bg-surface-container flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                  <span className="material-symbols-outlined text-2xl">
                    description
                  </span>
                </div>
                <div>
                  <p className="font-bold text-on-surface">Player Registration</p>
                  <p className="text-sm text-on-surface-variant">
                    Add new athletes
                  </p>
                </div>
              </Card>
            </Link>

            {/* Record Input */}
            <Link href="/record/input">
              <Card className="p-6 flex items-center gap-5 text-left cursor-pointer hover:brightness-110 active:scale-95 group transition-all bg-primary-container text-white">
                <div className="w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-2xl">
                    assignment
                  </span>
                </div>
                <div>
                  <p className="font-bold">Record Input</p>
                  <p className="text-sm opacity-80">Log game performance</p>
                </div>
              </Card>
            </Link>

            {/* Results View */}
            <Link href="/record/results">
              <Card className="p-6 flex items-center gap-5 text-left cursor-pointer hover:bg-sky-50 active:scale-95 group transition-all">
                <div className="w-12 h-12 rounded-lg bg-surface-container flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                  <span className="material-symbols-outlined text-2xl">
                    bar_chart
                  </span>
                </div>
                <div>
                  <p className="font-bold text-on-surface">Results View</p>
                  <p className="text-sm text-on-surface-variant">
                    Explore historic data
                  </p>
                </div>
              </Card>
            </Link>
          </div>
        </section>

        {/* Recent Summary */}
        <section>
          <h2 className="text-[0.6875rem] uppercase font-bold tracking-[0.1rem] text-on-surface-variant mb-6">
            Quick Stats
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="font-bold text-on-surface mb-4">Strike Rate</h3>
              <div className="text-3xl font-black text-primary">
                {displayStats
                  ? Math.round(displayStats.strike_rate)
                  : 0}%
              </div>
              <p className="text-sm text-on-surface-variant mt-2">
                {displayStats
                  ? `${displayStats.total_strikes} strikes out of ${displayStats.total_pitches} pitches`
                  : "No data"}
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="font-bold text-on-surface mb-4">
                ERA (Earned Run Average)
              </h3>
              <div className="text-3xl font-black text-secondary">
                {displayStats
                  ? (
                      (displayStats.total_earned_runs * 9) /
                      (displayStats.total_games * 6)
                    ).toFixed(2)
                  : "0.00"}
              </div>
              <p className="text-sm text-on-surface-variant mt-2">
                {displayStats
                  ? `${displayStats.total_earned_runs} earned runs`
                  : "No data"}
              </p>
            </Card>
          </div>
        </section>
      </main>
    </div>
  );
}
