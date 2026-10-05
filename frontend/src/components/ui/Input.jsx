import React from "react";
import { cn } from "../../lib/utils";

const Input = React.forwardRef(({ className, type, label, error, ...props }, ref) => {
  return (
    <div className="w-full">
      {label && <label className="mb-1.5 block text-sm font-bold text-slate-700">{label}</label>}
      <input
        type={type}
        className={cn(
          "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-900 transition-colors focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-500/10 disabled:bg-slate-50 disabled:text-slate-500",
          error && "border-red-300 focus:border-red-500 focus:ring-red-500/10",
          className
        )}
        ref={ref}
        {...props}
      />
      {error && <p className="mt-1.5 text-xs font-semibold text-red-600">{error}</p>}
    </div>
  );
});
Input.displayName = "Input";

export { Input };
