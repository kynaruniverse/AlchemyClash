"use client";

import * as React from "react";
import { Command as CommandPrimitive } from "cmdk";
import { SearchIcon } from "lucide-react";
import { motion } from "framer-motion";

import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// ----------------------------------------------------------------------
// Root Command Component
// ----------------------------------------------------------------------

function Command({
  className,
  ...props
}: React.ComponentProps < typeof CommandPrimitive > ) {
  return (
    <CommandPrimitive
      data-slot="command"
      className={cn(
        "flex h-full w-full flex-col overflow-hidden rounded-xl",
        "bg-parchment/95 border border-gold/30 shadow-lg",
        "font-lora text-ink",
        className
      )}
      {...props}
    />
  );
}

// ----------------------------------------------------------------------
// Command Dialog (wrapper around Dialog with Command inside)
// ----------------------------------------------------------------------

function CommandDialog({
  title = "Command Palette",
  description = "Search for a command to run...",
  children,
  className,
  showCloseButton = true,
  ...props
}: React.ComponentProps < typeof Dialog > & {
  title ? : string;
  description ? : string;
  className ? : string;
  showCloseButton ? : boolean;
}) {
  return (
    <Dialog {...props}>
      <DialogHeader className="sr-only">
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
      </DialogHeader>
      <DialogContent
        className={cn(
          "overflow-hidden p-0 rounded-xl border-gold/30",
          "bg-parchment/90 shadow-2xl",
          className
        )}
        showCloseButton={showCloseButton}
      >
        <Command className="[&_[cmdk-group-heading]]:text-muted-foreground **:data-[slot=command-input-wrapper]:h-12 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group]]:px-2 [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5">
          {children}
        </Command>
      </DialogContent>
    </Dialog>
  );
}

// ----------------------------------------------------------------------
// Input Area
// ----------------------------------------------------------------------

function CommandInput({
  className,
  ...props
}: React.ComponentProps < typeof CommandPrimitive.Input > ) {
  return (
    <div
      data-slot="command-input-wrapper"
      className="flex h-9 items-center gap-2 border-b border-gold/30 px-3"
    >
      <SearchIcon className="size-4 shrink-0 text-gold/60" />
      <CommandPrimitive.Input
        data-slot="command-input"
        className={cn(
          "flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-hidden",
          "placeholder:text-gold/40 text-ink",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "focus-visible:ring-1 focus-visible:ring-gold/50",
          className
        )}
        {...props}
      />
    </div>
  );
}

// ----------------------------------------------------------------------
// List & Groups
// ----------------------------------------------------------------------

function CommandList({
  className,
  ...props
}: React.ComponentProps < typeof CommandPrimitive.List > ) {
  return (
    <CommandPrimitive.List
      data-slot="command-list"
      className={cn(
        "max-h-[300px] scroll-py-1 overflow-x-hidden overflow-y-auto",
        className
      )}
      {...props}
    />
  );
}

function CommandEmpty({
  ...props
}: React.ComponentProps < typeof CommandPrimitive.Empty > ) {
  return (
    <CommandPrimitive.Empty
      data-slot="command-empty"
      className="py-6 text-center text-sm text-gold/60 font-lora italic"
      {...props}
    />
  );
}

function CommandGroup({
  className,
  ...props
}: React.ComponentProps < typeof CommandPrimitive.Group > ) {
  return (
    <CommandPrimitive.Group
      data-slot="command-group"
      className={cn(
        "overflow-hidden p-1",
        "[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium",
        "[&_[cmdk-group-heading]]:text-gold/80 [&_[cmdk-group-heading]]:font-cinzel [&_[cmdk-group-heading]]:tracking-wide",
        className
      )}
      {...props}
    />
  );
}

function CommandSeparator({
  className,
  ...props
}: React.ComponentProps < typeof CommandPrimitive.Separator > ) {
  return (
    <CommandPrimitive.Separator
      data-slot="command-separator"
      className={cn("bg-gold/30 -mx-1 h-px", className)}
      {...props}
    />
  );
}

// ----------------------------------------------------------------------
// Items
// ----------------------------------------------------------------------

function CommandItem({
  className,
  children,
  ...props
}: React.ComponentProps < typeof CommandPrimitive.Item > ) {
  return (
    <CommandPrimitive.Item
      data-slot="command-item"
      className={cn(
        "relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none select-none",
        "transition-all duration-150",
        "data-[selected=true]:bg-gold/20 data-[selected=true]:text-ink data-[selected=true]:shadow-sm",
        "data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50",
        "hover:bg-gold/10",
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      {children}
    </CommandPrimitive.Item>
  );
}

function CommandShortcut({
  className,
  ...props
}: React.ComponentProps < "span" > ) {
  return (
    <span
      data-slot="command-shortcut"
      className={cn(
        "ml-auto text-xs tracking-widest text-gold/50 font-mono",
        className
      )}
      {...props}
    />
  );
}

export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
};