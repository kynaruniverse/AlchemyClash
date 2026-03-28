import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { cn } from "@/lib/utils";

// Custom theme tokens (from index.css)
const theme = {
  gold: "oklch(0.72 0.12 75)",
  moss: "oklch(0.48 0.08 145)",
  violet: "oklch(0.55 0.12 295)",
  parchment: "oklch(0.93 0.04 80)",
  ink: "oklch(0.22 0.03 60)",
};

interface AvatarProps extends React.ComponentProps<typeof AvatarPrimitive.Root> {
  /** Optional decorative ring variant */
  ring?: "none" | "gold" | "nature" | "magic";
}

function Avatar({
  className,
  ring = "none",
  ...props
}: AvatarProps): JSX.Element {
  const ringStyles = {
    none: "",
    gold: "ring-2 ring-gold/60 ring-offset-2 ring-offset-parchment",
    nature: "ring-2 ring-moss/60 ring-offset-2 ring-offset-parchment",
    magic: "ring-2 ring-violet-magic/60 ring-offset-2 ring-offset-parchment",
  };

  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      className={cn(
        "relative flex size-8 shrink-0 overflow-hidden rounded-full",
        ringStyles[ring],
        className
      )}
      {...props}
    />
  );
}

function AvatarImage({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Image>): JSX.Element {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn("aspect-square size-full object-cover", className)}
      {...props}
    />
  );
}

function AvatarFallback({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Fallback>): JSX.Element {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        "flex size-full items-center justify-center rounded-full",
        "bg-parchment text-ink font-cinzel text-sm",
        "border border-gold/20 shadow-sm",
        className
      )}
      {...props}
    />
  );
}

export { Avatar, AvatarImage, AvatarFallback };