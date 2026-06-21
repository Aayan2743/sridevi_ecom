"use client";

import { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  Sparkles,
  TrendingUp,
  Copy,
  Search,
  Percent,
  Package,
  Tag,
  ArrowRight,
  Share2,
  Gift,
  Zap,
  Loader2,
} from "lucide-react";
import { AFFILIATE_SHOWCASE_PRODUCTS } from "@/lib/affiliateShowcaseProducts";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/lib/api";

/* ──────────────── Framer variants ──────────────── */
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.04 },
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

/* ──────────────── Commission Tier Badge ──────────────── */
function CommissionBadge({ commission }) {
  const rate = parseInt(commission, 10) || 0;

  const tier = rate >= 12 ? "premium" : rate >= 10 ? "plus" : "standard";

  const styles = {
    premium:
      "bg-gradient-to-r from-amber-100 to-amber-200 text-amber-900 ring-1 ring-amber-300/70",
    plus: "bg-gradient-to-r from-sage-100 to-emerald-100 text-sage-800 ring-1 ring-sage-300/70",
    standard:
      "bg-gradient-to-r from-blue-50 to-blue-100 text-blue-800 ring-1 ring-blue-200/70",
  };

  const icons = {
    premium: Zap,
    plus: TrendingUp,
    standard: Percent,
  };

  const Icon = icons[tier];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${styles[tier]}`}
    >
      <Icon className="h-3 w-3" aria-hidden />
      {commission}
    </span>
  );
}

/* ──────────────── Product Card ──────────────── */
function ProductCard({ product, index, affiliateCode }) {
  const [imgError, setImgError] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");

  const referralLink = useMemo(() => {
    if (typeof window === "undefined") return "";
    const base = `${window.location.origin}/product/details?slug=${product.slug}`;
    return affiliateCode ? `${base}&ref=${affiliateCode}` : base;
  }, [product.slug, affiliateCode]);

  const handleCopyLink = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(referralLink);
    toast.success("Referral link copied");
  };

  return (
    <motion.div
      variants={item}
      initial="rest"
      whileHover="hover"
      animate="rest"
      className="group relative overflow-hidden rounded-2xl border border-sage-200/70 bg-white transition-colors hover:border-sage-300/80"
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-sage-50">
        {!imgError ? (
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-sage-100 to-earth-50">
            <Package className="h-12 w-12 text-sage-400" aria-hidden />
          </div>
        )}

        {/* Commission overlay */}
        <div className="absolute left-3 top-3">
          <CommissionBadge commission={product.commission} />
        </div>

        {/* Quick copy overlay on hover */}
        <div className="absolute inset-0 flex items-end justify-center bg-gradient-to-t from-sage-950/60 via-transparent to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <button
            type="button"
            onClick={handleCopyLink}
            className="flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-xs font-semibold text-sage-900 shadow-lg backdrop-blur-sm transition hover:bg-white"
          >
            <Copy className="h-3.5 w-3.5" />
            Copy referral link
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="mb-1 flex items-center gap-2">
          <Tag className="h-3.5 w-3.5 text-sage-500" aria-hidden />
          <span className="text-xs font-medium uppercase tracking-wide text-sage-500">
            {product.tagline}
          </span>
        </div>

        <h3 className="font-serif text-lg font-semibold text-sage-950">
          {product.name}
        </h3>

        <div className="mt-3 flex items-center justify-between border-t border-sage-100 pt-3">
          <div className="flex items-center gap-1.5 text-xs text-sage-600">
            <Share2 className="h-3.5 w-3.5" />
            <span>Earn {product.commission}</span>
          </div>

          <a
            href={`/product/details?slug=${product.slug}`}
            className="inline-flex items-center gap-1 rounded-full bg-sage-50 px-3 py-1.5 text-xs font-semibold text-sage-700 transition hover:bg-sage-100 hover:text-sage-900"
          >
            View
            <ArrowRight className="h-3 w-3" />
          </a>
        </div>
      </div>
    </motion.div>
  );
}

/* ──────────────── Stats Row ──────────────── */
function StatsRow() {
  const stats = [
    {
      icon: Gift,
      label: "Total Products",
      value: AFFILIATE_SHOWCASE_PRODUCTS.length,
      color: "from-sage-100 to-emerald-50 text-sage-800",
    },
    {
      icon: TrendingUp,
      label: "Avg. Commission",
      value: "10.8%",
      color: "from-amber-100 to-orange-50 text-amber-800",
    },
    {
      icon: Zap,
      label: "Top Rate",
      value: "Up to 15%",
      color: "from-rose-100 to-pink-50 text-rose-800",
    },
    {
      icon: Package,
      label: "Categories",
      value: "6",
      color: "from-blue-100 to-indigo-50 text-blue-800",
    },
  ];

  return (
    <motion.div
      variants={item}
      className="grid grid-cols-2 gap-3 sm:grid-cols-4"
    >
      {stats.map((s) => {
        const Icon = s.icon;
        return (
          <div
            key={s.label}
            className="rounded-2xl border border-sage-200/70 bg-white p-4 shadow-nature-sm"
          >
            <div
              className={`mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br ${s.color}`}
            >
              <Icon className="h-4 w-4" aria-hidden />
            </div>
            <p className="text-lg font-bold text-sage-950">{s.value}</p>
            <p className="text-xs text-sage-500">{s.label}</p>
          </div>
        );
      })}
    </motion.div>
  );
}

/* ──────────────── Search & Filter ──────────────── */
function SearchBar({ value, onChange }) {
  return (
    <motion.div variants={item} className="relative">
      <Search
        className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-sage-400"
        aria-hidden
      />
      <input
        type="text"
        placeholder="Search affiliate products..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-2xl border border-sage-200/70 bg-white py-3 pl-11 pr-4 text-sm text-sage-900 outline-none transition placeholder:text-sage-400 focus:border-sage-400 focus:ring-2 focus:ring-sage-100"
      />
    </motion.div>
  );
}

/* ──────────────── Main Page ──────────────── */
export default function AffiliateProductsPage() {
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [affiliateCode, setAffiliateCode] = useState("");
  const [loadingAffiliate, setLoadingAffiliate] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Fetch affiliate code from API (same pattern as main affiliate page)
  useEffect(() => {
    const fetchAffiliateCode = async () => {
      try {
        setLoadingAffiliate(true);
        const res = await api.get("/user-dashboard/get-affiliates");
        // res.data.data contains { code, status, ... }
        if (res.data?.data?.code) {
          setAffiliateCode(res.data.data.code);
        }
      } catch {
        // Not registered as affiliate — use user ID as fallback
        if (user?.id) {
          setAffiliateCode(`ref_${user.id}`);
        }
      } finally {
        setLoadingAffiliate(false);
      }
    };

    fetchAffiliateCode();
  }, [user]);

  const categories = [
    "all",
    ...new Set(AFFILIATE_SHOWCASE_PRODUCTS.map((p) => p.category)),
  ];

  const filteredProducts = useMemo(() => {
    const q = search.toLowerCase();

    return AFFILIATE_SHOWCASE_PRODUCTS.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(q) || p.tagline.toLowerCase().includes(q);

      const matchesCategory =
        selectedCategory === "all" || p.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [search, selectedCategory]);

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      {/* Header */}
      <motion.div variants={item} className="space-y-2">
        <div className="inline-flex items-center gap-2 rounded-full border border-sage-200 bg-sage-50/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-sage-700">
          <Sparkles className="h-3.5 w-3.5" aria-hidden />
          Affiliate catalog
        </div>
        <h1 className="font-serif text-2xl font-bold text-sage-950 sm:text-3xl">
          Affiliate Products
        </h1>
        <p className="max-w-xl text-sm leading-relaxed text-sage-600">
          Browse our curated list of high-converting products. Share your
          referral links and earn commissions on every successful purchase.
        </p>
      </motion.div>

      {/* Referral code banner */}
      {affiliateCode && !loadingAffiliate && (
        <motion.div
          variants={item}
          className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
              <Share2 className="h-5 w-5" aria-hidden />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
                Your Referral Code
              </p>
              <p className="font-mono text-sm font-bold text-emerald-900">
                {affiliateCode}
              </p>
              <p className="text-xs text-emerald-600">
                This code is auto-appended to all product links below
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(affiliateCode);
                toast.success("Referral code copied");
              }}
              className="flex shrink-0 items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-semibold text-emerald-800 transition hover:bg-emerald-200"
            >
              <Copy className="h-3.5 w-3.5" />
              Copy
            </button>
          </div>
        </motion.div>
      )}

      {loadingAffiliate && (
        <motion.div
          variants={item}
          className="flex items-center justify-center gap-2 rounded-2xl border border-sage-200 bg-sage-50/40 py-6 text-sm text-sage-600"
        >
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading your affiliate data…
        </motion.div>
      )}

      {/* Stats */}
      <StatsRow />

      {/* Search */}
      <SearchBar value={search} onChange={setSearch} />

      <div className="mt-4">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-all ${
                selectedCategory === cat
                  ? "bg-sage-700 text-white"
                  : "bg-sage-100 text-sage-700 hover:bg-sage-200"
              }`}
            >
              {cat === "all" ? "All" : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      {/* Product Table */}
      {filteredProducts.length > 0 ? (
        <div className="overflow-x-auto rounded-2xl border bg-white">
          <table className="min-w-full">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="p-3 text-left">Image</th>
                <th className="p-3 text-left">Product</th>
                <th className="p-3 text-left">Category</th>
                <th className="p-3 text-left">Commission</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.slug} className="border-b hover:bg-gray-50">
                  <td className="p-3">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-12 w-12 rounded object-cover"
                    />
                  </td>

                  <td className="p-3">
                    <div>
                      <div className="font-medium">{product.name}</div>
                      <div className="text-xs text-gray-500">
                        {product.tagline}
                      </div>
                    </div>
                  </td>

                  <td className="p-3">{product.category}</td>

                  <td className="p-3">
                    <CommissionBadge commission={product.commission} />
                  </td>

                  <td className="p-3">
                    <button
                      onClick={() => {
                        const link = `${window.location.origin}/product/details?slug=${product.slug}&ref=${affiliateCode}`;
                        navigator.clipboard.writeText(link);
                        toast.success("Link copied");
                      }}
                      className="rounded bg-blue-600 px-3 py-1 text-white"
                    >
                      Copy Link
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <motion.div
          variants={item}
          className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-sage-200 bg-sage-50/40 py-16 text-center"
        >
          <Package className="mb-3 h-10 w-10 text-sage-400" aria-hidden />
          <p className="text-sm font-medium text-sage-600">
            No products match &ldquo;{search}&rdquo;
          </p>
          <button
            type="button"
            onClick={() => setSearch("")}
            className="mt-2 text-xs font-semibold text-sage-700 underline hover:text-sage-900"
          >
            Clear search
          </button>
        </motion.div>
      )}

      {/* Footer info */}
      <motion.footer
        variants={item}
        className="rounded-2xl border border-sage-200/60 bg-sage-50/40 px-5 py-4 text-xs text-sage-700"
      >
        <p>
          Commission rates are indicative and may vary based on order value and
          promotional campaigns. Payouts are processed monthly once your balance
          crosses the threshold.
        </p>
      </motion.footer>
    </motion.div>
  );
}
