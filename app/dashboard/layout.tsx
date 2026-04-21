"use client";

import React, { useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";
import { ProfileProvider } from "@/context/profile-context";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <ProfileProvider>
      {/* dashboard-shell carries the grid + gradient as a single CSS background */}
      <div className="dashboard-shell flex h-screen overflow-hidden text-slate-900 dark:text-n-1 transition-colors duration-300">
        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div
          className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } lg:static lg:translate-x-0`}
        >
          <Sidebar onClose={() => setSidebarOpen(false)} />
        </div>

        {/* Main */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <Header onMenuClick={() => setSidebarOpen(true)} />
          {/* transparent — grid shows through from shell background */}
          <main className="flex-1 overflow-y-auto relative bg-transparent">
            {/* Fixed corner glows — fixed so they never scroll or cause seams */}
            <div
              className="dashboard-glow-tr pointer-events-none fixed top-0 right-0 w-[40rem] h-[40rem] z-0"
              aria-hidden="true"
            />
            <div
              className="dashboard-glow-bl pointer-events-none fixed bottom-0 left-64 w-[40rem] h-[40rem] z-0"
              aria-hidden="true"
            />
            <div className="relative z-10 p-4 md:p-6 lg:p-8 mx-auto max-w-[1600px]">
              {children}
            </div>
          </main>
        </div>
      </div>
    </ProfileProvider>
  );
}
