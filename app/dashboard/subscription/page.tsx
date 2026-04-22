"use client";

import React, { useState } from "react";
import { CheckCircle2, ShieldCheck, Download, CreditCard, ChevronRight, Loader2, X, AlertTriangle, Zap, Lock } from "lucide-react";

type Plan = "Basic Vault" | "Pro Shield" | "Enterprise Custom";
type Billing = "monthly" | "yearly";

const tiers: { name: Plan; monthlyPrice: number | null; yearlyPrice: number | null; features: string[]; isRecommended?: boolean; isEnterprise?: boolean }[] = [
  { name: "Basic Vault", monthlyPrice: 0, yearlyPrice: 0, features: ["1k assets monitored", "pHash scanning", "Manual reports", "Email support"] },
  { name: "Pro Shield", monthlyPrice: 49, yearlyPrice: 37, features: ["Vertex AI matching", "Auto DMCA engine", "Geo-anomaly detection", "Priority 24/7 support", "10k assets monitored"], isRecommended: true },
  { name: "Enterprise Custom", monthlyPrice: null, yearlyPrice: null, features: ["10M+ assets", "Custom API endpoints", "Dedicated security team", "On-premise deployment", "SLA guarantee"], isEnterprise: true },
];

const initialBillingHistory = [
  { id: "INV-2026-04", date: "Apr 24, 2026", amount: "$49.00", status: "PAID" },
  { id: "INV-2026-03", date: "Mar 24, 2026", amount: "$49.00", status: "PAID" },
  { id: "INV-2026-02", date: "Feb 24, 2026", amount: "$49.00", status: "PAID" },
  { id: "INV-2026-01", date: "Jan 24, 2026", amount: "$49.00", status: "PAID" },
];

