"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  TrendingUp,
  Package,
  IndianRupee,
  Truck,
  Sparkles,
  Info,
  X,
  Link2,
  ShieldCheck,
  Clock,
  ChevronRight,
  Gift,
} from "lucide-react";
import AccountPagination from "@/components/account/AccountPagination";
import { clampPage, getTotalPages, paginateSlice } from "@/lib/paginationUtils";
import {
  STATIC_AFFILIATE_CONVERSIONS,
  AFFILIATE_REDEEM_THRESHOLD,
} from "@/lib/affiliateDashboardStaticData";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.04 },
  },
};

const item = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.36, ease: [0.22, 1, 0.36, 1] },
  },
};

const PAGE_SIZE = 5;

function formatDate(iso) {
  try {
    return new Intl.DateTimeFormat("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(iso));
  } catch {
    return "—";
  }
}

function deliveryLabel(key) {
  const map = {
    placed: "Placed",
    paid: "Paid",
    bill_sent: "Bill sent",
    ready: "Ready to ship",
    in_transit: "In transit",
    completed: "Delivered",
  };
  return map[key] || key.replace(/_/g, " ");
}

function deliveryBadgeClass(key) {
  const map = {
    completed: "bg-emerald-100 text-emerald-900 ring-emerald-200/80",
    in_transit: "bg-sky-100 text-sky-900 ring-sky-200/80",
    ready: "bg-violet-100 text-violet-900 ring-violet-200/80",
    bill_sent: "bg-amber-100 text-amber-950 ring-amber-200/80",
    paid: "bg-lime-100 text-lime-950 ring-lime-200/80",
    placed: "bg-sage-100 text-sage-900 ring-sage-200/80",
  };
  return map[key] || "bg-slate-100 text-slate-800 ring-slate-200/80";
}

function commissionStatusMeta(status) {
  if (status === "confirmed")
    return {
      label: "Confirmed",
      className: "bg-emerald-50 text-emerald-900 ring-emerald-200/70",
    };
  if (status === "held")
    return {
      label: "On hold",
      className: "bg-amber-50 text-amber-950 ring-amber-200/70",
    };
  return {
    label: "Pending",
    className: "bg-slate-50 text-slate-800 ring-slate-200/70",
  };
}

export default function AffiliateDashboardPage() {
  const [page, setPage] = useState(1);
  const [snackbarVisible, setSnackbarVisible] = useState(true);

  const rows = STATIC_AFFILIATE_CONVERSIONS;
  const totalPages = getTotalPages(rows.length, PAGE_SIZE);

  useEffect(() => {
    setPage((p) => clampPage(p, totalPages || 1));
  }, [totalPages]);

  const pagedRows = useMemo(
    () => paginateSlice(rows, page, PAGE_SIZE),
    [rows, page],
  );

  const totals = useMemo(() => {
    const units = rows.reduce((s, r) => s + r.quantity, 0);
    const commissionAll = rows.reduce((s, r) => s + r.commissionAmount, 0);
    const confirmed = rows
      .filter((r) => r.commissionStatus === "confirmed")
      .reduce((s, r) => s + r.commissionAmount, 0);
    const pending = rows
      .filter((r) => r.commissionStatus === "pending")
      .reduce((s, r) => s + r.commissionAmount, 0);
    return {
      orders: rows.length,
      units,
      commissionAll,
      confirmed,
      pending,
    };
  }, [rows]);

  const redeemProgress = Math.min(
    100,
    (totals.confirmed / AFFILIATE_REDEEM_THRESHOLD) * 100,
  );
  const canRedeem = totals.confirmed >= AFFILIATE_REDEEM_THRESHOLD;
  const amountToGo = Math.max(
    0,
    AFFILIATE_REDEEM_THRESHOLD - totals.confirmed,
  );

  const handlePageChange = useCallback((p) => {
    setPage(p);
    requestAnimationFrame(() => {
      document.getElementById("affiliate-dash-table")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  }, []);

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8 pb-24 md:pb-8"
    >
      <motion.header variants={item} className="space-y-3">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-sage-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-sage-800 ring-1 ring-sage-200/80">
              <LayoutDashboard className="h-3.5 w-3.5" aria-hidden />
              Performance
            </div>
            <h1 className="font-serif text-3xl font-semibold tracking-tight text-sage-950 sm:text-4xl">
              Affiliate dashboard
            </h1>
            <p className="max-w-2xl text-sm leading-relaxed text-sage-700/95 sm:text-base">
              Track every referred sale, fulfilment stage, and your commission
              per line. Figures below are sample data until your referral API is
              connected.
            </p>
          </div>
          <Link
            href="/account/affiliate"
            className="group inline-flex items-center gap-2 rounded-2xl border border-sage-200/90 bg-white px-4 py-2.5 text-sm font-semibold text-sage-900 shadow-sm ring-1 ring-sage-100/80 transition hover:border-sage-300 hover:bg-sage-50/80"
          >
            <Link2 className="h-4 w-4 text-sage-600" aria-hidden />
            Share links
            <ChevronRight className="h-4 w-4 text-sage-400 transition group-hover:translate-x-0.5" />
          </Link>
        </div>
      </motion.header>

      <motion.section
        variants={item}
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        {[
          {
            label: "Referred line items",
            value: totals.orders,
            sub: "Distinct conversions",
            icon: Package,
            accent: "from-sage-600 to-sage-800",
          },
          {
            label: "Units purchased",
            value: totals.units,
            sub: "Via your links",
            icon: TrendingUp,
            accent: "from-emerald-600 to-teal-800",
          },
          {
            label: "Confirmed commission",
            value: `₹${totals.confirmed.toLocaleString("en-IN")}`,
            sub: "Eligible toward payout",
            icon: IndianRupee,
            accent: "from-earth-700 to-sage-900",
          },
          {
            label: "All commissions (incl. pending)",
            value: `₹${totals.commissionAll.toLocaleString("en-IN")}`,
            sub: `Pending review: ₹${totals.pending.toLocaleString("en-IN")}`,
            icon: Sparkles,
            accent: "from-violet-600 to-indigo-800",
          },
        ].map((card) => (
          <div
            key={card.label}
            className="relative overflow-hidden rounded-2xl border border-white/90 bg-white/90 p-5 shadow-nature-md ring-1 ring-sage-100/60"
          >
            <div
              className={`pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-gradient-to-br ${card.accent} opacity-[0.12] blur-2xl`}
            />
            <div className="relative flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-sage-600/90">
                  {card.label}
                </p>
                <p className="mt-2 font-serif text-2xl font-semibold text-sage-950">
                  {card.value}
                </p>
                <p className="mt-1 text-xs text-sage-600">{card.sub}</p>
              </div>
              <span
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${card.accent} text-white shadow-md`}
              >
                <card.icon className="h-5 w-5" aria-hidden />
              </span>
            </div>
          </div>
        ))}
      </motion.section>

      <motion.section
        variants={item}
        className="rounded-2xl border border-sage-200/70 bg-gradient-to-br from-sage-50/90 via-white to-cream-50/80 p-5 shadow-inner ring-1 ring-white/80 sm:p-6"
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sage-800 text-white shadow-md">
              <Gift className="h-5 w-5" aria-hidden />
            </span>
            <div>
              <p className="font-semibold text-sage-950">Redemption threshold</p>
              <p className="mt-0.5 max-w-xl text-sm text-sage-700">
                Only{" "}
                <span className="font-semibold text-sage-900">
                  confirmed commission
                </span>{" "}
                counts toward the minimum payout. Pending lines clear after
                delivery and the return window.
              </p>
            </div>
          </div>
          <div className="w-full min-w-[200px] flex-1 sm:max-w-xs sm:flex-none">
            <div className="flex items-baseline justify-between text-xs font-semibold text-sage-800">
              <span>Progress to ₹{AFFILIATE_REDEEM_THRESHOLD}</span>
              <span>{Math.round(redeemProgress)}%</span>
            </div>
            <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-sage-200/80">
              <motion.div
                className={`h-full rounded-full ${
                  canRedeem
                    ? "bg-gradient-to-r from-emerald-500 to-teal-600"
                    : "bg-gradient-to-r from-sage-500 to-sage-700"
                }`}
                initial={{ width: 0 }}
                animate={{ width: `${redeemProgress}%` }}
                transition={{ type: "spring", stiffness: 90, damping: 22 }}
              />
            </div>
            <p className="mt-2 text-xs text-sage-600">
              {canRedeem
                ? "Threshold met — payout requests open when your program goes live."
                : `₹${amountToGo.toLocaleString("en-IN")} confirmed commission to go.`}
            </p>
          </div>
        </div>
      </motion.section>

      <motion.section
        variants={item}
        className="grid gap-4 md:grid-cols-3"
        aria-labelledby="affiliate-pro-tips"
      >
        <h2 id="affiliate-pro-tips" className="sr-only">
          How your affiliate program works
        </h2>
        {[
          {
            title: "Attribution",
            body: "Your friend should open your shared URL first. We recommend a 30-day last-click cookie once the backend is wired—industry standard for fair credit.",
            icon: Link2,
          },
          {
            title: "Commission lifecycle",
            body: "Pending → confirmed after delivery plus return window. Held may apply if the order is invoiced, refunded, or disputed.",
            icon: Clock,
          },
          {
            title: "Compliance",
            body: "Self-referrals, stacked coupons, and misleading claims can void earnings. Payouts may be taxable; keep invoices as per local rules.",
            icon: ShieldCheck,
          },
        ].map((tip) => (
          <div
            key={tip.title}
            className="flex gap-3 rounded-2xl border border-sage-100/90 bg-white/80 p-4 shadow-sm ring-1 ring-sage-50/80"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sage-100 text-sage-800">
              <tip.icon className="h-4 w-4" aria-hidden />
            </span>
            <div>
              <p className="font-semibold text-sage-900">{tip.title}</p>
              <p className="mt-1 text-xs leading-relaxed text-sage-600 sm:text-sm">
                {tip.body}
              </p>
            </div>
          </div>
        ))}
      </motion.section>

      <motion.section variants={item} className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2
              id="affiliate-dash-table"
              className="font-serif text-xl font-semibold text-sage-950 sm:text-2xl"
            >
              Referred purchases
            </h2>
            <p className="mt-1 text-sm text-sage-600">
              Buyer name, per-product quantity, delivery status, and your earnings
              for each referred line.
            </p>
          </div>
          <p className="inline-flex items-center gap-1.5 rounded-full bg-sage-100/90 px-3 py-1 text-xs font-medium text-sage-800 ring-1 ring-sage-200/60">
            <Info className="h-3.5 w-3.5 shrink-0" aria-hidden />
            Demo data — connect API for live sync
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-sage-200/60 bg-white/95 shadow-nature-md ring-1 ring-sage-50/80">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] text-left text-sm">
              <thead>
                <tr className="border-b border-sage-100 bg-sage-50/80 text-xs font-bold uppercase tracking-wider text-sage-700">
                  <th className="px-4 py-3.5">Order</th>
                  <th className="px-4 py-3.5">Date</th>
                  <th className="px-4 py-3.5">Purchased by</th>
                  <th className="px-4 py-3.5">Product</th>
                  <th className="px-4 py-3.5 text-center">Qty</th>
                  <th className="px-4 py-3.5">Delivery</th>
                  <th className="px-4 py-3.5 text-right">Rate</th>
                  <th className="px-4 py-3.5 text-right">You earn</th>
                  <th className="px-4 py-3.5">Payout status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sage-100/90">
                {pagedRows.map((r) => {
                  const cs = commissionStatusMeta(r.commissionStatus);
                  return (
                    <tr
                      key={r.id}
                      className="bg-white/50 transition hover:bg-sage-50/40"
                    >
                      <td className="whitespace-nowrap px-4 py-3.5 font-mono text-xs font-semibold text-sage-900">
                        {r.orderRef}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3.5 text-sage-700">
                        {formatDate(r.date)}
                      </td>
                      <td className="max-w-[160px] px-4 py-3.5 font-medium text-sage-900">
                        <span className="line-clamp-2">
                          {r.purchaserName?.trim() || "—"}
                        </span>
                      </td>
                      <td className="max-w-[220px] px-4 py-3.5 font-medium text-sage-900">
                        <span className="line-clamp-2">{r.productName}</span>
                      </td>
                      <td className="px-4 py-3.5 text-center tabular-nums text-sage-800">
                        {r.quantity}
                      </td>
                      <td className="px-4 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${deliveryBadgeClass(r.deliveryStatus)}`}
                        >
                          <Truck className="h-3 w-3 opacity-80" aria-hidden />
                          {deliveryLabel(r.deliveryStatus)}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-right tabular-nums text-sage-700">
                        {r.commissionRate}%
                      </td>
                      <td className="px-4 py-3.5 text-right font-semibold tabular-nums text-sage-950">
                        ₹{r.commissionAmount.toLocaleString("en-IN")}
                      </td>
                      <td className="px-4 py-3.5">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${cs.className}`}
                        >
                          {cs.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {totalPages > 1 && (
            <div className="border-t border-sage-100 bg-sage-50/40 px-4 py-4">
              <AccountPagination
                page={page}
                totalItems={rows.length}
                pageSize={PAGE_SIZE}
                onPageChange={handlePageChange}
                itemLabel="conversions"
              />
            </div>
          )}
        </div>
      </motion.section>

      <AnimatePresence>
        {snackbarVisible && (
          <motion.div
            role="status"
            initial={{ opacity: 0, y: 48, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 32, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 380, damping: 28 }}
            className="fixed bottom-4 left-4 right-4 z-[60] md:bottom-8 md:left-auto md:right-8 md:max-w-md"
          >
            <div className="relative overflow-hidden rounded-2xl border border-earth-200/80 bg-gradient-to-br from-earth-50 via-white to-amber-50/90 p-4 shadow-[0_16px_48px_-12px_rgba(67,20,7,0.35)] ring-1 ring-earth-100/90">
              <div
                className="pointer-events-none absolute -left-1/2 top-0 h-full w-1/2 skew-x-12 bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-80 animate-pulse-soft"
                aria-hidden
              />
              <div className="relative flex gap-3">
                <motion.span
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-earth-700 to-sage-900 text-white shadow-md"
                  animate={{ scale: [1, 1.06, 1] }}
                  transition={{
                    duration: 2.4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <IndianRupee className="h-5 w-5" aria-hidden />
                </motion.span>
                <div className="min-w-0 flex-1 pt-0.5">
                  <p className="text-sm font-bold text-earth-950">
                    Redeem from ₹{AFFILIATE_REDEEM_THRESHOLD} confirmed
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-earth-900/85">
                    You can request a payout only after your{" "}
                    <span className="font-semibold">confirmed commission</span>{" "}
                    balance reaches ₹{AFFILIATE_REDEEM_THRESHOLD}. Track progress
                    in the bar above.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSnackbarVisible(false)}
                  className="shrink-0 rounded-xl p-1.5 text-earth-700 transition hover:bg-earth-100/80 hover:text-earth-950"
                  aria-label="Dismiss notice"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
