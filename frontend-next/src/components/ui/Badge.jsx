import React from "react";
import { cn } from "../../lib/utils";

export const Badge = ({ children, variant = "default", className }) => {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold transition-colors",
        {
          "bg-slate-100 text-slate-700": variant === "default",
          "bg-primary-50 text-primary-700": variant === "primary",
          "bg-emerald-50 text-emerald-700": variant === "success",
          "bg-amber-50 text-amber-700": variant === "warning",
          "bg-red-50 text-red-700": variant === "danger",
        },
        className
      )}
    >
      {children}
    </span>
  );
};
