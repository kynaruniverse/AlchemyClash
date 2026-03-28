import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";
import { cn } from "@/lib/utils";

const Toaster = ({ className, ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className={cn("toaster group", className)}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--toast-background": "oklch(0.93 0.04 80)",
          "--toast-color": "oklch(0.22 0.03 60)",
          "--toast-border": "oklch(0.72 0.12 75 / 0.3)",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };