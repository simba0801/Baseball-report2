"use client";

import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  icon?: string;
  iconPosition?: "left" | "right";
}

export function Input({
  label,
  error,
  helperText,
  fullWidth = false,
  icon,
  iconPosition = "left",
  className = "",
  ...props
}: InputProps) {
  return (
    <div className={fullWidth ? "w-full" : ""}>
      {label && (
        <label className="block text-sm font-semibold text-on-surface mb-2">
          {label}
        </label>
      )}

      <div className="relative">
        {icon && iconPosition === "left" && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 material-symbols-outlined">
            {icon}
          </span>
        )}

        <input
          {...props}
          className={`w-full px-4 py-2.5 border-2 border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:border-primary dark:focus:border-sky-400 transition-colors bg-white dark:bg-slate-800 text-on-surface dark:text-white placeholder-slate-400 dark:placeholder-slate-500 ${
            icon && iconPosition === "left" ? "pl-10" : ""
          } ${icon && iconPosition === "right" ? "pr-10" : ""} ${
            error ? "border-error" : ""
          } ${className}`}
        />

        {icon && iconPosition === "right" && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 material-symbols-outlined">
            {icon}
          </span>
        )}
      </div>

      {error && (
        <p className="text-error text-sm mt-1 font-semibold">{error}</p>
      )}

      {helperText && !error && (
        <p className="text-on-surface-variant text-sm mt-1">{helperText}</p>
      )}
    </div>
  );
}
