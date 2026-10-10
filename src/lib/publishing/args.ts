export function readArg(argv: string[], name: string): string | undefined {
  const prefix = `--${name}=`;
  const hit = argv.find((item) => item.startsWith(prefix));
  return hit?.slice(prefix.length);
}

export function requireBatchSize(argv: string[]): number {
  const raw = readArg(argv, "batch-size");

  if (!raw) {
    throw new Error("Pass --batch-size. Refusing to publish without an explicit limit.");
  }

  const size = Number(raw);

  if (!Number.isInteger(size) || size < 1 || size > 500) {
    throw new Error("--batch-size must be an integer from 1 to 500.");
  }

  return size;
}

export function requireLimit(argv: string[], fallback = 1000): number {
  const raw = readArg(argv, "limit") ?? String(fallback);
  const limit = Number(raw);

  if (!Number.isInteger(limit) || limit < 1 || limit > 5000) {
    throw new Error("--limit must be an integer from 1 to 5000.");
  }

  return limit;
}
