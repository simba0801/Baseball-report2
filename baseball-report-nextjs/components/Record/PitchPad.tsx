"use client";

import React, { useState, useCallback } from "react";
import { Card } from "@/components/Common/Card";

interface PitchPadProps {
  onZoneSelect: (zone: number) => void;
  selectedZone?: number;
}

/**
 * PitchPad - 5x5 그리드 (투구 구역 선택)
 *
 * Zone 배치:
 * 1  2  3  4  5     (Ball zones - 좌상)
 * 6  7  8  9  10    (Ball zones - 좌)
 * 11 12 13 14 15    (Ball/Strike 경계)
 * 16 17 18 19 20    (Ball zones - 우)
 * 21 22 23 24 25    (Ball zones - 우하)
 *
 * Strike Zone (중앙 3x3):
 * 8, 9, 10 (중상)
 * 13, 14, 15 (중중)
 * 18, 19, 20 (중하)
 *
 * Streamlit의 pitchpad 로직을 React로 변환
 */

const STRIKE_ZONES = [8, 9, 10, 13, 14, 15, 18, 19, 20];

const ZONE_COLORS: Record<number, string> = {
  // Ball zones (파란색 계열)
  1: "bg-blue-100 border-blue-300",
  2: "bg-blue-100 border-blue-300",
  3: "bg-blue-100 border-blue-300",
  4: "bg-blue-100 border-blue-300",
  5: "bg-blue-100 border-blue-300",
  6: "bg-blue-100 border-blue-300",
  7: "bg-blue-100 border-blue-300",

  // Strike zones (초록색 계열)
  8: "bg-green-100 border-green-300",
  9: "bg-green-100 border-green-300",
  10: "bg-green-100 border-green-300",
  13: "bg-green-100 border-green-300",
  14: "bg-green-100 border-green-300",
  15: "bg-green-100 border-green-300",
  18: "bg-green-100 border-green-300",
  19: "bg-green-100 border-green-300",
  20: "bg-green-100 border-green-300",

  // Ball zones (파란색 계열)
  11: "bg-blue-100 border-blue-300",
  12: "bg-blue-100 border-blue-300",

  16: "bg-blue-100 border-blue-300",
  17: "bg-blue-100 border-blue-300",
  21: "bg-blue-100 border-blue-300",
  22: "bg-blue-100 border-blue-300",
  23: "bg-blue-100 border-blue-300",
  24: "bg-blue-100 border-blue-300",
  25: "bg-blue-100 border-blue-300",
};

export function PitchPad({ onZoneSelect, selectedZone }: PitchPadProps) {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-bold text-on-surface mb-4">투구 구역 선택</h3>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-green-100 border-2 border-green-300 rounded"></div>
          <span className="font-semibold">Strike Zone (center 3x3)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-blue-100 border-2 border-blue-300 rounded"></div>
          <span className="font-semibold">Ball Zone (outer)</span>
        </div>
      </div>

      {/* Pitch Pad Grid 5x5 */}
      <div className="inline-block border-4 border-gray-800 rounded-lg overflow-hidden bg-white">
        <div className="grid grid-cols-5 gap-0">
          {Array.from({ length: 25 }, (_, i) => i + 1).map((zone) => (
            <button
              key={zone}
              onClick={() => onZoneSelect(zone)}
              className={`
                w-12 h-12
                border-2
                rounded-none
                font-bold
                text-xs
                transition-all
                duration-200
                ${ZONE_COLORS[zone]}
                ${
                  selectedZone === zone
                    ? "ring-4 ring-offset-2 ring-primary scale-95"
                    : "hover:scale-95"
                }
                ${STRIKE_ZONES.includes(zone) ? "cursor-pointer" : "cursor-pointer"}
              `}
              title={`Zone ${zone} ${
                STRIKE_ZONES.includes(zone) ? "(Strike)" : "(Ball)"
              }`}
            >
              {zone}
            </button>
          ))}
        </div>
      </div>

      {/* Selected Zone Info */}
      {selectedZone && (
        <div className="mt-6 p-4 bg-sky-50 border-2 border-sky-200 rounded-lg">
          <p className="font-semibold text-on-surface">
            선택된 구역: Zone {selectedZone}{" "}
            <span className="text-sm font-normal">
              ({STRIKE_ZONES.includes(selectedZone) ? "Strike" : "Ball"})
            </span>
          </p>
        </div>
      )}

      {/* Grid Reference */}
      <div className="mt-6 pt-4 border-t border-slate-200">
        <p className="text-xs text-on-surface-variant font-semibold mb-2">
          구역 설명:
        </p>
        <div className="grid grid-cols-2 gap-2 text-xs text-on-surface-variant">
          <p>• 높이: 상(1-5) → 중(11-15) → 하(21-25)</p>
          <p>• 좌우: 좌(1,6,11,16,21) → 중(3,8,13,18,23) → 우(5,10,15,20,25)</p>
        </div>
      </div>
    </Card>
  );
}
