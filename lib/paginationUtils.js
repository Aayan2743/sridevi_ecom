/** Total pages for a list (minimum 1 when there is at least one item). */
export function getTotalPages(totalItems, pageSize) {
  if (totalItems <= 0) return 0;
  return Math.max(1, Math.ceil(totalItems / pageSize));
}

/** 1-based page clamped to [1, totalPages]. */
export function clampPage(page, totalPages) {
  if (totalPages < 1) return 1;
  return Math.min(Math.max(1, page), totalPages);
}

/** Slice for current page (page is 1-based). */
export function paginateSlice(items, page, pageSize) {
  if (!Array.isArray(items) || pageSize < 1) return [];
  if (items.length === 0) return [];
  const tp = getTotalPages(items.length, pageSize);
  const safe = clampPage(page, tp);
  const start = (safe - 1) * pageSize;
  return items.slice(start, start + pageSize);
}

/**
 * Compact page list with ellipses, e.g. [1, "ellipsis", 4, 5, 6, "ellipsis", 10]
 * @param {number} current - 1-based
 * @param {number} totalPages
 * @returns {(number | "ellipsis")[]}
 */
export function buildPageList(current, totalPages) {
  if (totalPages <= 0) return [];
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  const set = new Set([
    1,
    totalPages,
    current,
    current - 1,
    current + 1,
  ]);
  for (const n of [...set]) {
    if (n < 1 || n > totalPages) set.delete(n);
  }
  const sorted = [...set].sort((a, b) => a - b);
  /** @type {(number | "ellipsis")[]} */
  const out = [];
  let prev = 0;
  for (const n of sorted) {
    if (prev && n - prev > 1) out.push("ellipsis");
    out.push(n);
    prev = n;
  }
  return out;
}

export function rangeLabel(page, pageSize, totalItems) {
  if (totalItems <= 0) return { start: 0, end: 0 };
  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, totalItems);
  return { start, end };
}
