import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

// ----------------------------------------------------------------------
// InputGroup Container (with theming)
// ----------------------------------------------------------------------

export interface InputGroupProps extends React.ComponentProps<"div"> {
  /** Visual variant of the input group */
  variant?: "default" | "alchemy" | "nature" | "magic";
}

const variantStyles = {
  default: "bg-parchment/80 border-gold/30 text-ink shadow-sm",
  alchemy: "bg-gold/5 border-gold/50 text-ink shadow-md",
  nature: "bg-moss/5 border-moss/40 text-ink shadow-md",
  magic: "bg-violet-magic/5 border-violet-magic/40 text-ink shadow-md",
};

function InputGroup({
  className,
  variant = "default",
  ...props
}: InputGroupProps) {
  return (
    <div
      data-slot="input-group"
      role="group"
      className={cn(
        // Base layout and states (original)
        "group/input-group relative flex w-full items-center rounded-md border shadow-xs transition-[color,box-shadow] outline-none",
        "h-9 min-w-0 has-[>textarea]:h-auto",

        // Variants based on alignment.
        "has-[>[data-align=inline-start]]:[&>input]:pl-2",
        "has-[>[data-align=inline-end]]:[&>input]:pr-2",
        "has-[>[data-align=block-start]]:h-auto has-[>[data-align=block-start]]:flex-col has-[>[data-align=block-start]]:[&>input]:pb-3",
        "has-[>[data-align=block-end]]:h-auto has-[>[data-align=block-end]]:flex-col has-[>[data-align=block-end]]:[&>input]:pt-3",

        // Focus state (gold ring)
        "has-[[data-slot=input-group-control]:focus-visible]:border-gold has-[[data-slot=input-group-control]:focus-visible]:ring-gold/50",
        "has-[[data-slot=input-group-control]:focus-visible]:ring-[3px]",

        // Error state (clay red)
        "has-[[data-slot][aria-invalid=true]]:ring-clay/20 has-[[data-slot][aria-invalid=true]]:border-clay dark:has-[[data-slot][aria-invalid=true]]:ring-clay/40",

        // Theme
        variantStyles[variant],
        className
      )}
      {...props}
    />
  );
}

// ----------------------------------------------------------------------
// InputGroupAddon (with gold‑tinted text)
// ----------------------------------------------------------------------

const inputGroupAddonVariants = cva(
  "flex h-auto cursor-text items-center justify-center gap-2 py-1.5 text-sm font-medium select-none [&>svg:not([class*='size-'])]:size-4 [&>kbd]:rounded-[calc(var(--radius)-5px)] group-data-[disabled=true]/input-group:opacity-50",
  {
    variants: {
      align: {
        "inline-start":
          "order-first pl-3 has-[>button]:ml-[-0.45rem] has-[>kbd]:ml-[-0.35rem]",
        "inline-end":
          "order-last pr-3 has-[>button]:mr-[-0.45rem] has-[>kbd]:mr-[-0.35rem]",
        "block-start":
          "order-first w-full justify-start px-3 pt-3 [.border-b]:pb-3 group-has-[>input]/input-group:pt-2.5",
        "block-end":
          "order-last w-full justify-start px-3 pb-3 [.border-t]:pt-3 group-has-[>input]/input-group:pb-2.5",
      },
    },
    defaultVariants: {
      align: "inline-start",
    },
  }
);

function InputGroupAddon({
  className,
  align = "inline-start",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof inputGroupAddonVariants>) {
  return (
    <div
      role="group"
      data-slot="input-group-addon"
      data-align={align}
      className={cn(
        inputGroupAddonVariants({ align }),
        // Gold‑tinted text
        "text-gold/70",
        className
      )}
      onClick={e => {
        if ((e.target as HTMLElement).closest("button")) {
          return;
        }
        e.currentTarget.parentElement?.querySelector("input")?.focus();
      }}
      {...props}
    />
  );
}

// ----------------------------------------------------------------------
// InputGroupButton (with gold styling)
// ----------------------------------------------------------------------

const inputGroupButtonVariants = cva(
  "text-sm shadow-none flex gap-2 items-center",
  {
    variants: {
      size: {
        xs: "h-6 gap-1 px-2 rounded-[calc(var(--radius)-5px)] [&>svg:not([class*='size-'])]:size-3.5 has-[>svg]:px-2",
        sm: "h-8 px-2.5 gap-1.5 rounded-md has-[>svg]:px-2.5",
        "icon-xs":
          "size-6 rounded-[calc(var(--radius)-5px)] p-0 has-[>svg]:p-0",
        "icon-sm": "size-8 p-0 has-[>svg]:p-0",
      },
    },
    defaultVariants: {
      size: "xs",
    },
  }
);

function InputGroupButton({
  className,
  type = "button",
  variant = "ghost",
  size = "xs",
  ...props
}: Omit<React.ComponentProps<typeof Button>, "size"> &
  VariantProps<typeof inputGroupButtonVariants>) {
  return (
    <Button
      type={type}
      data-size={size}
      variant={variant}
      className={cn(
        inputGroupButtonVariants({ size }),
        // Override ghost hover to be gold
        variant === "ghost" && "hover:bg-gold/10 hover:text-gold",
        className
      )}
      {...props}
    />
  );
}

// ----------------------------------------------------------------------
// InputGroupText (gold‑tinted)
// ----------------------------------------------------------------------

function InputGroupText({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "flex items-center gap-2 text-sm [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4",
        "text-gold/70",
        className
      )}
      {...props}
    />
  );
}

// ----------------------------------------------------------------------
// InputGroupInput / Textarea (unchanged except they inherit parent styling)
// ----------------------------------------------------------------------

function InputGroupInput({
  className,
  ...props
}: React.ComponentProps<"input">) {
  return (
    <Input
      data-slot="input-group-control"
      className={cn(
        "flex-1 rounded-none border-0 bg-transparent shadow-none focus-visible:ring-0 dark:bg-transparent",
        className
      )}
      {...props}
    />
  );
}

function InputGroupTextarea({
  className,
  ...props
}: React.ComponentProps<"textarea">) {
  return (
    <Textarea
      data-slot="input-group-control"
      className={cn(
        "flex-1 resize-none rounded-none border-0 bg-transparent py-3 shadow-none focus-visible:ring-0 dark:bg-transparent",
        className
      )}
      {...props}
    />
  );
}

export {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupText,
  InputGroupInput,
  InputGroupTextarea,
};