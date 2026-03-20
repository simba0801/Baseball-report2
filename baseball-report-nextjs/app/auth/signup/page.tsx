"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, Button, Input } from "@/components";
import { useAuth } from "@/hooks";

export default function SignupPage() {
  const router = useRouter();
  const { signup, isLoading, error } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    userId: "",
    password: "",
    confirmPassword: "",
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

      if (
        !formData.email ||
        !formData.userId ||
        !formData.password ||
        !formData.confirmPassword
      ) {
        setFormError("모든 필드를 입력해주세요");
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        setFormError("비밀번호가 일치하지 않습니다");
        return;
      }

      await signup(
        formData.email,
        formData.userId,
        formData.password,
        formData.confirmPassword
      );
      router.push("/");
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "회원가입 실패");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-[2rem] font-extrabold text-[#005e93] mb-2">
            Baseball Report
          </h1>
          <p className="text-on-surface-variant">새 계정을 만들어주세요</p>
        </div>

        <Card className="p-8 mb-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="이메일"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="email@example.com"
              icon="mail"
              fullWidth
              disabled={isLoading}
            />

            <Input
              label="ID"
              name="userId"
              type="text"
              value={formData.userId}
              onChange={handleChange}
              placeholder="3-20자 사이의 ID"
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
              placeholder="최소 6자 이상"
              icon="lock"
              fullWidth
              disabled={isLoading}
            />

            <Input
              label="비밀번호 확인"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="비밀번호를 다시 입력해주세요"
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
              회원가입
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-200 text-center">
            <p className="text-sm text-on-surface-variant">
              이미 계정이 있으신가요?{" "}
              <Link href="/auth/login" className="text-primary font-bold hover:underline">
                로그인
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
