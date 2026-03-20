"use client";

import React from "react";
import { Card } from "./Card";

interface StatCardProps {
  label: string;
  value: string | number;
  unit?: string;
  icon?: string;
  trend?: {
    value: number;
    label: string;
    positive: boolean;
  };
  variant?: "default" | "primary" | "secondary";
  progressBar?: {
    current: number;
    total: number;
  };
}

export function StatCard({
  label,
  value,
  unit,
  icon,
  trend,
  variant = "default",
  progressBar,
}: StatCardProps) {
  const variants = {
    default: "bg-surface-container-lowest",
    primary: "bg-primary text-white",
    secondary: "bg-secondary text-white",
  };

  return (
    <Card
      className={`${variants[variant]} flex flex-col gap-1 transition-transform hover:scale-[1.02]`}
    >
      <span className="text-[0.6875rem] uppercase font-bold tracking-[0.05rem] text-inherit opacity-90">
        {label}
      </span>

      {unit ? (
        <div className="flex items-baseline gap-2">
          <span className="text-[3.5rem] font-black leading-none text-inherit">
            {value}
          </span>
          <span className="text-xl font-bold opacity-70">{unit}</span>
        </div>
      ) : (
        <span className="text-[3.5rem] font-black leading-none text-inherit">
          {value}
        </span>
      )}

      {progressBar && (
        <div className="mt-4 flex items-center text-xs text-neutral-600">
          <div className="h-1 w-full bg-surface-container-high rounded-full overflow-hidden">
            <div
              className="h-full bg-secondary"
              style={{
                width: `${(progressBar.current / progressBar.total) * 100}%`,
              }}
            ></div>
          </div>
        </div>
      )}

      {trend && (
        <div
          className={`mt-4 flex items-center text-xs font-semibold ${
            trend.positive ? "text-secondary" : "text-error"
          }`}
        >
          <span className="material-symbols-outlined text-sm mr-1">
            {trend.positive ? "trending_up" : "trending_down"}
          </span>
          {trend.value}% {trend.label}
        </div>
      )}

      {icon && (
        <div className="absolute top-6 right-6">
          <span className="material-symbols-outlined text-3xl opacity-30">
            {icon}
          </span>
        </div>
      )}
    </Card>
  );
}
