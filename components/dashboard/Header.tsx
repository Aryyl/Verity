"use client";

import React, { useState, useRef, useEffect } from "react";
import { Search, Filter, Bell, Sun, Moon, Menu, UserCircle, Plus, FileText, Image as ImageIcon, Video, Settings, LogOut } from "lucide-react";
import { useTheme } from "next-themes";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useProfile } from "@/context/profile-context";

// Utility hook for clicking outside modals
function useOnClickOutside(ref: any, handler: any) {
  useEffect(() => {
    const listener = (event: any) => {
      if (!ref.current || ref.current.contains(event.target)) return;
      handler(event);
    };
    document.addEventListener("mousedown", listener);
    return () => document.removeEventListener("mousedown", listener);
  }, [ref, handler]);
}

// ── Profile Dropdown Component ──────────────────────────────────────────────
function ProfileDropdown({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const { profile } = useProfile();

  const navigate = (path: string) => {
    onClose();
    router.push(path);
  };

  const handleSignOut = () => {
    onClose();
    router.push("/");
  };

  return (
    <div className="popup-panel absolute top-16 right-0 w-60 bg-white dark:bg-[#14121c] border border-slate-200 dark:border-n-1/10 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in zoom-in-95 fade-in duration-200">
      {/* Gradient top accent */}
      <div className="h-0.5 w-full" style={{ background: "linear-gradient(90deg,#89F9E8,#D87CEE,#FACB7B)" }} />

      {/* User Info */}
      <div className="px-4 pt-4 pb-3 border-b border-slate-100 dark:border-n-1/10">
        {/* Mini avatar */}
        <div className="flex items-center gap-3 mb-2">
          <div
            className="p-0.5 rounded-full flex-shrink-0"
            style={{ background: "linear-gradient(90deg,#89F9E8,#D87CEE,#FACB7B)" }}
          >
            <div className="flex size-8 items-center justify-center rounded-full bg-slate-800 dark:bg-[#1a1828]">
              <UserCircle className="h-7 w-7 text-slate-300 dark:text-n-3" />
            </div>
          </div>
          <div className="min-w-0">
            <p className="font-bold text-slate-900 dark:text-n-1 text-sm truncate">{profile.name}</p>
            <p className="text-xs text-slate-500 dark:text-n-4 truncate">{profile.email}</p>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="p-2">
        <button
          onClick={() => navigate("/dashboard/profile")}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-700 dark:text-n-2 hover:bg-slate-50 dark:hover:bg-n-8 rounded-lg transition-colors group"
        >
          <UserCircle className="w-4 h-4 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-color-1 transition-colors" />
          View Profile
        </button>
        <button
          onClick={() => navigate("/dashboard/settings")}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-700 dark:text-n-2 hover:bg-slate-50 dark:hover:bg-n-8 rounded-lg transition-colors group"
        >
          <Settings className="w-4 h-4 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-color-1 transition-colors" />
          Account Settings
        </button>
      </div>

      <div className="p-2 border-t border-slate-100 dark:border-n-1/10">
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-red-600 dark:text-color-3 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-colors group"
        >
          <LogOut className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          Sign Out
        </button>
      </div>
    </div>
  );
}

export default function Header({ onMenuClick }: { onMenuClick: () => void }) {
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const { profile } = useProfile();

  // Interaction States
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  // Focus Refs
  const searchRef = useRef(null);
  const filterRef = useRef(null);
  const notifRef = useRef(null);
  const profileRef = useRef(null);

  useOnClickOutside(searchRef, () => setIsSearchFocused(false));
  useOnClickOutside(filterRef, () => setShowFilter(false));
  useOnClickOutside(notifRef, () => setShowNotif(false));
  useOnClickOutside(profileRef, () => setShowProfile(false));

  return (
    <header className="relative flex h-16 md:h-20 flex-shrink-0 items-center justify-between border-b border-slate-200 dark:border-n-1/10 bg-white dark:bg-[#0E0C15] px-3 md:px-8 transition-colors duration-300 z-50">
      
      {/* ── Left: Hamburger + Search ── */}
      <div className="flex flex-1 items-center gap-2 min-w-0">
        {/* Sidebar hamburger (mobile only) */}
        <button onClick={onMenuClick} className="lg:hidden flex-shrink-0 p-2 text-slate-500 hover:text-slate-700 dark:text-n-3 dark:hover:text-n-1 rounded-lg transition-colors">
          <Menu className="h-5 w-5" />
        </button>

        {/* Desktop search — always visible on md+ */}
        <div ref={searchRef} className="relative w-full max-w-xl hidden md:block">
          <div className={cn(
            "flex items-center rounded-lg px-3 py-2.5 transition-all border",
            isSearchFocused ? "bg-white dark:bg-n-8 border-blue-500 shadow-sm ring-2 ring-blue-100 dark:ring-blue-900/30" : "bg-slate-100 dark:bg-n-8/50 border-transparent dark:border-n-1/10"
          )}>
            <Search className="h-4 w-4 text-slate-400 dark:text-n-4 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search assets, IDs, or sources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              className="ml-2 flex-1 bg-transparent text-sm text-slate-900 placeholder:text-slate-400 dark:text-n-1 dark:placeholder:text-n-4 outline-none min-w-0"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="flex-shrink-0 text-slate-400 hover:text-slate-600 dark:text-n-4 dark:hover:text-n-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            )}
          </div>
          {isSearchFocused && (() => {
            const allAssets = [
              { name: "Trailer_v14_Final.mp4", type: "VIDEO", source: "Asset Library", detail: "Uploaded 2h ago", Icon: Video },
              { name: "Brand_Logo_Variant_C.png", type: "IMAGE", source: "Detection Feed", detail: "Critical Match", Icon: ImageIcon },
              { name: "Interview_Podcast_Ep42.mp3", type: "AUDIO", source: "Social Monitor", detail: "Suspicious", Icon: FileText },
              { name: "Campaign_Assets_Q4.zip", type: "ARCHIVE", source: "Internal Storage", detail: "Indexed 1d ago", Icon: FileText },
              { name: "Main_Event_Wrapup.mov", type: "VIDEO", source: "Asset Library", detail: "Authentic", Icon: Video },
              { name: "Brand_Hero_Image.jpg", type: "IMAGE", source: "Public Web Crawler", detail: "Monitored", Icon: ImageIcon },
              { name: "Rights_Agreement_v2.pdf", type: "DOCUMENT", source: "Vault", detail: "Signed", Icon: FileText },
              { name: "Deepfake_Sample_01.mp4", type: "VIDEO", source: "Detection Feed", detail: "Flagged", Icon: Video },
            ];
            const q = searchQuery.trim().toLowerCase();
            const filtered = q ? allAssets.filter(a => a.name.toLowerCase().includes(q) || a.type.toLowerCase().includes(q) || a.source.toLowerCase().includes(q) || a.detail.toLowerCase().includes(q)) : [];
            return (
              <div className="popup-panel absolute top-14 left-0 w-full bg-white dark:bg-[#14121c] border border-slate-200 dark:border-n-1/10 rounded-xl shadow-xl overflow-hidden z-50 animate-in slide-in-from-top-2 duration-200">
                {q === '' ? (
                  <div className="p-4">
                    <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400 dark:text-n-4 mb-2">Recent Searches</p>
                    <ul className="space-y-1">
                      {["Campaign_Assets_Q4", "Hash: 4a8e2b1c9d3f", "Deepfake_Sample_01"].map(s => (
                        <li key={s} onClick={() => setSearchQuery(s)} className="px-2 py-1.5 hover:bg-slate-50 dark:hover:bg-n-8 rounded text-sm text-slate-600 dark:text-n-3 cursor-pointer flex items-center gap-2">
                          <svg className="w-3 h-3 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : filtered.length > 0 ? (
                  <div className="p-1.5">
                    <p className="px-3 py-2 text-[10px] font-bold text-slate-400 dark:text-n-4 uppercase tracking-widest">{filtered.length} result{filtered.length !== 1 ? 's' : ''} for "{q}"</p>
                    {filtered.map((a, idx) => (
                      <button key={idx} className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-slate-50 dark:hover:bg-n-8 rounded-lg transition-colors text-left" onClick={() => { setSearchQuery(a.name); setIsSearchFocused(false); }}>
                        <a.Icon className="w-4 h-4 flex-shrink-0 text-blue-500 dark:text-color-1" />
                        <div className="min-w-0"><p className="text-sm font-bold text-slate-900 dark:text-n-1 truncate">{a.name}</p><p className="text-[10px] text-slate-400 dark:text-n-4">{a.source} · {a.detail}</p></div>
                        <span className="ml-auto text-[9px] font-bold text-slate-400 border border-slate-200 dark:border-n-6 rounded px-1.5 py-0.5 uppercase tracking-wider">{a.type}</span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 text-center">
                    <p className="text-sm text-slate-500 dark:text-n-4">No results for <span className="font-bold text-slate-800 dark:text-n-1">"{q}"</span></p>
                    <p className="text-xs text-slate-400 dark:text-n-5 mt-1">Try a different name, type, or source.</p>
                  </div>
                )}
              </div>
            );
          })()}
        </div>

        {/* Mobile search icon — only on small screens */}
        <button
          onClick={() => setMobileSearchOpen(o => !o)}
          className="md:hidden flex-shrink-0 p-2 rounded-lg text-slate-500 dark:text-n-3 hover:bg-slate-100 dark:hover:bg-n-8 transition-colors"
        >
          <Search className="h-5 w-5" />
        </button>
      </div>

      {/* Mobile search overlay — slides down from top on small screens */}
      {mobileSearchOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white dark:bg-[#0E0C15] border-b border-slate-200 dark:border-n-1/10 px-3 py-2 z-40 shadow-lg animate-in slide-in-from-top-1 duration-200">
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-n-8/50 rounded-lg px-3 py-2.5 border border-transparent focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 dark:focus-within:ring-blue-900/30">
            <Search className="h-4 w-4 text-slate-400 dark:text-n-4 flex-shrink-0" />
            <input
              autoFocus
              type="text"
              placeholder="Search assets, IDs, or sources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent text-sm text-slate-900 dark:text-n-1 placeholder:text-slate-400 dark:placeholder:text-n-4 outline-none"
            />
            <button onClick={() => { setMobileSearchOpen(false); setSearchQuery(''); }} className="text-slate-400 dark:text-n-4">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          {searchQuery.trim() !== '' && (
            <div className="mt-2 bg-white dark:bg-[#14121c] border border-slate-200 dark:border-n-1/10 rounded-xl overflow-hidden shadow-xl">
              {((() => {
                const allAssets = [
                  { name: "Trailer_v14_Final.mp4", type: "VIDEO", source: "Asset Library", detail: "2h ago", Icon: Video },
                  { name: "Brand_Logo_Variant_C.png", type: "IMAGE", source: "Detection Feed", detail: "Critical", Icon: ImageIcon },
                  { name: "Interview_Podcast_Ep42.mp3", type: "AUDIO", source: "Social Monitor", detail: "Suspicious", Icon: FileText },
                  { name: "Campaign_Assets_Q4.zip", type: "ARCHIVE", source: "Internal", detail: "Indexed 1d ago", Icon: FileText },
                  { name: "Main_Event_Wrapup.mov", type: "VIDEO", source: "Asset Library", detail: "Authentic", Icon: Video },
                  { name: "Deepfake_Sample_01.mp4", type: "VIDEO", source: "Detection Feed", detail: "Flagged", Icon: Video },
                ];
                const q = searchQuery.trim().toLowerCase();
                const filtered = allAssets.filter(a => a.name.toLowerCase().includes(q) || a.type.toLowerCase().includes(q) || a.source.toLowerCase().includes(q));
                return filtered.length > 0 ? filtered.map((a, i) => (
                  <button key={i} className="w-full flex items-center gap-3 px-3 py-3 hover:bg-slate-50 dark:hover:bg-n-8 transition-colors text-left border-b border-slate-100 dark:border-n-1/10 last:border-0" onClick={() => { setSearchQuery(a.name); setMobileSearchOpen(false); }}>
                    <a.Icon className="w-4 h-4 flex-shrink-0 text-blue-500 dark:text-color-1" />
                    <div className="min-w-0"><p className="text-sm font-bold text-slate-900 dark:text-n-1 truncate">{a.name}</p><p className="text-[10px] text-slate-400">{a.source}</p></div>
                    <span className="ml-auto text-[9px] font-bold border border-slate-200 dark:border-n-6 rounded px-1 py-0.5 uppercase text-slate-400">{a.type}</span>
                  </button>
                )) : <p className="p-4 text-sm text-center text-slate-400">No results found.</p>;
              })())}
            </div>
          )}
        </div>
      )}

      {/* ── Right: Controls ── */}
      <div className="flex items-center gap-1.5 md:gap-3 ml-2 flex-shrink-0">
        {/* Filter — desktop only */}
        <div className="relative hidden md:block" ref={filterRef}>
          <button onClick={() => setShowFilter(!showFilter)} className={cn("p-2 rounded-lg transition-colors", showFilter ? "bg-slate-100 dark:bg-n-8 text-slate-900 dark:text-n-1" : "text-slate-400 hover:text-slate-600 dark:text-n-3 dark:hover:text-n-1")}>
            <Filter className="h-5 w-5" />
          </button>
            {showFilter && (
              <div className="popup-panel absolute top-12 right-0 w-48 bg-white dark:bg-[#14121c] border border-slate-200 dark:border-n-1/10 rounded-xl shadow-xl overflow-hidden z-50 animate-in zoom-in-95 duration-200">
                 <div className="p-3 border-b border-slate-100 dark:border-n-1/10">
                   <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400 dark:text-n-4">Quick Filters</p>
                 </div>
                 <div className="p-2 space-y-1">
                   <label className="flex items-center gap-2 px-2 py-1.5 hover:bg-slate-50 dark:hover:bg-n-8 rounded cursor-pointer text-sm font-medium text-slate-700 dark:text-n-2">
                     <input type="checkbox" defaultChecked className="rounded border-slate-300 text-blue-600" /> Violations Only
                   </label>
                   <label className="flex items-center gap-2 px-2 py-1.5 hover:bg-slate-50 dark:hover:bg-n-8 rounded cursor-pointer text-sm font-medium text-slate-700 dark:text-n-2">
                     <input type="checkbox" className="rounded border-slate-300 text-blue-600" /> Pending Review
                   </label>
                   <label className="flex items-center gap-2 px-2 py-1.5 hover:bg-slate-50 dark:hover:bg-n-8 rounded cursor-pointer text-sm font-medium text-slate-700 dark:text-n-2">
                     <input type="checkbox" defaultChecked className="rounded border-slate-300 text-blue-600" /> Over 90% Match
                   </label>
                 </div>
              </div>
            )}
        </div>

        {/* Notifications — always visible */}
        <div className="relative" ref={notifRef}>
            <button onClick={() => setShowNotif(!showNotif)} className={cn("p-2 rounded-lg transition-colors relative", showNotif ? "bg-slate-100 dark:bg-n-8 text-slate-900 dark:text-n-1" : "text-slate-400 hover:text-slate-600 dark:text-n-3 dark:hover:text-n-1")}>
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-600 rounded-full border-2 border-white dark:border-[#0E0C15]"></span>
            </button>
            {showNotif && (
              <div className="popup-panel absolute top-12 right-0 w-72 bg-white dark:bg-[#14121c] border border-slate-200 dark:border-n-1/10 rounded-xl shadow-xl overflow-hidden z-50 animate-in zoom-in-95 duration-200">
                 <div className="p-3 border-b border-slate-100 dark:border-n-1/10 flex justify-between items-center">
                   <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400 dark:text-n-4">Alerts</p>
                   <button className="text-[10px] font-bold text-blue-600 dark:text-color-1 hover:underline">Mark all read</button>
                 </div>
                 <div className="divide-y divide-slate-50 dark:divide-n-8/50">
                   <div className="p-3 hover:bg-slate-50 dark:hover:bg-n-8/30 cursor-pointer transition-colors bg-blue-50/30 dark:bg-color-1/5">
                      <p className="text-xs font-bold text-slate-900 dark:text-n-1 mb-0.5 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-600 dark:bg-color-3" /> Critical Violation
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-n-4 leading-relaxed">System flagged "Trailer_v14_Final.mp4" on external domains.</p>
                      <p className="text-[9px] text-slate-400 font-bold mt-2">2m ago</p>
                   </div>
                   <div className="p-3 hover:bg-slate-50 dark:hover:bg-n-8/30 cursor-pointer transition-colors">
                      <p className="text-xs font-bold text-slate-900 dark:text-n-1 mb-0.5">Asset Library Indexed</p>
                      <p className="text-[11px] text-slate-500 dark:text-n-4 leading-relaxed">Successfully encrypted 342 media elements.</p>
                      <p className="text-[9px] text-slate-400 font-bold mt-2">1h ago</p>
                   </div>
                 </div>
                 <button className="w-full p-2 text-xs font-bold text-slate-600 dark:text-n-3 hover:bg-slate-50 dark:hover:bg-n-8 text-center transition-colors border-t border-slate-100 dark:border-n-1/10">View all notifications</button>
              </div>
            )}
          </div>

        {/* Theme toggle — desktop only; on mobile it's in sidebar */}
        <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className="hidden md:flex p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:text-n-3 dark:hover:text-n-1 transition-colors">
          {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>
        {pathname === "/dashboard/assets" && (
          <button className="hidden md:flex items-center gap-2 ml-2 px-4 py-2 bg-blue-700 dark:bg-color-1 text-white dark:text-n-8 rounded-lg text-sm font-semibold hover:bg-blue-800 dark:hover:opacity-90 transition-colors">
            <Plus className="h-4 w-4" /> Upload
          </button>
        )}

        {/* Profile — always visible */}
        <div className="relative" ref={profileRef}>
          {/* Gradient ring wrapper — mirrors the landing page Dashboard button style */}
          <div
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center gap-3 cursor-pointer rounded-full p-0.5"
            style={{
              background: showProfile
                ? "linear-gradient(90deg,#89F9E8,#D87CEE,#FACB7B)"
                : "linear-gradient(90deg,#89F9E8,#D87CEE,#FACB7B)",
            }}
          >
            <div className="flex items-center gap-2 rounded-full bg-white dark:bg-[#0E0C15] px-2.5 py-1.5 transition-colors hover:bg-slate-50 dark:hover:bg-n-8 max-w-[180px]">
              <div className="text-right min-w-0 overflow-hidden">
                <p className="text-sm font-semibold text-slate-900 dark:text-n-1 leading-tight truncate">{profile.name}</p>
                <p className="text-[9px] uppercase tracking-widest text-slate-500 dark:text-n-3 font-bold hidden sm:block truncate">{profile.role}</p>
              </div>
              {/* Avatar */}
              <div className="flex size-9 flex-shrink-0 items-center justify-center rounded-full bg-slate-800 text-white dark:bg-[#1a1828] shadow-sm">
                <UserCircle className="h-8 w-8 text-slate-300 dark:text-n-3" />
              </div>
            </div>
          </div>

          {showProfile && (
            <ProfileDropdown
              onClose={() => setShowProfile(false)}
            />
          )}
        </div>

      </div>
    </header>
  );
}
