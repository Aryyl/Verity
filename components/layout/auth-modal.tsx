"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { yourlogo as brandLogo } from "@/public/assets/index";
import Button from "../atoms/button";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal = ({ isOpen, onClose }: AuthModalProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-n-8/60 backdrop-blur-md animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-[calc(1024px-600px)] md:max-w-md bg-gradient-to-br from-[#89F9E8] via-[#D87CEE] to-[#FACB7B] p-[2px] animate-in zoom-in-95 duration-300"
        style={{ clipPath: "url(#modal-cut)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div 
          className="relative bg-n-8 p-8 md:p-10 text-center"
          style={{ clipPath: "url(#modal-cut)" }}
        >
          {/* Close Button */}
          <button 
            className="absolute top-10 right-10 flex items-center justify-center size-8 rounded-full border border-n-1/10 text-n-1 hover:bg-n-7 transition-colors z-20"
            onClick={onClose}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>

          <div className="relative z-10 flex flex-col items-center">
            <Image alt="Verity" height={64} src={brandLogo} width={64} className="mb-4" />
            <h3 className="h3 mb-2">{isLogin ? "Welcome Back" : "Create Account"}</h3>
            <p className="body-2 text-n-3 mb-8">
              {isLogin 
                ? "Enter your credentials to access the Verity dashboard." 
                : "Join the forensic network and secure your digital assets."}
            </p>

            <form className="w-full" onSubmit={(e) => e.preventDefault()}>
              {!isLogin && (
                <div className="mb-4">
                  <input 
                    type="text" 
                    placeholder="Full Name" 
                    className="w-full bg-n-7 border border-n-1/10 rounded-xl px-4 py-3 text-n-1 outline-none focus:border-color-1 transition-colors" 
                  />
                </div>
              )}
              <div className="mb-4">
                <input 
                  type="email" 
                  placeholder="Email Address" 
                  className="w-full bg-n-7 border border-n-1/10 rounded-xl px-4 py-3 text-n-1 outline-none focus:border-color-1 transition-colors" 
                />
              </div>
              <div className="mb-6">
                <input 
                  type="password" 
                  placeholder="Password" 
                  className="w-full bg-n-7 border border-n-1/10 rounded-xl px-4 py-3 text-n-1 outline-none focus:border-color-1 transition-colors" 
                />
              </div>

              <button 
                type="submit"
                className="button w-full px-8 py-3 rounded-xl bg-color-1 text-n-8 font-bold hover:opacity-90 transition-opacity mb-4"
                onClick={(e) => {
                  e.preventDefault();
                  onClose();
                  router.push("/dashboard");
                }}
              >
                {isLogin ? "Sign In" : "Sign Up"}
              </button>
            </form>

            <div className="text-sm text-n-3">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button 
                className="text-color-1 hover:underline font-semibold"
                onClick={() => setIsLogin(!isLogin)}
              >
                {isLogin ? "Create one" : "Sign in here"}
              </button>
            </div>
          </div>

          {/* Background Decorative Elements */}
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-color-1/10 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none z-0" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-color-2/10 blur-[80px] rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none z-0" />
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
