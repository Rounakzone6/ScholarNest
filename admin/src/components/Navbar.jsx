import { LogOut } from "lucide-react";

const Navbar = ({ setToken }) => {
  return (
    <div className="sticky top-0 z-40 flex h-[73px] items-center justify-between border-b border-slate-200 bg-white px-6 py-2">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-600 text-lg font-bold text-white shadow-sm">
          S
        </div>
        <div>
          <h1 className="heading text-lg font-extrabold text-slate-900 leading-none">ScholarNest</h1>
          <p className="text-[11px] font-bold uppercase tracking-wider text-primary-600">Admin Portal</p>
        </div>
      </div>
      <button 
        onClick={() => setToken('')} 
        className="flex items-center gap-2 rounded-xl bg-slate-100 px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-200"
      >
        <LogOut className="h-4 w-4" />
        <span className="hidden sm:inline">Sign Out</span>
      </button>
    </div>
  );
};

export default Navbar;
