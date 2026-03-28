import * as React from "react";
import { cn } from "@/lib/utils";

// ----------------------------------------------------------------------
// Theming
// ----------------------------------------------------------------------
export interface TableProps extends React.ComponentProps<"table"> {
  /** Visual variant of the table container */
  variant?: "default" | "alchemy" | "nature" | "magic";
  /** Add a decorative gold ribbon at the top of the container */
  decorative?: boolean;
}

const tableVariantStyles = {
  default: {
    container: "bg-parchment/80 border-gold/30 text-ink shadow-sm",
    head: "text-gold font-cinzel",
    row: "hover:bg-gold/10",
    footer: "bg-gold/5 border-gold/30",
    caption: "text-ink/60",
  },
  alchemy: {
    container: "bg-gold/5 border-gold/50 text-ink shadow-md",
    head: "text-gold font-cinzel",
    row: "hover:bg-gold/20",
    footer: "bg-gold/10 border-gold/50",
    caption: "text-gold/70",
  },
  nature: {
    container: "bg-moss/5 border-moss/40 text-ink shadow-md",
    head: "text-moss font-cinzel",
    row: "hover:bg-moss/20",
    footer: "bg-moss/10 border-moss/40",
    caption: "text-moss/70",
  },
  magic: {
    container: "bg-violet-magic/5 border-violet-magic/40 text-ink shadow-md",
    head: "text-violet-magic font-cinzel",
    row: "hover:bg-violet-magic/20",
    footer: "bg-violet-magic/10 border-violet-magic/40",
    caption: "text-violet-magic/70",
  },
};

function Table({
  className,
  variant = "default",
  decorative = false,
  ...props
}: TableProps) {
  const styles = tableVariantStyles[variant];

  return (
    <div
      data-slot="table-container"
      className={cn(
        "relative w-full overflow-x-auto rounded-md border transition-all duration-200",
        styles.container,
        decorative && "pt-6",
        className
      )}
    >
      {/* Decorative gold ribbon */}
      {decorative && (
        <>
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-16 h-1 bg-gold/60 rounded-full" />
          <div className="absolute top-0 left-4 w-8 h-[2px] bg-gold/30" />
          <div className="absolute top-0 right-4 w-8 h-[2px] bg-gold/30" />
        </>
      )}
      <table
        data-slot="table"
        className={cn("w-full caption-bottom text-sm", className)}
        {...props}
      />
    </div>
  );
}

function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return (
    <thead
      data-slot="table-header"
      className={cn("[&_tr]:border-b border-gold/20", className)}
      {...props}
    />
  );
}

function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return (
    <tbody
      data-slot="table-body"
      className={cn("[&_tr:last-child]:border-0", className)}
      {...props}
    />
  );
}

function TableFooter({ className, ...props }: React.ComponentProps<"tfoot">) {
  // Footer styling can be themed via parent context, but we'll pass through variant via a context if needed.
  // For simplicity, we'll add a default gold-tinted footer.
  return (
    <tfoot
      data-slot="table-footer"
      className={cn(
        "border-t font-medium [&>tr]:last:border-b-0",
        "bg-gold/5 border-gold/30",
        className
      )}
      {...props}
    />
  );
}

function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
  // Row hover will be themed via the parent Table's variant. We'll add a default gold hover.
  return (
    <tr
      data-slot="table-row"
      className={cn(
        "border-b border-gold/20 transition-colors duration-150",
        "hover:bg-gold/10",
        className
      )}
      {...props}
    />
  );
}

function TableHead({ className, ...props }: React.ComponentProps<"th">) {
  return (
    <th
      data-slot="table-head"
      className={cn(
        "h-10 px-2 text-left align-middle font-medium whitespace-nowrap",
        "font-cinzel text-gold",
        "[&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        className
      )}
      {...props}
    />
  );
}

function TableCell({ className, ...props }: React.ComponentProps<"td">) {
  return (
    <td
      data-slot="table-cell"
      className={cn(
        "p-2 align-middle whitespace-nowrap text-ink/80",
        "[&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        className
      )}
      {...props}
    />
  );
}

function TableCaption({
  className,
  ...props
}: React.ComponentProps<"caption">) {
  return (
    <caption
      data-slot="table-caption"
      className={cn("mt-4 text-sm font-lora text-ink/60", className)}
      {...props}
    />
  );
}

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
};