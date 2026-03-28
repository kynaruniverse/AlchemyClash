import { cn } from "@/lib/utils";

export interface SkeletonProps extends React.ComponentProps<"div"> {
  /** Visual variant of the skeleton */
  variant?: "default" | "alchemy" | "nature" | "magic";
}

const skeletonVariantStyles = {
  default: "bg-gold/20",
  alchemy: "bg-gold/30",
  nature: "bg-moss/20",
  magic: "bg-violet-magic/20",
};

function Skeleton({
  className,
  variant = "default",
  ...props
}: SkeletonProps) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        "animate-pulse rounded-md",
        skeletonVariantStyles[variant],
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };