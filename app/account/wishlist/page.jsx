"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import api from "@/lib/api";
import { toast } from "sonner";

import { Heart, Trash2, ExternalLink, ShoppingBag } from "lucide-react";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.03 },
  },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.34, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function WishlistPage() {
  const router = useRouter();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  // const [usingDemo, setUsingDemo] = useState(false);

  const handleRemove = useCallback(async (productId) => {
    try {
      const res = await api.post(
        "user-dashboard/wishlist-toggle",
        { product_id: productId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jb-fashions-token")}`,
          },
        },
      );
      if (res.data?.action === "removed") {
        setWishlist((prev) => prev.filter((w) => w.id !== productId));
        toast.success("Removed from wishlist");
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to remove item");
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await api.get("user-dashboard/get-wishlist", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jb-fashions-token")}`,
          },
        });

        console.log("wishlist", res);
        const raw = res?.data?.data ?? res?.data ?? [];
        const list = Array.isArray(raw) ? raw : [];
        if (cancelled) return;
        setWishlist(list);
      } catch (error) {
        console.log(error);

        if (!cancelled) {
          setWishlist([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-40 animate-pulse rounded-2xl bg-sage-100/80"
          />
        ))}
      </div>
    );
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      <motion.header variants={item} className="space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-sage-200/80 bg-sage-50/80 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-sage-800">
          <Heart className="h-3.5 w-3.5 text-red-500" aria-hidden />
          Wishlist
        </div>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl font-bold tracking-tight text-sage-950 sm:text-4xl">
              My wishlist
            </h1>
            <p className="mt-1 max-w-xl text-sm text-sage-700/90">
              Curate products you love—jump back anytime to compare, share, or
              move them to cart.
            </p>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 rounded-2xl border border-sage-200 bg-white px-4 py-2.5 text-sm font-semibold text-sage-800 shadow-sm transition hover:bg-sage-50"
          >
            <ShoppingBag className="h-4 w-4" aria-hidden />
            Continue shopping
          </Link>
        </div>
      </motion.header>

      {wishlist.length === 0 ? (
        <motion.div
          variants={item}
          className="rounded-3xl border border-dashed border-sage-200 bg-gradient-to-br from-sage-50/80 to-cream-50/60 px-8 py-16 text-center"
        >
          <Heart className="mx-auto h-12 w-12 text-sage-300" />
          <p className="mt-4 font-serif text-xl font-semibold text-sage-900">
            No products in wishlist.
          </p>
          <p className="mt-2 text-sm text-sage-600">
            Explore the catalog and tap the heart on products you want to save.
          </p>
          <Link
            href="/products"
            className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-sage-800 px-6 py-3 text-sm font-semibold text-white transition hover:bg-sage-900"
          >
            Browse products
            <ExternalLink className="h-4 w-4" aria-hidden />
          </Link>
        </motion.div>
      ) : (
        <motion.div
          variants={item}
          className="grid gap-5 sm:grid-cols-2 lg:grid-cols-2"
        >
          <AnimatePresence mode="popLayout">
            {wishlist.map((w, idx) => {
              const name = w.name || w.product_name || "Product";
              const price = w.price ?? w.amount ?? w.final_price ?? 0;
              const slug = w.slug || w.product_slug || "";
              const image =
                w.image ||
                w.image_url ||
                w.thumbnail ||
                "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400&h=400&fit=crop&q=80";

              return (
                <motion.article
                  layout
                  key={w.id}
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: idx * 0.05 }}
                  whileHover={{ y: -4 }}
                  className="group overflow-hidden rounded-2xl border border-sage-200/60 bg-white shadow-sm transition-shadow hover:shadow-nature-md"
                >
                  <div className="relative aspect-[5/3] bg-sage-100">
                    <Image
                      src={image}
                      alt=""
                      fill
                      className="object-cover transition duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 400px"
                    />
                    <div className="absolute left-3 top-3 rounded-full bg-white/90 px-2 py-1 text-xs font-bold text-sage-900 shadow-sm backdrop-blur">
                      Saved
                    </div>
                  </div>
                  <div className="p-5">
                    <h2 className="line-clamp-2 font-semibold text-sage-950">
                      {name}
                    </h2>
                    <p className="mt-2 text-lg font-bold text-sage-900">
                      ₹{Number(price).toLocaleString("en-IN")}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          slug
                            ? router.push(
                                `/product/details/?slug=${encodeURIComponent(slug)}`,
                              )
                            : router.push("/products")
                        }
                        className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-sage-800 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-sage-900"
                      >
                        View product
                        <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemove(w.id)}
                        className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-red-200 bg-red-50/80 px-4 py-2.5 text-sm font-semibold text-red-800 transition hover:bg-red-100"
                      >
                        <Trash2 className="h-4 w-4" aria-hidden />
                        Remove
                      </button>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </AnimatePresence>
        </motion.div>
      )}
    </motion.div>
  );
}
