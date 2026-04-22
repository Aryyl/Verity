"use client";

import { UIProvider, useUI } from "@/context/ui-context";
import AuthModal from "@/components/layout/auth-modal";

/**
 * Landing Page Layout
 * Always forces dark mode by adding the `dark` class to the wrapper div.
 * This guarantees the landing page never picks up light-mode styles
 * even when the dashboard ThemeProvider switches the global theme to light.
 */
export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UIProvider>
      <LandingContent>{children}</LandingContent>
    </UIProvider>
  );
}

function LandingContent({ children }: { children: React.ReactNode }) {
  const { isAuthModalOpen, closeAuthModal } = useUI();
  return (
    <div className="dark">
      {children}
      <AuthModal isOpen={isAuthModalOpen} onClose={closeAuthModal} />
    </div>
  );
}
