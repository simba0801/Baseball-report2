"use client";

import React, { useState } from "react";
import { Card, Button } from "@/components";

interface BatterActionPanelProps {
  onRecordPitch: (result: "strike" | "ball" | "swinging_strike") => void;
  onRecordBat: (result: "hit" | "foul" | "swing_and_miss") => void;
  onSpecialSituation: (situation: string) => void;
  isLoading?: boolean;
}

type ActionMode = "pitch_result" | "bat_action" | "special_situation";

/**
 * BatterActionPanel - 타자 행동 기록 패널
 * Streamlit의 batter_action 선택지를 React로 구현
 */
export function BatterActionPanel({
  onRecordPitch,
  onRecordBat,
  onSpecialSituation,
  isLoading = false,
}: BatterActionPanelProps) {
  const [mode, setMode] = useState<ActionMode>("pitch_result");

  return (
    <Card className="p-6">
      <h3 className="text-lg font-bold text-on-surface mb-4">타자 행동</h3>

      {/* Mode Selector */}
      <div className="flex gap-2 mb-6">
        <Button
          variant={mode === "pitch_result" ? "primary" : "ghost"}
          size="sm"
          onClick={() => setMode("pitch_result")}
          fullWidth
        >
          투구 결과
        </Button>
        <Button
          variant={mode === "bat_action" ? "primary" : "ghost"}
          size="sm"
          onClick={() => setMode("bat_action")}
          fullWidth
        >
          타자 행동
        </Button>
        <Button
          variant={mode === "special_situation" ? "primary" : "ghost"}
          size="sm"
          onClick={() => setMode("special_situation")}
          fullWidth
        >
          특수 상황
        </Button>
      </div>

      {/* Pitch Result */}
      {mode === "pitch_result" && (
        <div className="grid grid-cols-3 gap-3">
          <Button
            variant="primary"
            fullWidth
            loading={isLoading}
            onClick={() => onRecordPitch("strike")}
          >
            Strike
          </Button>
          <Button
            variant="primary"
            fullWidth
            loading={isLoading}
            onClick={() => onRecordPitch("ball")}
          >
            Ball
          </Button>
          <Button
            variant="secondary"
            fullWidth
            loading={isLoading}
            onClick={() => onRecordPitch("swinging_strike")}
          >
            Swinging Strike
          </Button>
        </div>
      )}

      {/* Bat Action */}
      {mode === "bat_action" && (
        <div className="grid grid-cols-3 gap-3">
          <Button
            variant="primary"
            fullWidth
            loading={isLoading}
            onClick={() => onRecordBat("hit")}
          >
            Hit
            <span className="material-symbols-outlined text-lg">
              favorite
            </span>
          </Button>
          <Button
            variant="secondary"
            fullWidth
            loading={isLoading}
            onClick={() => onRecordBat("foul")}
          >
            Foul
            <span className="material-symbols-outlined text-lg">error</span>
          </Button>
          <Button
            variant="outline"
            fullWidth
            loading={isLoading}
            onClick={() => onRecordBat("swing_and_miss")}
          >
            K
          </Button>
        </div>
      )}

      {/* Special Situations */}
      {mode === "special_situation" && (
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            size="sm"
            fullWidth
            loading={isLoading}
            onClick={() => onSpecialSituation("wild_pitch")}
          >
            Wild Pitch
          </Button>
          <Button
            variant="outline"
            size="sm"
            fullWidth
            loading={isLoading}
            onClick={() => onSpecialSituation("passed_ball")}
          >
            Passed Ball
          </Button>
          <Button
            variant="outline"
            size="sm"
            fullWidth
            loading={isLoading}
            onClick={() => onSpecialSituation("balk")}
          >
            Balk
          </Button>
          <Button
            variant="outline"
            size="sm"
            fullWidth
            loading={isLoading}
            onClick={() => onSpecialSituation("error")}
          >
            Error
          </Button>
          <Button
            variant="outline"
            size="sm"
            fullWidth
            loading={isLoading}
            onClick={() => onSpecialSituation("hit_by_pitch")}
          >
            HBP
          </Button>
          <Button
            variant="outline"
            size="sm"
            fullWidth
            loading={isLoading}
            onClick={() => onSpecialSituation("pickoff")}
          >
            Pickoff
          </Button>
        </div>
      )}
    </Card>
  );
}
