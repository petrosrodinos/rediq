import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const REDDIT_BASE_URL = "https://reddit.com";

export function getRedditUrl(permalink: string): string {
  if (/^https?:\/\//i.test(permalink)) {
    return permalink;
  }
  return `${REDDIT_BASE_URL}${permalink}`;
}
