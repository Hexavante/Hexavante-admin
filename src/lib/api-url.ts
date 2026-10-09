/** O Web chama somente Route Handlers same origin. */
export function getApiUrl(): string { return ""; }
export async function apiFetch(path: string, options: RequestInit = {}): Promise<Response> {
  if (!path.startsWith("/")) throw new Error("O caminho local deve começar com /");
  return fetch(path, { ...options, headers: { "Content-Type": "application/json", ...options.headers } });
}
