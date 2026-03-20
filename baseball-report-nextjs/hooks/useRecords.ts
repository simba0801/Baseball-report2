import { useState, useCallback, useEffect } from "react";
import { GameRecord, GameStats, Player, User } from "@/types";

/**
 * useRecords
 * Streamlit의 load_records, save_records, load_players 로직을 React Hook으로 변환
 * 게임 기록, 선수 정보, 통계 조회 및 저장을 담당
 */
export function useRecords() {
  const [records, setRecords] = useState<GameRecord[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [stats, setStats] = useState<GameStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // localStorage 키
  const RECORDS_STORAGE_KEY = "baseball_records";
  const PLAYERS_STORAGE_KEY = "baseball_players";

  // 초기 데이터 로드
  useEffect(() => {
    loadRecords();
    loadPlayers();
  }, []);

  // 기록 로드 (Streamlit: load_records)
  const loadRecords = useCallback(() => {
    try {
      setIsLoading(true);
      const stored = localStorage.getItem(RECORDS_STORAGE_KEY);
      const loadedRecords = stored ? JSON.parse(stored) : [];
      setRecords(loadedRecords);
      calculateStats(loadedRecords);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "기록 로드 실패");
      setRecords([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 선수 정보 로드 (Streamlit: load_players)
  const loadPlayers = useCallback(() => {
    try {
      const stored = localStorage.getItem(PLAYERS_STORAGE_KEY);
      const loadedPlayers = stored ? JSON.parse(stored) : [];
      setPlayers(loadedPlayers);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "선수 정보 로드 실패");
      setPlayers([]);
    }
  }, []);

  // 기록 저장 (Streamlit: save_records)
  const saveRecord = useCallback(
    (record: GameRecord) => {
      try {
        setIsLoading(true);
        const updatedRecords = [...records];
        const existingIndex = updatedRecords.findIndex(
          (r) => r.record_id === record.record_id
        );

        if (existingIndex >= 0) {
          updatedRecords[existingIndex] = record;
        } else {
          updatedRecords.push(record);
        }

        localStorage.setItem(RECORDS_STORAGE_KEY, JSON.stringify(updatedRecords));
        setRecords(updatedRecords);
        calculateStats(updatedRecords);
        setError(null);
        setIsLoading(false);
        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : "기록 저장 실패");
        setIsLoading(false);
        return false;
      }
    },
    [records]
  );

  // 선수 정보 저장 (Streamlit: save_players)
  const savePlayer = useCallback(
    (player: Player) => {
      try {
        setIsLoading(true);
        const updatedPlayers = [...players];
        const existingIndex = updatedPlayers.findIndex(
          (p) => p.player_id === player.player_id
        );

        if (existingIndex >= 0) {
          updatedPlayers[existingIndex] = player;
        } else {
          updatedPlayers.push(player);
        }

        localStorage.setItem(PLAYERS_STORAGE_KEY, JSON.stringify(updatedPlayers));
        setPlayers(updatedPlayers);
        setError(null);
        setIsLoading(false);
        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : "선수 정보 저장 실패");
        setIsLoading(false);
        return false;
      }
    },
    [players]
  );

  // 통계 계산 (Streamlit: calculate_stats)
  const calculateStats = useCallback((recordList: GameRecord[]) => {
    if (recordList.length === 0) {
      setStats(null);
      return;
    }

    const totalGames = recordList.length;
    const totalPitches = recordList.reduce((sum, r) => sum + r.pitches_thrown, 0);
    const totalStrikes = recordList.reduce((sum, r) => sum + r.strikes, 0);
    const totalBalls = recordList.reduce((sum, r) => sum + r.balls, 0);

    const strikeDistribution = new Map<number, number>();
    const ballDistribution = new Map<number, number>();
    const pitchLocationDistribution = new Map<number, number>();

    recordList.forEach((record) => {
      record.pitches.forEach((pitch) => {
        // 위치별 분포 (1-25 zone)
        const current = pitchLocationDistribution.get(pitch.location) || 0;
        pitchLocationDistribution.set(pitch.location, current + 1);
      });
    });

    const newStats: GameStats = {
      total_games: totalGames,
      total_pitches: totalPitches,
      total_strikes: totalStrikes,
      total_balls: totalBalls,
      strike_rate: totalPitches > 0 ? (totalStrikes / totalPitches) * 100 : 0,
      average_pitches_per_game: totalPitches / totalGames,
      total_runs_allowed: recordList.reduce((sum, r) => sum + r.runs, 0),
      total_earned_runs: recordList.reduce((sum, r) => sum + r.earned_runs, 0),
      total_errors: recordList.reduce((sum, r) => sum + r.errors, 0),
      strike_distribution: Object.fromEntries(strikeDistribution),
      ball_distribution: Object.fromEntries(ballDistribution),
      pitch_location_distribution: Object.fromEntries(pitchLocationDistribution),
    };

    setStats(newStats);
  }, []);

  // 특정 사용자의 기록 조회
  const getRecordsByUser = useCallback(
    (userId: string) => {
      return records.filter((r) => r.user_id === userId);
    },
    [records]
  );

  // 특정 기간의 기록 조회
  const getRecordsByDateRange = useCallback(
    (startDate: Date, endDate: Date) => {
      return records.filter((r) => {
        const recordDate = new Date(r.date);
        return recordDate >= startDate && recordDate <= endDate;
      });
    },
    [records]
  );

  // 특정 상대팀의 기록 조회
  const getRecordsByOpponent = useCallback(
    (opponent: string) => {
      return records.filter((r) => r.opponent === opponent);
    },
    [records]
  );

  // 기록 삭제
  const deleteRecord = useCallback(
    (recordId: string) => {
      try {
        const updatedRecords = records.filter((r) => r.record_id !== recordId);
        localStorage.setItem(RECORDS_STORAGE_KEY, JSON.stringify(updatedRecords));
        setRecords(updatedRecords);
        calculateStats(updatedRecords);
        setError(null);
        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : "기록 삭제 실패");
        return false;
      }
    },
    [records]
  );

  // 기록 검색 (Streamlit의 검색 기능)
  const searchRecords = useCallback(
    (query: string) => {
      return records.filter(
        (r) =>
          r.opponent.toLowerCase().includes(query.toLowerCase()) ||
          r.position.toLowerCase().includes(query.toLowerCase())
      );
    },
    [records]
  );

  return {
    records,
    players,
    stats,
    isLoading,
    error,
    loadRecords,
    loadPlayers,
    saveRecord,
    savePlayer,
    getRecordsByUser,
    getRecordsByDateRange,
    getRecordsByOpponent,
    deleteRecord,
    searchRecords,
  };
}
