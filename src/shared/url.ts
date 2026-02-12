export function buildAppUrl(path: string): string {
  const base = (import.meta.env.BASE_URL as string | undefined) ?? "/";
  const baseUrl = new URL(base, window.location.origin);
  const normalized = path.startsWith("/") ? path.slice(1) : path;
  return new URL(normalized, baseUrl).toString();
}
