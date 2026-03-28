import { cn } from "@/lib/utils";

// ----------------------------------------------------------------------
// Kbd component (with theming)
// ----------------------------------------------------------------------

export interface KbdProps extends React.ComponentProps<"kbd"> {
  /** Visual variant of the keyboard key */
  variant?: "default" | "alchemy" | "nature" | "magic";
  /** Add a decorative gold rim (subtle shadow/glow) */
  decorative?: boolean;
}

const kbdVariantStyles = {
  default: "bg-parchment/80 border border-gold/30 text-ink shadow-sm",
  alchemy: "bg-gold/10 border border-gold/50 text-ink shadow-sm",
  nature: "bg-moss/10 border border-moss/40 text-ink shadow-sm",
  magic: "bg-violet-magic/10 border border-violet-magic/40 text-ink shadow-sm",
};

function Kbd({
  className,
  variant = "default",
  decorative = false,
  ...props
}: KbdProps) {
  return (
    <kbd
      data-slot="kbd"
      className={cn(
        // Base (original)
        "pointer-events-none inline-flex h-5 w-fit min-w-5 items-center justify-center gap-1 rounded-sm px-1 font-sans text-xs font-medium select-none",
        "[&_svg:not([class*='size-'])]:size-3",
        // Theme
        kbdVariantStyles[variant],
        // Decorative (subtle inner shadow or glow)
        decorative && "shadow-[inset_0_1px_1px_rgba(0,0,0,0.05),0_0_0_1px_rgba(212,168,67,0.2)]",
        // Inherit styles inside tooltips (keep original logic)
        "[[data-slot=tooltip-content]_&]:bg-background/20 [[data-slot=tooltip-content]_&]:text-background dark:[[data-slot=tooltip-content]_&]:bg-background/10",
        className
      )}
      {...props}
    />
  );
}

// ----------------------------------------------------------------------
// KbdGroup (unchanged, but can inherit theme)
// ----------------------------------------------------------------------

function KbdGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="kbd-group"
      className={cn("inline-flex items-center gap-1", className)}
      {...props}
    />
  );
}

export { Kbd, KbdGroup };