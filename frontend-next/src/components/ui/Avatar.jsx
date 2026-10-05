import React from "react";
import { cn } from "../../lib/utils";

export const Avatar = ({ src, fallback, size = "md", className }) => {
  return (
    <div
      className={cn(
        "relative flex shrink-0 overflow-hidden rounded-full bg-slate-100",
        {
          "h-8 w-8": size === "sm",
          "h-10 w-10": size === "md",
          "h-16 w-16": size === "lg",
          "h-24 w-24": size === "xl",
        },
        className
      )}
    >
      {src ? (
        <img src={src} alt="Avatar" className="aspect-square h-full w-full object-cover" />
      ) : (
        <div className="flex h-full w-full items-center justify-center font-bold text-slate-500 uppercase">
          {fallback || "?"}
        </div>
      )}
    </div>
  );
};
