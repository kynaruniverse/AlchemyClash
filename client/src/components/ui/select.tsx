import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react";

import { cn } from "@/lib/utils";

// ----------------------------------------------------------------------
// Theming
// ----------------------------------------------------------------------
export interface SelectProps extends React.ComponentProps<typeof SelectPrimitive.Root> {
  variant?: "default" | "alchemy" | "nature" | "magic";
}

const selectVariantStyles = {
  default: {
    trigger: "bg-parchment/80 border-gold/30 text-ink",
    content: "bg-parchment/95 border-gold/30 text-ink",
    item: "hover:bg-gold/10 focus:bg-gold/20 data-[highlighted]:bg-gold/20",
    separator: "bg-gold/30",
  },
  alchemy: {
    trigger: "bg-gold/5 border-gold/50 text-ink",
    content: "bg-gold/5 border-gold/50 text-ink",
    item: "hover:bg-gold/20 focus:bg-gold/30 data-[highlighted]:bg-gold/30",
    separator: "bg-gold/50",
  },
  nature: {
    trigger: "bg-moss/5 border-moss/40 text-ink",
    content: "bg-moss/5 border-moss/40 text-ink",
    item: "hover:bg-moss/20 focus:bg-moss/30 data-[highlighted]:bg-moss/30",
    separator: "bg-moss/40",
  },
  magic: {
    trigger: "bg-violet-magic/5 border-violet-magic/40 text-ink",
    content: "bg-violet-magic/5 border-violet-magic/40 text-ink",
    item: "hover:bg-violet-magic/20 focus:bg-violet-magic/30 data-[highlighted]:bg-violet-magic/30",
    separator: "bg-violet-magic/40",
  },
};

function Select({
  variant = "default",
  ...props
}: SelectProps) {
  // We pass variant via context if needed, but for simplicity we'll store in a React context.
  // We'll create a context for select variant.
  const SelectContext = React.createContext<{ variant: typeof variant }>({ variant });
  return (
    <SelectContext.Provider value={{ variant }}>
      <SelectPrimitive.Root data-slot="select" {...props} />
    </SelectContext.Provider>
  );
}

function useSelectVariant() {
  const ctx = React.useContext(SelectContext);
  return ctx.variant;
}

// ----------------------------------------------------------------------
// Components
// ----------------------------------------------------------------------
function SelectGroup({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Group>) {
  return <SelectPrimitive.Group data-slot="select-group" {...props} />;
}

function SelectValue({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Value>) {
  return <SelectPrimitive.Value data-slot="select-value" {...props} />;
}

function SelectTrigger({
  className,
  size = "default",
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger> & {
  size?: "sm" | "default";
}) {
  const variant = useSelectVariant();
  const styles = selectVariantStyles[variant].trigger;

  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      data-size={size}
      className={cn(
        "flex w-fit items-center justify-between gap-2 rounded-md border px-3 py-2 text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none",
        "focus-visible:ring-2 focus-visible:ring-gold/50",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "data-[size=default]:h-9 data-[size=sm]:h-8",
        styles,
        className
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDownIcon className="size-4 opacity-50" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
}

function SelectContent({
  className,
  children,
  position = "popper",
  align = "center",
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Content>) {
  const variant = useSelectVariant();
  const styles = selectVariantStyles[variant].content;

  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        data-slot="select-content"
        className={cn(
          "relative z-50 max-h-(--radix-select-content-available-height) min-w-[8rem] origin-(--radix-select-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border p-1 shadow-md",
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
          "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
          "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2",
          "data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
          position === "popper" &&
            "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
          styles,
          className
        )}
        position={position}
        align={align}
        {...props}
      >
        <SelectScrollUpButton />
        <SelectPrimitive.Viewport
          className={cn(
            "p-1",
            position === "popper" &&
              "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)] scroll-my-1"
          )}
        >
          {children}
        </SelectPrimitive.Viewport>
        <SelectScrollDownButton />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
}

function SelectLabel({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Label>) {
  return (
    <SelectPrimitive.Label
      data-slot="select-label"
      className={cn("px-2 py-1.5 text-xs font-medium font-cinzel text-gold/80", className)}
      {...props}
    />
  );
}

function SelectItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Item>) {
  const variant = useSelectVariant();
  const styles = selectVariantStyles[variant].item;

  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        "relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-none select-none",
        "transition-colors duration-150",
        styles,
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      <span className="absolute right-2 flex size-3.5 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <CheckIcon className="size-4 text-gold" />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  );
}

function SelectSeparator({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Separator>) {
  const variant = useSelectVariant();
  const styles = selectVariantStyles[variant].separator;

  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className={cn("-mx-1 my-1 h-px", styles, className)}
      {...props}
    />
  );
}

function SelectScrollUpButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>) {
  return (
    <SelectPrimitive.ScrollUpButton
      data-slot="select-scroll-up-button"
      className={cn("flex cursor-default items-center justify-center py-1", className)}
      {...props}
    >
      <ChevronUpIcon className="size-4" />
    </SelectPrimitive.ScrollUpButton>
  );
}

function SelectScrollDownButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownButton>) {
  return (
    <SelectPrimitive.ScrollDownButton
      data-slot="select-scroll-down-button"
      className={cn("flex cursor-default items-center justify-center py-1", className)}
      {...props}
    >
      <ChevronDownIcon className="size-4" />
    </SelectPrimitive.ScrollDownButton>
  );
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
};