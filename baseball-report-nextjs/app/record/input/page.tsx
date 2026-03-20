"use client";

import React, { useState } from "react";
import { Header, Sidebar, Card, Button, Input } from "@/components";
import { PitchPad, GameStatus, BatterActionPanel } from "@/components/Record";
import { useGameSession, useRecords } from "@/hooks";
import { Pitch } from "@/types";

export default function RecordInputPage() {
  const {
    gameSession,
    startNewGame,
    recordPitch,
    updateBallCount,
    updateStrikeCount,
    updateOutCount,
    updateBases,
    convertToGameRecord,
    resetSession,
    isLoading,
  } = useGameSession();

  const { saveRecord } = useRecords();

  // Form states
  const [opponent, setOpponent] = useState("");
  const [position, setPosition] = useState("투수");
  const [batterHand, setBatterHand] = useState<"우타" | "좌타">("우타");
  const [selectedZone, setSelectedZone] = useState<number | undefined>();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // 게임 시작
  const handleStartGame = () => {
    try {
      setError(null);
      if (!opponent) {
        setError("상대팀을 입력해주세요");
        return;
      }
      startNewGame(opponent, position, batterHand);
      setOpponent("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "게임 시작 실패");
    }
  };

  // 투구 기록
  const handleRecordPitch = (result: "strike" | "ball" | "swinging_strike") => {
    if (!gameSession || selectedZone === undefined) {
      setError("먼저 투구 구역을 선택해주세요");
      return;
    }

    const pitch: Pitch = {
      pitch_num: gameSession.pitches.length + 1,
      pitch_type: "fastball", // 기본값
      result,
      location: selectedZone,
      special_situation: null,
      ball_count: result === "ball" ? gameSession.ball_count + 1 : gameSession.ball_count,
      strike_count: result === "strike" || result === "swinging_strike" ? gameSession.strike_count + 1 : gameSession.strike_count,
      out_count: gameSession.out_count,
    };

    recordPitch(pitch);
    setSelectedZone(undefined);

    // Auto increment counters
    if (result === "ball") {
      updateBallCount(pitch.ball_count);
    } else if (result === "strike" || result === "swinging_strike") {
      updateStrikeCount(pitch.strike_count);
    }
  };

  // 타자 행동 기록
  const handleRecordBat = (result: "hit" | "foul" | "swing_and_miss") => {
    if (!gameSession || selectedZone === undefined) {
      setError("먼저 투구 구역을 선택해주세요");
      return;
    }

    const pitch: Pitch = {
      pitch_num: gameSession.pitches.length + 1,
      pitch_type: "fastball",
      result: result === "swing_and_miss" ? "swinging_strike" : result,
      location: selectedZone,
      special_situation: null,
      ball_count: gameSession.ball_count,
      strike_count: result === "swing_and_miss" ? gameSession.strike_count + 1 : gameSession.strike_count,
      out_count: gameSession.out_count,
    };

    recordPitch(pitch);
    setSelectedZone(undefined);

    if (result === "swing_and_miss") {
      updateStrikeCount(pitch.strike_count);
    }
  };

  // 특수 상황 기록
  const handleSpecialSituation = (situation: string) => {
    if (!gameSession) return;

    // 특수 상황에 대한 처리
    if (situation === "wild_pitch" || situation === "passed_ball" || situation === "balk") {
      // 진루 처리
      updateBases({
        first: gameSession.bases.second,
        second: gameSession.bases.third,
        third: false,
      });
    } else if (situation === "error") {
      // 에러 처리
    } else if (situation === "hit_by_pitch") {
      updateBases({
        first: true,
        second: gameSession.bases.first,
        third: gameSession.bases.second,
      });
    }
  };

  // 게임 저장
  const handleSaveGame = async () => {
    try {
      setError(null);
      if (!gameSession) {
        setError("진행 중인 게임이 없습니다");
        return;
      }

      const record = convertToGameRecord("user_1"); // TODO: 실제 user_id 사용
      if (record && saveRecord(record)) {
        setSuccess(true);
        resetSession();
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError("게임 저장에 실패했습니다");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "저장 실패");
    }
  };

  // 게임 종료
  const handleEndGame = () => {
    if (confirm("게임 기록을 저장하지 않고 종료하시겠습니까?")) {
      resetSession();
      setSelectedZone(undefined);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar />

      <main className="lg:ml-64 pt-20 pb-24 lg:pb-8 px-6 md:px-10 max-w-7xl">
        <section className="mb-10 mt-6">
          <h1 className="text-[1.75rem] font-extrabold text-on-surface tracking-tight mb-2">
            기록 입력
          </h1>
          <p className="text-on-surface-variant">
            게임 정보를 입력하고 투구 기록을 관리하세요
          </p>
        </section>

        {success && (
          <Card className="bg-green-50 border-2 border-green-200 p-4 mb-6">
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-green-600">
                check_circle
              </span>
              <div>
                <p className="font-bold text-green-800">게임 저장 완료!</p>
                <p className="text-sm text-green-700 mt-1">
                  게임 기록이 정상적으로 저장되었습니다.
                </p>
              </div>
            </div>
          </Card>
        )}

        {error && (
          <Card className="bg-red-50 border-2 border-red-200 p-4 mb-6">
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-red-600">
                error
              </span>
              <div>
                <p className="font-bold text-red-800">오류</p>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </Card>
        )}

        {!gameSession ? (
          // Game Start Form
          <Card className="p-8 max-w-2xl">
            <h2 className="text-lg font-bold text-on-surface mb-6">새 게임 시작</h2>

            <div className="space-y-6">
              <Input
                label="상대팀"
                value={opponent}
                onChange={(e) => setOpponent(e.target.value)}
                placeholder="예: 한국대학교"
                icon="groups"
                fullWidth
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-on-surface mb-2">
                    포지션
                  </label>
                  <select
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-primary transition-colors bg-white"
                  >
                    <option>투수</option>
                    <option>포수</option>
                    <option>내야수</option>
                    <option>외야수</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-on-surface mb-2">
                    타자 타입
                  </label>
                  <select
                    value={batterHand}
                    onChange={(e) =>
                      setBatterHand(e.target.value as "우타" | "좌타")
                    }
                    className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-primary transition-colors bg-white"
                  >
                    <option value="우타">우타</option>
                    <option value="좌타">좌타</option>
                  </select>
                </div>
              </div>

              <Button
                variant="primary"
                size="lg"
                fullWidth
                loading={isLoading}
                onClick={handleStartGame}
              >
                게임 시작
                <span className="material-symbols-outlined">play_arrow</span>
              </Button>
            </div>
          </Card>
        ) : (
          // Game Recording Interface
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
            {/* Left Column: PitchPad */}
            <div className="lg:col-span-2">
              <PitchPad
                selectedZone={selectedZone}
                onZoneSelect={setSelectedZone}
              />
            </div>

            {/* Right Column: Game Status */}
            <div>
              <GameStatus
                ballCount={gameSession.ball_count}
                strikeCount={gameSession.strike_count}
                outCount={gameSession.out_count}
                inning={gameSession.inning}
                batterOrder={gameSession.batter_order}
                bases={gameSession.bases}
              />
            </div>
          </div>
        )}

        {/* Action Panels */}
        {gameSession && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
            <BatterActionPanel
              onRecordPitch={handleRecordPitch}
              onRecordBat={handleRecordBat}
              onSpecialSituation={handleSpecialSituation}
              isLoading={isLoading}
            />

            {/* Counter Controls */}
            <Card className="p-6">
              <h3 className="text-lg font-bold text-on-surface mb-4">
                수동 조정
              </h3>

              <div className="space-y-4">
                {/* Ball Count */}
                <div>
                  <label className="block text-sm font-semibold text-on-surface mb-2">
                    Ball Count
                  </label>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        updateBallCount(Math.max(gameSession.ball_count - 1, 0))
                      }
                    >
                      −
                    </Button>
                    <input
                      type="number"
                      min="0"
                      max="4"
                      value={gameSession.ball_count}
                      onChange={(e) => updateBallCount(parseInt(e.target.value))}
                      className="flex-1 px-3 py-2 border-2 border-slate-200 rounded-lg text-center font-bold"
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        updateBallCount(Math.min(gameSession.ball_count + 1, 4))
                      }
                    >
                      +
                    </Button>
                  </div>
                </div>

                {/* Strike Count */}
                <div>
                  <label className="block text-sm font-semibold text-on-surface mb-2">
                    Strike Count
                  </label>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        updateStrikeCount(
                          Math.max(gameSession.strike_count - 1, 0)
                        )
                      }
                    >
                      −
                    </Button>
                    <input
                      type="number"
                      min="0"
                      max="3"
                      value={gameSession.strike_count}
                      onChange={(e) => updateStrikeCount(parseInt(e.target.value))}
                      className="flex-1 px-3 py-2 border-2 border-slate-200 rounded-lg text-center font-bold"
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        updateStrikeCount(Math.min(gameSession.strike_count + 1, 3))
                      }
                    >
                      +
                    </Button>
                  </div>
                </div>

                {/* Out Count */}
                <div>
                  <label className="block text-sm font-semibold text-on-surface mb-2">
                    Out Count
                  </label>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        updateOutCount(Math.max(gameSession.out_count - 1, 0))
                      }
                    >
                      −
                    </Button>
                    <input
                      type="number"
                      min="0"
                      max="3"
                      value={gameSession.out_count}
                      onChange={(e) => updateOutCount(parseInt(e.target.value))}
                      className="flex-1 px-3 py-2 border-2 border-slate-200 rounded-lg text-center font-bold"
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        updateOutCount(Math.min(gameSession.out_count + 1, 3))
                      }
                    >
                      +
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Game Summary */}
        {gameSession && (
          <Card className="p-6 mb-6">
            <h3 className="text-lg font-bold text-on-surface mb-4">게임 요약</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-on-surface-variant font-semibold">
                  상대팀
                </p>
                <p className="text-lg font-bold text-on-surface">
                  {gameSession.opponent}
                </p>
              </div>
              <div>
                <p className="text-xs text-on-surface-variant font-semibold">
                  투구 수
                </p>
                <p className="text-lg font-bold text-on-surface">
                  {gameSession.pitches.length}
                </p>
              </div>
              <div>
                <p className="text-xs text-on-surface-variant font-semibold">
                  득점
                </p>
                <p className="text-lg font-bold text-secondary">
                  {gameSession.runs}
                </p>
              </div>
              <div>
                <p className="text-xs text-on-surface-variant font-semibold">
                  실점
                </p>
                <p className="text-lg font-bold text-error">
                  {gameSession.earned_runs}
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Action Buttons */}
        {gameSession && (
          <div className="flex gap-4">
            <Button
              variant="primary"
              size="lg"
              fullWidth
              loading={isLoading}
              onClick={handleSaveGame}
            >
              게임 저장
              <span className="material-symbols-outlined">save</span>
            </Button>
            <Button
              variant="outline"
              size="lg"
              fullWidth
              onClick={handleEndGame}
            >
              게임 종료
              <span className="material-symbols-outlined">close</span>
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
