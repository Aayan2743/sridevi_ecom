"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  LayoutDashboard,
  TrendingUp,
  Package,
  IndianRupee,
  Truck,
  ChevronRight,
  Wallet,
  Loader2,
  RefreshCw,
} from "lucide-react";
import AccountPagination from "@/components/account/AccountPagination";
import { clampPage, getTotalPages } from "@/lib/paginationUtils";
import api from "@/lib/api";
import { useRouter } from "next/navigation";

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

const PAGE_SIZE = 10;

function deliveryLabel(key) {
  const map = {
    pending: "Pending",
    placed: "Placed",
    paid: "Paid",
    bill_sent: "Bill sent",
    ready: "Ready to ship",
    in_transit: "In Transit",
    completed: "Delivered",
    delivered: "Delivered",
    cancelled: "Cancelled",
  };

  return map[key] || key || "—";
}

function deliveryBadgeClass(key) {
  const map = {
    pending: "bg-yellow-100 text-yellow-900 ring-yellow-200/80",
    paid: "bg-lime-100 text-lime-950 ring-lime-200/80",
    completed: "bg-emerald-100 text-emerald-900 ring-emerald-200/80",
    delivered: "bg-emerald-100 text-emerald-900 ring-emerald-200/80",
    cancelled: "bg-red-100 text-red-900 ring-red-200/80",
    in_transit: "bg-sky-100 text-sky-900 ring-sky-200/80",
    ready: "bg-violet-100 text-violet-900 ring-violet-200/80",
    bill_sent: "bg-amber-100 text-amber-950 ring-amber-200/80",
  };
  return map[key] || "bg-slate-100 text-slate-800 ring-slate-200/80";
}

