"use client";

import React, { createContext, useContext, useState, useCallback, useReducer, ReactNode } from "react";
import { GameSession, Pitch, SpecialSituation } from "@/types";

interface GameContextType {
  gameSession: GameSession | null;
  isRecording: boolean;
  startGame: (opponent: string, position: string) => void;
  recordPitch: (pitch: Pitch) => void;
  updateGameSession: (updates: Partial<GameSession>) => void;
  endGame: () => void;
  updateBallCount: (count: number) => void;
  updateStrikeCount: (count: number) => void;
  updateOutCount: (count: number) => void;
  updateBases: (bases: GameSession["bases"]) => void;
  recordSpecialSituation: (situation: SpecialSituation) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

const initialGameSession: GameSession = {
  date: new Date(),
  opponent: "",
  position: "선발",
  inning: 1,
  batter_order: 1,
  batter_hand: "우타",
  out_count: 0,
  ball_count: 0,
  strike_count: 0,
  bases: {
    first: false,
    second: false,
    third: false,
  },
  pitches: [],
  runs: 0,
  earned_runs: 0,
  errors: 0,
};

export function GameProvider({ children }: { children: ReactNode }) {
  const [gameSession, setGameSession] = useState<GameSession | null>(null);
  const [isRecording, setIsRecording] = useState(false);

  const startGame = useCallback((opponent: string, position: string) => {
    setGameSession({
      ...initialGameSession,
      opponent,
      position,
      date: new Date(),
    });
    setIsRecording(true);
  }, []);

  const recordPitch = useCallback((pitch: Pitch) => {
    setGameSession((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        pitches: [...prev.pitches, pitch],
        ball_count: pitch.ball_count,
        strike_count: pitch.strike_count,
        out_count: pitch.out_count,
      };
    });
  }, []);

  const updateGameSession = useCallback((updates: Partial<GameSession>) => {
    setGameSession((prev) => {
      if (!prev) return prev;
      return { ...prev, ...updates };
    });
  }, []);

  const endGame = useCallback(() => {
    setIsRecording(false);
  }, []);

  const updateBallCount = useCallback((count: number) => {
    setGameSession((prev) => {
      if (!prev) return prev;
      return { ...prev, ball_count: Math.min(count, 4) };
    });
  }, []);

  const updateStrikeCount = useCallback((count: number) => {
    setGameSession((prev) => {
      if (!prev) return prev;
      return { ...prev, strike_count: Math.min(count, 3) };
    });
  }, []);

  const updateOutCount = useCallback((count: number) => {
    setGameSession((prev) => {
      if (!prev) return prev;
      return { ...prev, out_count: Math.min(count, 3) };
    });
  }, []);

  const updateBases = useCallback((bases: GameSession["bases"]) => {
    setGameSession((prev) => {
      if (!prev) return prev;
      return { ...prev, bases };
    });
  }, []);

  const recordSpecialSituation = useCallback((situation: SpecialSituation) => {
    setGameSession((prev) => {
      if (!prev) return prev;

      let runs = prev.runs;
      let earned_runs = prev.earned_runs;
      let errors = prev.errors;

      // Streamlit의 special_situation 처리 로직
      if (
        situation === "wild_pitch" ||
        situation === "passed_ball" ||
        situation === "balk"
      ) {
        runs += 1;
        earned_runs += 1;
      } else if (situation === "error") {
        errors += 1;
      } else if (situation === "hit_by_pitch") {
        runs += 1;
      }

      return {
        ...prev,
        runs,
        earned_runs,
        errors,
      };
    });
  }, []);

  const value: GameContextType = {
    gameSession,
    isRecording,
    startGame,
    recordPitch,
    updateGameSession,
    endGame,
    updateBallCount,
    updateStrikeCount,
    updateOutCount,
    updateBases,
    recordSpecialSituation,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGame must be used within GameProvider");
  }
  return context;
}
