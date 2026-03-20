"use client";

import React from "react";
import { Card, StatCard } from "@/components/Common";

interface GameStatusProps {
  ballCount: number;
  strikeCount: number;
  outCount: number;
  inning: number;
  batterOrder: number;
  bases: {
    first: boolean;
    second: boolean;
    third: boolean;
  };
}

/**
 * GameStatus - 게임 상태 표시
 * Streamlit의 st.metric() 로직을 React로 구현
 */
export function GameStatus({
  ballCount,
  strikeCount,
  outCount,
  inning,
  batterOrder,
  bases,
}: GameStatusProps) {
  return (
    <div className="space-y-4">
      {/* Count Display */}
      <Card className="p-6">
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <span className="text-xs font-bold uppercase text-secondary">
              Ball
            </span>
            <div className="text-4xl font-black text-secondary">{ballCount}</div>
          </div>
          <div className="text-center">
            <span className="text-xs font-bold uppercase text-primary">
              Strike
            </span>
            <div className="text-4xl font-black text-primary">
              {strikeCount}
            </div>
          </div>
          <div className="text-center">
            <span className="text-xs font-bold uppercase text-error">
              Out
            </span>
            <div className="text-4xl font-black text-error">{outCount}</div>
          </div>
        </div>

        {/* Status message */}
        <div className="text-center pt-4 border-t border-slate-200">
          <p className="text-sm font-semibold text-on-surface">
            {ballCount}-{strikeCount} Count
          </p>
          <p className="text-xs text-on-surface-variant mt-1">
            Inning {inning} • Batter {batterOrder}
          </p>
        </div>
      </Card>

      {/* Bases */}
      <Card className="p-6">
        <h4 className="text-sm font-bold uppercase text-on-surface-variant mb-4">
          Bases
        </h4>
        <div className="flex items-center justify-between">
          {/* 1st Base */}
          <div className="w-14 h-14 border-4 border-slate-300 rounded-full flex items-center justify-center">
            <div
              className={`w-12 h-12 rounded-full transition-colors ${
                bases.first ? "bg-secondary shadow-lg" : "bg-sky-100"
              }`}
            >
              <span className="text-xs font-bold flex items-center justify-center h-full">
                1st
              </span>
            </div>
          </div>

          {/* 2nd Base */}
          <div className="w-14 h-14 border-4 border-slate-300 rounded-full flex items-center justify-center">
            <div
              className={`w-12 h-12 rounded-full transition-colors ${
                bases.second ? "bg-secondary shadow-lg" : "bg-sky-100"
              }`}
            >
              <span className="text-xs font-bold flex items-center justify-center h-full">
                2nd
              </span>
            </div>
          </div>

          {/* 3rd Base */}
          <div className="w-14 h-14 border-4 border-slate-300 rounded-full flex items-center justify-center">
            <div
              className={`w-12 h-12 rounded-full transition-colors ${
                bases.third ? "bg-secondary shadow-lg" : "bg-sky-100"
              }`}
            >
              <span className="text-xs font-bold flex items-center justify-center h-full">
                3rd
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Game Info */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4">
          <p className="text-xs uppercase font-bold text-on-surface-variant mb-2">
            Inning
          </p>
          <p className="text-2xl font-black text-primary">{inning}</p>
        </Card>

        <Card className="p-4">
          <p className="text-xs uppercase font-bold text-on-surface-variant mb-2">
            Batter
          </p>
          <p className="text-2xl font-black text-secondary">#{batterOrder}</p>
        </Card>
      </div>
    </div>
  );
}
