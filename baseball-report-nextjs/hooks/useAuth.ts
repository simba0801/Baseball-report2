import { useState, useCallback, useEffect } from "react";
import { User } from "@/types";

/**
 * useAuth
 * Streamlit의 로그인/회원가입 로직을 React Hook으로 변환
 * 사용자 인증 상태 관리를 담당
 */
export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const USERS_STORAGE_KEY = "baseball_users";
  const TOKEN_STORAGE_KEY = "auth_token";
  const USER_ID_STORAGE_KEY = "user_id";

  // 초기 로딩 (로컬 스토리지에서 토큰 복구)
  useEffect(() => {
    const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY);
    const storedUserId = localStorage.getItem(USER_ID_STORAGE_KEY);

    if (storedToken && storedUserId) {
      setToken(storedToken);
      // 사용자 정보 복구
      const users = getAllUsers();
      const foundUser = users.find((u) => u.user_id === storedUserId);
      if (foundUser) {
        setUser(foundUser);
      }
    }
  }, []);

  // 모든 사용자 조회
  const getAllUsers = useCallback((): User[] => {
    try {
      const stored = localStorage.getItem(USERS_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }, []);

  // 사용자 저장
  const saveUser = useCallback((user: User) => {
    try {
      const users = getAllUsers();
      const existingIndex = users.findIndex((u) => u.user_id === user.user_id);

      if (existingIndex >= 0) {
        users[existingIndex] = user;
      } else {
        users.push(user);
      }

      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
      return true;
    } catch {
      return false;
    }
  }, []);

  // 로그인 (Streamlit: screen_login 로직)
  const login = useCallback(
    async (userId: string, password: string) => {
      try {
        setIsLoading(true);
        setError(null);

        // Streamlit의 users.json 검증 로직
        if (!userId || !password) {
          throw new Error("ID와 비밀번호를 입력해주세요");
        }

        // 모든 사용자 조회
        const allUsers = getAllUsers();

        // 사용자 찾기
        const foundUser = allUsers.find((u) => u.user_id === userId);
        if (!foundUser) {
          throw new Error("존재하지 않는 ID입니다");
        }

        // 비밀번호 확인 (실제로는 암호화된 비밀번호 비교 필요)
        // 여기서는 테스트 용도로 사용자 정보에 password 필드가 있다고 가정
        const userWithAuth = allUsers.find(
          (u) => u.user_id === userId // 실제로는 password 비교
        );

        if (!userWithAuth) {
          throw new Error("비밀번호가 일치하지 않습니다");
        }

        // 토큰 생성
        const newToken = `token_${userId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        setUser(foundUser);
        setToken(newToken);
        localStorage.setItem(TOKEN_STORAGE_KEY, newToken);
        localStorage.setItem(USER_ID_STORAGE_KEY, userId);

        setIsLoading(false);
        return true;
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : "로그인 실패";
        setError(errorMsg);
        setIsLoading(false);
        throw new Error(errorMsg);
      }
    },
    []
  );

  // 회원가입 (Streamlit: screen_signup 로직)
  const signup = useCallback(
    async (email: string, userId: string, password: string, confirmPassword: string) => {
      try {
        setIsLoading(true);
        setError(null);

        // Streamlit의 회원가입 검증 로직
        if (!email || !userId || !password || !confirmPassword) {
          throw new Error("모든 필드를 입력해주세요");
        }

        // 이메일 형식 검증
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          throw new Error("유효한 이메일 주소를 입력해주세요");
        }

        // ID 길이 검증
        if (userId.length < 3 || userId.length > 20) {
          throw new Error("ID는 3-20자 사이여야 합니다");
        }

        // 비밀번호 길이 검증
        if (password.length < 6) {
          throw new Error("비밀번호는 최소 6자 이상이어야 합니다");
        }

        // 비밀번호 확인
        if (password !== confirmPassword) {
          throw new Error("비밀번호가 일치하지 않습니다");
        }

        // 중복 ID 확인
        const allUsers = getAllUsers();
        if (allUsers.some((u) => u.user_id === userId)) {
          throw new Error("이미 존재하는 ID입니다");
        }

        // 중복 이메일 확인
        if (allUsers.some((u) => u.email === email)) {
          throw new Error("이미 등록된 이메일입니다");
        }

        // 새 사용자 생성
        const newUser: User = {
          user_id: userId,
          email,
          created_date: new Date().toISOString(),
        };

        // 사용자 저장
        if (!saveUser(newUser)) {
          throw new Error("사용자 생성 실패");
        }

        // 자동 로그인
        const newToken = `token_${userId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        setUser(newUser);
        setToken(newToken);
        localStorage.setItem(TOKEN_STORAGE_KEY, newToken);
        localStorage.setItem(USER_ID_STORAGE_KEY, userId);

        setIsLoading(false);
        return true;
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : "회원가입 실패";
        setError(errorMsg);
        setIsLoading(false);
        throw new Error(errorMsg);
      }
    },
    []
  );

  // 로그아웃
  const logout = useCallback(() => {
    try {
      setUser(null);
      setToken(null);
      setError(null);
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      localStorage.removeItem(USER_ID_STORAGE_KEY);
      return true;
    } catch {
      return false;
    }
  }, []);

  // 오류 제거
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // 인증 상태 확인
  const isAuthenticated = useCallback(() => {
    return !!user && !!token;
  }, [user, token]);

  // 사용자 정보 업데이트
  const updateUser = useCallback(
    (updates: Partial<User>) => {
      if (!user) return false;

      const updatedUser = { ...user, ...updates };
      if (saveUser(updatedUser)) {
        setUser(updatedUser);
        return true;
      }
      return false;
    },
    [user]
  );

  return {
    user,
    token,
    isLoading,
    error,
    login,
    signup,
    logout,
    clearError,
    isAuthenticated: isAuthenticated(),
    updateUser,
    getAllUsers,
  };
}
