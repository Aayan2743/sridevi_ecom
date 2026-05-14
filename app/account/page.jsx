"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/lib/api";
import {
  Package,
  Heart,
  CalendarDays,
  ArrowRight,
  Sparkles,
  Leaf,
} from "lucide-react";

const STATIC_SUMMARY = {
  totalOrders: 8,
  wishlistCount: 4,
  memberSince: "2024-01-15T00:00:00.000Z",
};

const STATIC_USER_DISPLAY = {
  name: "Wellness member",
  email: "care@herbalwellness.in",
  phone: "+91 98765 43210",
};

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.07, delayChildren: 0.05 },
  },
};

const item = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.38, ease: [0.22, 1, 0.36, 1] },
  },
};

function mergeSummary(apiData) {
  if (!apiData || typeof apiData !== "object") return { ...STATIC_SUMMARY };
  return {
    totalOrders:
      typeof apiData.totalOrders === "number"
        ? apiData.totalOrders
        : STATIC_SUMMARY.totalOrders,
    wishlistCount:
      typeof apiData.wishlistCount === "number"
        ? apiData.wishlistCount
        : STATIC_SUMMARY.wishlistCount,
    memberSince:
      apiData.memberSince ||
      apiData.created_at ||
      STATIC_SUMMARY.memberSince,
  };
}

export default function AccountPage() {
  const { user } = useAuth();
  const [summary, setSummary] = useState(STATIC_SUMMARY);

  useEffect(() => {
    let cancelled = false;
    const fetchSummary = async () => {
      try {
        const res = await api.get("/cart/account/summary");
        const raw = res?.data?.data ?? res?.data;
        if (!cancelled) setSummary(mergeSummary(raw));
      } catch {
        if (!cancelled) setSummary({ ...STATIC_SUMMARY });
      }
    };
    fetchSummary();
    return () => {
      cancelled = true;
    };
  }, []);

  if (!user) return null;

  const displayName =
    user.name?.trim() || STATIC_USER_DISPLAY.name;
  const displayEmail =
    user.email?.trim() || STATIC_USER_DISPLAY.email;
  const displayPhone =
    user.phone?.trim() || STATIC_USER_DISPLAY.phone;

  const initials = displayName
    .split(/\s+/)
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "U";

  const memberLabel = summary.memberSince
    ? new Date(summary.memberSince).toLocaleDateString("en-IN", {
        month: "short",
        year: "numeric",
      })
    : new Date(STATIC_SUMMARY.memberSince).toLocaleDateString("en-IN", {
        month: "short",
        year: "numeric",
      });

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      <motion.header variants={item} className="space-y-2">
        <div className="inline-flex items-center gap-2 rounded-full border border-sage-200/80 bg-sage-50/80 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-sage-800">
          <Sparkles className="h-3.5 w-3.5 text-earth-600" aria-hidden />
          Dashboard
        </div>
        <h1 className="font-serif text-3xl font-bold tracking-tight text-sage-950 sm:text-4xl">
          My account
        </h1>
        <p className="max-w-xl text-sm leading-relaxed text-sage-700/90">
          Track orders, curate your wishlist, and keep your profile aligned with
          your herbal wellness journey.
        </p>
      </motion.header>

      {/* Profile */}
      <motion.section
        variants={item}
        className="relative overflow-hidden rounded-3xl border border-sage-200/60 bg-gradient-to-br from-white via-cream-50/50 to-sage-50/40 p-6 shadow-nature-md sm:p-8"
      >
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-sage-200/30 blur-2xl" />
        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center">
          <motion.div
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            className="relative"
          >
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-sage-400 to-sage-700 opacity-60 blur-md" />
            <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-sage-600 to-sage-800 text-xl font-bold text-white ring-4 ring-white shadow-nature-md sm:h-24 sm:w-24 sm:text-2xl">
              {initials}
            </div>
          </motion.div>
          <div className="min-w-0 flex-1 space-y-1">
            <p className="font-serif text-2xl font-semibold text-sage-950">
              {displayName}
            </p>
            <p className="text-sm text-sage-700/90">{displayEmail}</p>
            <p className="flex items-center gap-2 text-sm text-sage-700/90">
              <span className="inline-flex items-center gap-1 rounded-full bg-sage-100/90 px-2 py-0.5 text-xs font-medium text-sage-800">
                <Leaf className="h-3 w-3" aria-hidden />
                {displayPhone}
              </span>
            </p>
          </div>
        </div>
      </motion.section>

      {/* Stats */}
      <motion.section
        variants={item}
        className="grid grid-cols-1 gap-4 sm:grid-cols-3"
      >
        {[
          {
            label: "Total orders",
            value: summary.totalOrders,
            icon: Package,
            hint: "Delivered & in progress",
          },
          {
            label: "Wishlist",
            value: summary.wishlistCount,
            icon: Heart,
            hint: "Saved for later",
          },
          {
            label: "Member since",
            value: memberLabel,
            icon: CalendarDays,
            hint: "With us",
            isText: true,
          },
        ].map((card, i) => (
          <motion.div
            key={card.label}
            variants={item}
            custom={i}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="group relative overflow-hidden rounded-2xl border border-sage-200/50 bg-white/90 p-5 shadow-sm ring-1 ring-transparent transition-all hover:shadow-nature-md hover:ring-sage-200/60"
          >
            <div className="absolute right-4 top-4 rounded-xl bg-sage-50 p-2 text-sage-600 transition-colors group-hover:bg-sage-100">
              <card.icon className="h-5 w-5" aria-hidden />
            </div>
            <p className="text-xs font-semibold uppercase tracking-wide text-sage-600/90">
              {card.label}
            </p>
            <p
              className={`mt-2 font-semibold tracking-tight text-sage-900 ${
                card.isText ? "text-2xl" : "text-3xl"
              }`}
            >
              {card.value}
            </p>
            <p className="mt-2 text-xs text-sage-600/80">{card.hint}</p>
          </motion.div>
        ))}
      </motion.section>

      {/* Quick actions */}
      <motion.section variants={item} className="grid gap-4 md:grid-cols-2">
        <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.2 }}>
          <Link
            href="/account/orders"
            className="group block h-full rounded-3xl border border-sage-200/60 bg-gradient-to-br from-sage-50/90 via-white to-earth-50/50 p-6 shadow-sm transition-shadow hover:shadow-nature-md"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-serif text-xl font-semibold text-sage-900">
                  Manage orders
                </p>
                <p className="mt-2 text-sm leading-relaxed text-sage-700/85">
                  View status, invoices, and delivery timelines in one calm
                  place.
                </p>
              </div>
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-sage-700 text-white">
                <Package className="h-5 w-5" aria-hidden />
              </span>
            </div>
            <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-sage-800">
              Go to orders
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </Link>
        </motion.div>

        <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.2 }}>
          <Link
            href="/account/wishlist"
            className="group block h-full rounded-3xl border border-earth-200/70 bg-gradient-to-br from-earth-50/90 via-white to-cream-50/60 p-6 shadow-sm transition-shadow hover:shadow-nature-md"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-serif text-xl font-semibold text-sage-900">
                  Wishlist
                </p>
                <p className="mt-2 text-sm leading-relaxed text-sage-700/85">
                  Herbs and rituals you love—ready whenever you are.
                </p>
              </div>
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-earth-600 text-white">
                <Heart className="h-5 w-5" aria-hidden />
              </span>
            </div>
            <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-earth-900">
              View wishlist
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </Link>
        </motion.div>
      </motion.section>
    </motion.div>
  );
}
