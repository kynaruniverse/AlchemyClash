import * as React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronDownIcon, ScrollIcon } from "lucide-react"; // ScrollIcon adds manuscript flair
import { motion, AnimatePresence } from "framer-motion";

import { cn } from "@/lib/utils";

// Custom theme tokens (already defined in index.css, but we reference them here for clarity)
const theme = {
  parchment: "oklch(0.93 0.04 80)",
  parchmentDark: "oklch(0.82 0.05 75)",
  ink: "oklch(0.22 0.03 60)",
  gold: "oklch(0.72 0.12 75)",
  goldLight: "oklch(0.85 0.10 80)",
  moss: "oklch(0.48 0.08 145)",
};

// ----- Accordion Root -----
function Accordion({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Root>): JSX.Element {
  return (
    <AccordionPrimitive.Root
      data-slot="accordion"
      className={cn(
        "rounded-md border border-gold/20 bg-parchment/80 backdrop-blur-sm",
        className
      )}
      {...props}
    />
  );
}

// ----- Accordion Item -----
function AccordionItem({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Item>): JSX.Element {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn(
        "border-b border-gold/20 last:border-b-0 transition-colors duration-200",
        className
      )}
      {...props}
    />
  );
}

// ----- Accordion Trigger -----
function AccordionTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger>): JSX.Element {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          // Base styles
          "group relative flex flex-1 items-center justify-between gap-4 py-4 px-2 text-left text-sm font-medium",
          // Focus & hover
          "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold/50",
          "hover:bg-parchment-dark/10 transition-all duration-200",
          // Disabled
          "disabled:pointer-events-none disabled:opacity-50",
          className
        )}
        {...props}
      >
        {/* Decorative manuscript line (subtle) */}
        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-gold/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <span className="flex items-center gap-2">
          {/* Optional scroll icon for manuscript feel */}
          <ScrollIcon className="size-4 text-gold/60 group-hover:text-gold transition-colors duration-200" />
          {children}
        </span>

        <ChevronDownIcon
          className={cn(
            "size-4 shrink-0 text-gold/70 transition-transform duration-300 ease-out",
            "group-data-[state=open]:rotate-180 group-data-[state=open]:text-gold"
          )}
        />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

// ----- Accordion Content -----
function AccordionContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Content>): JSX.Element {
  return (
    <AccordionPrimitive.Content
      data-slot="accordion-content"
      className="overflow-hidden text-sm"
      {...props}
    >
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className={cn(
          "pt-0 pb-4 px-2 text-ink/80 leading-relaxed",
          // Optional: add a subtle inner shadow or border
          "border-l-2 border-gold/20 ml-4",
          className
        )}
      >
        {/* Decorative ink blot at the start (optional) */}
        <span className="inline-block mr-2 text-gold/40 text-xs">⚜️</span>
        {children}
      </motion.div>
    </AccordionPrimitive.Content>
  );
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };