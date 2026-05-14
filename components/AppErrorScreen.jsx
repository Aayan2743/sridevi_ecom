"use client";

import Link from "next/link";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";

/**
 * Full-page fallback when a route segment throws (used by app/error.jsx).
 * Keep copy calm and actions obvious (retry + home).
 */
export default function AppErrorScreen({ error, reset }) {
  const digest = error?.digest;
  const isDev = process.env.NODE_ENV === "development";

  return (
    <div className="min-h-[calc(100vh-8rem)] flex flex-col items-center justify-center px-4 py-16 sm:py-24">
      <div className="w-full max-w-lg rounded-2xl border border-[#e8e4dc] bg-white p-8 shadow-[0_24px_60px_-24px_rgba(27,67,50,0.15)] sm:p-10">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 ring-1 ring-red-100">
          <AlertTriangle
            className="h-8 w-8 text-red-800"
            aria-hidden
          />
        </div>
        <h1 className="mt-6 text-center font-serif text-2xl font-bold tracking-tight text-[#3e2723] sm:text-3xl">
          Something went wrong
        </h1>
        <p className="mt-3 text-center text-[#5c6d64] leading-relaxed">
          We hit an unexpected problem loading this page. You can try again, or
          return to the shop. If the issue continues, please check back later.
        </p>
        {isDev && error?.message && (
          <details className="mt-6 rounded-xl border border-amber-200/80 bg-amber-50/80 p-4 text-left">
            <summary className="cursor-pointer text-sm font-semibold text-[#7c2d12]">
              Technical details (dev only)
            </summary>
            <pre className="mt-3 max-h-40 overflow-auto whitespace-pre-wrap break-words text-xs text-[#5c4d40]">
              {error.message}
              {digest ? `\n\ndigest: ${digest}` : ""}
            </pre>
          </details>
        )}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-900 px-6 py-3.5 text-sm font-bold text-white shadow-[0_14px_36px_-8px_rgba(107,28,35,0.4)] transition hover:bg-red-800"
          >
            <RefreshCw className="h-4 w-4" aria-hidden />
            Try again
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-[#1b4332]/20 bg-[#f7f9f7] px-6 py-3.5 text-sm font-bold text-[#1b4332] transition hover:border-[#1b4332]/40 hover:bg-[#eef5ee]"
          >
            <Home className="h-4 w-4" aria-hidden />
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
