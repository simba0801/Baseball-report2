import { useState, useCallback, useEffect } from "react";
import { GameSession, Pitch, GameRecord } from "@/types";

interface GameSessionState extends GameSession {
  id: string;
}

/**
 * useGameSession
 * Streamlit의 st.session_state["game_session"] 로직을 React Hook으로 변환
 * 게임 세션 생성, 투구 기록, 게임 상태 업데이트를 담당
 */
export function useGameSession() {
  const [gameSession, setGameSession] = useState<GameSessionState | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 새 게임 세션 시작
  const startNewGame = useCallback(
    (opponent: string, position: string, batterHand: "우타" | "좌타") => {
      try {
        setIsLoading(true);
        setError(null);

        const newSession: GameSessionState = {
          id: `game_${Date.now()}`,
          date: new Date(),
          opponent,
          position,
          batter_hand: batterHand,
          inning: 1,
          batter_order: 1,
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

        setGameSession(newSession);
        setIsLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "게임 시작 실패");
        setIsLoading(false);
      }
    },
    []
  );

  // 투구 기록
  const recordPitch = useCallback(
    (pitch: Pitch) => {
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
    },
    []
  );

  // 볼 카운트 업데이트
  const updateBallCount = useCallback((count: number) => {
    setGameSession((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        ball_count: Math.min(Math.max(count, 0), 4),
      };
    });
  }, []);

  // 스트라이크 카운트 업데이트
  const updateStrikeCount = useCallback((count: number) => {
    setGameSession((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        strike_count: Math.min(Math.max(count, 0), 3),
      };
    });
  }, []);

  // 아웃 카운트 업데이트
  const updateOutCount = useCallback((count: number) => {
    setGameSession((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        out_count: Math.min(Math.max(count, 0), 3),
      };
    });
  }, []);

  // 베이스 업데이트 (주자 진루)
  const updateBases = useCallback(
    (bases: GameSession["bases"]) => {
      setGameSession((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          bases,
        };
      });
    },
    []
  );

  // 득점 및 실점 업데이트
  const updateRuns = useCallback(
    (runs: number, earnedRuns: number) => {
      setGameSession((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          runs: Math.max(runs, 0),
          earned_runs: Math.max(earnedRuns, 0),
        };
      });
    },
    []
  );

  // 실수 업데이트
  const updateErrors = useCallback((errors: number) => {
    setGameSession((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        errors: Math.max(errors, 0),
      };
    });
  }, []);

  // 이닝 업데이트
  const updateInning = useCallback((inning: number) => {
    setGameSession((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        inning: Math.max(inning, 1),
      };
    });
  }, []);

  // 타자 순번 업데이트
  const updateBatterOrder = useCallback((order: number) => {
    setGameSession((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        batter_order: Math.max(order, 1),
      };
    });
  }, []);

  // 특수 상황 기록
  const recordSpecialSituation = useCallback(
    (
      situation:
        | "wild_pitch"
        | "passed_ball"
        | "balk"
        | "error"
        | "hit_by_pitch"
        | "pickoff"
    ) => {
      setGameSession((prev) => {
        if (!prev) return prev;

        let newSession = { ...prev };

        switch (situation) {
          case "wild_pitch":
          case "passed_ball":
          case "balk":
            // 주자가 진루 가능 (1루 주자는 2루로, 2루는 3루로, 3루는 홈으로)
            newSession.bases = {
              first: newSession.bases.second,
              second: newSession.bases.third,
              third: false,
            };
            newSession.runs += newSession.bases.third ? 1 : 0;
            newSession.earned_runs += newSession.bases.third ? 1 : 0;
            break;

          case "error":
            newSession.errors += 1;
            break;

          case "hit_by_pitch":
            newSession.bases = {
              first: true,
              second: newSession.bases.first,
              third: newSession.bases.second,
            };
            break;

          case "pickoff":
            // 주자별 아웃 처리 (간단히 1루 주자만 아웃으로 가정)
            if (newSession.bases.first) {
              newSession.bases.first = false;
              newSession.out_count += 1;
            }
            break;
        }

        return newSession;
      });
    },
    []
  );

  // 게임 세션을 GameRecord로 변환 (저장용)
  const convertToGameRecord = useCallback(
    (userId: string): GameRecord | null => {
      if (!gameSession) return null;

      return {
        record_id: gameSession.id,
        user_id: userId,
        date: gameSession.date,
        opponent: gameSession.opponent,
        position: gameSession.position,
        inning: gameSession.inning,
        pitches_thrown: gameSession.pitches.length,
        strikes: gameSession.pitches.filter(
          (p) => p.result === "strike" || p.result === "swinging_strike"
        ).length,
        balls: gameSession.pitches.filter((p) => p.result === "ball").length,
        hit_batters: gameSession.pitches.filter(
          (p) => p.special_situation === "hit_by_pitch"
        ).length,
        runs: gameSession.runs,
        earned_runs: gameSession.earned_runs,
        errors: gameSession.errors,
        pitches: gameSession.pitches,
      };
    },
    [gameSession]
  );

  // 게임 세션 초기화
  const resetSession = useCallback(() => {
    setGameSession(null);
    setError(null);
  }, []);

  return {
    gameSession,
    isLoading,
    error,
    startNewGame,
    recordPitch,
    updateBallCount,
    updateStrikeCount,
    updateOutCount,
    updateBases,
    updateRuns,
    updateErrors,
    updateInning,
    updateBatterOrder,
    recordSpecialSituation,
    convertToGameRecord,
    resetSession,
  };
}
