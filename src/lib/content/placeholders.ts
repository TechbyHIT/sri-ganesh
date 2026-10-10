const patterns = [
  /\[[A-Z][A-Z0-9_ ]{2,}\]/,
  /\blorem ipsum\b/i,
  /\bTODO\b/,
  /\bfake review\b/i,
  /\bxxxx+\b/i,
];

export function findPlaceholders(value: string): string[] {
  return patterns.flatMap((pattern) => {
    const match = value.match(pattern);
    return match ? [match[0]] : [];
  });
}

export function hasPlaceholder(value: string): boolean {
  return findPlaceholders(value).length > 0;
}
