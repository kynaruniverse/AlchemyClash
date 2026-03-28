import * as React from "react";
import * as MenubarPrimitive from "@radix-ui/react-menubar";
import { CheckIcon, ChevronRightIcon, CircleIcon } from "lucide-react";

import { cn } from "@/lib/utils";

// ----------------------------------------------------------------------
// Menubar Root
// ----------------------------------------------------------------------

export interface MenubarProps
  extends React.ComponentProps<typeof MenubarPrimitive.Root> {
  /** Visual variant of the menubar */
  variant?: "default" | "alchemy" | "nature" | "magic";
}

const menubarVariantStyles = {
  default: "bg-parchment/80 border-gold/30 text-ink shadow-sm",
  alchemy: "bg-gold/5 border-gold/50 text-ink shadow-md",
  nature: "bg-moss/5 border-moss/40 text-ink shadow-md",
  magic: "bg-violet-magic/5 border-violet-magic/40 text-ink shadow-md",
};

function Menubar({
  className,
  variant = "default",
  ...props
}: MenubarProps) {
  return (
    <MenubarPrimitive.Root
      data-slot="menubar"
      className={cn(
        "flex h-9 items-center gap-1 rounded-md border p-1 shadow-xs transition-all duration-200",
        menubarVariantStyles[variant],
        className
      )}
      {...props}
    />
  );
}

