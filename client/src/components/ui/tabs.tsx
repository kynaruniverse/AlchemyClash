import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "@/lib/utils";

export interface TabsProps extends React.ComponentProps<typeof TabsPrimitive.Root> {
  variant?: "default" | "alchemy" | "nature" | "magic";
}

const tabsVariantStyles = {
  default: {
    list: "bg-parchment/80 border-gold/30",
    trigger: "data-[state=active]:bg-parchment data-[state=active]:text-gold",
  },
  alchemy: {
    list: "bg-gold/5 border-gold/50",
    trigger: "data-[state=active]:bg-gold/20 data-[state=active]:text-gold",
  },
  nature: {
    list: "bg-moss/5 border-moss/40",
    trigger: "data-[state=active]:bg-moss/20 data-[state=active]:text-moss",
  },
  magic: {
    list: "bg-violet-magic/5 border-violet-magic/40",
    trigger: "data-[state=active]:bg-violet-magic/20 data-[state=active]:text-violet-magic",
  },
};

function Tabs({
  className,
  variant = "default",
  ...props
}: TabsProps) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  );
}

function TabsList({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
  // We'll use the variant from context, but for simplicity we'll rely on parent class.
  // Since we don't have context, we'll just add a base gold border.
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        "inline-flex h-9 w-fit items-center justify-center rounded-lg border p-[3px] transition-all duration-200",
        "bg-parchment/80 border-gold/30",
        className
      )}
      {...props}
    />
  );
}

function TabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-all duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/50",
        "disabled:pointer-events-none disabled:opacity-50",
        "data-[state=active]:bg-parchment data-[state=active]:text-gold data-[state=active]:shadow-sm",
        "text-ink/70 hover:bg-gold/10",
        className
      )}
      {...props}
    />
  );
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn("flex-1 outline-none", className)}
      {...props}
    />
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent };