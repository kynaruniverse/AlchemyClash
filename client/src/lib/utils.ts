import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges Tailwind CSS classes using clsx and tailwind-merge.
 * This utility resolves conflicting classes and returns a single string.
 *
 * @param inputs - A list of class values (strings, objects, arrays, etc.).
 * @returns A merged class string.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}