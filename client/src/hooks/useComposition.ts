import { useRef } from "react";
import { usePersistFn } from "./usePersistFn";

// ----------------------------------------------------------------------
// Types
// ----------------------------------------------------------------------

export interface UseCompositionReturn<
  T extends HTMLInputElement | HTMLTextAreaElement,
> {
  onCompositionStart: React.CompositionEventHandler<T>;
  onCompositionEnd: React.CompositionEventHandler<T>;
  onKeyDown: React.KeyboardEventHandler<T>;
  isComposing: () => boolean;
}

export interface UseCompositionOptions<
  T extends HTMLInputElement | HTMLTextAreaElement,
> {
  onKeyDown?: React.KeyboardEventHandler<T>;
  onCompositionStart?: React.CompositionEventHandler<T>;
  onCompositionEnd?: React.CompositionEventHandler<T>;
}

type TimerHandle = ReturnType<typeof setTimeout>;

// ----------------------------------------------------------------------
// Hook Implementation
// ----------------------------------------------------------------------

/**
 * Custom hook that provides composition event handlers for inputs.
 * Handles IME (Input Method Editor) composition events correctly,
 * including a special two‑timer fix for Safari.
 *
 * @param options - Optional original event handlers.
 * @returns An object containing composition event handlers and a function to check if composing.
 */
export function useComposition<
  T extends HTMLInputElement | HTMLTextAreaElement = HTMLInputElement,
>(options: UseCompositionOptions<T> = {}): UseCompositionReturn<T> {
  const {
    onKeyDown: originalOnKeyDown,
    onCompositionStart: originalOnCompositionStart,
    onCompositionEnd: originalOnCompositionEnd,
  } = options;

  const isComposingRef = useRef(false);
  const timer1 = useRef<TimerHandle | null>(null);
  const timer2 = useRef<TimerHandle | null>(null);

  const onCompositionStart = usePersistFn((e: React.CompositionEvent<T>) => {
    // Clear any pending timers to avoid stale state
    if (timer1.current) {
      clearTimeout(timer1.current);
      timer1.current = null;
    }
    if (timer2.current) {
      clearTimeout(timer2.current);
      timer2.current = null;
    }

    isComposingRef.current = true;
    originalOnCompositionStart?.(e);
  });

  const onCompositionEnd = usePersistFn((e: React.CompositionEvent<T>) => {
    // Two‑timer pattern to work around Safari's event order:
    // In Safari, `compositionEnd` fires before the following `keydown` event.
    // Delaying the reset ensures `isComposing()` stays `true` until the `keydown` has been processed.
    timer1.current = setTimeout(() => {
      timer2.current = setTimeout(() => {
        isComposingRef.current = false;
      });
    });

    originalOnCompositionEnd?.(e);
  });

  const onKeyDown = usePersistFn((e: React.KeyboardEvent<T>) => {
    // While composing, prevent default for Escape and Enter (without Shift)
    // to avoid interfering with the IME.
    if (
      isComposingRef.current &&
      (e.key === "Escape" || (e.key === "Enter" && !e.shiftKey))
    ) {
      e.stopPropagation();
      return;
    }

    originalOnKeyDown?.(e);
  });

  const isComposing = usePersistFn(() => isComposingRef.current);

  return {
    onCompositionStart,
    onCompositionEnd,
    onKeyDown,
    isComposing,
  };
}