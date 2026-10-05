import React, { createContext, useContext, useState } from "react";
import { cn } from "../../lib/utils";

const TabsContext = createContext();

export const Tabs = ({ defaultValue, children, className }) => {
  const [activeTab, setActiveTab] = useState(defaultValue);
  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={cn("w-full", className)}>{children}</div>
    </TabsContext.Provider>
  );
};

export const TabsList = ({ children, className }) => {
  return (
    <div className={cn("flex flex-wrap items-center gap-2 border-b border-slate-200", className)}>
      {children}
    </div>
  );
};

export const TabsTrigger = ({ value, children, className }) => {
  const { activeTab, setActiveTab } = useContext(TabsContext);
  const isActive = activeTab === value;
  
  return (
    <button
      type="button"
      onClick={() => setActiveTab(value)}
      className={cn(
        "relative px-4 py-3 text-sm font-bold transition-colors hover:bg-slate-50",
        isActive ? "text-primary-600" : "text-slate-600 hover:text-slate-900",
        className
      )}
    >
      {children}
      {isActive && (
        <div className="absolute inset-x-0 bottom-0 h-0.5 bg-primary-600" />
      )}
    </button>
  );
};

export const TabsContent = ({ value, children, className }) => {
  const { activeTab } = useContext(TabsContext);
  if (activeTab !== value) return null;
  
  return (
    <div className={cn("animate-fade-in pt-4", className)}>
      {children}
    </div>
  );
};