export default function AffiliateDashboardPage() {
  const [loading, setLoading] = useState(true);

  const [showAffiliateButton, setShowAffiliateButton] = useState(false);

  const router = useRouter();
  const [stats, setStats] = useState({
    total_orders: 0,
    units_sold: 0,
    total_commission: 0,
    credited_to_wallet: 0,
  });
  const [purchases, setPurchases] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [error, setError] = useState(null);

  const fetchDashboard = useCallback(
    async (pageNum = 1) => {
      try {
        setLoading(true);
        setError(null);

        const res = await api.get("/user-dashboard/affiliate/dashboard", {
          params: {
            page: pageNum,
            per_page: PAGE_SIZE,
          },
        });

        if (res.data?.success) {
          setStats(
            res.data.stats || {
              total_orders: 0,
              units_sold: 0,
              total_commission: 0,
              credited_to_wallet: 0,
            },
          );

          setPurchases(res.data.purchases || []);
          setPagination(res.data.pagination || null);
        }
      } catch (err) {
        if (err.response?.status === 404) {
          toast.error(
            err.response?.data?.message || "Affiliate account not found",
          );

          setShowAffiliateButton(true);
          return;
        }

        setError("Failed to load dashboard data");
        toast.error("Failed to load affiliate dashboard");
      } finally {
        setLoading(false);
      }
    },
    [router],
  );

  useEffect(() => {
    fetchDashboard(page);
  }, [page, fetchDashboard]);

  const totalPages = pagination
    ? Number(pagination.last_page)
    : getTotalPages(purchases.length, PAGE_SIZE);

  useEffect(() => {
    setPage((p) => clampPage(p, totalPages || 1));
  }, [totalPages]);

  const handlePageChange = useCallback((p) => {
    setPage(p);
    requestAnimationFrame(() => {
      document.getElementById("affiliate-dash-table")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  }, []);

  const handleRetry = () => {
    fetchDashboard(page);
  };

  /* Show loading state */
  if (loading && purchases.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center space-y-3">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-sage-600" />
          <p className="text-sm text-sage-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  /* Show error state */
  if (error && purchases.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center space-y-4 max-w-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-500">
            <RefreshCw className="h-8 w-8" />
          </div>
          <p className="text-sm text-red-700">{error}</p>
          <button
            type="button"
            onClick={handleRetry}
            className="inline-flex items-center gap-2 rounded-xl bg-sage-800 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-sage-900"
          >
            <RefreshCw className="h-4 w-4" />
            Retry
          </button>
        </div>
      </div>
    );
  }
  if (showAffiliateButton) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="max-w-md rounded-2xl border border-yellow-300 bg-yellow-50 p-8 text-center shadow">
          <h2 className="text-2xl font-bold text-gray-900">
            Affiliate Account Not Found
          </h2>

          <p className="mt-3 text-gray-600">
            Please register as an affiliate to access your dashboard.
          </p>

          <button
            onClick={() => router.push("/account/affiliate")}
            className="mt-6 rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
          >
            Go to Affiliate Page
          </button>
        </div>
      </div>
    );
  }
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8 pb-24 md:pb-8"
    >
      {/* Header */}
      <motion.header
        variants={item}
        className="flex flex-wrap items-start justify-between gap-4"
      >
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full bg-sage-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-sage-800 ring-1 ring-sage-200/80">
            <LayoutDashboard className="h-3.5 w-3.5" aria-hidden />
            Purchases
          </div>
          <h1 className="font-serif text-3xl font-semibold tracking-tight text-sage-950 sm:text-4xl">
            My Referred Purchases
          </h1>
          <p className="max-w-2xl text-sm leading-relaxed text-sage-700/95 sm:text-base">
            Products purchased through your referral links. When a product is
            delivered, the commission is automatically added to your wallet.
          </p>
        </div>
        <Link
          href="/account/affiliate-dashboard/wallet"
          className="group inline-flex items-center gap-2 rounded-2xl border border-emerald-300 bg-emerald-50 px-5 py-3 text-sm font-semibold text-emerald-800 shadow-sm transition hover:bg-emerald-100 hover:border-emerald-400"
        >
          <Wallet className="h-4 w-4" aria-hidden />
          Go to Wallet
          <ChevronRight className="h-4 w-4 text-emerald-400 transition group-hover:translate-x-0.5" />
        </Link>
      </motion.header>

      {/* Summary Cards */}
      <motion.section
        variants={item}
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        {[
          {
            label: "Total Orders",
            value: stats.total_orders,
            sub: "Referred purchases",
            icon: Package,
            accent: "from-sage-600 to-sage-800",
          },
          {
            label: "Units Sold",
            value: stats.units_sold,
            sub: "Via your links",
            icon: TrendingUp,
            accent: "from-emerald-600 to-teal-800",
          },
          {
            label: "Total Commission",
            value: `₹${Number(stats.total_commission).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`,
            sub: "All referred orders",
            icon: IndianRupee,
            accent: "from-earth-700 to-sage-900",
          },
          {
            label: "Credited to Wallet",
            value: `₹${Number(stats.credited_to_wallet).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`,
            sub: "From delivered orders",
            icon: Wallet,
            accent: "from-emerald-700 to-green-900",
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

      {/* Info Banner */}
      <motion.div
        variants={item}
        className="rounded-2xl border border-emerald-200/70 bg-emerald-50/70 px-5 py-4 text-sm text-emerald-800"
      >
        <p>
          💡 <strong>How it works:</strong> When an order status becomes{" "}
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-900 ring-1 ring-emerald-200/80">
            <Truck className="h-3 w-3" /> Delivered
          </span>
          , the commission amount is automatically credited to your wallet. You
          can then withdraw it once your wallet balance reaches the minimum
          threshold.
        </p>
      </motion.div>

      {/* Purchases Table */}
      <motion.section variants={item} className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2
              id="affiliate-dash-table"
              className="font-serif text-xl font-semibold text-sage-950 sm:text-2xl"
            >
              Purchases
            </h2>
            <p className="mt-1 text-sm text-sage-600">
              Each order placed through your referral link with its current
              delivery status.
            </p>
          </div>
          {loading && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-sage-100/90 px-3 py-1 text-xs font-medium text-sage-600">
              <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin" />
              Refreshing...
            </span>
          )}
        </div>

        {purchases.length === 0 ? (
          <div className="rounded-2xl border border-sage-200/60 bg-white/95 p-10 text-center shadow-nature-md">
            <Package className="mx-auto h-10 w-10 text-sage-300" />
            <p className="mt-3 text-sm font-medium text-sage-600">
              No purchases yet
            </p>
            <p className="mt-1 text-xs text-sage-500">
              Share your referral link to start earning commissions.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-sage-200/60 bg-white/95 shadow-nature-md ring-1 ring-sage-50/80">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] text-left text-sm">
                <thead>
                  <tr className="border-b border-sage-100 bg-sage-50/80 text-xs font-bold uppercase tracking-wider text-sage-700">
                    <th className="px-4 py-3.5">Order #</th>
                    <th className="px-4 py-3.5">Date</th>
                    <th className="px-4 py-3.5">Customer</th>
                    <th className="px-4 py-3.5">Product</th>
                    <th className="px-4 py-3.5 text-center">Qty</th>
                    <th className="px-4 py-3.5 text-right">Rate</th>
                    <th className="px-4 py-3.5 text-right">Commission</th>
                    <th className="px-4 py-3.5">Delivery Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sage-100/90">
                  {purchases.map((r) => (
                    <tr
                      key={r.id}
                      className="bg-white/50 transition hover:bg-sage-50/40"
                    >
                      <td className="whitespace-nowrap px-4 py-3.5 font-mono text-xs font-semibold text-sage-900">
                        #{r.order_no}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3.5 text-sage-700">
                        {r.date || "—"}
                      </td>
                      <td className="max-w-[140px] px-4 py-3.5 font-medium text-sage-900">
                        <span className="line-clamp-2">
                          {r.customer || "—"}
                        </span>
                      </td>
                      <td className="max-w-[220px] px-4 py-3.5 font-medium text-sage-900">
                        <span className="line-clamp-2">{r.product || "-"}</span>
                      </td>
                      <td className="px-4 py-3.5 text-center tabular-nums text-sage-800">
                        {r.qty}
                      </td>
                      <td className="px-4 py-3.5 text-right tabular-nums text-sage-700">
                        {r.rate}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3.5 text-right font-semibold tabular-nums text-sage-950">
                        ₹
                        {Number(r.commission || 0).toLocaleString("en-IN", {
                          minimumFractionDigits: 2,
                        })}
                      </td>
                      <td className="px-4 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${deliveryBadgeClass(r.delivery_status)}`}
                        >
                          <Truck className="h-3 w-3 opacity-80" aria-hidden />
                          {deliveryLabel(r.delivery_status)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {totalPages > 1 && (
              <div className="border-t border-sage-100 bg-sage-50/40 px-4 py-4">
                <AccountPagination
                  page={page}
                  totalItems={pagination?.total || purchases.length}
                  pageSize={PAGE_SIZE}
                  onPageChange={handlePageChange}
                  itemLabel="purchases"
                />
              </div>
            )}
          </div>
        )}
      </motion.section>
    </motion.div>
  );
}
