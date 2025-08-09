import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function warnEnvMissing(key: string) {
  if (
    import.meta &&
    (import.meta as any).env &&
    !(import.meta as any).env[key]
  ) {
    // eslint-disable-next-line no-console
    console.warn(
      `[env] Missing ${key}. Set it in your .env (e.g., VITE_AUTH_BASE_URL).`
    );
  }
}
