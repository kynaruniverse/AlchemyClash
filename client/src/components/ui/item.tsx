import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

// ----------------------------------------------------------------------
// ItemGroup (with optional decorative ribbon)
// ----------------------------------------------------------------------

export interface ItemGroupProps extends React.ComponentProps<"div"> {
  /** Add a decorative gold ribbon at the top of the group */
  decorative?: boolean;
}

function ItemGroup({
  className,
  decorative = false,
  ...props
}: ItemGroupProps) {
  return (
    <div
      role="list"
      data-slot="item-group"
      className={cn(
        "group/item-group relative flex flex-col",
        decorative && "pt-6", // space for ribbon
        className
      )}
      {...props}
    >
      {/* Decorative gold top ribbon */}
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

function ItemSeparator({
  className,
  ...props
}: React.ComponentProps<typeof Separator>) {
  return (
    <Separator
      data-slot="item-separator"
      orientation="horizontal"
      className={cn("my-0 bg-gold/30", className)}
      {...props}
    />
  );
}

// ----------------------------------------------------------------------
// Item (with theming)
// ----------------------------------------------------------------------

export interface ItemProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof itemVariants> {
  asChild?: boolean;
  /** Visual variant of the item */
  variant?: "default" | "alchemy" | "nature" | "magic";
  /** Size variant */
  size?: "default" | "sm";
}

const itemVariantStyles = {
  default: "bg-parchment/50 border-gold/30 text-ink shadow-sm",
  alchemy: "bg-gold/5 border-gold/50 text-ink shadow-md",
  nature: "bg-moss/5 border-moss/40 text-ink shadow-md",
  magic: "bg-violet-magic/5 border-violet-magic/40 text-ink shadow-md",
};

const itemVariants = cva(
  "group/item flex items-center border rounded-md transition-all duration-200 flex-wrap outline-none focus-visible:border-gold focus-visible:ring-gold/50 focus-visible:ring-[3px]",
  {
    variants: {
      size: {
        default: "p-4 gap-4",
        sm: "py-3 px-4 gap-2.5",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

function Item({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: ItemProps) {
  const Comp = asChild ? Slot : "div";
  return (
    <Comp
      data-slot="item"
      data-variant={variant}
      data-size={size}
      className={cn(
        itemVariants({ size }),
        // Theme
        itemVariantStyles[variant],
        // Hover (light gold background for default variant)
        variant === "default" && "hover:bg-gold/10",
        className
      )}
      {...props}
    />
  );
}

// ----------------------------------------------------------------------
// ItemMedia (with gold icon variant)
// ----------------------------------------------------------------------

const itemMediaVariants = cva(
  "flex shrink-0 items-center justify-center gap-2 group-has-[[data-slot=item-description]]/item:self-start [&_svg]:pointer-events-none group-has-[[data-slot=item-description]]/item:translate-y-0.5",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        icon: "size-8 border rounded-sm bg-gold/10 text-gold [&_svg:not([class*='size-'])]:size-4",
        image:
          "size-10 rounded-sm overflow-hidden [&_img]:size-full [&_img]:object-cover",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

function ItemMedia({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof itemMediaVariants>) {
  return (
    <div
      data-slot="item-media"
      data-variant={variant}
      className={cn(itemMediaVariants({ variant, className }))}
      {...props}
    />
  );
}

// ----------------------------------------------------------------------
// Content, Title, Description
// ----------------------------------------------------------------------

function ItemContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="item-content"
      className={cn(
        "flex flex-1 flex-col gap-1 [&+[data-slot=item-content]]:flex-none",
        className
      )}
      {...props}
    />
  );
}

function ItemTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="item-title"
      className={cn(
        "flex w-fit items-center gap-2 text-sm leading-snug font-medium font-cinzel text-ink",
        className
      )}
      {...props}
    />
  );
}

function ItemDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="item-description"
      className={cn(
        "line-clamp-2 text-sm leading-normal font-normal text-balance font-lora text-ink/70",
        "[&>a:hover]:text-gold [&>a]:underline [&>a]:underline-offset-4 [&>a]:text-gold/80",
        className
      )}
      {...props}
    />
  );
}

// ----------------------------------------------------------------------
// Actions, Header, Footer
// ----------------------------------------------------------------------

function ItemActions({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="item-actions"
      className={cn("flex items-center gap-2", className)}
      {...props}
    />
  );
}

function ItemHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="item-header"
      className={cn(
        "flex basis-full items-center justify-between gap-2",
        className
      )}
      {...props}
    />
  );
}

function ItemFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="item-footer"
      className={cn(
        "flex basis-full items-center justify-between gap-2",
        className
      )}
      {...props}
    />
  );
}

export {
  Item,
  ItemMedia,
  ItemContent,
  ItemActions,
  ItemGroup,
  ItemSeparator,
  ItemTitle,
  ItemDescription,
  ItemHeader,
  ItemFooter,
};