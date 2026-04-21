import type React from "react";

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
    // `dark` class is hardcoded — landing page is always dark regardless of
    // the dashboard's theme toggle, which only controls the html-level class.
    <div className="dark">
      {children}
    </div>
  );
}
