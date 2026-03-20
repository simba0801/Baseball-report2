"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, Button, Input } from "@/components";
import { useAuth } from "@/hooks";

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading, error, clearError } = useAuth();
  const [formData, setFormData] = useState({
    userId: "",
    password: "",
  });
  const [formError, setFormError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormError(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setFormError(null);
      if (!formData.userId || !formData.password) {
        setFormError("ID와 비밀번호를 입력해주세요");
        return;
      }

      await login(formData.userId, formData.password);
      router.push("/");
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "로그인 실패");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-[2rem] font-extrabold text-[#005e93] mb-2">
            Baseball Report
          </h1>
          <p className="text-on-surface-variant">로그인해서 시작하세요</p>
        </div>

        <Card className="p-8 mb-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="ID"
              name="userId"
              type="text"
              value={formData.userId}
              onChange={handleChange}
              placeholder="ID를 입력해주세요"
              icon="person"
              fullWidth
              disabled={isLoading}
            />

            <Input
              label="비밀번호"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="비밀번호를 입력해주세요"
              icon="lock"
              fullWidth
              disabled={isLoading}
            />

            {(formError || error) && (
              <div className="bg-error-container text-error p-3 rounded-lg text-sm font-semibold">
                {formError || error}
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={isLoading}
            >
              로그인
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-200 text-center">
            <p className="text-sm text-on-surface-variant">
              계정이 없으신가요?{" "}
              <Link href="/auth/signup" className="text-primary font-bold hover:underline">
                회원가입
              </Link>
            </p>
          </div>
        </Card>

        {/* Demo Credentials */}
        <Card className="p-4 bg-sky-50 border-2 border-sky-200">
          <p className="text-xs font-semibold text-on-surface-variant mb-2">
            테스트 계정:
          </p>
          <div className="text-sm text-on-surface">
            <p>ID: admin</p>
            <p>Password: 1111</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
