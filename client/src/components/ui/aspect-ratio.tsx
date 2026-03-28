import * as AspectRatioPrimitive from "@radix-ui/react-aspect-ratio";
import { cn } from "@/lib/utils";

interface AspectRatioProps
  extends React.ComponentProps<typeof AspectRatioPrimitive.Root> {
  /** Apply a decorative gold border and parchment background */
  decorative?: boolean;
}

function AspectRatio({
  className,
  decorative = false,
  children,
  ...props
}: AspectRatioProps): JSX.Element {
  return (
    <AspectRatioPrimitive.Root
      data-slot="aspect-ratio"
      className={cn(
        "relative overflow-hidden",
        decorative && [
          "rounded-lg border border-gold/40 bg-parchment/30 shadow-sm",
          "after:absolute after:inset-0 after:pointer-events-none after:rounded-lg",
          "after:bg-[radial-gradient(circle_at_center,_transparent_50%,_rgba(212,168,67,0.05)_100%)]",
        ],
        className
      )}
      {...props}
    >
      {children}
    </AspectRatioPrimitive.Root>
  );
}

export { AspectRatio };