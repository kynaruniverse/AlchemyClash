import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// ----------------------------------------------------------------------
// Empty Container (with theming)
// ----------------------------------------------------------------------

export interface EmptyProps extends React.ComponentProps < "div" > {
  /** Visual variant of the empty state container */
  variant ? : "default" | "alchemy" | "nature" | "magic";
  /** Add a decorative gold ribbon at the top */
  decorative ? : boolean;
}

const emptyVariantStyles = {
  default: "bg-parchment/80 border-gold/30 text-ink shadow-sm",
  alchemy: "bg-gold/5 border-gold/50 text-ink shadow-md",
  nature: "bg-moss/5 border-moss/40 text-ink shadow-md",
  magic: "bg-violet-magic/5 border-violet-magic/40 text-ink shadow-md",
};

function Empty({
  className,
  variant = "default",
  decorative = false,
  ...props
}: EmptyProps) {
  return (
    <div
      data-slot="empty"
      className={cn(
        // Base layout (original)
        "relative flex min-w-0 flex-1 flex-col items-center justify-center gap-6 rounded-lg p-6 text-center text-balance md:p-12",
        // Border style (original used dashed border, we keep that but add a solid border? We'll keep dashed but make it gold)
        "border border-dashed",
        // Theme
        emptyVariantStyles[variant],
        decorative && "pt-14", // extra padding for ribbon
        className
      )}
      {...props}
    >
      {/* Decorative gold ribbon */}
      {decorative && (
        <>
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-16 h-1 bg-gold/60 rounded-full" />
          <div className="absolute top-0 left-4 w-8 h-[2px] bg-gold/30" />
          <div className="absolute top-0 right-4 w-8 h-[2px] bg-gold/30" />
        </>
      )}
      {props.children}
    </div>
  );
}

// ----------------------------------------------------------------------
// EmptyHeader
// ----------------------------------------------------------------------
function EmptyHeader({ className, ...props }: React.ComponentProps < "div" > ) {
  return (
    <div
      data-slot="empty-header"
      className={cn(
        "flex max-w-sm flex-col items-center gap-2 text-center",
        className
      )}
      {...props}
    />
  );
}

// ----------------------------------------------------------------------
// EmptyMedia (icon/illustration container)
// ----------------------------------------------------------------------
const emptyMediaVariants = cva(
  "flex shrink-0 items-center justify-center mb-2 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        icon: "bg-gold/10 text-gold flex size-10 shrink-0 items-center justify-center rounded-lg [&_svg:not([class*='size-'])]:size-6",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

function EmptyMedia({
  className,
  variant = "default",
  ...props
}: React.ComponentProps < "div" > & VariantProps < typeof emptyMediaVariants > ) {
  return (
    <div
      data-slot="empty-icon"
      data-variant={variant}
      className={cn(emptyMediaVariants({ variant, className }))}
      {...props}
    />
  );
}

// ----------------------------------------------------------------------
// EmptyTitle
// ----------------------------------------------------------------------
function EmptyTitle({ className, ...props }: React.ComponentProps < "div" > ) {
  return (
    <div
      data-slot="empty-title"
      className={cn(
        "text-lg font-medium tracking-tight font-cinzel text-ink",
        className
      )}
      {...props}
    />
  );
}

// ----------------------------------------------------------------------
// EmptyDescription
// ----------------------------------------------------------------------
function EmptyDescription({ className, ...props }: React.ComponentProps < "p" > ) {
  return (
    <div
      data-slot="empty-description"
      className={cn(
        "text-ink/70 font-lora text-sm/relaxed",
        "[&>a:hover]:text-gold [&>a]:underline [&>a]:underline-offset-4 [&>a]:text-gold/80",
        className
      )}
      {...props}
    />
  );
}

// ----------------------------------------------------------------------
// EmptyContent
// ----------------------------------------------------------------------
function EmptyContent({ className, ...props }: React.ComponentProps < "div" > ) {
  return (
    <div
      data-slot="empty-content"
      className={cn(
        "flex w-full max-w-sm min-w-0 flex-col items-center gap-4 text-sm text-balance font-lora",
        className
      )}
      {...props}
    />
  );
}

export {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
  EmptyMedia,
};