"use client";

import * as React from "react";
import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group";
import { type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { toggleVariants } from "@/components/ui/toggle";

const ToggleGroupContext = React.createContext<
  VariantProps<typeof toggleVariants> & { themeVariant?: "default" | "alchemy" | "nature" | "magic" }
>({
  size: "default",
  variant: "default",
  themeVariant: "default",
});

function ToggleGroup({
  className,
  variant,
  size,
  children,
  themeVariant = "default",
  ...props
}: React.ComponentProps<typeof ToggleGroupPrimitive.Root> &
  VariantProps<typeof toggleVariants> & {
    themeVariant?: "default" | "alchemy" | "nature" | "magic";
  }) {
  return (
    <ToggleGroupPrimitive.Root
      data-slot="toggle-group"
      data-variant={variant}
      data-size={size}
      className={cn(
        "group/toggle-group flex w-fit items-center rounded-md border p-[1px] transition-all duration-200",
        "bg-parchment/80 border-gold/30",
        className
      )}
      {...props}
    >
      <ToggleGroupContext.Provider value={{ variant, size, themeVariant }}>
        {children}
      </ToggleGroupContext.Provider>
    </ToggleGroupPrimitive.Root>
  );
}

function ToggleGroupItem({
  className,
  children,
  variant,
  size,
  ...props
}: React.ComponentProps<typeof ToggleGroupPrimitive.Item> &
  VariantProps<typeof toggleVariants>) {
  const context = React.useContext(ToggleGroupContext);
  const themeVariant = context.themeVariant || "default";

  const activeStyles = {
    default: "data-[state=on]:bg-gold/20 data-[state=on]:text-gold",
    alchemy: "data-[state=on]:bg-gold/30 data-[state=on]:text-gold",
    nature: "data-[state=on]:bg-moss/30 data-[state=on]:text-moss",
    magic: "data-[state=on]:bg-violet-magic/30 data-[state=on]:text-violet-magic",
  };

  return (
    <ToggleGroupPrimitive.Item
      data-slot="toggle-group-item"
      data-variant={context.variant || variant}
      data-size={context.size || size}
      className={cn(
        toggleVariants({
          variant: context.variant || variant,
          size: context.size || size,
        }),
        "min-w-0 flex-1 shrink-0 rounded-none shadow-none first:rounded-l-md last:rounded-r-md focus:z-10 focus-visible:z-10 data-[variant=outline]:border-l-0 data-[variant=outline]:first:border-l",
        "transition-all duration-150",
        activeStyles[themeVariant],
        className
      )}
      {...props}
    >
      {children}
    </ToggleGroupPrimitive.Item>
  );
}

export { ToggleGroup, ToggleGroupItem };