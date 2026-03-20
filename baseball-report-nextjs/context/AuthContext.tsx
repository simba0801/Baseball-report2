"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { User, AuthState } from "@/types";

interface AuthContextType extends AuthState {
  login: (user_id: string, password: string) => Promise<void>;
  signup: (email: string, user_id: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isLoading: false,
    error: null,
  });

  const login = useCallback(async (user_id: string, password: string) => {
    setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      // Streamlit의 users.json 로직을 시뮬레이션
      const users: Record<string, { email: string; password: string; created_date: string }> = {
        admin: {
          email: "admin@example.com",
          password: "1111",
          created_date: new Date().toISOString(),
        },
      };

      if (!users[user_id]) {
        throw new Error("존재하지 않는 ID입니다");
      }

      if (users[user_id].password !== password) {
        throw new Error("비밀번호가 일치하지 않습니다");
      }

      const user: User = {
        user_id,
        email: users[user_id].email,
        created_date: users[user_id].created_date,
      };

      const token = `token_${user_id}_${Date.now()}`;

      setAuthState({
        user,
        token,
        isLoading: false,
        error: null,
      });

      localStorage.setItem("auth_token", token);
      localStorage.setItem("user_id", user_id);
    } catch (error) {
      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : "로그인 실패",
      }));
      throw error;
    }
  }, []);

  const signup = useCallback(
    async (email: string, user_id: string, password: string) => {
      setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));
      try {
        // Streamlit의 회원가입 검증 로직
        if (!email || !user_id || !password) {
          throw new Error("필드를 모두 입력해주세요");
        }

        if (user_id.length < 3 || user_id.length > 20) {
          throw new Error("ID는 3-20자 사이여야 합니다");
        }

        const user: User = {
          user_id,
          email,
          created_date: new Date().toISOString(),
        };

        const token = `token_${user_id}_${Date.now()}`;

        setAuthState({
          user,
          token,
          isLoading: false,
          error: null,
        });

        localStorage.setItem("auth_token", token);
        localStorage.setItem("user_id", user_id);
      } catch (error) {
        setAuthState((prev) => ({
          ...prev,
          isLoading: false,
          error: error instanceof Error ? error.message : "회원가입 실패",
        }));
        throw error;
      }
    },
    []
  );

  const logout = useCallback(() => {
    setAuthState({
      user: null,
      token: null,
      isLoading: false,
      error: null,
    });
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user_id");
  }, []);

  const clearError = useCallback(() => {
    setAuthState((prev) => ({ ...prev, error: null }));
  }, []);

  const value: AuthContextType = {
    ...authState,
    login,
    signup,
    logout,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
