import * as React from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends React.ComponentProps<"div"> {
  /** Visual variant of the card */
  variant?: "default" | "alchemy" | "nature" | "magic";
  /** Show a decorative gold ribbon at the top */
  decorative?: boolean;
}

function Card({
  className,
  variant = "default",
  decorative = false,
  ...props
}: CardProps) {
  const variantStyles = {
    default: "bg-parchment/90 border-gold/30 text-ink shadow-sm",
    alchemy: "bg-gold/5 border-gold/50 text-ink shadow-md",
    nature: "bg-moss/5 border-moss/40 text-ink shadow-md",
    magic: "bg-violet-magic/5 border-violet-magic/40 text-ink shadow-md",
  };

  return (
    <div
      data-slot="card"
      className={cn(
        "relative flex flex-col gap-6 rounded-xl border py-6 transition-all duration-200",
        variantStyles[variant],
        decorative && "pt-8", // space for the decorative ribbon
        className
      )}
      {...props}
    >
      {/* Decorative ribbon at the top (like a manuscript header) */}
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

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className
      )}
      {...props}
    />
  );
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn(
        "leading-none font-semibold font-cinzel tracking-wide text-ink",
        className
      )}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn(
        "text-ink/70 text-sm font-lora",
        className
      )}
      {...props}
    />
  );
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    />
  );
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-6 font-lora", className)}
      {...props}
    />
  );
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn(
        "flex items-center px-6 [.border-t]:pt-6 font-lora",
        className
      )}
      {...props}
    />
  );
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
};