export function generateDescription(value: string, limit = 160): string {
  const normalized = value.replace(/\s+/g, " ").trim();

  if (normalized.length <= limit) {
    return normalized;
  }

  const cut = normalized.slice(0, limit - 1);
  const lastSpace = cut.lastIndexOf(" ");
  return cut.slice(0, lastSpace > 80 ? lastSpace : limit - 1).trimEnd();
}
