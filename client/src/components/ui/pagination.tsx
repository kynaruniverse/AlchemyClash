import * as React from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MoreHorizontalIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";

// ----------------------------------------------------------------------
// Pagination Root (with theming)
// ----------------------------------------------------------------------

export interface PaginationProps extends React.ComponentProps<"nav"> {
  /** Visual variant of the pagination container */
  variant?: "default" | "alchemy" | "nature" | "magic";
  /** Add a decorative gold ribbon at the top */
  decorative?: boolean;
}

const paginationVariantStyles = {
  default: "bg-parchment/80 border-gold/30 text-ink shadow-sm",
  alchemy: "bg-gold/5 border-gold/50 text-ink shadow-md",
  nature: "bg-moss/5 border-moss/40 text-ink shadow-md",
  magic: "bg-violet-magic/5 border-violet-magic/40 text-ink shadow-md",
};

function Pagination({
  className,
  variant = "default",
  decorative = false,
  ...props
}: PaginationProps) {
  return (
    <nav
      role="navigation"
      aria-label="pagination"
      data-slot="pagination"
      className={cn(
        "relative mx-auto flex w-full justify-center rounded-md border p-2 transition-all duration-200",
        paginationVariantStyles[variant],
        decorative && "pt-6",
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
    </nav>
  );
}

// ----------------------------------------------------------------------
// PaginationContent (unchanged)
// ----------------------------------------------------------------------
function PaginationContent({
  className,
  ...props
}: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="pagination-content"
      className={cn("flex flex-row items-center gap-1", className)}
      {...props}
    />
  );
}

// ----------------------------------------------------------------------
// PaginationItem (unchanged)
// ----------------------------------------------------------------------
function PaginationItem({ ...props }: React.ComponentProps<"li">) {
  return <li data-slot="pagination-item" {...props} />;
}

// ----------------------------------------------------------------------
// PaginationLink (enhanced with gold active/hover)
// ----------------------------------------------------------------------
type PaginationLinkProps = {
  isActive?: boolean;
} & Pick<React.ComponentProps<typeof Button>, "size"> &
  React.ComponentProps<"a">;

function PaginationLink({
  className,
  isActive,
  size = "icon",
  ...props
}: PaginationLinkProps) {
  return (
    <a
      aria-current={isActive ? "page" : undefined}
      data-slot="pagination-link"
      data-active={isActive}
      className={cn(
        // Base button styles with custom overrides for active/hover
        "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/50",
        "disabled:pointer-events-none disabled:opacity-50",
        // Size variants (from buttonVariants)
        size === "icon" && "h-9 w-9",
        size === "default" && "h-9 px-4 py-2",
        // Theme
        isActive
          ? "bg-gold/20 text-ink border border-gold/60 shadow-sm hover:bg-gold/30"
          : "text-ink/70 hover:bg-gold/10 hover:text-ink",
        className
      )}
      {...props}
    />
  );
}

// ----------------------------------------------------------------------
// PaginationPrevious & PaginationNext (enhanced icons)
// ----------------------------------------------------------------------
function PaginationPrevious({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink
      aria-label="Go to previous page"
      size="default"
      className={cn("gap-1 px-2.5 sm:pl-2.5", className)}
      {...props}
    >
      <ChevronLeftIcon className="text-gold/70" />
      <span className="hidden sm:block">Previous</span>
    </PaginationLink>
  );
}

function PaginationNext({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink
      aria-label="Go to next page"
      size="default"
      className={cn("gap-1 px-2.5 sm:pr-2.5", className)}
      {...props}
    >
      <span className="hidden sm:block">Next</span>
      <ChevronRightIcon className="text-gold/70" />
    </PaginationLink>
  );
}

// ----------------------------------------------------------------------
// PaginationEllipsis (gold tint)
// ----------------------------------------------------------------------
function PaginationEllipsis({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      aria-hidden
      data-slot="pagination-ellipsis"
      className={cn("flex size-9 items-center justify-center", className)}
      {...props}
    >
      <MoreHorizontalIcon className="size-4 text-gold/50" />
      <span className="sr-only">More pages</span>
    </span>
  );
}

export {
  Pagination,
  PaginationContent,
  PaginationLink,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
};