"use client";

import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  loading?: boolean;
  icon?: string;
  iconPosition?: "left" | "right";
}

export function Button({
  variant = "primary",
  size = "md",
  fullWidth = false,
  loading = false,
  icon,
  iconPosition = "left",
  className = "",
  children,
  disabled,
  ...props
}: ButtonProps) {
  const baseClasses =
    "font-semibold rounded-lg transition-all duration-200 ease-in-out flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary: "bg-primary text-white hover:bg-blue-700 active:scale-95",
    secondary: "bg-secondary text-white hover:bg-amber-700 active:scale-95",
    ghost: "bg-transparent text-primary hover:bg-sky-50 active:scale-95",
    outline:
      "border-2 border-primary text-primary bg-transparent hover:bg-sky-50 active:scale-95",
  };

  const sizes = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-2.5 text-base",
    lg: "px-6 py-3 text-lg",
  };

  const finalClassName = `${baseClasses} ${variants[variant]} ${sizes[size]} ${
    fullWidth ? "w-full" : ""
  } ${className}`;

  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={finalClassName}
    >
      {loading ? (
        <span className="material-symbols-outlined animate-spin">refresh</span>
      ) : (
        <>
          {icon && iconPosition === "left" && (
            <span className="material-symbols-outlined text-lg">{icon}</span>
          )}
          {children}
          {icon && iconPosition === "right" && (
            <span className="material-symbols-outlined text-lg">{icon}</span>
          )}
        </>
      )}
    </button>
  );
}
