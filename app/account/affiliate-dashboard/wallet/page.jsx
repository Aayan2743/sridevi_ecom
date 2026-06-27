"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  Wallet,
  ArrowDownToLine,
  ArrowLeft,
  Smartphone,
  Loader2,
  CheckCircle2,
  X,
  History,
  IndianRupee,
  TrendingUp,
  TrendingDown,
  HelpCircle,
} from "lucide-react";
import {
  STATIC_WALLET_TRANSACTIONS,
  AFFILIATE_REDEEM_THRESHOLD,
} from "@/lib/affiliateDashboardStaticData";
import api from "@/lib/api";

/* animation configs */
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

function formatDateTime(iso) {
  try {
    return new Intl.DateTimeFormat("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(iso));
  } catch {
    return "—";
  }
}

/* ===================== Withdraw Modal ===================== */
function WithdrawModal({ open, onClose, walletBalance, threshold, upiId }) {
  const [localUpiId, setLocalUpiId] = useState(upiId || "");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const canWithdraw = walletBalance >= threshold;

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!localUpiId.trim()) {
      setError("Please enter your UPI ID");
      return;
    }

    if (!/^[\w.\-_]+@[\w]+$/.test(localUpiId.trim())) {
      setError("Please enter a valid UPI ID (e.g. yourname@upi)");
      return;
    }

    try {
      setSubmitting(true);

      const res = await api.post("/user-dashboard/affiliate/redeem", {
        upi_id: localUpiId.trim(),
        amount: walletBalance,
      });

      if (res.data?.success) {
        toast.success(
          res.data?.message || "Withdrawal request submitted successfully",
        );

        onClose();

        // Refresh wallet data
        window.location.reload();
      } else {
        toast.error(res.data?.message || "Failed to submit withdrawal request");
      }
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to submit withdrawal request",
      );
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    setLocalUpiId(upiId || "");
  }, [upiId]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-md rounded-3xl border border-sage-200 bg-white p-6 shadow-2xl sm:p-8"
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-sage-500 transition hover:bg-sage-100 hover:text-sage-800"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-600 to-green-800 text-white shadow-md">
                <ArrowDownToLine className="h-6 w-6" />
              </div>
              <div>
                <h2 className="font-serif text-xl font-bold text-sage-950">
                  Withdraw Funds
                </h2>
                <p className="text-sm text-sage-600">
                  Transfer your balance via UPI
                </p>
              </div>
            </div>

            {!canWithdraw ? (
              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-center">
                <p className="text-sm font-semibold text-amber-800">
                  Minimum ₹{threshold.toLocaleString("en-IN")} required
                </p>
                <p className="mt-2 text-sm text-amber-700">
                  Your balance is ₹{walletBalance.toLocaleString("en-IN")}. Need
                  ₹
                  {Math.max(0, threshold - walletBalance).toLocaleString(
                    "en-IN",
                  )}{" "}
                  more.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                  <p className="text-xs font-semibold uppercase text-emerald-700">
                    Amount
                  </p>
                  <p className="mt-1 font-serif text-3xl font-bold text-emerald-900">
                    ₹{walletBalance.toLocaleString("en-IN")}
                  </p>
                </div>

                <div>
                  <label className="mb-1.5 flex items-center gap-2 text-sm font-semibold text-sage-800">
                    <Smartphone className="h-4 w-4" />
                    Your UPI ID
                  </label>
                  <input
                    type="text"
                    placeholder="yourname@upi"
                    value={localUpiId}
                    onChange={(e) => {
                      setLocalUpiId(e.target.value);
                      if (error) setError("");
                    }}
                    className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition ${
                      error
                        ? "border-red-300 bg-red-50 text-red-900"
                        : "border-sage-200 bg-sage-50/50 text-sage-900 focus:border-sage-400 focus:bg-white"
                    }`}
                  />
                  {error && (
                    <p className="mt-1 text-xs text-red-600">{error}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-700 to-green-800 py-3.5 text-sm font-semibold text-white shadow-nature transition hover:from-emerald-800 hover:to-green-900 disabled:opacity-60"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <ArrowDownToLine className="h-4 w-4" />
                      Withdraw ₹{walletBalance.toLocaleString("en-IN")}
                    </>
                  )}
                </button>
              </form>
            )}

            <p className="mt-4 text-center text-xs text-sage-500">
              Reviewed by admin · Usually processed in 3-5 business days
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ===================== Main Wallet Page ===================== */
export default function AffiliateWalletPage() {
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [withdrawUpiId, setWithdrawUpiId] = useState("");
  const [showAffilityButton, setshowAffilityButton] = useState(false);

  useEffect(() => {
    fetchWallet();
  }, []);

  const fetchWallet = async () => {
    try {
      setLoading(true);

      const res = await api.get("/user-dashboard/affiliate/wallet");

      if (res.data?.success) {
        setWallet(res.data.wallet);
        setWithdrawUpiId(res.data.wallet?.upi_id || "");
        setTransactions(res.data.transactions || []);
      }
    } catch (error) {
      if (error.response?.status === 404) {
        toast.error(
          error.response?.data?.message || "Affiliate account not found",
        );

        setshowAffilityButton(true);
        return;
      }

      console.error(error);
      toast.error("Failed to load wallet");
    } finally {
      setLoading(false);
    }
  };

  const walletBalance = Number(wallet?.available_balance || 0);

  const totalCredits = Number(wallet?.total_earned || 0);

  const totalDebits = Number(wallet?.total_withdrawn || 0);

  const pendingWithdrawal = Number(wallet?.pending_withdrawal || 0);

  const canWithdraw = walletBalance >= AFFILIATE_REDEEM_THRESHOLD;

  if (showAffilityButton) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="max-w-md rounded-2xl border border-yellow-300 bg-yellow-50 p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900">
            Affiliate Account Not Found
          </h2>

          <p className="mt-3 text-gray-600">
            Please create your affiliate account to access the wallet.
          </p>

          <Link
            href="/account/affiliate"
            className="mt-6 inline-flex rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
          >
            Go to Affiliate Page
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <WithdrawModal
        open={withdrawOpen}
        onClose={() => setWithdrawOpen(false)}
        walletBalance={walletBalance}
        threshold={AFFILIATE_REDEEM_THRESHOLD}
        upiId={withdrawUpiId}
      />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-8 pb-24 md:pb-8"
      >
        {/* Back + Header */}
        <motion.div variants={item} className="space-y-4">
          <Link
            href="/account/affiliate-dashboard"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-sage-600 transition hover:text-sage-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Purchases
          </Link>

          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-800 ring-1 ring-emerald-200/80">
                <Wallet className="h-3.5 w-3.5" aria-hidden />
                Wallet
              </div>
              <h1 className="font-serif text-3xl font-semibold tracking-tight text-sage-950 sm:text-4xl">
                Affiliate Wallet
              </h1>
              <p className="max-w-2xl text-sm leading-relaxed text-sage-700/95 sm:text-base">
                Your commission earnings are credited here when orders are
                delivered. Withdraw when your balance reaches ₹
                {AFFILIATE_REDEEM_THRESHOLD.toLocaleString("en-IN")}.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Wallet Balance Card */}
        <motion.section variants={item}>
          <div className="rounded-2xl border border-emerald-200/70 bg-gradient-to-br from-emerald-50 via-white to-green-50/60 p-6 shadow-nature-md sm:p-8">
            <div className="flex flex-col items-center text-center sm:flex-row sm:text-left sm:justify-between gap-6">
              <div className="flex items-start gap-4">
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-600 to-green-800 text-white shadow-md">
                  <Wallet className="h-7 w-7" aria-hidden />
                </span>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                    Available Balance
                  </p>
                  <p className="mt-1 font-serif text-4xl font-bold text-sage-950">
                    ₹{walletBalance.toLocaleString("en-IN")}
                  </p>
                  <div className="mt-2 space-y-1 text-sm text-sage-600">
                    <p>
                      <span className="font-medium text-emerald-700">
                        ₹{totalCredits.toLocaleString("en-IN")}
                      </span>{" "}
                      Earned
                    </p>

                    <p>
                      <span className="font-medium text-amber-600">
                        ₹{pendingWithdrawal.toLocaleString("en-IN")}
                      </span>{" "}
                      Pending Withdrawal
                    </p>

                    <p>
                      <span className="font-medium text-red-600">
                        ₹{totalDebits.toLocaleString("en-IN")}
                      </span>{" "}
                      Withdrawn
                    </p>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setWithdrawOpen(true)}
                disabled={!canWithdraw}
                className={`inline-flex items-center gap-2 rounded-2xl px-6 py-3 text-sm font-semibold shadow-nature transition shrink-0 ${
                  canWithdraw
                    ? "bg-gradient-to-r from-emerald-700 to-green-800 text-white hover:from-emerald-800 hover:to-green-900"
                    : "cursor-not-allowed bg-sage-200 text-sage-500"
                }`}
              >
                {canWithdraw ? (
                  <>
                    <ArrowDownToLine className="h-4 w-4" />
                    Withdraw Now
                  </>
                ) : (
                  <>
                    <ArrowDownToLine className="h-4 w-4" />
                    Min ₹{AFFILIATE_REDEEM_THRESHOLD.toLocaleString("en-IN")} to
                    Withdraw
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.section>

        {/* Explanation */}
        <motion.div
          variants={item}
          className="flex items-start gap-3 rounded-2xl border border-sage-200/70 bg-sage-50/60 p-5"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sage-100 text-sage-700">
            <HelpCircle className="h-5 w-5" aria-hidden />
          </span>
          <div className="text-sm text-sage-700">
            <p className="font-semibold text-sage-900">How it works</p>
            <p className="mt-1">
              📦 When a product you referred is{" "}
              <span className="font-semibold">Delivered</span>, the commission
              is credited to your wallet.
            </p>
            <p className="mt-0.5">
              💰 Once your wallet reaches ₹
              {AFFILIATE_REDEEM_THRESHOLD.toLocaleString("en-IN")}, you can
              withdraw it to your UPI ID.
            </p>
            <p className="mt-0.5">
              ⏳ Admin reviews withdrawal requests and pays within 3-5 business
              days.
            </p>
          </div>
        </motion.div>

        {/* Transaction History */}
        <motion.section variants={item} className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sage-100 text-sage-700">
              <History className="h-5 w-5" aria-hidden />
            </span>
            <div>
              <h2 className="font-serif text-xl font-semibold text-sage-950 sm:text-2xl">
                Transaction History
              </h2>
              <p className="mt-0.5 text-sm text-sage-600">
                All credits (earnings) and debits (withdrawals)
              </p>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-sage-200/60 bg-white/95 shadow-nature-md ring-1 ring-sage-50/80">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px] text-left text-sm">
                <thead>
                  <tr className="border-b border-sage-100 bg-sage-50/80 text-xs font-bold uppercase tracking-wider text-sage-700">
                    <th className="px-4 py-3.5">Date</th>
                    <th className="px-4 py-3.5">Type</th>
                    <th className="px-4 py-3.5">Description</th>
                    <th className="px-4 py-3.5 text-right">Amount</th>
                    <th className="px-4 py-3.5">Status / Ref</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sage-100/90">
                  {transactions.map((tx) => (
                    <tr
                      key={tx.id}
                      className="bg-white/50 transition hover:bg-sage-50/40"
                    >
                      <td className="whitespace-nowrap px-4 py-3.5 text-sage-700">
                        {formatDateTime(tx.date)}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3.5">
                        {tx.type === "credit" ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-800 ring-1 ring-emerald-200/70">
                            <TrendingUp className="h-3 w-3" />
                            Credit
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-800 ring-1 ring-amber-200/70">
                            <TrendingDown className="h-3 w-3" />
                            Debit
                          </span>
                        )}
                      </td>
                      <td className="max-w-[240px] px-4 py-3.5 text-sage-800">
                        <span className="line-clamp-2">{tx.description}</span>
                      </td>
                      <td
                        className={`whitespace-nowrap px-4 py-3.5 text-right font-semibold tabular-nums ${
                          tx.type === "credit"
                            ? "text-emerald-700"
                            : "text-red-600"
                        }`}
                      >
                        {tx.type === "credit" ? "+" : "-"}₹
                        {Number(tx.amount).toLocaleString("en-IN")}
                      </td>
                      <td className="px-4 py-3.5">
                        {tx.type === "debit" ? (
                          tx.status === "paid" ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-800 ring-1 ring-emerald-200/70">
                              <CheckCircle2 className="h-3 w-3" />
                              {tx.transactionRef || "Paid"}
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-800 ring-1 ring-amber-200/70">
                              Pending
                            </span>
                          )
                        ) : (
                          <span className="text-xs text-sage-500">
                            {tx.reference}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.section>
      </motion.div>
    </>
  );
}