// ----------------------------------------------------------------------
// MenubarMenu (no changes)
// ----------------------------------------------------------------------
function MenubarMenu({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Menu>) {
  return <MenubarPrimitive.Menu data-slot="menubar-menu" {...props} />;
}

// ----------------------------------------------------------------------
// MenubarTrigger (gold hover/focus)
// ----------------------------------------------------------------------
function MenubarTrigger({
  className,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Trigger>) {
  return (
    <MenubarPrimitive.Trigger
      data-slot="menubar-trigger"
      className={cn(
        "flex items-center rounded-sm px-2 py-1 text-sm font-medium outline-none select-none transition-colors duration-150",
        "focus:bg-gold/20 focus:text-ink",
        "data-[state=open]:bg-gold/20 data-[state=open]:text-ink",
        "font-cinzel tracking-wide",
        className
      )}
      {...props}
    />
  );
}

// ----------------------------------------------------------------------
// MenubarContent (parchment dropdown)
// ----------------------------------------------------------------------

export interface MenubarContentProps
  extends React.ComponentProps<typeof MenubarPrimitive.Content> {
  variant?: "default" | "alchemy" | "nature" | "magic";
}

const menubarContentVariantStyles = {
  default: "bg-parchment/95 border-gold/30 text-ink shadow-lg",
  alchemy: "bg-gold/5 border-gold/50 text-ink shadow-lg",
  nature: "bg-moss/5 border-moss/40 text-ink shadow-lg",
  magic: "bg-violet-magic/5 border-violet-magic/40 text-ink shadow-lg",
};

function MenubarContent({
  className,
  align = "start",
  alignOffset = -4,
  sideOffset = 8,
  variant = "default",
  ...props
}: MenubarContentProps) {
  return (
    <MenubarPortal>
      <MenubarPrimitive.Content
        data-slot="menubar-content"
        align={align}
        alignOffset={alignOffset}
        sideOffset={sideOffset}
        className={cn(
          "z-50 min-w-[12rem] origin-(--radix-menubar-content-transform-origin) overflow-hidden rounded-md border p-1 shadow-md",
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
          "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
          "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2",
          "data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
          menubarContentVariantStyles[variant],
          className
        )}
        {...props}
      />
    </MenubarPortal>
  );
}

// ----------------------------------------------------------------------
// MenubarItem (gold hover, clay destructive)
// ----------------------------------------------------------------------
function MenubarItem({
  className,
  inset,
  variant = "default",
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Item> & {
  inset?: boolean;
  variant?: "default" | "destructive";
}) {
  return (
    <MenubarPrimitive.Item
      data-slot="menubar-item"
      data-inset={inset}
      data-variant={variant}
      className={cn(
        "relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none select-none",
        "font-lora transition-colors duration-150",
        "focus:bg-gold/20 focus:text-ink",
        "data-[variant=destructive]:text-clay data-[variant=destructive]:focus:bg-clay/10",
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        "data-[inset]:pl-8",
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    />
  );
}

// ----------------------------------------------------------------------
// MenubarCheckboxItem (gold check)
// ----------------------------------------------------------------------
function MenubarCheckboxItem({
  className,
  children,
  checked,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.CheckboxItem>) {
  return (
    <MenubarPrimitive.CheckboxItem
      data-slot="menubar-checkbox-item"
      className={cn(
        "relative flex cursor-default items-center gap-2 rounded-xs py-1.5 pr-2 pl-8 text-sm outline-none select-none",
        "font-lora transition-colors duration-150",
        "focus:bg-gold/20 focus:text-ink",
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      checked={checked}
      {...props}
    >
      <span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
        <MenubarPrimitive.ItemIndicator>
          <CheckIcon className="size-4 text-gold" />
        </MenubarPrimitive.ItemIndicator>
      </span>
      {children}
    </MenubarPrimitive.CheckboxItem>
  );
}

// ----------------------------------------------------------------------
// MenubarRadioItem (gold circle)
// ----------------------------------------------------------------------
function MenubarRadioItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.RadioItem>) {
  return (
    <MenubarPrimitive.RadioItem
      data-slot="menubar-radio-item"
      className={cn(
        "relative flex cursor-default items-center gap-2 rounded-xs py-1.5 pr-2 pl-8 text-sm outline-none select-none",
        "font-lora transition-colors duration-150",
        "focus:bg-gold/20 focus:text-ink",
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      <span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
        <MenubarPrimitive.ItemIndicator>
          <CircleIcon className="size-2 fill-gold text-gold" />
        </MenubarPrimitive.ItemIndicator>
      </span>
      {children}
    </MenubarPrimitive.RadioItem>
  );
}

// ----------------------------------------------------------------------
// MenubarLabel (gold, Cinzel)
// ----------------------------------------------------------------------
function MenubarLabel({
  className,
  inset,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Label> & {
  inset?: boolean;
}) {
  return (
    <MenubarPrimitive.Label
      data-slot="menubar-label"
      data-inset={inset}
      className={cn(
        "px-2 py-1.5 text-sm font-medium font-cinzel text-gold",
        "data-[inset]:pl-8",
        className
      )}
      {...props}
    />
  );
}

// ----------------------------------------------------------------------
// MenubarSeparator (gold line)
// ----------------------------------------------------------------------
function MenubarSeparator({
  className,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Separator>) {
  return (
    <MenubarPrimitive.Separator
      data-slot="menubar-separator"
      className={cn("bg-gold/30 -mx-1 my-1 h-px", className)}
      {...props}
    />
  );
}

// ----------------------------------------------------------------------
// MenubarShortcut (gold tint)
// ----------------------------------------------------------------------
function MenubarShortcut({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="menubar-shortcut"
      className={cn(
        "ml-auto text-xs tracking-widest text-gold/60 font-mono",
        className
      )}
      {...props}
    />
  );
}

// ----------------------------------------------------------------------
// MenubarSub (no changes)
// ----------------------------------------------------------------------
function MenubarSub({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Sub>) {
  return <MenubarPrimitive.Sub data-slot="menubar-sub" {...props} />;
}

// ----------------------------------------------------------------------
// MenubarSubTrigger (gold hover, chevron)
// ----------------------------------------------------------------------
function MenubarSubTrigger({
  className,
  inset,
  children,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.SubTrigger> & {
  inset?: boolean;
}) {
  return (
    <MenubarPrimitive.SubTrigger
      data-slot="menubar-sub-trigger"
      data-inset={inset}
      className={cn(
        "flex cursor-default items-center rounded-sm px-2 py-1.5 text-sm outline-none select-none",
        "font-lora transition-colors duration-150",
        "focus:bg-gold/20 focus:text-ink",
        "data-[state=open]:bg-gold/20 data-[state=open]:text-ink",
        "data-[inset]:pl-8",
        className
      )}
      {...props}
    >
      {children}
      <ChevronRightIcon className="ml-auto h-4 w-4 text-gold/60" />
    </MenubarPrimitive.SubTrigger>
  );
}

// ----------------------------------------------------------------------
// MenubarSubContent (parchment)
// ----------------------------------------------------------------------
function MenubarSubContent({
  className,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.SubContent>) {
  return (
    <MenubarPrimitive.SubContent
      data-slot="menubar-sub-content"
      className={cn(
        "z-50 min-w-[8rem] origin-(--radix-menubar-content-transform-origin) overflow-hidden rounded-md border p-1 shadow-lg",
        "bg-parchment/95 border-gold/30 text-ink backdrop-blur-sm",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
        "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2",
        "data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className
      )}
      {...props}
    />
  );
}

// ----------------------------------------------------------------------
// Group and Portal (unchanged)
// ----------------------------------------------------------------------
function MenubarGroup({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Group>) {
  return <MenubarPrimitive.Group data-slot="menubar-group" {...props} />;
}

function MenubarPortal({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Portal>) {
  return <MenubarPrimitive.Portal data-slot="menubar-portal" {...props} />;
}

function MenubarRadioGroup({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.RadioGroup>) {
  return (
    <MenubarPrimitive.RadioGroup data-slot="menubar-radio-group" {...props} />
  );
}

export {
  Menubar,
  MenubarPortal,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarGroup,
  MenubarSeparator,
  MenubarLabel,
  MenubarItem,
  MenubarShortcut,
  MenubarCheckboxItem,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSub,
  MenubarSubTrigger,
  MenubarSubContent,
};