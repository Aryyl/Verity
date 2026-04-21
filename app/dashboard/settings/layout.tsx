"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Users, Code, Mail, SlidersHorizontal, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

const secondaryNavigation = [
  { name: "User Management", href: "/dashboard/settings", icon: Users },
  { name: "API Access", href: "/dashboard/settings/api", icon: Code },
  { name: "Notifications", href: "/dashboard/settings/notifications", icon: Mail },
  { name: "System Sensitivity", href: "/dashboard/settings/sensitivity", icon: SlidersHorizontal },
  { name: "Security & Audit", href: "/dashboard/settings/security", icon: ShieldCheck },
];

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  let title = "Settings";
  let subtitle = "Manage system preferences and configurations.";

  if (pathname === '/dashboard/settings') {
     title = "User Management";
     subtitle = "Manage user accounts, roles, permissions, and access controls.";
  } else if (pathname === '/dashboard/settings/api') {
     title = "API Managements";
     subtitle = "Manage API keys, access tokens, endpoints, and integration settings.";
  } else if (pathname.includes('/dashboard/settings/notifications')) {
     title = "Notification Settings";
     subtitle = "Configure how and when your team receives alerts for rights violations.";
  } else if (pathname.includes('/dashboard/settings/sensitivity')) {
     title = "System Sensitivity";
     subtitle = "Adjust the probabilistic thresholds for the AI detection engine. Higher strictness reduces false positives but may increase latency and omission rates.";
  } else if (pathname.includes('/dashboard/settings/security')) {
     title = "Security & Audit Logs";
     subtitle = "Real-time surveillance of administrative actions and system modifications.";
  }

  return (
    <div className="flex flex-col gap-8 p-2 md:p-6 lg:p-8 animate-in fade-in duration-500 max-w-7xl mx-auto w-full">
      {/* Dynamic Header */}
      <div>
        <h1 className="text-[28px] font-bold text-slate-900 dark:text-n-1 tracking-tight">{title}</h1>
        <p className="text-slate-500 dark:text-n-3 mt-2">{subtitle}</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Secondary Sidebar */}
        <div className="w-full md:w-64 flex-shrink-0 flex flex-col gap-1">
          {secondaryNavigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "group flex items-center px-4 py-3 text-sm font-semibold rounded-lg transition-all duration-200",
                  isActive 
                    ? "bg-white text-slate-900 shadow-sm border border-slate-200 border-l-4 border-l-blue-600 dark:bg-[#0E0C15] dark:border-n-1/10 dark:text-n-1 dark:border-l-color-1" 
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-50 dark:text-n-4 dark:hover:text-n-2 dark:hover:bg-n-8/50"
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
        </div>

        {/* Content Area */}
        <div className="flex-1 w-full min-w-0">
          {children}
        </div>
      </div>
    </div>
  );
}
