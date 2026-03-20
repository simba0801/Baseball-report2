"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Header, Sidebar, Card, Button, Input } from "@/components";
import { useRecords } from "@/hooks";
import { Player, PlayerEducation } from "@/types";

export default function PlayerRegisterPage() {
  const { savePlayer, isLoading } = useRecords();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [formData, setFormData] = useState<Player>({
    player_id: `player_${Date.now()}`,
    name: "",
    position: "투수",
    height: 0,
    weight: 0,
    birth_date: "",
    phone: "",
    education: {
      elementary: "",
      middle: "",
      high_school: "",
    },
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    field: string
  ) => {
    const { value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [field]: field === "height" || field === "weight" ? parseInt(value) : value,
    }));
  };

  const handleEducationChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    level: keyof PlayerEducation
  ) => {
    const { value } = e.target;
    setFormData((prev) => ({
      ...prev,
      education: {
        ...prev.education,
        [level]: value,
      },
    }));
  };

  const handleSubmit = async () => {
    try {
      setError(null);

      // 필수 필드 검증
      if (!formData.name) {
        setError("선수명을 입력해주세요");
        return;
      }
      if (formData.height <= 0 || formData.weight <= 0) {
        setError("키와 몸무게를 올바르게 입력해주세요");
        return;
      }
      if (!formData.education.elementary) {
        setError("초등학교를 입력해주세요");
        return;
      }
      if (!formData.education.middle) {
        setError("중학교를 입력해주세요");
        return;
      }
      if (!formData.education.high_school) {
        setError("고등학교를 입력해주세요");
        return;
      }

      if (savePlayer(formData)) {
        setSuccess(true);
        setFormData({
          player_id: `player_${Date.now()}`,
          name: "",
          position: "투수",
          height: 0,
          weight: 0,
          birth_date: "",
          phone: "",
          education: {
            elementary: "",
            middle: "",
            high_school: "",
          },
        });
        setStep(1);

        // 성공 메시지 표시
        setTimeout(() => {
          setSuccess(false);
        }, 3000);
      } else {
        setError("선수 등록에 실패했습니다");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "선수 등록 실패");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar />

      <main className="lg:ml-64 pt-20 pb-24 lg:pb-8 px-6 md:px-10 max-w-4xl">
        <section className="mb-10 mt-6">
          <h1 className="text-[1.75rem] font-extrabold text-on-surface tracking-tight mb-2">
            선수 등록
          </h1>
          <p className="text-on-surface-variant">
            새로운 선수 정보를 등록해주세요
          </p>
        </section>

        {success && (
          <Card className="bg-green-50 border-2 border-green-200 p-4 mb-6">
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-green-600">
                check_circle
              </span>
              <div>
                <p className="font-bold text-green-800">등록 완료!</p>
                <p className="text-sm text-green-700 mt-1">
                  선수 정보가 정상적으로 등록되었습니다.
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
                <p className="font-bold text-red-800">오류 발생</p>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </Card>
        )}

        <Card className="p-8">
          {/* Step Indicator */}
          <div className="flex justify-between mb-8">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`flex items-center ${s < 3 ? "flex-1" : ""}`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                    step >= s
                      ? "bg-primary text-white"
                      : "bg-surface-container text-on-surface-variant"
                  }`}
                >
                  {s}
                </div>
                {s < 3 && (
                  <div
                    className={`flex-1 h-1 mx-2 rounded-full ${
                      step > s ? "bg-primary" : "bg-surface-container"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Step 1: Basic Info */}
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-on-surface">기본 정보</h2>

              <Input
                label="선수명"
                value={formData.name}
                onChange={(e) => handleChange(e, "name")}
                placeholder="선수 이름을 입력해주세요"
                icon="person"
                fullWidth
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-on-surface mb-2">
                    포지션
                  </label>
                  <select
                    value={formData.position}
                    onChange={(e) => handleChange(e, "position")}
                    className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-primary transition-colors bg-white"
                  >
                    <option>투수</option>
                    <option>포수</option>
                    <option>1루수</option>
                    <option>2루수</option>
                    <option>3루수</option>
                    <option>유격수</option>
                    <option>좌익수</option>
                    <option>중견수</option>
                    <option>우익수</option>
                  </select>
                </div>

                <Input
                  label="생년월일"
                  type="date"
                  value={formData.birth_date}
                  onChange={(e) => handleChange(e, "birth_date")}
                  fullWidth
                />
              </div>

              <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={() => setStep(2)}
              >
                다음 단계
                <span className="material-symbols-outlined">arrow_forward</span>
              </Button>
            </div>
          )}

          {/* Step 2: Physical Info */}
          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-on-surface">신체 정보</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="키 (cm)"
                  type="number"
                  value={formData.height || ""}
                  onChange={(e) => handleChange(e, "height")}
                  placeholder="예: 180"
                  fullWidth
                />

                <Input
                  label="몸무게 (kg)"
                  type="number"
                  value={formData.weight || ""}
                  onChange={(e) => handleChange(e, "weight")}
                  placeholder="예: 80"
                  fullWidth
                />
              </div>

              <Input
                label="연락처"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange(e, "phone")}
                placeholder="010-0000-0000"
                icon="phone"
                fullWidth
              />

              <div className="flex gap-4">
                <Button
                  variant="ghost"
                  size="lg"
                  fullWidth
                  onClick={() => setStep(1)}
                >
                  <span className="material-symbols-outlined">arrow_back</span>
                  이전
                </Button>
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  onClick={() => setStep(3)}
                >
                  다음 단계
                  <span className="material-symbols-outlined">arrow_forward</span>
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Education */}
          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-on-surface">학력 정보</h2>

              <Input
                label="초등학교"
                value={formData.education.elementary}
                onChange={(e) => handleEducationChange(e, "elementary")}
                placeholder="예: 서울초등학교"
                icon="school"
                fullWidth
              />

              <Input
                label="중학교"
                value={formData.education.middle}
                onChange={(e) => handleEducationChange(e, "middle")}
                placeholder="예: 서울중학교"
                icon="school"
                fullWidth
              />

              <Input
                label="고등학교"
                value={formData.education.high_school}
                onChange={(e) => handleEducationChange(e, "high_school")}
                placeholder="예: 서울고등학교"
                icon="school"
                fullWidth
              />

              <div className="flex gap-4">
                <Button
                  variant="ghost"
                  size="lg"
                  fullWidth
                  onClick={() => setStep(2)}
                >
                  <span className="material-symbols-outlined">arrow_back</span>
                  이전
                </Button>
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  loading={isLoading}
                  onClick={handleSubmit}
                >
                  등록 완료
                  <span className="material-symbols-outlined">check</span>
                </Button>
              </div>
            </div>
          )}
        </Card>
      </main>
    </div>
  );
}
