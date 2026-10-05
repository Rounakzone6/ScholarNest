import React from "react";
import { cn } from "../../lib/utils";

export const EmptyState = ({ icon: Icon, title, description, action, className }) => {
  return (
    <div className={cn("flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center", className)}>
      {Icon && (
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-500">
          <Icon className="h-8 w-8" />
        </div>
      )}
      <h3 className="heading mb-2 text-xl font-extrabold text-slate-900">{title}</h3>
      {description && <p className="mb-6 max-w-sm text-sm text-slate-500">{description}</p>}
      {action}
    </div>
  );
};
