"use client";

import "./globals.css";
import { AlertTriangle, RefreshCw } from "lucide-react";

/**
 * Catches errors in the root layout itself. Must define html/body (Next.js).
 */
export default function GlobalError({ error, reset }) {
  const isDev = process.env.NODE_ENV === "development";

  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-b from-[#f7f9f7] to-[#fefcf8] antialiased">
        <div className="flex min-h-screen flex-col items-center justify-center px-4 py-16">
          <div className="w-full max-w-md rounded-2xl border border-[#e8e4dc] bg-white p-8 shadow-lg">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-red-50">
              <AlertTriangle className="h-7 w-7 text-red-800" aria-hidden />
            </div>
            <h1 className="mt-5 text-center font-serif text-xl font-bold text-[#3e2723] sm:text-2xl">
              Application error
            </h1>
            <p className="mt-2 text-center text-sm text-[#5c6d64] leading-relaxed">
              A serious error occurred. Please refresh the page or try again in
              a few minutes.
            </p>
            {isDev && error?.message && (
              <pre className="mt-4 max-h-32 overflow-auto rounded-lg bg-neutral-100 p-3 text-left text-xs text-neutral-700">
                {error.message}
              </pre>
            )}
            <button
              type="button"
              onClick={() => reset()}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-red-900 py-3.5 text-sm font-bold text-white hover:bg-red-800"
            >
              <RefreshCw className="h-4 w-4" aria-hidden />
              Try again
            </button>
            <a
              href="/"
              className="mt-3 block w-full rounded-xl border border-[#1b4332]/25 py-3 text-center text-sm font-semibold text-[#1b4332] hover:bg-[#f7f9f7]"
            >
              Go to home
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
