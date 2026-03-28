import { useDialogComposition } from "@/components/ui/dialog";
import { useComposition } from "@/hooks/useComposition";
import { cn } from "@/lib/utils";
import * as React from "react";

// ----------------------------------------------------------------------
// Input with theming
// ----------------------------------------------------------------------

export interface InputProps extends React.ComponentProps<"input"> {
  /** Visual variant of the input */
  variant?: "default" | "alchemy" | "nature" | "magic";
}

const variantStyles = {
  default: "bg-parchment/80 border-gold/30 text-ink placeholder:text-gold/40",
  alchemy: "bg-gold/5 border-gold/50 text-ink placeholder:text-gold/50",
  nature: "bg-moss/5 border-moss/40 text-ink placeholder:text-moss/50",
  magic: "bg-violet-magic/5 border-violet-magic/40 text-ink placeholder:text-violet-magic/50",
};

function Input({
  className,
  type,
  variant = "default",
  onKeyDown,
  onCompositionStart,
  onCompositionEnd,
  ...props
}: InputProps) {
  // Get dialog composition context if available (will be no-op if not inside Dialog)
  const dialogComposition = useDialogComposition();

  // Add composition event handlers to support input method editor (IME) for CJK languages.
  const {
    onCompositionStart: handleCompositionStart,
    onCompositionEnd: handleCompositionEnd,
    onKeyDown: handleKeyDown,
  } = useComposition<HTMLInputElement>({
    onKeyDown: (e) => {
      // Check if this is an Enter key that should be blocked
      const isComposing =
        (e.nativeEvent as any).isComposing || dialogComposition.justEndedComposing();

      // If Enter key is pressed while composing or just after composition ended,
      // don't call the user's onKeyDown (this blocks the business logic)
      if (e.key === "Enter" && isComposing) {
        return;
      }

      // Otherwise, call the user's onKeyDown
      onKeyDown?.(e);
    },
    onCompositionStart: (e) => {
      dialogComposition.setComposing(true);
      onCompositionStart?.(e);
    },
    onCompositionEnd: (e) => {
      // Mark that composition just ended - this helps handle the Enter key that confirms input
      dialogComposition.markCompositionEnd();
      // Delay setting composing to false to handle Safari's event order
      // In Safari, compositionEnd fires before the ESC keydown event
      setTimeout(() => {
        dialogComposition.setComposing(false);
      }, 100);
      onCompositionEnd?.(e);
    },
  });

  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        // Base styles (original)
        "h-9 w-full min-w-0 rounded-md border px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none md:text-sm",
        "file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        // Theme (background, border, text, placeholder)
        variantStyles[variant],
        // Focus ring (gold)
        "focus-visible:border-gold focus-visible:ring-gold/50 focus-visible:ring-[3px]",
        // Error state (clay)
        "aria-invalid:border-clay aria-invalid:ring-clay/20 dark:aria-invalid:ring-clay/40",
        className
      )}
      onCompositionStart={handleCompositionStart}
      onCompositionEnd={handleCompositionEnd}
      onKeyDown={handleKeyDown}
      {...props}
    />
  );
}

export { Input };