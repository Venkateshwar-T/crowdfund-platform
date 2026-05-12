
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function shortenAddress(address: string) {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function formatCurrency(val: number) {
  if (val >= 1000) return `$${(val / 1000).toFixed(1)}k`;
  return `$${val}`;
}

export function sanitizeTitle(title: string) {
  return title.trim().replace(/\s+/g, ' ');
}

/**
 * Formats raw USD amounts from the blockchain for the UI.
 * Handles the "slippage surplus" by snapping to the target if it's within a 1% margin.
 */
export function formatCampaignUsd(amount: number, target?: number) {
  if (target) {
    const diff = amount - target;
    // If we're over the target by less than 1%, snap it down for a clean UI
    if (diff > 0 && diff < (target * 0.01)) {
      return target.toFixed(2);
    }
  }
  return amount.toFixed(2);
}