export default function Subscription() {
  const [billing, setBilling] = useState<Billing>("monthly");
  const [currentPlan, setCurrentPlan] = useState<Plan>("Pro Shield");
  const [upgradeTarget, setUpgradeTarget] = useState<Plan | null>(null);
  const [upgradeLoading, setUpgradeLoading] = useState(false);
  const [cancelModal, setCancelModal] = useState(false);
  const [cancelStep, setCancelStep] = useState<"confirm" | "reason" | "done">("confirm");
  const [cancelReason, setCancelReason] = useState("");
  const [editPayment, setEditPayment] = useState(false);
  const [cardNum, setCardNum] = useState("•••• 4242");
  const [tempCard, setTempCard] = useState("");
  const [exportingId, setExportingId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "warn" } | null>(null);
  const [contactSalesModal, setContactSalesModal] = useState(false);
  const [contactEmail, setContactEmail] = useState("");
  const [contactSent, setContactSent] = useState(false);

  const showToast = (msg: string, type: "success" | "warn" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleUpgrade = (plan: Plan) => {
    if (plan === currentPlan) return;
    setUpgradeTarget(plan);
    setUpgradeLoading(true);
    setTimeout(() => {
      setCurrentPlan(plan);
      setUpgradeTarget(null);
      setUpgradeLoading(false);
      showToast(`Successfully switched to ${plan}!`);
    }, 1800);
  };

  const handleExportInvoice = (id: string) => {
    setExportingId(id);
    setTimeout(() => {
      setExportingId(null);
      showToast("Invoice downloaded as PDF!");
    }, 1500);
  };

  const handleSaveCard = () => {
    if (tempCard.length < 4) return;
    setCardNum(`•••• ${tempCard.slice(-4)}`);
    setEditPayment(false);
    showToast("Payment method updated!");
    setTempCard("");
  };

  const handleCancelDone = () => {
    setCancelStep("done");
    setTimeout(() => {
      setCurrentPlan("Basic Vault");
      setCancelModal(false);
      setCancelStep("confirm");
      setCancelReason("");
      showToast("Subscription cancelled. Downgraded to Basic Vault.", "warn");
    }, 2000);
  };

  const handleContactSales = () => {
    if (!contactEmail.trim()) return;
    setContactSent(true);
    setTimeout(() => {
      setContactSalesModal(false);
      setContactSent(false);
      setContactEmail("");
      showToast("Sales team will reach out within 24 hours!");
    }, 1500);
  };

  const currentTier = tiers.find(t => t.name === currentPlan)!;
  const price = billing === "monthly" ? currentTier.monthlyPrice : currentTier.yearlyPrice;

  return (
    <div className="flex flex-col gap-8 p-2 md:p-6 lg:p-8 animate-in fade-in duration-500 relative">

      {/* Toast */}
      {toast && (
        <div className={`toast-notification fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-2xl border text-sm font-semibold animate-in slide-in-from-bottom-4 duration-300 ${toast.type === "success" ? "bg-emerald-600 border-emerald-500 text-white" : "bg-amber-500 border-amber-400 text-white"}`}>
          {toast.type === "success" ? <CheckCircle2 className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
          <span className="text-slate-900 dark:text-white">{toast.msg}</span>
        </div>
      )}

      {/* Cancel Modal */}
      {cancelModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => { setCancelModal(false); setCancelStep("confirm"); }}>
          <div className="bg-white dark:bg-n-8 rounded-2xl shadow-2xl w-full max-w-md border border-slate-200 dark:border-n-1/10 p-6 animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
            {cancelStep === "confirm" && (
              <>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold text-lg text-slate-900 dark:text-n-1">Cancel Subscription?</h3>
                  <button onClick={() => setCancelModal(false)} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-n-7 text-slate-400"><X className="w-5 h-5" /></button>
                </div>
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/40 rounded-xl p-4 mb-6 flex gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-amber-800 dark:text-amber-200">You will lose access to <span className="font-bold">Vertex AI matching, Auto DMCA engine, and 24/7 support</span> at the end of your billing period.</p>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setCancelStep("reason")} className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-bold transition-colors">Yes, Cancel</button>
                  <button onClick={() => setCancelModal(false)} className="flex-1 py-3 bg-slate-100 dark:bg-n-7 hover:bg-slate-200 dark:hover:bg-n-6 text-slate-700 dark:text-n-1 rounded-lg text-sm font-bold transition-colors">Keep Plan</button>
                </div>
              </>
            )}
            {cancelStep === "reason" && (
              <>
                <h3 className="font-bold text-lg text-slate-900 dark:text-n-1 mb-4">Tell us why you&apos;re leaving</h3>
                <div className="space-y-2 mb-6">
                  {["Too expensive", "Missing features I need", "Switching to a competitor", "No longer needed", "Other"].map(r => (
                    <button key={r} onClick={() => setCancelReason(r)} className={`w-full text-left px-4 py-3 rounded-xl border text-sm font-medium transition-all ${cancelReason === r ? "border-blue-500 bg-blue-50 dark:bg-color-1/10 text-blue-700 dark:text-color-1 font-bold" : "border-slate-200 dark:border-n-6 text-slate-700 dark:text-n-2 hover:border-slate-300 dark:hover:border-n-4"}`}>{r}</button>
                  ))}
                </div>
                <div className="flex gap-3">
                  <button onClick={handleCancelDone} disabled={!cancelReason} className="flex-1 py-3 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded-lg text-sm font-bold transition-colors">Confirm Cancellation</button>
                  <button onClick={() => setCancelStep("confirm")} className="flex-1 py-3 bg-slate-100 dark:bg-n-7 text-slate-700 dark:text-n-1 rounded-lg text-sm font-bold">Back</button>
                </div>
              </>
            )}
            {cancelStep === "done" && (
              <div className="text-center py-6">
                <Loader2 className="w-10 h-10 text-slate-400 animate-spin mx-auto mb-4" />
                <p className="font-bold text-slate-900 dark:text-n-1">Processing cancellation...</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Contact Sales Modal */}
      {contactSalesModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setContactSalesModal(false)}>
          <div className="bg-white dark:bg-n-8 rounded-2xl shadow-2xl w-full max-w-md border border-slate-200 dark:border-n-1/10 p-6 animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg text-slate-900 dark:text-n-1">Contact Enterprise Sales</h3>
              <button onClick={() => setContactSalesModal(false)} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-n-7 text-slate-400"><X className="w-5 h-5" /></button>
            </div>
            <p className="text-sm text-slate-500 dark:text-n-3 mb-6">Our enterprise team will prepare a custom quote tailored to your scale and compliance needs.</p>
            {!contactSent ? (
              <>
                <label className="block text-xs font-bold text-slate-500 dark:text-n-4 uppercase tracking-widest mb-2">Work Email</label>
                <input value={contactEmail} onChange={e => setContactEmail(e.target.value)} type="email" placeholder="you@company.com" className="w-full px-4 py-3 bg-slate-50 dark:bg-n-7 border border-slate-200 dark:border-n-6 rounded-xl text-sm text-slate-900 dark:text-n-1 focus:outline-none focus:ring-2 ring-blue-500 mb-6" />
                <div className="flex gap-3">
                  <button onClick={handleContactSales} disabled={!contactEmail.trim()} className="flex-1 py-3 bg-slate-900 hover:bg-slate-800 dark:bg-n-1 dark:text-n-8 dark:hover:bg-n-3 disabled:opacity-50 text-white rounded-lg text-sm font-bold transition-colors">Request Demo</button>
                  <button onClick={() => setContactSalesModal(false)} className="flex-1 py-3 bg-slate-100 dark:bg-n-7 text-slate-700 dark:text-n-1 rounded-lg text-sm font-bold">Cancel</button>
                </div>
              </>
            ) : (
              <div className="text-center py-4">
                <Loader2 className="w-8 h-8 text-slate-400 animate-spin mx-auto mb-3" />
                <p className="text-sm font-semibold text-slate-600 dark:text-n-3">Sending request...</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-n-1 tracking-wide">Subscription Management</h1>
        <div className="flex bg-slate-100 dark:bg-n-8 border border-slate-200 dark:border-n-1/10 rounded-xl p-1 text-sm font-bold">
          <button onClick={() => setBilling("monthly")} className={`px-6 py-2 rounded-lg transition-all ${billing === "monthly" ? "bg-white dark:bg-n-6 text-slate-900 dark:text-n-1 shadow-sm" : "text-slate-500 dark:text-n-4 hover:text-slate-900 dark:hover:text-n-1"}`}>Monthly</button>
          <button onClick={() => setBilling("yearly")} className={`flex items-center gap-2 px-6 py-2 rounded-lg transition-all ${billing === "yearly" ? "bg-white dark:bg-n-6 text-slate-900 dark:text-n-1 shadow-sm" : "text-slate-500 dark:text-n-4 hover:text-slate-900 dark:hover:text-n-1"}`}>
            Yearly <span className="text-[9px] bg-blue-100 text-blue-700 dark:bg-color-1/20 dark:text-color-1 px-1.5 py-0.5 rounded font-extrabold uppercase tracking-widest">Save 25%</span>
          </button>
        </div>
      </div>

      {/* Active Plan + Payment */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-[#0E0C15] border border-slate-200 dark:border-n-1/10 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-6">
            <div>
              <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 dark:bg-color-1/10 dark:text-color-1 text-[10px] uppercase font-bold tracking-widest rounded-full mb-3 shadow-sm border border-blue-200 dark:border-color-1/20">Active Plan</span>
              <h2 className="text-3xl font-grotesk font-bold text-slate-900 dark:text-n-1 tracking-tight">{currentPlan}</h2>
              <p className="text-xs text-slate-500 dark:text-n-3 mt-1 font-medium">Renews on <span className="font-bold text-slate-800 dark:text-n-1">May 24, 2026</span></p>
            </div>
            <div className="text-right">
              {price === null ? (
                <p className="text-3xl font-grotesk font-bold text-slate-900 dark:text-n-1">Custom</p>
              ) : (
                <p className="text-4xl font-grotesk font-bold text-slate-900 dark:text-n-1 -tracking-wider">
                  ${price}<span className="text-lg text-slate-400 font-sans tracking-normal">/{billing === "monthly" ? "mo" : "yr"}</span>
                </p>
              )}
              <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-widest mt-1">Billed {billing}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <div className="flex justify-between items-end mb-2">
                <span className="text-[10px] font-bold text-slate-500 dark:text-n-4 tracking-widest uppercase">Assets Monitored</span>
                <span className="text-xs font-bold font-grotesk text-slate-800 dark:text-n-1">820 <span className="text-slate-400">/ 1,000</span></span>
              </div>
              <div className="w-full h-1.5 bg-slate-200 dark:bg-n-7 rounded-sm overflow-hidden">
                <div className="h-full bg-blue-700 dark:bg-color-1 rounded-sm transition-all duration-1000" style={{ width: "82%" }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-end mb-2">
                <span className="text-[10px] font-bold text-slate-500 dark:text-n-4 tracking-widest uppercase">Detection Scans</span>
                <span className="text-xs font-bold font-grotesk text-slate-800 dark:text-n-1">4,500 <span className="text-slate-400">/ 5,000</span></span>
              </div>
              <div className="w-full h-1.5 bg-slate-200 dark:bg-n-7 rounded-sm overflow-hidden">
                <div className="h-full bg-amber-500 dark:bg-amber-400 rounded-sm transition-all duration-1000" style={{ width: "90%" }}></div>
              </div>
            </div>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => {
                const nextPlan = currentPlan === "Basic Vault" ? "Pro Shield" : currentPlan === "Pro Shield" ? "Enterprise Custom" : "Pro Shield";
                if (nextPlan === "Enterprise Custom") { setContactSalesModal(true); return; }
                handleUpgrade(nextPlan);
              }}
              disabled={upgradeLoading}
              className="flex items-center gap-2 px-6 py-3 bg-blue-700 hover:bg-blue-800 dark:bg-color-1 dark:hover:opacity-90 disabled:opacity-70 text-white font-bold rounded-lg text-sm transition-colors shadow-sm"
            >
              {upgradeLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
              {upgradeLoading ? "Upgrading..." : currentPlan === "Enterprise Custom" ? "Manage Enterprise" : "Upgrade Plan"}
            </button>
            <button onClick={() => setCancelModal(true)} className="px-6 py-3 bg-white dark:bg-n-8 border border-slate-300 dark:border-n-6 text-slate-700 dark:text-n-1 hover:bg-red-50 hover:border-red-200 hover:text-red-700 dark:hover:bg-red-950/20 dark:hover:border-red-900 dark:hover:text-red-400 font-bold rounded-lg text-sm transition-all">
              Cancel Subscription
            </button>
          </div>
        </div>

        {/* Payment Method */}
        <div className="bg-white dark:bg-[#0E0C15] border border-slate-200 dark:border-n-1/10 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <h3 className="font-bold text-lg text-slate-900 dark:text-n-1 mb-6">Payment Method</h3>
          {!editPayment ? (
            <>
              <div className="p-4 border border-slate-200 dark:border-n-6 rounded-xl flex items-center justify-between bg-slate-50 dark:bg-n-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-8 bg-blue-900 rounded flex items-center justify-center text-white font-bold italic text-sm">VISA</div>
                  <div>
                    <p className="font-bold font-mono text-slate-900 dark:text-n-1 mt-1 tracking-widest">{cardNum}</p>
                    <p className="text-[9px] text-slate-500 tracking-widest font-bold uppercase">Expires 08/26</p>
                  </div>
                </div>
                <button onClick={() => setEditPayment(true)} className="text-sm font-bold text-blue-600 dark:text-color-1 hover:underline">Edit</button>
              </div>
              <div className="mt-8 flex items-start gap-3 text-slate-500 dark:text-n-3">
                <ShieldCheck className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                <p className="text-[11px] leading-relaxed">
                  <span className="font-bold text-slate-700 dark:text-n-2">Secure recurring payments enabled</span><br />
                  Your data is encrypted with enterprise-grade AES-256 protocols. We never store CVV codes.
                </p>
              </div>
            </>
          ) : (
            <div className="flex flex-col gap-4">
              <label className="block text-xs font-bold text-slate-500 dark:text-n-4 uppercase tracking-widest">New Card Number</label>
              <input value={tempCard} onChange={e => setTempCard(e.target.value.replace(/\D/g, "").slice(0, 16))} placeholder="1234 5678 9012 3456" className="w-full px-4 py-3 bg-slate-50 dark:bg-n-7 border border-slate-200 dark:border-n-6 rounded-xl text-sm font-mono text-slate-900 dark:text-n-1 focus:outline-none focus:ring-2 ring-blue-500 tracking-widest" />
              <div className="flex gap-2">
                <button onClick={handleSaveCard} disabled={tempCard.length < 4} className="flex-1 py-2.5 bg-blue-700 hover:bg-blue-800 dark:bg-color-1 text-white rounded-lg text-sm font-bold disabled:opacity-50 transition-colors">Save Card</button>
                <button onClick={() => { setEditPayment(false); setTempCard(""); }} className="flex-1 py-2.5 bg-slate-100 dark:bg-n-7 text-slate-700 dark:text-n-1 rounded-lg text-sm font-bold">Cancel</button>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-n-4">
                <Lock className="w-3.5 h-3.5" /> Encrypted & secure
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Plan Tiers */}
      <div className="flex flex-col items-center text-center mt-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-n-1">Available Intelligence Tiers</h2>
        <p className="text-slate-500 dark:text-n-3 mt-2 text-sm max-w-lg">Scale your protection as your digital footprint grows. Switch plans anytime.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto w-full">
        {tiers.map((tier) => {
          const isCurrent = tier.name === currentPlan;
          const isUpgrading = upgradeLoading && upgradeTarget === tier.name;
          const displayPrice = billing === "monthly" ? tier.monthlyPrice : tier.yearlyPrice;
          return (
            <div key={tier.name} className={`relative p-8 rounded-2xl flex flex-col h-full bg-white dark:bg-[#0E0C15] transition-all ${isCurrent ? "border-2 border-blue-600 dark:border-color-1 shadow-lg shadow-blue-900/5 -mt-2 mb-2 scale-[1.02]" : "border border-slate-200 dark:border-n-1/10 shadow-sm hover:shadow-md"}`}>
              {tier.isRecommended && (
                <div className="plan-badge absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-blue-600 dark:bg-color-1 text-white dark:text-n-8 text-[10px] font-bold tracking-widest uppercase rounded-full">Recommended</div>
              )}
              {isCurrent && (
                <div className="plan-badge absolute -top-3 right-4 px-3 py-1 bg-emerald-600 text-white text-[10px] font-bold tracking-widest uppercase rounded-full">Current</div>
              )}
              <h3 className="font-bold text-lg text-slate-900 dark:text-n-1">{tier.name}</h3>
              <div className="mt-2 mb-6">
                {tier.isEnterprise ? (
                  <p className="text-3xl font-grotesk font-bold text-slate-900 dark:text-n-1 tracking-tight">Custom</p>
                ) : (
                  <p className="text-4xl font-grotesk font-bold text-slate-900 dark:text-n-1 -tracking-wider">
                    ${displayPrice}<span className="text-lg text-slate-400 font-sans tracking-normal">/{billing === "monthly" ? "mo" : "mo*"}</span>
                  </p>
                )}
                {billing === "yearly" && !tier.isEnterprise && <p className="text-xs text-emerald-600 font-bold mt-1">Billed annually — save 25%</p>}
              </div>
              <div className="flex flex-col gap-4 flex-1 mb-8">
                {tier.features.map((ft, i) => (
                  <div key={i} className="flex items-start gap-3">
                    {tier.isEnterprise ? <ChevronRight className="w-4 h-4 text-slate-400 mt-0.5" /> : <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-color-1 mt-0.5" />}
                    <span className="text-sm text-slate-600 dark:text-n-3">{ft}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => {
                  if (tier.isEnterprise) { setContactSalesModal(true); return; }
                  if (!isCurrent) handleUpgrade(tier.name);
                }}
                disabled={isCurrent || (upgradeLoading && upgradeTarget !== tier.name)}
                className={`w-full py-3 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${isCurrent ? "bg-emerald-50 border border-emerald-300 text-emerald-700 dark:bg-emerald-900/20 dark:border-emerald-800/40 dark:text-emerald-400 cursor-default" : tier.isEnterprise ? "bg-slate-900 hover:bg-slate-800 text-white dark:bg-n-1 dark:text-n-8 dark:hover:bg-n-3" : "bg-blue-700 hover:bg-blue-800 dark:bg-color-1 dark:hover:opacity-90 text-white dark:text-n-8"} disabled:cursor-not-allowed`}
              >
                {isUpgrading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {isCurrent ? "✓ Current Plan" : isUpgrading ? "Switching..." : tier.isEnterprise ? "Contact Sales" : tier.name === "Basic Vault" ? "Downgrade" : "Upgrade"}
              </button>
            </div>
          );
        })}
      </div>

      {/* Billing History */}
      <div className="bg-white dark:bg-[#0E0C15] border border-slate-200 dark:border-n-1/10 rounded-2xl p-6 shadow-sm flex flex-col max-w-5xl mx-auto w-full">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-lg text-slate-900 dark:text-n-1">Billing History</h3>
          <button onClick={() => showToast("Full invoice history coming soon!")} className="text-[10px] font-bold text-blue-600 dark:text-color-1 uppercase tracking-widest hover:underline">View All</button>
        </div>
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="text-slate-400 dark:text-n-4 font-bold uppercase tracking-widest text-[10px] border-b border-slate-100 dark:border-n-1/10">
            <tr>
              <th className="pb-4">Invoice Date</th>
              <th className="pb-4">Invoice ID</th>
              <th className="pb-4">Amount</th>
              <th className="pb-4">Status</th>
              <th className="pb-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 dark:divide-n-1/10 text-slate-700 dark:text-n-1">
            {initialBillingHistory.map((bill) => (
              <tr key={bill.id} className="hover:bg-slate-50 dark:hover:bg-n-8/30 transition-colors">
                <td className="py-5 font-medium">{bill.date}</td>
                <td className="py-5 font-mono text-xs text-slate-400 dark:text-n-4">{bill.id}</td>
                <td className="py-5 font-bold">{bill.amount}</td>
                <td className="py-5">
                  <span className="px-2.5 py-1 text-[9px] font-bold tracking-widest uppercase rounded bg-green-100 text-green-700 dark:bg-emerald-900/30 dark:text-emerald-400">{bill.status}</span>
                </td>
                <td className="py-5 text-right">
                  <button
                    onClick={() => handleExportInvoice(bill.id)}
                    disabled={!!exportingId}
                    className="flex justify-end items-center gap-1.5 w-full font-bold text-[11px] uppercase tracking-wider text-blue-600 dark:text-color-1 hover:underline disabled:opacity-60"
                  >
                    {exportingId === bill.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Download className="w-3 h-3" />}
                    {exportingId === bill.id ? "Downloading..." : "PDF Invoice"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
