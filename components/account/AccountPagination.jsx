"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  buildPageList,
  clampPage,
  getTotalPages,
  rangeLabel,
} from "@/lib/paginationUtils";

export default function AccountPagination({
  page,
  pageSize,
  totalItems,
  onPageChange,
  itemLabel = "items",
  className,
}) {
  const totalPages = useMemo(
    () => getTotalPages(totalItems, pageSize),
    [totalItems, pageSize],
  );

  const safePage = useMemo(
    () => clampPage(page, totalPages || 1),
    [page, totalPages],
  );

  const { start, end } = useMemo(
    () => rangeLabel(safePage, pageSize, totalItems),
    [safePage, pageSize, totalItems],
  );

  const pageNumbers = useMemo(
    () => (totalPages > 0 ? buildPageList(safePage, totalPages) : []),
    [safePage, totalPages],
  );

  if (totalItems <= 0) return null;

  if (totalPages <= 1) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className={cn(
          "flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-sage-200/60 bg-sage-50/40 px-4 py-3 text-sm text-sage-700",
          className,
        )}
      >
        <span className="font-medium text-sage-800">
          Showing all {totalItems}{" "}
          <span className="text-sage-600">{itemLabel}</span>
        </span>
        <span className="text-xs font-semibold uppercase tracking-wide text-sage-500">
          Page 1 of 1
        </span>
      </motion.div>
    );
  }

  const go = (p) => {
    const next = clampPage(p, totalPages);
    if (next !== page) onPageChange(next);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "flex flex-col gap-3 rounded-2xl border border-sage-200/60 bg-gradient-to-r from-white via-cream-50/30 to-sage-50/40 px-3 py-3 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:px-4 sm:py-3.5",
        className,
      )}
      role="navigation"
      aria-label="Pagination"
    >
      <p className="text-center text-sm text-sage-700 sm:text-left">
        <span className="font-semibold text-sage-900">
          {start}–{end}
        </span>
        <span className="text-sage-600"> of {totalItems} </span>
        <span className="text-sage-600">{itemLabel}</span>
      </p>

      <div className="flex flex-wrap items-center justify-center gap-1.5 sm:justify-end">
        <motion.button
          type="button"
          whileTap={{ scale: 0.96 }}
          disabled={safePage <= 1}
          onClick={() => go(safePage - 1)}
          aria-label="Previous page"
          className={cn(
            "inline-flex h-10 items-center gap-1 rounded-xl border border-sage-200/90 bg-white px-3 text-sm font-semibold text-sage-800 shadow-sm transition hover:border-sage-300 hover:bg-sage-50",
            safePage <= 1 && "pointer-events-none opacity-40",
          )}
        >
          <ChevronLeft className="h-4 w-4 shrink-0" aria-hidden />
          <span className="hidden sm:inline">Prev</span>
        </motion.button>

        <ul className="flex items-center gap-1">
          {pageNumbers.map((entry, idx) =>
            entry === "ellipsis" ? (
              <li key={`e-${idx}`} className="flex items-center px-0.5">
                <span
                  className="flex h-10 w-9 items-center justify-center text-sage-400"
                  aria-hidden
                >
                  <MoreHorizontal className="h-4 w-4" />
                </span>
              </li>
            ) : (
              <li key={entry}>
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => go(entry)}
                  aria-label={`Page ${entry}`}
                  aria-current={entry === safePage ? "page" : undefined}
                  className={cn(
                    "flex h-10 min-w-[2.5rem] items-center justify-center rounded-xl border text-sm font-bold transition",
                    entry === safePage
                      ? "border-sage-800 bg-sage-800 text-white shadow-md shadow-sage-900/20"
                      : "border-transparent bg-white/80 text-sage-800 hover:border-sage-200 hover:bg-sage-50",
                  )}
                >
                  {entry}
                </motion.button>
              </li>
            ),
          )}
        </ul>

        <motion.button
          type="button"
          whileTap={{ scale: 0.96 }}
          disabled={safePage >= totalPages}
          onClick={() => go(safePage + 1)}
          aria-label="Next page"
          className={cn(
            "inline-flex h-10 items-center gap-1 rounded-xl border border-sage-200/90 bg-white px-3 text-sm font-semibold text-sage-800 shadow-sm transition hover:border-sage-300 hover:bg-sage-50",
            safePage >= totalPages && "pointer-events-none opacity-40",
          )}
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="h-4 w-4 shrink-0" aria-hidden />
        </motion.button>
      </div>
    </motion.div>
  );
}
