import React from "react";
import { cn } from "../../lib/utils";
import { AlertCircle } from "lucide-react";
import { Button } from "./Button";

export const ErrorState = ({ title = "Something went wrong", description, onRetry, className }) => {
  return (
    <div className={cn("flex flex-col items-center justify-center rounded-3xl border border-red-100 bg-red-50/50 px-6 py-16 text-center", className)}>
      <AlertCircle className="mb-4 h-12 w-12 text-red-500" />
      <h3 className="heading mb-2 text-xl font-bold text-slate-900">{title}</h3>
      {description && <p className="mb-6 max-w-sm text-sm text-slate-600">{description}</p>}
      {onRetry && (
        <Button variant="secondary" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
};
