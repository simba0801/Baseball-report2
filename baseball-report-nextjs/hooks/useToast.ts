import { useCallback } from "react";

/**
 * useToast
 * Streamlit의 st.success(), st.error(), st.info(), st.warning() 로직을 React Hook으로 변환
 * 알림 메시지 표시 기능을 담당
 */

// Toast 타입
type ToastType = "success" | "error" | "info" | "warning";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
  createdAt: Date;
}

// 글로벌 토스트 등록 함수 저장소
const toastListeners = new Set<(toast: Toast) => void>();

export function useToast() {
  // 토스트 추가
  const addToast = useCallback((message: string, type: ToastType = "info") => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const toast: Toast = {
      id,
      message,
      type,
      createdAt: new Date(),
    };

    // 모든 리스너에 알림
    toastListeners.forEach((listener) => listener(toast));

    return id;
  }, []);

  // 각 유형별 편의 함수 (Streamlit API 모방)
  const success = useCallback((message: string) => {
    return addToast(message, "success");
  }, [addToast]);

  const error = useCallback((message: string) => {
    return addToast(message, "error");
  }, [addToast]);

  const info = useCallback((message: string) => {
    return addToast(message, "info");
  }, [addToast]);

  const warning = useCallback((message: string) => {
    return addToast(message, "warning");
  }, [addToast]);

  return {
    addToast,
    success,
    error,
    info,
    warning,
    toastListeners,
  };
}

// Provider에서 사용할 훅
export function useToastListener(callback: (toast: Toast) => void) {
  return useCallback(() => {
    toastListeners.add(callback);
    return () => {
      toastListeners.delete(callback);
    };
  }, [callback]);
}
