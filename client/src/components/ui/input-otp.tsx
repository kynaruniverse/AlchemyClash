import * as React from "react";
import { OTPInput, OTPInputContext } from "input-otp";
import { MinusIcon } from "lucide-react";

import { cn } from "@/lib/utils";

// ----------------------------------------------------------------------
// Context for theming
// ----------------------------------------------------------------------

type InputOTPVariant = "default" | "alchemy" | "nature" | "magic";

const InputOTPContext = React.createContext<{
  variant: InputOTPVariant;
  decorative: boolean;
}>({
  variant: "default",
  decorative: false,
});

// ----------------------------------------------------------------------
// InputOTP Root
// ----------------------------------------------------------------------

export interface InputOTPProps
  extends React.ComponentProps<typeof OTPInput> {
  containerClassName?: string;
  /** Visual variant of the OTP input */
  variant?: InputOTPVariant;
  /** Add a decorative gold ribbon at the top of the container */
  decorative?: boolean;
}

const variantStyles = {
  default: "bg-parchment/80 border-gold/30 text-ink shadow-sm",
  alchemy: "bg-gold/5 border-gold/50 text-ink shadow-md",
  nature: "bg-moss/5 border-moss/40 text-ink shadow-md",
  magic: "bg-violet-magic/5 border-violet-magic/40 text-ink shadow-md",
};

function InputOTP({
  className,
  containerClassName,
  variant = "default",
  decorative = false,
  ...props
}: InputOTPProps) {
  return (
    <InputOTPContext.Provider value={{ variant, decorative }}>
      <OTPInput
        data-slot="input-otp"
        containerClassName={cn(
          "flex items-center gap-2 has-disabled:opacity-50",
          "relative rounded-lg border p-2 transition-all duration-200",
          variantStyles[variant],
          decorative && "pt-6", // space for ribbon
          containerClassName
        )}
        className={cn("disabled:cursor-not-allowed", className)}
        {...props}
      />
    </InputOTPContext.Provider>
  );
}

// ----------------------------------------------------------------------
// OTP Group (no changes)
// ----------------------------------------------------------------------

function InputOTPGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="input-otp-group"
      className={cn("flex items-center gap-1", className)}
      {...props}
    />
  );
}

// ----------------------------------------------------------------------
// OTP Slot (enhanced)
// ----------------------------------------------------------------------

function InputOTPSlot({
  index,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  index: number;
}) {
  const { variant, decorative } = React.useContext(InputOTPContext);
  const inputOTPContext = React.useContext(OTPInputContext);
  const { char, hasFakeCaret, isActive } = inputOTPContext?.slots[index] ?? {};

  const slotVariantStyles = {
    default: "border-gold/40 bg-parchment/50 text-ink",
    alchemy: "border-gold/60 bg-gold/10 text-ink",
    nature: "border-moss/60 bg-moss/10 text-ink",
    magic: "border-violet-magic/60 bg-violet-magic/10 text-ink",
  };

  return (
    <div
      data-slot="input-otp-slot"
      data-active={isActive}
      className={cn(
        // Base styles
        "relative flex h-9 w-9 items-center justify-center border-y border-r text-sm shadow-xs transition-all outline-none first:rounded-l-md first:border-l last:rounded-r-md",
        // Theme
        slotVariantStyles[variant],
        // Focus state (gold ring)
        "data-[active=true]:z-10 data-[active=true]:ring-[3px] data-[active=true]:ring-gold/50 data-[active=true]:border-gold",
        // Error state (clay)
        "aria-invalid:border-clay aria-invalid:ring-clay/20",
        // Typography
        "font-cinzel text-base",
        className
      )}
      {...props}
    >
      {char}
      {hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="animate-caret-blink bg-gold h-4 w-px duration-1000" />
        </div>
      )}
    </div>
  );
}

// ----------------------------------------------------------------------
// OTP Separator (gold tint)
// ----------------------------------------------------------------------

function InputOTPSeparator({ ...props }: React.ComponentProps<"div">) {
  const { variant } = React.useContext(InputOTPContext);
  const separatorColor = {
    default: "text-gold/50",
    alchemy: "text-gold/70",
    nature: "text-moss/60",
    magic: "text-violet-magic/60",
  }[variant];

  return (
    <div
      data-slot="input-otp-separator"
      role="separator"
      className={cn("flex items-center", separatorColor)}
      {...props}
    >
      <MinusIcon className="size-4" />
    </div>
  );
}

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator };