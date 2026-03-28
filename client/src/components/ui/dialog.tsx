import { cn } from "@/lib/utils";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { XIcon } from "lucide-react";
import * as React from "react";

// ----------------------------------------------------------------------
// Composition context (unchanged – needed for IME handling)
// ----------------------------------------------------------------------
const DialogCompositionContext = React.createContext < {
  isComposing: () => boolean;
  setComposing: (composing: boolean) => void;
  justEndedComposing: () => boolean;
  markCompositionEnd: () => void;
} > ({
  isComposing: () => false,
  setComposing: () => {},
  justEndedComposing: () => false,
  markCompositionEnd: () => {},
});

export const useDialogComposition = () =>
  React.useContext(DialogCompositionContext);

// ----------------------------------------------------------------------
// Root Dialog
// ----------------------------------------------------------------------
function Dialog({
  ...props
}: React.ComponentProps < typeof DialogPrimitive.Root > ) {
  const composingRef = React.useRef(false);
  const justEndedRef = React.useRef(false);
  const endTimerRef = React.useRef < ReturnType < typeof setTimeout > | null > (null);
  
  const contextValue = React.useMemo(
    () => ({
      isComposing: () => composingRef.current,
      setComposing: (composing: boolean) => {
        composingRef.current = composing;
      },
      justEndedComposing: () => justEndedRef.current,
      markCompositionEnd: () => {
        justEndedRef.current = true;
        if (endTimerRef.current) {
          clearTimeout(endTimerRef.current);
        }
        endTimerRef.current = setTimeout(() => {
          justEndedRef.current = false;
        }, 150);
      },
    }),
    []
  );
  
  return (
    <DialogCompositionContext.Provider value={contextValue}>
      <DialogPrimitive.Root data-slot="dialog" {...props} />
    </DialogCompositionContext.Provider>
  );
}

// ----------------------------------------------------------------------
// Trigger, Portal, Close (unchanged)
// ----------------------------------------------------------------------
function DialogTrigger({
  ...props
}: React.ComponentProps < typeof DialogPrimitive.Trigger > ) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />;
}

function DialogPortal({
  ...props
}: React.ComponentProps < typeof DialogPrimitive.Portal > ) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />;
}

function DialogClose({
  ...props
}: React.ComponentProps < typeof DialogPrimitive.Close > ) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />;
}

// ----------------------------------------------------------------------
// Overlay
// ----------------------------------------------------------------------
function DialogOverlay({
  className,
  ...props
}: React.ComponentProps < typeof DialogPrimitive.Overlay > ) {
  return (
    <DialogPrimitive.Overlay
      data-slot="dialog-overlay"
      className={cn(
        "fixed inset-0 z-50 bg-ink/50 backdrop-blur-sm",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        className
      )}
      {...props}
    />
  );
}

DialogOverlay.displayName = "DialogOverlay";

// ----------------------------------------------------------------------
// Content (with theming)
// ----------------------------------------------------------------------
export interface DialogContentProps
extends React.ComponentProps < typeof DialogPrimitive.Content > {
  showCloseButton ? : boolean;
  /** Visual variant of the dialog */
  variant ? : "default" | "alchemy" | "nature" | "magic";
  /** Add a decorative gold ribbon at the top */
  decorative ? : boolean;
}

const variantStyles = {
  default: "bg-parchment/95 border-gold/30 text-ink shadow-2xl",
  alchemy: "bg-gold/5 border-gold/50 text-ink shadow-2xl",
  nature: "bg-moss/5 border-moss/40 text-ink shadow-2xl",
  magic: "bg-violet-magic/5 border-violet-magic/40 text-ink shadow-2xl",
};

function DialogContent({
  className,
  children,
  showCloseButton = true,
  onEscapeKeyDown,
  variant = "default",
  decorative = false,
  ...props
}: DialogContentProps) {
  const { isComposing } = useDialogComposition();
  
  const handleEscapeKeyDown = React.useCallback(
    (e: KeyboardEvent) => {
      // Check both the native isComposing property and our context state
      const isCurrentlyComposing = (e as any).isComposing || isComposing();
      
      // If IME is composing, prevent dialog from closing
      if (isCurrentlyComposing) {
        e.preventDefault();
        return;
      }
      
      // Call user's onEscapeKeyDown if provided
      onEscapeKeyDown?.(e);
    },
    [isComposing, onEscapeKeyDown]
  );
  
  return (
    <DialogPortal data-slot="dialog-portal">
      <DialogOverlay />
      <DialogPrimitive.Content
        data-slot="dialog-content"
        className={cn(
          // Base layout and animations
          "fixed top-[50%] left-[50%] z-50 w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-xl border p-6 shadow-2xl duration-200 sm:max-w-lg",
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
          "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
          // Theme
          variantStyles[variant],
          decorative && "pt-8", // space for decorative ribbon
          className
        )}
        onEscapeKeyDown={handleEscapeKeyDown}
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

        {children}

        {showCloseButton && (
          <DialogPrimitive.Close
            data-slot="dialog-close"
            className={cn(
              "absolute top-4 right-4 rounded-full p-1 transition-all duration-200",
              "text-gold/60 hover:text-gold hover:bg-gold/10",
              "focus:outline-none focus:ring-2 focus:ring-gold/50 focus:ring-offset-2 focus:ring-offset-parchment",
              "data-[state=open]:bg-gold/20"
            )}
          >
            <XIcon className="size-4" />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPortal>
  );
}

// ----------------------------------------------------------------------
// Header, Footer, Title, Description
// ----------------------------------------------------------------------
function DialogHeader({ className, ...props }: React.ComponentProps < "div" > ) {
  return (
    <div
      data-slot="dialog-header"
      className={cn(
        "flex flex-col gap-1 text-center sm:text-left border-b border-gold/20 pb-3",
        className
      )}
      {...props}
    />
  );
}

function DialogFooter({ className, ...props }: React.ComponentProps < "div" > ) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end pt-3",
        className
      )}
      {...props}
    />
  );
}

function DialogTitle({
  className,
  ...props
}: React.ComponentProps < typeof DialogPrimitive.Title > ) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn(
        "text-lg leading-none font-semibold font-cinzel tracking-wide text-ink",
        className
      )}
      {...props}
    />
  );
}

function DialogDescription({
  className,
  ...props
}: React.ComponentProps < typeof DialogPrimitive.Description > ) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn(
        "text-sm font-lora text-ink/80 leading-relaxed",
        className
      )}
      {...props}
    />
  );
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
};