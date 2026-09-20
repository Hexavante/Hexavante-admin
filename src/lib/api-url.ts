/**
 * Centralized API URL configuration
 * Use this file to get the API URL throughout the application
 */

// Server-side API URL (for use in Server Components, API routes, middleware)
export const SERVER_API_URL =
  process.env.AUTH_API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  (process.env.NODE_ENV === "production"
    ? "https://api.hexavante.com.br"
    : "http://localhost:3045");

// Client-side API URL (for use in Client Components)
export const CLIENT_API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  (typeof window !== "undefined"
    ? (window as { __API_URL__?: string }).__API_URL__
    : undefined) ||
  SERVER_API_URL;

// Legacy export for backward compatibility
export const API_URL = CLIENT_API_URL;

// Helper to get API URL based on context
export function getApiUrl(): string {
  if (typeof window === "undefined") {
    // Server-side
    return SERVER_API_URL;
  }
  // Client-side
  return CLIENT_API_URL;
}

// Helper for fetch requests
export async function apiFetch(
  path: string,
  options: RequestInit = {}
): Promise<Response> {
  const url = `${getApiUrl()}${path}`;
  return fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
}
