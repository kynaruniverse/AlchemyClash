import { useRef } from "react";

// ----------------------------------------------------------------------
// Types
// ----------------------------------------------------------------------

type AnyFunction = (...args: any[]) => any;

// ----------------------------------------------------------------------
// Hook Implementation
// ----------------------------------------------------------------------

/**
 * usePersistFn – returns a stable function reference that always calls the
 * latest version of the provided function. This is useful for passing
 * functions to child components that rely on referential stability,
 * while still having access to the most up‑to‑date closure values.
 *
 * @param fn - The function to persist.
 * @returns A stable function reference that delegates to the latest `fn`.
 */
export function usePersistFn<T extends AnyFunction>(fn: T): T {
  const fnRef = useRef<T>(fn);
  fnRef.current = fn;

  // Create the stable function only once, reusing the same reference.
  const stableFn = useRef<T | null>(null);
  if (!stableFn.current) {
    stableFn.current = function (this: unknown, ...args): ReturnType<T> {
      return fnRef.current!.apply(this, args);
    } as T;
  }

  return stableFn.current!;
}