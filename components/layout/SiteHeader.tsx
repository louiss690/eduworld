"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, LogOut, Menu, Settings, UserRound, X } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { useAuth } from "@/services/auth/auth-context";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/library", label: "Explore Courses" },
  { href: "/subjects", label: "Subjects" },
  { href: "/tutor", label: "AI Tutor" },
  { href: "/about", label: "About Us" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const { user, loading, logout } = useAuth();

  function closeMenus() {
    setOpen(false);
    setMenuOpen(false);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur">
      <div className="wrap flex h-16 items-center justify-between gap-6">
        <Link href="/" aria-label="EduWorld home" onClick={closeMenus}>
          <Logo />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
          {NAV_LINKS.map((link) => {
            const active = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "nav-link rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200",
                  active ? "text-brand-700" : "text-navy-800 hover:text-navy-950"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          {loading ? (
            <div className="h-9 w-40 animate-pulse rounded-lg bg-paper" />
          ) : user ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setMenuOpen((v) => !v)}
                className="flex items-center gap-2.5 rounded-lg border border-line py-1.5 pl-1.5 pr-3 text-sm font-medium text-navy-800 hover:bg-paper"
                aria-expanded={menuOpen}
                aria-haspopup="menu"
              >
                <span className="grid size-7 place-items-center rounded-md bg-navy-950 text-xs font-bold text-white">
                  {user.name.slice(0, 1).toUpperCase()}
                </span>
                {user.name.split(" ")[0]}
              </button>
              {menuOpen && (
                <div
                  role="menu"
                  className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-line bg-white p-1.5 shadow-lg"
                >
                  <Link
                    href={user.role === "teacher" ? "/teacher" : user.role === "admin" ? "/admin" : "/dashboard"}
                    role="menuitem"
                    onClick={closeMenus}
                    className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-navy-800 hover:bg-paper"
                  >
                    <LayoutDashboard className="size-4 text-muted" /> Dashboard
                  </Link>
                  <Link
                    href="/settings"
                    role="menuitem"
                    onClick={closeMenus}
                    className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-navy-800 hover:bg-paper"
                  >
                    <Settings className="size-4 text-muted" /> Account settings
                  </Link>
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => { closeMenus(); void logout(); }}
                    className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="size-4" /> Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/login" className="btn-ghost">Log In</Link>
              <Link href="/signup" className="btn-primary btn-sm">Sign Up</Link>
            </>
          )}
        </div>

        <button
          type="button"
          className="grid size-10 place-items-center rounded-lg border border-line text-navy-800 lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-line bg-white lg:hidden">
          <nav className="wrap flex flex-col gap-1 py-4" aria-label="Mobile">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMenus}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-navy-800 hover:bg-paper"
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-3 flex flex-col gap-2 border-t border-line pt-4">
              {user ? (
                <>
                  <Link href="/dashboard" onClick={closeMenus} className="btn-secondary w-full">
                    <UserRound className="size-4" /> Dashboard
                  </Link>
                  <Link href="/settings" onClick={closeMenus} className="btn-secondary w-full">
                    <Settings className="size-4" /> Account settings
                  </Link>
                  <button type="button" onClick={() => { closeMenus(); void logout(); }} className="btn-ghost w-full text-red-600">
                    <LogOut className="size-4" /> Sign out
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={closeMenus} className="btn-secondary w-full">Log In</Link>
                  <Link href="/signup" onClick={closeMenus} className="btn-primary w-full">Sign Up</Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
