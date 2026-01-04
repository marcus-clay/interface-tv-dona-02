import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Fusionne les classes Tailwind proprement (gère les conflits)
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

export function getAssetUrl(path: string): string {
  // En prod, ce serait l'URL TMDB. Ici on retourne le mock ou un placeholder.
  return path; 
}