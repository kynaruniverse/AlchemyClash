import { useDialogComposition } from "@/components/ui/dialog";
import { useComposition } from "@/hooks/useComposition";
import { cn } from "@/lib/utils";
import * as React from "react";

export interface TextareaProps extends React.ComponentProps<"textarea"> {
  variant?: "default" | "alchemy" | "nature" | "magic";
}

const textareaVariantStyles = {
  default: "bg-parchment/80 border-gold/30 text-ink placeholder:text-gold/40",
  alchemy: "bg-gold/5 border-gold/50 text-ink placeholder:text-gold/50",
  nature: "bg-moss/5 border-moss/40 text-ink placeholder:text-moss/50",
  magic: "bg-violet-magic/5 border-violet-magic/40 text-ink placeholder:text-violet-magic/50",
};

function Textarea({
  className,
  variant = "default",
  onKeyDown,
  onCompositionStart,
  onCompositionEnd,
  ...props
}: TextareaProps) {
  // Get dialog composition context if available (will be no-op if not inside Dialog)
  const dialogComposition = useDialogComposition();

  // Add composition event handlers to support input method editor (IME) for CJK languages.
  const {
    onCompositionStart: handleCompositionStart,
    onCompositionEnd: handleCompositionEnd,
    onKeyDown: handleKeyDown,
  } = useComposition<HTMLTextAreaElement>({
    onKeyDown: (e) => {
      // Check if this is an Enter key that should be blocked
      const isComposing = (e.nativeEvent as any).isComposing || dialogComposition.justEndedComposing();

      // If Enter key is pressed while composing or just after composition ended,
      // don't call the user's onKeyDown (this blocks the business logic)
      // Note: For textarea, Shift+Enter should still work for newlines
      if (e.key === "Enter" && !e.shiftKey && isComposing) {
        return;
      }

      // Otherwise, call the user's onKeyDown
      onKeyDown?.(e);
    },
    onCompositionStart: e => {
      dialogComposition.setComposing(true);
      onCompositionStart?.(e);
    },
    onCompositionEnd: e => {
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

  const styles = textareaVariantStyles[variant];

  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-16 w-full rounded-md border px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none md:text-sm",
        "focus-visible:ring-2 focus-visible:ring-gold/50 focus-visible:border-gold",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "aria-invalid:border-clay aria-invalid:ring-clay/20",
        styles,
        className
      )}
      onCompositionStart={handleCompositionStart}
      onCompositionEnd={handleCompositionEnd}
      onKeyDown={handleKeyDown}
      {...props}
    />
  );
}

export { Textarea };