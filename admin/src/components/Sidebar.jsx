import { NavLink } from "react-router-dom";
import { LayoutDashboard, ShieldCheck, Users } from "lucide-react";
import { cn } from "../lib/utils";

const Sidebar = () => {
  const navItems = [
    { to: "/dashboard", icon: LayoutDashboard, label: "Overview" },
    { to: "/moderation", icon: ShieldCheck, label: "Listing Moderation" },
    { to: "/users", icon: Users, label: "Verification Queue" },
  ];

  return (
    <div className="min-h-[calc(100vh-73px)] w-64 border-r border-slate-200 bg-white">
      <div className="flex flex-col gap-2 p-4">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => cn(
              "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-all",
              isActive 
                ? "bg-primary-50 text-primary-700" 
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            )}
          >
            <item.icon className="h-5 w-5" />
            <p className="hidden md:block">{item.label}</p>
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
