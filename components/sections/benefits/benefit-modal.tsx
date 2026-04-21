"use client";

import Image from "next/image";
import { useEffect } from "react";

interface BenefitModalProps {
  benefit: {
    id: string;
    title: string;
    text: string;
    details: string;
    iconUrl: string;
  } | null;
  onClose: () => void;
}

const BenefitModal = ({ benefit, onClose }: BenefitModalProps) => {
  useEffect(() => {
    if (benefit) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [benefit]);

  if (!benefit) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-n-8/40 backdrop-blur-sm animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-2xl overflow-hidden rounded-[2.5rem] bg-n-8 border border-n-1/10 p-1 md:p-1.5 animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative overflow-hidden rounded-[2.4375rem] bg-n-8 p-8 md:p-12">
          {/* Close Button */}
          <button 
            className="absolute top-6 right-6 flex items-center justify-center size-10 rounded-full border border-n-1/10 text-n-1 hover:bg-n-7 transition-colors z-10"
            onClick={onClose}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>

          <div className="relative z-1">
            <div className="mb-8 flex items-center gap-4">
              <div className="flex items-center justify-center size-16 rounded-2xl bg-n-7 border border-n-1/10">
                <Image
                  src={benefit.iconUrl}
                  alt={benefit.title}
                  width={32}
                  height={32}
                />
              </div>
              <h3 className="h3">{benefit.title}</h3>
            </div>

            <p className="body-1 mb-6 text-n-3 font-semibold italic">
              {benefit.text}
            </p>

            <div className="h-px w-full bg-n-1/10 mb-8" />

            <div className="body-2 text-n-1/70 leading-relaxed space-y-4">
              {benefit.details.split('\n').map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>

            <div className="mt-12 flex justify-end">
              <button 
                className="button px-8 py-3 rounded-xl bg-n-1 text-n-8 font-bold hover:bg-n-2 transition-colors"
                onClick={onClose}
              >
                Close
              </button>
            </div>
          </div>

          {/* Background Decorative Elements */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-color-1/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-color-2/10 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none" />
        </div>
      </div>
    </div>
  );
};

export default BenefitModal;
