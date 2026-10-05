"use client";

import { useContext, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Home, PlusCircle, User, Menu, X, LogOut, Package, ShieldCheck } from "lucide-react";
import { ShopContext } from "@/context/ShopContext";
import { Avatar } from "./ui/Avatar";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const { token, user, logout, navigate } = useContext(ShopContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  const links = [
    { href: "/browse", text: "Browse" },
    { href: "/about", text: "How it works" },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 -mx-4 border-b border-slate-200/80 bg-white/95 px-4 backdrop-blur-xl sm:-mx-[5vw] sm:px-[5vw] md:-mx-[7vw] md:px-[7vw] lg:-mx-[9vw] lg:px-[9vw]">
        <div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between gap-6">
          <Link href="/" className="flex shrink-0 items-center gap-2.5 transition-opacity hover:opacity-80" aria-label="ScholarNest home">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary-600 bg-gradient-to-br from-primary-500 to-primary-700 text-lg font-bold text-white shadow-sm">
              S
            </span>
            <span className="heading hidden text-[20px] font-extrabold tracking-tight text-slate-900 sm:block">
              ScholarNest
            </span>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {links.map(link => {
              const isActive = pathname === link.href;
              return (
                <Link 
                  key={link.href} 
                  href={link.href} 
                  className={cn(
                    "text-sm font-semibold transition-colors", 
                    isActive ? "text-primary-700" : "text-slate-600 hover:text-slate-950"
                  )}
                >
                  {link.text}
                </Link>
              )
            })}
          </nav>

          <div className="flex flex-1 items-center justify-end gap-2 sm:gap-3 md:flex-none">
            <button 
              className="grid h-10 w-10 place-items-center rounded-full text-slate-600 transition-colors hover:bg-slate-100" 
              aria-label="Search listings" 
              onClick={() => navigate("/browse")}
            >
              <Search className="h-5 w-5" />
            </button>
            
            <Link 
              href="/sell" 
              className="hidden items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-slate-800 hover:shadow-md sm:flex"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Sell item</span>
            </Link>

            {token ? (
              <div className="group relative hidden sm:block">
                <button className="flex items-center gap-2 rounded-full p-1 transition-colors hover:bg-slate-100" aria-label="Account menu">
                  <Avatar src={user?.avatar} fallback={user?.name?.[0] || "S"} size="sm" />
                </button>
                <div className="absolute right-0 top-[110%] hidden w-56 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl group-hover:block">
                  <div className="border-b border-slate-100 px-3 pb-3 pt-2">
                    <p className="truncate text-sm font-bold text-slate-900">{user?.name || "Student"}</p>
                    <p className="truncate text-xs text-slate-500">{user?.email || "Loading..."}</p>
                  </div>
                  <div className="py-1">
                    <Link className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-primary-600" href="/profile">
                      <User className="h-4 w-4" /> My Profile
                    </Link>
                    <Link className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-primary-600" href="/orders">
                      <Package className="h-4 w-4" /> Exchanges & Orders
                    </Link>
                    <Link className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-primary-600" href="/account/verify">
                      <ShieldCheck className="h-4 w-4" /> Trust & Verification
                    </Link>
                  </div>
                  <div className="border-t border-slate-100 pt-1">
                    <button onClick={logout} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium text-red-600 hover:bg-red-50">
                      <LogOut className="h-4 w-4" /> Sign out
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link href="/login" className="hidden rounded-xl px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-100 sm:block">
                Sign in
              </Link>
            )}

            <button 
              onClick={() => setMenuOpen(!menuOpen)} 
              className="grid h-10 w-10 place-items-center rounded-xl text-slate-700 md:hidden" 
              aria-label="Toggle menu"
            >
              {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile slide-down menu */}
        {menuOpen && (
          <div className="animate-fade-in border-t border-slate-100 bg-white py-4 md:hidden">
            <div className="space-y-1">
              {links.map(link => (
                <Link 
                  key={link.href} 
                  onClick={() => setMenuOpen(false)} 
                  className={cn("block rounded-xl px-4 py-3 font-semibold", pathname === link.href ? "bg-primary-50 text-primary-700" : "text-slate-700 hover:bg-slate-50")}
                  href={link.href}
                >
                  {link.text}
                </Link>
              ))}
              <Link onClick={() => setMenuOpen(false)} className="block rounded-xl px-4 py-3 font-semibold text-slate-700 hover:bg-slate-50" href={token ? "/profile" : "/login"}>
                {token ? "My Profile" : "Sign in to account"}
              </Link>
              {token && (
                <button onClick={() => { logout(); setMenuOpen(false); }} className="w-full rounded-xl px-4 py-3 text-left font-semibold text-red-600 hover:bg-red-50">
                  Sign out
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Mobile Bottom Navigation (Safe area padded) */}
      <nav className="mobile-safe-bottom fixed inset-x-0 bottom-0 z-40 grid grid-cols-4 border-t border-slate-200 bg-white/95 pb-1 pt-2 backdrop-blur-xl sm:hidden">
        {[
          { icon: Home, label: "Home", href: "/" },
          { icon: Search, label: "Browse", href: "/browse" },
          { icon: PlusCircle, label: "Sell", href: "/sell" },
          { icon: User, label: token ? "Profile" : "Sign in", href: token ? "/profile" : "/login" }
        ].map(({ icon: Icon, label, href }) => {
          const isActive = pathname === href || (href !== "/" && pathname.startsWith(href));
          return (
            <Link key={label} href={href} className="flex flex-col items-center gap-1">
              <Icon className={cn("h-6 w-6 transition-colors", isActive ? "text-primary-600" : "text-slate-500")} strokeWidth={isActive ? 2.5 : 2} />
              <span className={cn("text-[10px] font-semibold transition-colors", isActive ? "text-primary-600" : "text-slate-500")}>
                {label}
              </span>
            </Link>
          );
        })}
      </nav>
    </>
  );
};

export default Navbar;
