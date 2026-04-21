"use client";

import React, { useState } from "react";
import { UserCircle, Mail, Phone, Building2, MapPin, Shield, Camera, CheckCircle2, Loader2, Edit3, Activity, Key, Clock } from "lucide-react";
import { useProfile } from "@/context/profile-context";

const activityLog = [
  { id: 1, action: "Reviewed Violation", detail: "Trailer_v14_Final.mp4 — Critical Match", time: "2h ago", icon: "shield" },
  { id: 2, action: "Uploaded Asset", detail: "Brand_Campaign_Q2_Hero.jpg", time: "Yesterday", icon: "camera" },
  { id: 3, action: "API Key Regenerated", detail: "Production environment key rotated", time: "Apr 20, 2026", icon: "key" },
  { id: 4, action: "Settings Updated", detail: "Visual threshold changed to 88%", time: "Apr 20, 2026", icon: "activity" },
];

export default function ProfilePage() {
  const { profile, updateProfile } = useProfile();

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [phone, setPhone] = useState("+1 (415) 920-3847");
  const [company, setCompany] = useState("MediaRights Intelligence");
  const [location, setLocation] = useState("San Francisco, CA");
  const [bio, setBio] = useState("Senior forensic analyst specializing in deepfake detection and digital asset protection across streaming and broadcast pipelines.");
  const [saveState, setSaveState] = useState<"idle" | "loading" | "done">("idle");
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleSave = () => {
    setSaveState("loading");
    setTimeout(() => {
      // Sync to global context → header button updates instantly
      updateProfile({ name, email });
      setSaveState("done");
      setEditing(false);
      showToast("Profile updated successfully!");
      setTimeout(() => setSaveState("idle"), 3000);
    }, 1000);
  };

  const cancelEdit = () => {
    // Reset local state to context values
    setName(profile.name);
    setEmail(profile.email);
    setEditing(false);
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-2xl border bg-emerald-600 border-emerald-500 text-white text-sm font-semibold animate-in slide-in-from-bottom-4 duration-300">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" /> {toast}
        </div>
      )}

      {/* Profile Hero */}
      <div className="relative bg-white dark:bg-[#0E0C15]/80 border border-slate-200 dark:border-n-1/10 rounded-2xl overflow-hidden shadow-sm backdrop-blur-sm">
        {/* Banner */}
        <div className="h-28 w-full relative overflow-hidden" style={{ background: "linear-gradient(135deg,#0E0C15 0%,#1a1040 40%,#0e1f40 100%)" }}>
          <div className="absolute inset-0 opacity-30 bg-[radial-gradient(ellipse_at_30%_50%,#89F9E8,transparent_60%),radial-gradient(ellipse_at_70%_50%,#D87CEE,transparent_60%)]" />
          <div className="absolute inset-0 opacity-20 bg-[linear-gradient(90deg,#FACB7B22,transparent)]" />
          {/* Grid lines on banner */}
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
        </div>

        {/* Avatar + Info */}
        <div className="px-6 pb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 -mt-10 mb-4">
            <div className="relative flex-shrink-0">
              <div className="p-1 rounded-full" style={{ background: "linear-gradient(90deg,#89F9E8,#D87CEE,#FACB7B)" }}>
                <div className="w-20 h-20 rounded-full bg-slate-800 dark:bg-[#1a1828] flex items-center justify-center border-4 border-white dark:border-[#0E0C15]">
                  <UserCircle className="w-16 h-16 text-slate-300 dark:text-n-4" />
                </div>
              </div>
              <button
                onClick={() => showToast("Photo upload coming soon!")}
                className="absolute bottom-0 right-0 w-7 h-7 rounded-full flex items-center justify-center shadow-lg border-2 border-white dark:border-[#0E0C15] transition-transform hover:scale-110"
                style={{ background: "linear-gradient(90deg,#89F9E8,#D87CEE)" }}
              >
                <Camera className="w-3.5 h-3.5 text-slate-900" />
              </button>
            </div>
            <div className="flex-1 min-w-0 pb-1">
              <h1 className="text-xl font-bold text-slate-900 dark:text-n-1 truncate">{name}</h1>
              <p className="text-sm text-slate-500 dark:text-n-3 font-medium truncate">Senior Analyst · {company}</p>
            </div>
            <button
              onClick={() => editing ? cancelEdit() : setEditing(true)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold border transition-all flex-shrink-0 active:scale-95 ${editing ? "bg-slate-100 dark:bg-n-7 text-slate-700 dark:text-n-1 border-slate-200 dark:border-n-6" : "border-transparent"}`}
              style={editing ? {} : { background: "linear-gradient(90deg,#89F9E8,#D87CEE,#FACB7B)" }}
            >
              <Edit3 className="w-4 h-4" style={editing ? {} : { color: "#1a1828" }} />
              <span style={editing ? {} : { color: "#1a1828" }}>{editing ? "Cancel" : "Edit Profile"}</span>
            </button>
          </div>

          {editing ? (
            <textarea value={bio} onChange={e => setBio(e.target.value)} rows={3} className="w-full px-4 py-3 bg-slate-50 dark:bg-n-8 border border-slate-200 dark:border-n-1/10 rounded-xl text-sm text-slate-700 dark:text-n-2 focus:outline-none focus:ring-2 ring-blue-500 resize-none transition-all" />
          ) : (
            <p className="text-sm text-slate-500 dark:text-n-4 leading-relaxed max-w-2xl">{bio}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contact Details */}
        <div className="lg:col-span-2 bg-white dark:bg-[#0E0C15]/80 border border-slate-200 dark:border-n-1/10 rounded-2xl p-6 shadow-sm backdrop-blur-sm">
          <h2 className="text-base font-bold text-slate-900 dark:text-n-1 mb-6">Contact Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {([
              ["Full Name", name, setName, "text", <UserCircle key="u" className="w-4 h-4" />],
              ["Email Address", email, setEmail, "email", <Mail key="m" className="w-4 h-4" />],
              ["Phone Number", phone, setPhone, "tel", <Phone key="p" className="w-4 h-4" />],
              ["Company", company, setCompany, "text", <Building2 key="b" className="w-4 h-4" />],
              ["Location", location, setLocation, "text", <MapPin key="mp" className="w-4 h-4" />],
            ] as const).map(([label, val, setter, type, icon]) => (
              <div key={label}>
                <label className="block text-[10px] uppercase font-bold tracking-widest text-slate-500 dark:text-n-4 mb-2">{label}</label>
                {editing ? (
                  <input
                    type={type}
                    value={val as string}
                    onChange={e => (setter as any)(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-n-8 border border-slate-200 dark:border-n-1/10 rounded-lg text-sm text-slate-900 dark:text-n-1 focus:outline-none focus:ring-2 ring-blue-500 transition-all"
                  />
                ) : (
                  <div className="flex items-center gap-2.5 px-3 py-2.5 bg-slate-50 dark:bg-n-8/50 rounded-lg border border-slate-100 dark:border-n-1/10">
                    <span className="text-slate-400 dark:text-n-4 flex-shrink-0">{icon as React.ReactNode}</span>
                    <span className="text-sm text-slate-700 dark:text-n-2 font-medium truncate">{val as string}</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {editing && (
            <div className="flex gap-3 mt-6 pt-6 border-t border-slate-100 dark:border-n-1/10">
              <button
                onClick={handleSave}
                disabled={saveState !== "idle"}
                className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-slate-900 rounded-lg shadow-sm transition-all disabled:opacity-60 active:scale-95"
                style={{ background: "linear-gradient(90deg,#89F9E8,#D87CEE,#FACB7B)" }}
              >
                {saveState === "loading" && <Loader2 className="w-4 h-4 animate-spin" />}
                {saveState === "done" && <CheckCircle2 className="w-4 h-4" />}
                {saveState === "idle" ? "Save Changes" : saveState === "loading" ? "Saving..." : "Saved!"}
              </button>
              <button onClick={cancelEdit} className="px-6 py-2.5 text-sm font-bold text-slate-600 dark:text-n-3 hover:text-slate-900 dark:hover:text-n-1 transition-colors">Cancel</button>
            </div>
          )}
        </div>

        {/* Sidebar stats */}
        <div className="flex flex-col gap-4">
          {/* Role Badge */}
          <div className="bg-white dark:bg-[#0E0C15]/80 border border-slate-200 dark:border-n-1/10 rounded-2xl p-5 shadow-sm backdrop-blur-sm">
            <p className="text-[10px] uppercase font-bold tracking-widest text-slate-500 dark:text-n-4 mb-3">Access Level</p>
            <div className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 dark:border-n-1/10 bg-slate-50 dark:bg-n-8/50">
              <div className="p-0.5 rounded-full flex-shrink-0" style={{ background: "linear-gradient(90deg,#89F9E8,#D87CEE,#FACB7B)" }}>
                <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center"><Shield className="w-4 h-4 text-emerald-400" /></div>
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-n-1">Senior Analyst</p>
                <p className="text-[10px] text-slate-400 dark:text-n-4">Tier 2 Clearance</p>
              </div>
            </div>
            <div className="mt-4 space-y-2.5">
              {[["Assets Access", "Full Read/Write"], ["Detection Feed", "Real-time View"], ["Reports Export", "PDF + CSV"], ["Settings", "Read-only"]].map(([label, val]) => (
                <div key={label} className="flex justify-between items-center">
                  <span className="text-xs text-slate-500 dark:text-n-4">{label}</span>
                  <span className="text-xs font-bold text-slate-700 dark:text-n-2">{val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="bg-white dark:bg-[#0E0C15]/80 border border-slate-200 dark:border-n-1/10 rounded-2xl p-5 shadow-sm backdrop-blur-sm">
            <p className="text-[10px] uppercase font-bold tracking-widest text-slate-500 dark:text-n-4 mb-4">Performance Stats</p>
            <div className="grid grid-cols-2 gap-3">
              {[["342", "Assets"], ["28", "Reports"], ["1.2K", "Detections"], ["99.4%", "Accuracy"]].map(([num, label]) => (
                <div key={label} className="rounded-xl border border-slate-100 dark:border-n-1/10 bg-slate-50 dark:bg-n-8/50 p-3 text-center hover:border-blue-200 dark:hover:border-color-1/20 transition-colors">
                  <p className="text-xl font-bold text-slate-900 dark:text-n-1 tracking-tight">{num}</p>
                  <p className="text-[9px] uppercase font-bold text-slate-400 dark:text-n-4 tracking-widest mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Activity Log */}
      <div className="bg-white dark:bg-[#0E0C15]/80 border border-slate-200 dark:border-n-1/10 rounded-2xl p-6 shadow-sm backdrop-blur-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-base font-bold text-slate-900 dark:text-n-1">Recent Activity</h2>
          <button onClick={() => showToast("Full activity log loaded!")} className="text-[11px] font-bold text-blue-600 dark:text-color-1 hover:underline uppercase tracking-wider">View All</button>
        </div>
        <div className="divide-y divide-slate-100 dark:divide-n-1/10">
          {activityLog.map(log => (
            <div key={log.id} className="flex items-center gap-4 py-4 hover:bg-slate-50/50 dark:hover:bg-n-8/20 transition-colors rounded-lg px-2 -mx-2">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "linear-gradient(135deg,rgba(137,249,232,0.12),rgba(216,124,238,0.12))" }}>
                {log.icon === "shield" && <Shield className="w-4 h-4 text-blue-600 dark:text-color-1" />}
                {log.icon === "camera" && <Camera className="w-4 h-4 text-purple-500" />}
                {log.icon === "key" && <Key className="w-4 h-4 text-amber-500" />}
                {log.icon === "activity" && <Activity className="w-4 h-4 text-emerald-500" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-800 dark:text-n-1">{log.action}</p>
                <p className="text-xs text-slate-500 dark:text-n-4 truncate mt-0.5">{log.detail}</p>
              </div>
              <div className="flex items-center gap-1 text-[10px] text-slate-400 dark:text-n-5 flex-shrink-0">
                <Clock className="w-3 h-3" /> {log.time}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
