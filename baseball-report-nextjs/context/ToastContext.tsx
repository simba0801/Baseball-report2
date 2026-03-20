"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { Toast } from "@/types";

interface ToastContextType {
  toasts: Toast[];
  addToast: (message: string, type: "success" | "error" | "info" | "warning") => string;
  removeToast: (id: string) => void;
  clearAll: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback(
    (message: string, type: "success" | "error" | "info" | "warning" = "info") => {
      const id = `toast_${Date.now()}`;
      const toast: Toast = {
        id,
        message,
        type,
        createdAt: new Date(),
      };

      setToasts((prev) => [...prev, toast]);

      // Auto-remove after 3 seconds (Streamlit의 st.success, st.error 동작)
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 3000);

      return id;
    },
    []
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setToasts([]);
  }, []);

  const value: ToastContextType = {
    toasts,
    addToast,
    removeToast,
    clearAll,
  };

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
}
