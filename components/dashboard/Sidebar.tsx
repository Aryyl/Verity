"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useProfile } from "@/context/profile-context";
import { 
  LayoutDashboard, 
  FolderOpen, 
  Radio, 
  ShieldAlert, 
  BarChart2, 
  Settings,
  X,
  CreditCard,
  Sun,
  Moon,
  UserCircle,
  LogOut,
} from "lucide-react";
import { yourlogo as brandLogo } from "@/public/assets/index";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "Asset Library", href: "/dashboard/assets", icon: FolderOpen },
  { name: "Detection Feed", href: "/dashboard/feed", icon: Radio },
  { name: "Violations", href: "/dashboard/violations", icon: ShieldAlert },
  { name: "Reports", href: "/dashboard/reports", icon: BarChart2 },
  { name: "Subscription", href: "/dashboard/subscription", icon: CreditCard },
];

export default function Sidebar({ onClose }: { onClose: () => void }) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const { profile } = useProfile();

  return (
    <div className="flex h-full flex-col overflow-y-auto bg-white dark:bg-[#0E0C15] border-r border-slate-200 dark:border-n-1/10 shadow-sm transition-colors duration-300">
      <div className="flex items-center justify-between px-6 py-8">
        <Link href="/" className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
             <Image src={brandLogo} alt="Verity" width={32} height={32} className="rounded-md" />
             <span className="font-bold font-grotesk tracking-wide text-lg text-slate-900 dark:text-n-1">
                Verity
             </span>
          </div>
          <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-slate-500 dark:text-n-3 pl-11">
            Enterprise Monitor
          </span>
        </Link>
        <button onClick={onClose} className="lg:hidden text-slate-500 dark:text-n-3 p-1 hover:bg-slate-100 dark:hover:bg-n-8 rounded-lg transition-colors">
          <X className="h-6 w-6" />
        </button>
      </div>

      <nav className="flex-1 space-y-1 px-4 py-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onClose}
              className={cn(
                "group flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200",
                isActive 
                  ? "bg-blue-50 text-blue-700 dark:bg-color-1/10 dark:text-[#E8D1FF] dark:border-l-2 dark:border-color-1" 
                  : "text-slate-600 hover:bg-slate-100 dark:text-n-3 dark:hover:bg-n-7 dark:hover:text-n-1"
              )}
            >
              <item.icon
                className={cn(
                  "mr-3 flex-shrink-0 h-5 w-5",
                  isActive ? "text-blue-600 dark:text-color-1" : "text-slate-400 group-hover:text-slate-500 dark:text-n-4 dark:group-hover:text-n-3"
                )}
                aria-hidden="true"
              />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Settings link */}
      <div className="px-4 border-t border-slate-200 dark:border-n-1/10 pt-4">
        <Link
          href="/dashboard/settings"
          onClick={onClose}
          className={cn(
            "group flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200",
            pathname.startsWith("/dashboard/settings")
              ? "bg-blue-50 text-blue-700 dark:bg-color-1/10 dark:text-[#E8D1FF] dark:border-l-2 dark:border-color-1" 
              : "text-slate-600 hover:bg-slate-100 dark:text-n-3 dark:hover:bg-n-7 dark:hover:text-n-1"
          )}
        >
          <Settings
            className={cn(
              "mr-3 flex-shrink-0 h-5 w-5",
              pathname.startsWith("/dashboard/settings") ? "text-blue-600 dark:text-color-1" : "text-slate-400 group-hover:text-slate-500 dark:text-n-4"
            )}
            aria-hidden="true"
          />
          Settings
        </Link>
      </div>

      {/* ── Mobile-only: Theme toggle + User info ── (hidden on lg desktop) */}
      <div className="lg:hidden px-4 py-4 border-t border-slate-200 dark:border-n-1/10 space-y-2">
        {/* Theme toggle row */}
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-slate-600 dark:text-n-3 hover:bg-slate-100 dark:hover:bg-n-7 hover:text-slate-900 dark:hover:text-n-1 transition-colors"
        >
          {theme === "dark"
            ? <Sun className="h-5 w-5 text-amber-400 flex-shrink-0" />
            : <Moon className="h-5 w-5 text-indigo-500 flex-shrink-0" />
          }
          {theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
        </button>

        {/* User info */}
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-slate-100 dark:border-n-1/10 bg-slate-50 dark:bg-n-8/50">
          {/* Gradient ring avatar */}
          <div className="p-0.5 rounded-full flex-shrink-0" style={{ background: "linear-gradient(90deg,#89F9E8,#D87CEE,#FACB7B)" }}>
            <div className="w-9 h-9 rounded-full bg-slate-800 dark:bg-[#1a1828] flex items-center justify-center">
              <UserCircle className="w-7 h-7 text-slate-300 dark:text-n-3" />
            </div>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-slate-900 dark:text-n-1 truncate">{profile.name}</p>
            <p className="text-[10px] text-slate-400 dark:text-n-4 uppercase tracking-widest font-bold">{profile.role}</p>
          </div>
        </div>

        {/* Quick nav links */}
        <Link
          href="/dashboard/profile"
          onClick={onClose}
          className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-slate-600 dark:text-n-3 hover:bg-slate-100 dark:hover:bg-n-7 hover:text-slate-900 dark:hover:text-n-1 transition-colors"
        >
          <UserCircle className="h-4 w-4 flex-shrink-0 text-slate-400" />
          View Profile
        </Link>

        <button
          onClick={() => { onClose(); router.push("/"); }}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-bold text-red-600 dark:text-color-3 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
        >
          <LogOut className="h-4 w-4 flex-shrink-0" />
          Sign Out
        </button>
      </div>
    </div>
  );
}
