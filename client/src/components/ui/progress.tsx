import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";

import { cn } from "@/lib/utils";

// ----------------------------------------------------------------------
// Progress with theming
// ----------------------------------------------------------------------

export interface ProgressProps
  extends React.ComponentProps<typeof ProgressPrimitive.Root> {
  /** Visual variant of the progress bar */
  variant?: "default" | "alchemy" | "nature" | "magic";
  /** Add a subtle gold glow effect when progress is high */
  glow?: boolean;
}

const variantStyles = {
  default: {
    track: "bg-gold/20",
    indicator: "bg-gradient-to-r from-gold to-gold/80",
  },
  alchemy: {
    track: "bg-gold/30",
    indicator: "bg-gradient-to-r from-gold to-gold/90",
  },
  nature: {
    track: "bg-moss/20",
    indicator: "bg-gradient-to-r from-moss to-moss/80",
  },
  magic: {
    track: "bg-violet-magic/20",
    indicator: "bg-gradient-to-r from-violet-magic to-violet-magic/80",
  },
};

function Progress({
  className,
  value,
  variant = "default",
  glow = false,
  ...props
}: ProgressProps) {
  const percentage = value ?? 0;
  const styles = variantStyles[variant];

  return (
    <div className="relative w-full">
      <ProgressPrimitive.Root
        data-slot="progress"
        className={cn(
          // Base track styling
          "relative h-2 w-full overflow-hidden rounded-full",
          styles.track,
          // Parchment texture overlay (subtle noise)
          "after:absolute after:inset-0 after:pointer-events-none after:rounded-full after:bg-[url('data:image/svg+xml,%3Csvg xmlns=\"http://www.w3.org/2000/svg\" width=\"300\" height=\"300\"%3E%3Cfilter id=\"noise\"%3E%3CfeTurbulence type=\"fractalNoise\" baseFrequency=\"0.65\" numOctaves=\"3\" stitchTiles=\"stitch\"/%3E%3CfeColorMatrix type=\"saturate\" values=\"0\"/%3E%3C/filter%3E%3Crect width=\"300\" height=\"300\" filter=\"url(%23noise)\" opacity=\"0.04\"/%3E%3C/svg%3E')] after:bg-repeat after:opacity-20",
          className
        )}
        {...props}
      >
        <ProgressPrimitive.Indicator
          data-slot="progress-indicator"
          className={cn(
            "h-full w-full flex-1 rounded-full transition-all duration-500 ease-out",
            styles.indicator,
            glow && percentage > 50 && "animate-gold-pulse"
          )}
          style={{ transform: `translateX(-${100 - percentage}%)` }}
        />
      </ProgressPrimitive.Root>

      {/* Optional decorative rune at the end */}
      {glow && percentage === 100 && (
        <div className="absolute -right-1 -top-1 text-gold/60 text-xs animate-pulse">
          ✦
        </div>
      )}
    </div>
  );
}

export { Progress };