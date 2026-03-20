"use client";

import React, { useState, useEffect } from "react";

interface ToastNotificationProps {
  id: string;
  message: string;
  type: "success" | "error" | "info" | "warning";
  onRemove: (id: string) => void;
  duration?: number;
}

export function ToastNotification({
  id,
  message,
  type,
  onRemove,
  duration = 3000,
}: ToastNotificationProps) {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => onRemove(id), 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [id, duration, onRemove]);

  const typeStyles = {
    success: {
      bg: "bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800",
      text: "text-green-800 dark:text-green-200",
      icon: "check_circle",
      iconColor: "text-green-600 dark:text-green-400",
    },
    error: {
      bg: "bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800",
      text: "text-red-800 dark:text-red-200",
      icon: "error",
      iconColor: "text-red-600 dark:text-red-400",
    },
    info: {
      bg: "bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800",
      text: "text-blue-800 dark:text-blue-200",
      icon: "info",
      iconColor: "text-blue-600 dark:text-blue-400",
    },
    warning: {
      bg: "bg-amber-50 dark:bg-amber-900/30 border-amber-200 dark:border-amber-800",
      text: "text-amber-800 dark:text-amber-200",
      icon: "warning",
      iconColor: "text-amber-600 dark:text-amber-400",
    },
  };

  const style = typeStyles[type];

  return (
    <div
      className={`${style.bg} ${style.text} border rounded-lg p-4 flex items-start gap-3 shadow-lg transition-all duration-300 ${
        isExiting ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"
      }`}
    >
      <span className={`material-symbols-outlined flex-shrink-0 ${style.iconColor}`}>
        {style.icon}
      </span>
      <p className="font-semibold text-sm">{message}</p>
      <button
        onClick={() => {
          setIsExiting(true);
          setTimeout(() => onRemove(id), 300);
        }}
        className="ml-auto flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity"
      >
        <span className="material-symbols-outlined text-lg">close</span>
      </button>
    </div>
  );
}
