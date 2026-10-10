export function sliceCursorPage<T extends { id: string }>(rows: T[], take: number) {
  const size = Math.max(1, take);
  const hasMore = rows.length > size;
  const items = hasMore ? rows.slice(0, size) : rows;
  const last = items[items.length - 1];

  return {
    items,
    nextCursor: hasMore && last ? last.id : null,
  };
}
