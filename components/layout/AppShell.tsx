"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bot,
  ChevronsLeft,
  ChevronsRight,
  Compass,
  FileCheck2,
  GraduationCap,
  Home,
  Layers,
  LayoutDashboard,
  LogIn,
  LogOut,
  Menu,
  Settings,
  ShieldCheck,
  UserPlus,
  X,
} from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { useAuth } from "@/services/auth/auth-context";
import { cn } from "@/lib/utils";

interface NavItem {
  href: string;
  label: string;
  icon: typeof Home;
  matchPrefix?: string;
}

const LEARNING_NAV: NavItem[] = [
  { href: "/", label: "Home", icon: Home },
  { href: "/dashboard", label: "My Learning", icon: LayoutDashboard },
  { href: "/library", label: "Explore Courses", icon: Compass },
  { href: "/subjects", label: "Subjects", icon: Layers },
  { href: "/tutor", label: "AI Tutor", icon: Bot },
];

const ASSESS_NAV: NavItem[] = [
  { href: "/results", label: "Quizzes & Results", icon: FileCheck2 },
];

function isActive(pathname: string, item: NavItem): boolean {
  if (item.href === "/") return pathname === "/";
  return pathname.startsWith(item.href);
}

function SidebarContent({
  pathname,
  collapsed,
  onNavigate,
}: {
  pathname: string;
  collapsed: boolean;
  onNavigate?: () => void;
}) {
  const { user, logout } = useAuth();
  const showAssess = Boolean(user);
  const showTeacher = user?.role === "teacher" || user?.role === "admin";
  const showAdmin = user?.role === "admin";

  const renderItem = (item: NavItem) => (
    <Link
      key={item.href}
      href={item.href}
      onClick={onNavigate}
      className={cn(
        "app-nav-item",
        isActive(pathname, item) && "is-active"
      )}
      aria-current={isActive(pathname, item) ? "page" : undefined}
      title={collapsed ? item.label : undefined}
    >
      <item.icon className="size-5 shrink-0" aria-hidden />
      {!collapsed && <span>{item.label}</span>}
    </Link>
  );

  return (
    <div className="flex h-full flex-col">
      <div className={cn("flex h-16 items-center px-4", collapsed && "justify-center px-2")}>
        <Link href="/" aria-label="EduWorld home" onClick={onNavigate}>
          <Logo mark={!collapsed} className={cn(!collapsed && "hidden")} />
          <span className={cn(collapsed && "hidden")}>
            <Logo />
          </span>
        </Link>
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-4" aria-label="Main">
        <div className="space-y-1">
          {!collapsed && <p className="app-nav-group-label">Learning</p>}
          {LEARNING_NAV.map(renderItem)}
        </div>

        {showAssess && (
          <div className="space-y-1">
            {!collapsed && <p className="app-nav-group-label">Assessment</p>}
            {ASSESS_NAV.map(renderItem)}
          </div>
        )}

        {(showTeacher || showAdmin) && (
          <div className="space-y-1">
            {!collapsed && <p className="app-nav-group-label">Portal</p>}
            {showTeacher && renderItem({ href: "/teacher", label: "Teacher Portal", icon: GraduationCap })}
            {showAdmin && renderItem({ href: "/admin", label: "Administration", icon: ShieldCheck })}
          </div>
        )}
      </nav>

      <div className="border-t border-line p-3">
        {user ? (
          <div className="space-y-1">
            {renderItem({ href: "/settings", label: "Settings", icon: Settings })}
            <button
              type="button"
              onClick={() => void logout()}
              className="app-nav-item w-full"
              title={collapsed ? "Sign out" : undefined}
            >
              <LogOut className="size-5 shrink-0" aria-hidden />
              {!collapsed && <span>Sign out</span>}
            </button>
          </div>
        ) : (
          <div className="space-y-1">
            <Link href="/login" className="app-nav-item" onClick={onNavigate}>
              <LogIn className="size-5 shrink-0" aria-hidden />
              {!collapsed && <span>Log In</span>}
            </Link>
            <Link href="/signup" className="app-nav-item" onClick={onNavigate}>
              <UserPlus className="size-5 shrink-0" aria-hidden />
              {!collapsed && <span>Sign Up</span>}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col">
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-line bg-topbar backdrop-blur">
        <div className="flex h-16 items-center gap-3 px-4 sm:px-6">
          <button
            type="button"
            className="grid size-10 place-items-center rounded-xl border border-line text-navy-800 lg:hidden"
            onClick={() => setDrawerOpen(true)}
            aria-expanded={drawerOpen}
            aria-label="Open menu"
          >
            <Menu className="size-5" />
          </button>

          <button
            type="button"
            className="hidden size-10 place-items-center rounded-xl border border-line text-navy-800 transition-colors hover:bg-surface3 lg:grid"
            onClick={() => setCollapsed((v) => !v)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronsRight className="size-5" /> : <ChevronsLeft className="size-5" />}
          </button>

          <div className="min-w-0 flex-1">
            <Link href="/" className="lg:hidden" aria-label="EduWorld home">
              <Logo />
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            {user && (
              <Link
                href={user.role === "teacher" ? "/teacher" : user.role === "admin" ? "/admin" : "/dashboard"}
                className="flex items-center gap-2.5 rounded-xl border border-line bg-surface1 py-1.5 pl-1.5 pr-3 text-sm font-medium text-navy-800 transition-colors hover:bg-surface3"
              >
                <span className="grid size-7 place-items-center rounded-lg bg-deep text-xs font-bold text-white">
                  {user.name.slice(0, 1).toUpperCase()}
                </span>
                <span className="hidden sm:block">{user.name.split(" ")[0]}</span>
              </Link>
            )}
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Desktop sidebar */}
        <aside
          className={cn(
            "app-sidebar sticky top-16 hidden h-[calc(100vh-4rem)] lg:block",
            collapsed ? "w-20" : "w-64"
          )}
        >
          <SidebarContent pathname={pathname} collapsed={collapsed} />
        </aside>

        {/* Mobile drawer */}
        {drawerOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <button
              type="button"
              aria-label="Close menu"
              className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm"
              onClick={() => setDrawerOpen(false)}
            />
            <div className="app-sidebar absolute inset-y-0 left-0 w-72 max-w-[85vw] shadow-2xl">
              <button
                type="button"
                className="absolute right-3 top-4 grid size-9 place-items-center rounded-lg text-navy-700 hover:bg-surface3"
                onClick={() => setDrawerOpen(false)}
                aria-label="Close menu"
              >
                <X className="size-5" />
              </button>
              <SidebarContent pathname={pathname} collapsed={false} onNavigate={() => setDrawerOpen(false)} />
            </div>
          </div>
        )}

        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
