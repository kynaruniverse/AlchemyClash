import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

const buttonGroupVariants = cva(
  "flex w-fit items-stretch",
  // Ensure that any child buttons get proper border radius and focus styles
  "[&>*]:focus-visible:z-10 [&>*]:focus-visible:relative [&>*]:focus-visible:ring-2 [&>*]:focus-visible:ring-gold/50",
  "[&>[data-slot=select-trigger]:not([class*='w-'])]:w-fit [&>input]:flex-1",
  "has-[select[aria-hidden=true]:last-child]:[&>[data-slot=select-trigger]:last-of-type]:rounded-r-md",
  "has-[>[data-slot=button-group]]:gap-2",
  {
    variants: {
      orientation: {
        horizontal:
          "[&>*:not(:first-child)]:rounded-l-none [&>*:not(:first-child)]:border-l-0 [&>*:not(:last-child)]:rounded-r-none",
        vertical:
          "flex-col [&>*:not(:first-child)]:rounded-t-none [&>*:not(:first-child)]:border-t-0 [&>*:not(:last-child)]:rounded-b-none",
      },
    },
    defaultVariants: {
      orientation: "horizontal",
    },
  }
);

function ButtonGroup({
  className,
  orientation,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof buttonGroupVariants>) {
  return (
    <div
      role="group"
      data-slot="button-group"
      data-orientation={orientation}
      className={cn(
        buttonGroupVariants({ orientation }),
        // Add a subtle gold border and parchment background to the whole group
        "rounded-md border border-gold/30 bg-parchment/20 shadow-sm",
        "transition-all duration-200",
        className
      )}
      {...props}
    />
  );
}

function ButtonGroupText({
  className,
  asChild = false,
  ...props
}: React.ComponentProps<"div"> & {
  asChild?: boolean;
}) {
  const Comp = asChild ? Slot : "div";

  return (
    <Comp
      className={cn(
        "flex items-center gap-2 rounded-md border px-4 py-1.5 text-sm font-medium",
        "bg-parchment/50 border-gold/30 text-ink font-cinzel",
        "shadow-xs [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4",
        "hover:bg-parchment/80 transition-colors duration-200",
        className
      )}
      {...props}
    />
  );
}

function ButtonGroupSeparator({
  className,
  orientation = "vertical",
  ...props
}: React.ComponentProps<typeof Separator>) {
  return (
    <Separator
      data-slot="button-group-separator"
      orientation={orientation}
      className={cn(
        "bg-gold/30 relative !m-0 self-stretch data-[orientation=vertical]:h-auto",
        className
      )}
      {...props}
    />
  );
}

export {
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText,
  buttonGroupVariants,
};