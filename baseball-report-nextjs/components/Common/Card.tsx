"use client";

import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "elevated" | "outlined" | "filled";
  padding?: "none" | "sm" | "md" | "lg";
  hoverable?: boolean;
}

export function Card({
  variant = "default",
  padding = "md",
  hoverable = false,
  className = "",
  children,
  ...props
}: CardProps) {
  const variants = {
    default: "bg-surface-container-lowest rounded-xl ghost-shadow",
    elevated: "bg-white rounded-xl shadow-lg dark:shadow-slate-800/50",
    outlined: "bg-transparent border-2 border-slate-200 dark:border-slate-700 rounded-xl",
    filled: "bg-primary text-white rounded-xl shadow-lg",
  };

  const paddings = {
    none: "p-0",
    sm: "p-3",
    md: "p-6",
    lg: "p-8",
  };

  const finalClassName = `${variants[variant]} ${paddings[padding]} ${
    hoverable ? "transition-transform hover:scale-[1.02] cursor-pointer" : ""
  } ${className}`;

  return (
    <div {...props} className={finalClassName}>
      {children}
    </div>
  );
}
