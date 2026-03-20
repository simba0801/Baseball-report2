"use client";

import React, { useState } from "react";
import { Header, Sidebar, Card, Button } from "@/components";
import { useRecords } from "@/hooks";
import { GameRecord } from "@/types";

export default function ResultsPage() {
  const { records, stats, deleteRecord, isLoading } = useRecords();
  const [expandedRecord, setExpandedRecord] = useState<string | null>(null);
  const [filterOpponent, setFilterOpponent] = useState("");

  // Filter records
  const filteredRecords = filterOpponent
    ? records.filter((r) =>
        r.opponent.toLowerCase().includes(filterOpponent.toLowerCase())
      )
    : records;

  const handleDelete = (recordId: string) => {
    if (confirm("이 기록을 삭제하시겠습니까?")) {
      deleteRecord(recordId);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar />

      <main className="lg:ml-64 pt-20 pb-24 lg:pb-8 px-6 md:px-10 max-w-7xl">
        <section className="mb-10 mt-6">
          <h1 className="text-[1.75rem] font-extrabold text-on-surface tracking-tight mb-2">
            결과 조회
          </h1>
          <p className="text-on-surface-variant">
            모든 게임 기록과 통계를 확인하세요
          </p>
        </section>

        {/* Statistics Summary */}
        {stats && (
          <section className="mb-12">
            <h2 className="text-[0.6875rem] uppercase font-bold tracking-[0.1rem] text-on-surface-variant mb-6">
              전체 통계
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="p-4">
                <p className="text-xs text-on-surface-variant font-semibold mb-2">
                  총 경기
                </p>
                <p className="text-2xl font-black text-primary">
                  {stats.total_games}
                </p>
              </Card>
              <Card className="p-4">
                <p className="text-xs text-on-surface-variant font-semibold mb-2">
                  총 투구
                </p>
                <p className="text-2xl font-black text-on-surface">
                  {stats.total_pitches}
                </p>
              </Card>
              <Card className="p-4">
                <p className="text-xs text-on-surface-variant font-semibold mb-2">
                  스트라이크율
                </p>
                <p className="text-2xl font-black text-secondary">
                  {Math.round(stats.strike_rate)}%
                </p>
              </Card>
              <Card className="p-4">
                <p className="text-xs text-on-surface-variant font-semibold mb-2">
                  평균 구속
                </p>
                <p className="text-2xl font-black text-tertiary">
                  평균 투구
                </p>
              </Card>
            </div>
          </section>
        )}

        {/* Filter & Search */}
        <section className="mb-6">
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="상대팀으로 검색..."
              value={filterOpponent}
              onChange={(e) => setFilterOpponent(e.target.value)}
              className="flex-1 px-4 py-2.5 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-primary transition-colors"
            />
          </div>
        </section>

        {/* Records List */}
        {filteredRecords.length === 0 ? (
          <Card className="p-12 text-center">
            <span className="material-symbols-outlined text-6xl text-on-surface-variant/30">
              assignment
            </span>
            <p className="text-on-surface-variant mt-4 font-semibold">
              기록이 없습니다
            </p>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredRecords.map((record) => (
              <Card
                key={record.record_id}
                className="p-0 overflow-hidden hover:shadow-lg transition-shadow"
              >
                <button
                  onClick={() =>
                    setExpandedRecord(
                      expandedRecord === record.record_id
                        ? null
                        : record.record_id
                    )
                  }
                  className="w-full p-6 flex items-center justify-between text-left hover:bg-sky-50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <h3 className="text-lg font-bold text-on-surface">
                        vs {record.opponent}
                      </h3>
                      <span className="text-xs font-bold uppercase bg-primary/10 text-primary px-2 py-1 rounded">
                        {record.position}
                      </span>
                    </div>
                    <p className="text-sm text-on-surface-variant">
                      {new Date(record.date).toLocaleDateString("ko-KR")} •
                      이닝 {record.inning} • 투구 {record.pitches_thrown}개
                    </p>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-sm font-bold text-on-surface">
                        {record.runs}:{record.earned_runs}
                      </p>
                      <p className="text-xs text-on-surface-variant">
                        점수:실점
                      </p>
                    </div>
                    <span className="material-symbols-outlined text-on-surface-variant">
                      {expandedRecord === record.record_id
                        ? "expand_less"
                        : "expand_more"}
                    </span>
                  </div>
                </button>

                {/* Expanded Details */}
                {expandedRecord === record.record_id && (
                  <div className="border-t border-slate-200 bg-sky-50 p-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      <div>
                        <p className="text-xs text-on-surface-variant font-semibold">
                          총 투구
                        </p>
                        <p className="text-xl font-black text-on-surface">
                          {record.pitches_thrown}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-on-surface-variant font-semibold">
                          스트라이크
                        </p>
                        <p className="text-xl font-black text-secondary">
                          {record.strikes}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-on-surface-variant font-semibold">
                          볼
                        </p>
                        <p className="text-xl font-black text-primary">
                          {record.balls}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-on-surface-variant font-semibold">
                          실수
                        </p>
                        <p className="text-xl font-black text-error">
                          {record.errors}
                        </p>
                      </div>
                    </div>

                    {/* Pitch Details */}
                    {record.pitches.length > 0 && (
                      <div>
                        <h4 className="font-bold text-on-surface mb-3">
                          투구 상세 기록
                        </h4>
                        <div className="bg-white rounded-lg p-4 max-h-48 overflow-y-auto">
                          <table className="w-full text-xs">
                            <thead>
                              <tr className="border-b">
                                <th className="text-left py-2 font-bold">번호</th>
                                <th className="text-left py-2 font-bold">결과</th>
                                <th className="text-center py-2 font-bold">
                                  구역
                                </th>
                                <th className="text-center py-2 font-bold">
                                  B-S-O
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {record.pitches.map((pitch, idx) => (
                                <tr key={idx} className="border-b">
                                  <td className="py-2">{pitch.pitch_num}</td>
                                  <td className="py-2 font-semibold">
                                    {pitch.result}
                                  </td>
                                  <td className="text-center py-2">
                                    {pitch.location}
                                  </td>
                                  <td className="text-center py-2">
                                    {pitch.ball_count}-{pitch.strike_count}-
                                    {pitch.out_count}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3 mt-6">
                      <Button variant="ghost" size="sm" fullWidth>
                        상세보기
                        <span className="material-symbols-outlined">
                          arrow_forward
                        </span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        fullWidth
                        loading={isLoading}
                        onClick={() => handleDelete(record.record_id)}
                      >
                        삭제
                        <span className="material-symbols-outlined">delete</span>
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
