export function wordCount(value: string): number {
  return value.split(/\s+/).filter(Boolean).length;
}

export function similarityScore(left: string, right: string): number {
  const leftShingles = shingles(left);
  const rightShingles = shingles(right);

  if (leftShingles.length === 0 || rightShingles.length === 0) {
    return normalize(left) === normalize(right) && normalize(left).length > 0 ? 1 : 0;
  }

  const rightSet = new Set(rightShingles);
  let shared = 0;

  for (const item of new Set(leftShingles)) {
    if (rightSet.has(item)) {
      shared += 1;
    }
  }

  const union = new Set([...leftShingles, ...rightShingles]).size;
  return union === 0 ? 0 : shared / union;
}

function shingles(value: string): string[] {
  const words = normalize(value)
    .split(" ")
    .filter((word) => word.length > 2);
  const items: string[] = [];

  for (let index = 0; index <= words.length - 3; index += 1) {
    items.push(words.slice(index, index + 3).join(" "));
  }

  return items;
}

function normalize(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
