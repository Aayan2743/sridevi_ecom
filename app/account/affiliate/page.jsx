"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { AFFILIATE_SHOWCASE_PRODUCTS } from "@/lib/affiliateShowcaseProducts";
import { clampPage, getTotalPages, paginateSlice } from "@/lib/paginationUtils";
import AccountPagination from "@/components/account/AccountPagination";
import {
  Sparkles,
  Leaf,
  TrendingUp,
  Calendar,
  LayoutDashboard,
  Shield,
  Link2,
  Copy,
  Share2,
  ExternalLink,
  BadgePercent,
  Package,
  CheckCircle2,
} from "lucide-react";

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

const AFFILIATE_PAGE_SIZE = 4;

function useOrigin() {
  const [origin, setOrigin] = useState("");
  useEffect(() => {
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin);
    }
  }, []);
  return origin;
}

export default function AffiliatePage() {
  const { user } = useAuth();
  const origin = useOrigin();
  const productsAnchorRef = useRef(null);
  const [productPage, setProductPage] = useState(1);

  const affiliateTotal = AFFILIATE_SHOWCASE_PRODUCTS.length;
  const affiliateTotalPages = getTotalPages(affiliateTotal, AFFILIATE_PAGE_SIZE);

  useEffect(() => {
    setProductPage((p) => clampPage(p, affiliateTotalPages || 1));
  }, [affiliateTotalPages]);

  const pagedProducts = useMemo(
    () =>
      paginateSlice(
        AFFILIATE_SHOWCASE_PRODUCTS,
        productPage,
        AFFILIATE_PAGE_SIZE,
      ),
    [productPage],
  );

  const scrollToProducts = useCallback(() => {
    requestAnimationFrame(() => {
      productsAnchorRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  }, []);

  const handleAffiliatePageChange = useCallback(
    (p) => {
      setProductPage(p);
      scrollToProducts();
    },
    [scrollToProducts],
  );

  const refCode = useMemo(() => {
    const raw =
      user?.affiliate_code ??
      user?.affiliateCode ??
      user?.referral_code ??
      user?.id;
    if (raw === undefined || raw === null || raw === "") return "PENDING";
    return String(raw);
  }, [user]);

  const isRegistered = Boolean(
    user?.affiliate_code ||
      user?.affiliateCode ||
      user?.affiliate_status === "active"
  );

  const storeReferralUrl = useMemo(() => {
    if (!origin) return "";
    return `${origin}/?ref=${encodeURIComponent(refCode)}`;
  }, [origin, refCode]);

  const productHref = useCallback(
    (slug) =>
      `/product/details/?slug=${encodeURIComponent(slug)}&ref=${encodeURIComponent(refCode)}`,
    [refCode]
  );

  const copy = useCallback(async (text, message = "Copied to clipboard") => {
    if (!text) {
      toast.error("Nothing to copy yet");
      return;
    }
    try {
      await navigator.clipboard.writeText(text);
      toast.success(message);
    } catch {
      toast.error("Unable to copy — try selecting the link manually");
    }
  }, []);

  const shareStore = useCallback(async () => {
    if (!storeReferralUrl) {
      toast.error("Link is still loading…");
      return;
    }
    const title = "Sridevi Herbal — shop with my link";
    const text = "Explore Sridevi Herbal products using my referral link.";
    try {
      if (navigator.share) {
        await navigator.share({ title, text, url: storeReferralUrl });
      } else {
        await copy(storeReferralUrl, "Store link copied");
      }
    } catch (e) {
      if (e?.name !== "AbortError") await copy(storeReferralUrl);
    }
  }, [copy, storeReferralUrl]);

  const shareProduct = useCallback(
    async (slug, name) => {
      const url =
        typeof window !== "undefined"
          ? `${window.location.origin}${productHref(slug)}`
          : "";
      if (!url) return;
      try {
        if (navigator.share) {
          await navigator.share({
            title: `${name} | Sridevi Herbal`,
            text: `Shop ${name} on Sridevi Herbal`,
            url,
          });
        } else {
          await copy(url, "Product link copied");
        }
      } catch (e) {
        if (e?.name !== "AbortError") await copy(url);
      }
    },
    [copy, productHref]
  );

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      {/* Hero */}
      <motion.section
        variants={item}
        className="relative overflow-hidden rounded-3xl border border-sage-700/40 bg-gradient-to-br from-sage-950 via-sage-800 to-earth-950 px-6 py-10 text-white shadow-nature-lg sm:px-10 sm:py-12"
      >
        <div
          className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-lime-400/15 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-24 -left-16 h-80 w-80 rounded-full bg-emerald-500/10 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M40 0L40 80M0 40L80 40' stroke='%23ffffff' stroke-width='0.5' fill='none'/%3E%3C/svg%3E")`,
          }}
          aria-hidden
        />

        <div className="relative z-[1] max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-cream-100">
            <Sparkles className="h-3.5 w-3.5" aria-hidden />
            Partner program
          </div>
          <h1 className="font-serif text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Become an affiliate
          </h1>
          <p className="text-base leading-relaxed text-sage-100/95 sm:text-lg">
            Join the Sridevi Herbal partner network: earn on every successful
            referral, enjoy monthly payouts, and share products you truly stand
            behind—with a link toolkit built for creators and wellness advocates.
          </p>
        </div>

        <div className="relative z-[1] mt-10 grid gap-4 sm:grid-cols-3">
          {[
            {
              icon: TrendingUp,
              title: "Commission on referrals",
              body: "Earn when new customers purchase through your tracked links.",
            },
            {
              icon: Calendar,
              title: "Monthly payouts",
              body: "Reliable settlement rhythm so your earnings stay predictable.",
            },
            {
              icon: LayoutDashboard,
              title: "Partner dashboard",
              body: "Track status, links, and next steps—more analytics coming soon.",
            },
          ].map((b) => (
            <div
              key={b.title}
              className="rounded-2xl border border-white/15 bg-white/5 p-4 backdrop-blur-sm"
            >
              <b.icon className="mb-3 h-6 w-6 text-lime-200" aria-hidden />
              <p className="font-semibold text-cream-50">{b.title}</p>
              <p className="mt-1 text-sm text-sage-100/85">{b.body}</p>
            </div>
          ))}
        </div>
      </motion.section>

      <div className="grid gap-8 lg:grid-cols-12 lg:items-start">
        {/* Status + links */}
        <motion.div variants={item} className="space-y-6 lg:col-span-5">
          <div className="rounded-3xl border border-sage-200/70 bg-gradient-to-br from-white via-cream-50/40 to-sage-50/30 p-6 shadow-nature-md">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-sage-100 text-sage-800">
                <Shield className="h-6 w-6" aria-hidden />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-sage-600">
                  Affiliate status
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <span
                    className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold ${
                      isRegistered
                        ? "bg-emerald-100 text-emerald-900 ring-1 ring-emerald-200"
                        : "bg-amber-100 text-amber-950 ring-1 ring-amber-200/80"
                    }`}
                  >
                    {isRegistered ? "Active partner" : "Not registered"}
                  </span>
                  {!isRegistered && (
                    <span className="text-xs text-sage-600">
                      Apply to unlock full tracking &amp; payouts
                    </span>
                  )}
                </div>
                <p className="mt-3 text-sm leading-relaxed text-sage-700/90">
                  {isRegistered
                    ? "Your partner profile is active. Share your links below and watch conversions roll in."
                    : "You can still preview links below. Once approved, the same URLs will attribute sales to your account."}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() =>
                toast.message("Affiliate applications", {
                  description:
                    "We’ll open applications here soon. For now, preview and share your referral links.",
                })
              }
              className="mt-6 w-full rounded-2xl bg-gradient-to-r from-sage-800 to-sage-700 py-3.5 text-sm font-semibold text-white shadow-nature transition hover:from-sage-900 hover:to-sage-800"
            >
              Apply for affiliate
            </button>
          </div>

          {/* Share store link */}
          <div className="rounded-3xl border border-sage-200/60 bg-white/90 p-6 shadow-sm">
            <div className="flex items-center gap-2 text-sage-900">
              <Link2 className="h-5 w-5 text-sage-600" aria-hidden />
              <h2 className="font-serif text-xl font-semibold">Your store link</h2>
            </div>
            <p className="mt-2 text-sm text-sage-700/85">
              Share this URL so visits and checkouts can be attributed to you
              once your partner ID is live.
            </p>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="min-w-0 flex-1 rounded-2xl border border-sage-200 bg-sage-50/50 px-4 py-3 font-mono text-xs text-sage-900 sm:text-sm">
                {storeReferralUrl || "Loading your link…"}
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => copy(storeReferralUrl, "Store link copied")}
                disabled={!storeReferralUrl}
                className="inline-flex items-center gap-2 rounded-xl border border-sage-200 bg-white px-4 py-2.5 text-sm font-semibold text-sage-800 transition hover:bg-sage-50 disabled:opacity-50"
              >
                <Copy className="h-4 w-4" aria-hidden />
                Copy link
              </button>
              <button
                type="button"
                onClick={shareStore}
                disabled={!storeReferralUrl}
                className="inline-flex items-center gap-2 rounded-xl border border-sage-700 bg-sage-800 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-sage-900 disabled:opacity-50"
              >
                <Share2 className="h-4 w-4" aria-hidden />
                Share
              </button>
            </div>
            <p className="mt-3 flex items-center gap-1.5 text-xs text-sage-600">
              <BadgePercent className="h-3.5 w-3.5 shrink-0" aria-hidden />
              Ref code preview:{" "}
              <span className="font-mono font-semibold text-sage-800">
                {refCode}
              </span>
            </p>
          </div>
        </motion.div>

        {/* Products */}
        <motion.div variants={item} className="lg:col-span-7">
          <section
            ref={productsAnchorRef}
            id="affiliate-products"
            className="scroll-mt-28 space-y-4"
          >
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="font-serif text-2xl font-bold text-sage-950 sm:text-3xl">
                Promote these picks
              </h2>
              <p className="mt-1 max-w-xl text-sm text-sage-700/90">
                High-intent catalog highlights—each card includes commission
                guidance and a ready-to-share product link with your ref attached.
              </p>
            </div>
            <Link
              href="/products"
              className="inline-flex items-center gap-1 text-sm font-semibold text-sage-800 underline decoration-sage-300 underline-offset-4 hover:text-sage-950"
            >
              Browse full catalog
              <ExternalLink className="h-3.5 w-3.5" aria-hidden />
            </Link>
          </div>

          <motion.div
            key={productPage}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="grid gap-4 sm:grid-cols-2"
          >
            {pagedProducts.map((p, idx) => (
              <motion.article
                key={p.slug}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.04 * idx, duration: 0.32 }}
                whileHover={{ y: -4 }}
                className="group overflow-hidden rounded-2xl border border-sage-200/70 bg-white shadow-sm ring-1 ring-transparent transition-all hover:shadow-nature-md hover:ring-sage-200/60"
              >
                <Link
                  href={productHref(p.slug)}
                  className="relative block aspect-[4/3] overflow-hidden bg-sage-100"
                >
                  <Image
                    src={p.image}
                    alt=""
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 320px"
                  />
                  <div className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-bold text-sage-900 shadow-sm backdrop-blur">
                    {p.commission}
                  </div>
                </Link>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <Link
                        href={productHref(p.slug)}
                        className="font-semibold text-sage-950 transition hover:text-sage-700"
                      >
                        {p.name}
                      </Link>
                      <p className="mt-0.5 text-xs text-sage-600">{p.tagline}</p>
                    </div>
                    <Package
                      className="h-4 w-4 shrink-0 text-sage-400"
                      aria-hidden
                    />
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        copy(
                          origin
                            ? `${origin}${productHref(p.slug)}`
                            : productHref(p.slug),
                          "Product link copied"
                        )
                      }
                      className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-sage-200 bg-sage-50/80 px-3 py-2 text-xs font-semibold text-sage-800 transition hover:bg-sage-100 sm:flex-none"
                    >
                      <Copy className="h-3.5 w-3.5" aria-hidden />
                      Copy link
                    </button>
                    <button
                      type="button"
                      onClick={() => shareProduct(p.slug, p.name)}
                      className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-earth-200 bg-earth-50 px-3 py-2 text-xs font-semibold text-earth-900 transition hover:bg-earth-100 sm:flex-none"
                    >
                      <Share2 className="h-3.5 w-3.5" aria-hidden />
                      Share
                    </button>
                    <Link
                      href={productHref(p.slug)}
                      className="inline-flex flex-1 items-center justify-center gap-1 rounded-xl bg-sage-800 px-3 py-2 text-xs font-semibold text-white transition hover:bg-sage-900 sm:flex-none"
                    >
                      View
                      <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                    </Link>
                  </div>
                </div>
              </motion.article>
            ))}
          </motion.div>

          <AccountPagination
            page={productPage}
            pageSize={AFFILIATE_PAGE_SIZE}
            totalItems={affiliateTotal}
            onPageChange={handleAffiliatePageChange}
            itemLabel="products"
          />
          </section>

          <div className="mt-6 flex items-start gap-3 rounded-2xl border border-emerald-200/80 bg-emerald-50/60 px-4 py-3 text-sm text-emerald-950">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700" />
            <p>
              <span className="font-semibold">Tip:</span> Short videos and
              before/after stories convert best for herbal care. Pair your store
              link in bio with deep links to individual products.
            </p>
          </div>
        </motion.div>
      </div>

      <motion.footer
        variants={item}
        className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-sage-200/60 bg-sage-50/40 px-4 py-3 text-xs text-sage-700"
      >
        <span className="inline-flex items-center gap-2">
          <Leaf className="h-4 w-4 text-sage-600" aria-hidden />
          Commission tiers and dashboards will reflect live data after partner
          onboarding.
        </span>
      </motion.footer>
    </motion.div>
  );
}
