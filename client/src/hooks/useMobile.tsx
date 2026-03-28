import * as React from "react";

const MOBILE_BREAKPOINT = 768;

/**
 * Hook that detects if the current viewport matches mobile dimensions.
 * Uses a media query to listen for changes and update accordingly.
 *
 * @returns `true` if the screen width is less than `MOBILE_BREAKPOINT`, otherwise `false`.
 */
export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = React.useState<boolean>(() => {
    // Check window existence for SSR safety
    if (typeof window === "undefined") return false;
    return window.innerWidth < MOBILE_BREAKPOINT;
  });

  React.useEffect(() => {
    if (typeof window === "undefined") return;

    const handleResize = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    // Listen to both resize and orientation change for better coverage
    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);

    // Initial check
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
    };
  }, []);

  return isMobile;
}