"use client";

import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import React, { useEffect, useState, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Leaf,
  Loader2,
  Star,
  Heart,
  ShoppingCart,
  Truck,
  Clock,
  CheckCircle,
  Info,
  Zap,
  Users,
  Eye,
  ChevronRight,
  Sparkles,
  ShieldCheck,
  Droplets,
  Sun,
} from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import api from "@/lib/api";
import ProductCard from "@/components/ProductCard";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { toast } from "sonner";
import { safeAnimate } from "@/lib/gsap-utils";
import ProductPremiumStickyVideo from "@/components/product/ProductPremiumStickyVideo";

gsap.registerPlugin(ScrollTrigger);

/** Static demo clip (PiP-style player); swap when product videos are ready. */
const STATIC_PRODUCT_DEMO_VIDEO =
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.06 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 380, damping: 28 },
  },
};

/** Premium PDP key-benefits row (UI only; not tied to API shape). */
const KEY_BENEFITS_CARDS = [
  {
    key: "purity",
    Icon: ShieldCheck,
    title: "Trusted purity",
    body: "Carefully chosen botanicals for everyday wellness rituals.",
  },
  {
    key: "nature",
    Icon: Leaf,
    title: "Nature-led craft",
    body: "Inspired by traditional preparation and mindful sourcing.",
  },
  {
    key: "gentle",
    Icon: Droplets,
    title: "Gentle on routine",
    body: "Fits naturally into morning and evening self-care rhythms.",
  },
  {
    key: "balance",
    Icon: Sun,
    title: "Balanced living",
    body: "Support your goals with calm, consistent care you can trust.",
  },
];

/** Static review snippets for PDP gallery (UI only until reviews API is wired). */
const CUSTOMER_REVIEWS_UI = [
  {
    id: 1,
    name: "Ananya K.",
    rating: 5,
    text: "Genuine quality—texture and aroma feel authentic. Already placed a second order.",
    date: "2 weeks ago",
  },
  {
    id: 2,
    name: "Rahul M.",
    rating: 5,
    text: "Packaging was neat and delivery was quick. Happy with the results so far.",
    date: "1 month ago",
  },
  {
    id: 3,
    name: "Deepa S.",
    rating: 4,
    text: "Great for our daily routine. Would love a bigger family pack option.",
    date: "1 month ago",
  },
];

function ProductDetailContent({ product, onBack }) {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const containerRef = useRef(null);
  const imageRef = useRef(null);
  const detailsRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        imageRef.current,
        { opacity: 0, scale: 0.96, filter: "blur(6px)" },
        {
          opacity: 1,
          scale: 1,
          filter: "blur(0px)",
          duration: 0.85,
          ease: "power3.out",
        },
      );
      gsap.fromTo(
        detailsRef.current,
        { opacity: 0, x: 28 },
        { opacity: 1, x: 0, duration: 0.75, ease: "power3.out", delay: 0.12 },
      );
    }, containerRef);
    return () => ctx.revert();
  }, [product?.id]);

  const images = useMemo(() => {
    const productImages =
      product.images?.map((img) => img.image_url).filter(Boolean) || [];
    const fallbackImages = [
      "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600&h=600&fit=crop",
    ];
    return productImages.length ? productImages : fallbackImages;
  }, [product.images]);

  const variations = useMemo(() => {
    return (
      product.variant_combinations?.map((v) => ({
        id: v.id,
        name: v.values?.map((val) => val.value).join(" / ") || "Variant",
        price: Number(v.amount || v.extra_price),
        originalPrice: Number(v.extra_price),
        stock: v.quantity,
        colorCode: v.values?.find((val) => val.color_code)?.color_code,
      })) || []
    );
  }, [product.variant_combinations]);

  const [selectedVariation, setSelectedVariation] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);

  const inWishlist = isInWishlist(product.id);

  const sampleVideos = [
    STATIC_PRODUCT_DEMO_VIDEO,
    "https://www.w3schools.com/html/mov_bbb.mp4",
    "https://sample-videos.com/zip/10/mp4/SampleVideo_640x360_1mb.mp4",
  ];

  const videoUrl = product.videos?.[0]?.video_url || STATIC_PRODUCT_DEMO_VIDEO;

  const price =
    selectedVariation?.price ?? Number(product.min_variant_price) ?? 0;
  const originalPrice =
    selectedVariation?.originalPrice ?? Number(product.max_variant_price) ?? 0;
  const stock = selectedVariation?.stock ?? 10;
  const discount =
    originalPrice > price
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : 0;

  useEffect(() => {
    if (variations.length && !selectedVariation) {
      setSelectedVariation(
        variations.find((v) => v.stock > 0) || variations[0],
      );
    }
  }, [variations, selectedVariation]);

  const handleAddToCart = () => {
    if (!selectedVariation) return;
    if (stock === 0) {
      toast.error("This product is out of stock");
      return;
    }
    addToCart({
      id: product.id,
      variationId: selectedVariation.id,
      name: `${product.name} (${selectedVariation.name})`,
      price,
      image: images[0],
      stock,
    });
    toast.success("Added to cart!");
  };

  const handleWishlistToggle = () => {
    inWishlist ? removeFromWishlist(product.id) : addToWishlist(product);
    toast.success(inWishlist ? "Removed from wishlist" : "Added to wishlist");
  };

  const similarProducts = [
    {
      id: 999,
      name: "Premium Herbal Tea",
      slug: "premium-herbal-tea",
      min_variant_price: "350",
      max_variant_price: "400",
      category: { name: "Herbal Teas" },
      images: [
        {
          image_url:
            "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&h=400&fit=crop",
        },
      ],
      variant_combinations: [
        { extra_price: "400", discount: "10", quantity: 10, amount: "350" },
      ],
    },
    {
      id: 998,
      name: "Organic Turmeric Powder",
      slug: "organic-turmeric-powder",
      min_variant_price: "420",
      max_variant_price: "450",
      category: { name: "Spices" },
      images: [
        {
          image_url:
            "https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=400&h=400&fit=crop",
        },
      ],
      variant_combinations: [
        { extra_price: "450", discount: "5", quantity: 15, amount: "420" },
      ],
    },
    {
      id: 997,
      name: "Ayurvedic Hair Oil",
      slug: "ayurvedic-hair-oil",
      min_variant_price: "380",
      max_variant_price: "420",
      category: { name: "Hair Care" },
      images: [
        {
          image_url:
            "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop",
        },
      ],
      variant_combinations: [
        { extra_price: "420", discount: "8", quantity: 20, amount: "380" },
      ],
    },
    {
      id: 996,
      name: "Natural Face Pack",
      slug: "natural-face-pack",
      min_variant_price: "500",
      max_variant_price: "550",
      category: { name: "Skin Care" },
      images: [
        {
          image_url:
            "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
        },
      ],
      variant_combinations: [
        { extra_price: "550", discount: "12", quantity: 8, amount: "500" },
      ],
    },
  ];

  const categoryLabel =
    product.category?.name || product.category_name || "Herbal Care";
  const categorySlug =
    product.category?.slug ||
    product.category_slug ||
    encodeURIComponent(categoryLabel);

  const productSubtitle =
    product.subtitle ||
    product.tagline ||
    (categoryLabel ? `${categoryLabel} program` : "Wellness program");

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-[#f9f8f3] text-[#1a2f23] selection:bg-[#c8e6c9] selection:text-[#1b4332]"
    >
      {/* Top announcement strip */}
      <div className="bg-red-900 text-white/95 text-center text-sm py-2.5 px-4 tracking-wide font-medium">
        <span className="inline-flex items-center justify-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-[#e8f5e9]" aria-hidden />
          Free delivery on orders above ₹999 · Purely natural care
        </span>
      </div>

      {/* Sticky bar */}
      <header className="sticky top-0 z-50 border-b border-[#e5e0d8]/80 bg-[#fffcf7]/90 backdrop-blur-xl shadow-[0_4px_24px_rgba(27,67,50,0.06)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-3">
          <motion.button
            type="button"
            whileHover={{ x: -3 }}
            whileTap={{ scale: 0.98 }}
            onClick={onBack}
            className="inline-flex items-center gap-3 rounded-full pl-1 pr-4 py-2 text-[#1b4332] hover:bg-[#e8f5e9]/80 transition-colors"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-[#1b4332]/10">
              <ArrowLeft className="w-5 h-5" />
            </span>
            <span className="font-semibold text-sm sm:text-base">
              Back to shop
            </span>
          </motion.button>

          <nav
            className="flex flex-wrap items-center gap-1 text-sm text-[#5c6d64] max-w-full"
            aria-label="Breadcrumb"
          >
            <Link
              href="/"
              className="hover:text-[#1b4332] transition-colors font-medium"
            >
              Home
            </Link>
            <ChevronRight className="w-4 h-4 shrink-0 opacity-50" />
            <Link
              href={`/products?category=${categorySlug}`}
              className="hover:text-[#1b4332] transition-colors truncate max-w-[140px] sm:max-w-xs"
            >
              {categoryLabel}
            </Link>
            <ChevronRight className="w-4 h-4 shrink-0 opacity-50" />
            <span className="text-[#1b4332] font-semibold truncate max-w-[180px] sm:max-w-md">
              {product.name}
            </span>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 pb-28 pt-6 sm:px-6 sm:pt-10 lg:pb-16 lg:px-8">
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-12 xl:items-start xl:gap-8">
          {/* Left: taller hero gallery + compact reviews (no loose white band) */}
          <motion.div
            ref={imageRef}
            className="flex w-full min-w-0 flex-col xl:col-span-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="overflow-hidden rounded-2xl bg-[#f4f1eb] shadow-[0_16px_44px_-20px_rgba(27,67,50,0.14)] ring-1 ring-[#e0dbd3]">
              <div className="flex w-full min-w-0 flex-row items-stretch gap-1.5 p-1 sm:gap-2 sm:p-1.5">
                {images.length > 1 && (
                  <div
                    className="flex w-11 shrink-0 flex-col gap-1.5 overflow-y-auto overflow-x-hidden py-0.5 [-webkit-overflow-scrolling:touch] sm:w-14 sm:gap-2 xl:w-14 xl:gap-2"
                    aria-label="Product images"
                  >
                    {images.map((img, i) => (
                      <motion.button
                        key={i}
                        type="button"
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setSelectedImage(i)}
                        className={`relative aspect-square w-full shrink-0 overflow-hidden rounded-lg ring-2 transition-all duration-300 sm:rounded-xl ${
                          selectedImage === i
                            ? "ring-[#1b4332] shadow-md"
                            : "ring-transparent opacity-80 hover:opacity-100 hover:ring-[#a5d6a7]"
                        }`}
                      >
                        <img
                          src={img}
                          alt=""
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            e.target.src =
                              "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=200&h=200&fit=crop";
                          }}
                        />
                      </motion.button>
                    ))}
                  </div>
                )}

                <div className="group relative z-0 aspect-[3/4] min-h-[260px] min-w-0 flex-1 overflow-hidden rounded-lg bg-[#faf9f6] ring-1 ring-[#1b4332]/10 sm:min-h-[320px] sm:rounded-[1.05rem] xl:min-h-[380px]">
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={selectedImage}
                      src={images[selectedImage]}
                      alt={product.name}
                      initial={{ opacity: 0, scale: 1.03 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.target.src =
                          "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600&h=600&fit=crop";
                      }}
                    />
                  </AnimatePresence>

                  {discount > 0 && (
                    <motion.div
                      initial={{ scale: 0.85, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="absolute left-5 top-5 flex items-center gap-2 rounded-full bg-gradient-to-r from-[#7f1d1d] to-[#991b1b] px-5 py-2.5 text-sm font-bold text-white shadow-lg"
                    >
                      <Zap className="w-4 h-4" />
                      {discount}% off
                    </motion.div>
                  )}

                  {images.length > 1 && (
                    <>
                      <button
                        type="button"
                        aria-label="Previous image"
                        onClick={() =>
                          setSelectedImage((i) =>
                            i === 0 ? images.length - 1 : i - 1,
                          )
                        }
                        className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/95 p-3 shadow-md opacity-0 transition-all hover:scale-105 group-hover:opacity-100"
                      >
                        <ArrowLeft className="w-5 h-5 text-[#1b4332]" />
                      </button>
                      <button
                        type="button"
                        aria-label="Next image"
                        onClick={() =>
                          setSelectedImage((i) =>
                            i === images.length - 1 ? 0 : i + 1,
                          )
                        }
                        className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rotate-180 rounded-full bg-white/95 p-3 shadow-md opacity-0 transition-all hover:scale-105 group-hover:opacity-100"
                      >
                        <ArrowLeft className="w-5 h-5 text-[#1b4332]" />
                      </button>
                    </>
                  )}

                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/25 to-transparent" />
                </div>
              </div>

              <div className="border-t border-[#e0dbd3]/90 bg-white px-2 py-2 sm:px-3 sm:py-2.5">
                <div className="flex items-baseline justify-between gap-2">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#1b4332] sm:text-[11px]">
                    Customer reviews
                  </p>
                  <span className="shrink-0 text-[10px] font-semibold text-[#6b1c23] sm:text-[11px]">
                    4.8 · 247 ratings
                  </span>
                </div>
                <ul className="mt-1.5 space-y-1.5 sm:mt-2 sm:space-y-2">
                  {CUSTOMER_REVIEWS_UI.map((r) => (
                    <li
                      key={r.id}
                      className="rounded-lg border border-[#ece8df] bg-[#faf9f6] px-2 py-1.5 sm:px-2.5 sm:py-2"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-semibold text-[#1b4332] sm:text-sm">
                          {r.name}
                        </span>
                        <span className="text-[10px] text-[#6b6560]">
                          {r.date}
                        </span>
                      </div>
                      <div className="mt-0.5 flex gap-0.5">
                        {Array.from({ length: 5 }, (_, i) => (
                          <Star
                            key={i}
                            className={`h-3 w-3 sm:h-3.5 sm:w-3.5 ${
                              i < r.rating
                                ? "fill-amber-400 text-amber-400"
                                : "fill-transparent text-[#d4cfc4]"
                            }`}
                            aria-hidden
                          />
                        ))}
                      </div>
                      <p className="mt-1 text-[11px] leading-snug text-[#3d3830] sm:text-xs">
                        {r.text}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Right: full-width copy; video overlays top-right (xl) with z-index + sticky scroll */}
          <motion.div
            ref={detailsRef}
            className="relative xl:col-span-6 xl:min-h-0"
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            <div className="relative z-10">
              <motion.div
                variants={itemVariants}
                className="mb-4 flex flex-wrap gap-2"
              >
                <span className="inline-flex items-center gap-2 rounded-full bg-[#fde8dc] px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#7c2d12] ring-1 ring-[#f5cbb8]">
                  Best seller
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-[#e8f5e9] px-4 py-1.5 text-xs font-semibold text-[#1b4332] ring-1 ring-[#a5d6a7]/50">
                  <Leaf className="w-3.5 h-3.5" />
                  {categoryLabel}
                </span>
              </motion.div>

              <motion.h1
                variants={itemVariants}
                className="font-serif text-4xl font-bold leading-[1.1] tracking-tight text-[#1b4332] sm:text-5xl lg:text-[2.75rem]"
              >
                {product.name}
              </motion.h1>

              <motion.p
                variants={itemVariants}
                className="mt-2 text-base font-medium text-[#2e4a35] sm:text-lg"
              >
                {productSubtitle}
              </motion.p>

              <motion.p
                variants={itemVariants}
                className="mt-5 w-full max-w-none text-lg leading-[1.75] text-[#4a5c54] sm:text-[1.05rem] sm:leading-8"
              >
                <div
                  className="text-lg leading-relaxed text-[#5c6d64]"
                  dangerouslySetInnerHTML={{
                    __html:
                      product.extra_details?.Description ||
                      product.description ||
                      "No description available.",
                  }}
                />
              </motion.p>

              <motion.div variants={itemVariants} className="mt-10">
                <h2 className="font-serif text-xl font-bold tracking-tight text-[#1b4332] sm:text-2xl">
                  Key benefits
                </h2>
                <div className="mt-6 grid w-full grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-6 xl:gap-x-8">
                  {Object.entries(product.specifications || {}).map(
                    ([title, description], index) => (
                      <div
                        key={index}
                        className="rounded-2xl border border-[#e8e4dc]/90 bg-white/80 p-4 shadow-sm"
                      >
                        <h4 className="font-semibold text-[#1b4332] mb-2">
                          {title}
                        </h4>

                        <p className="text-sm leading-relaxed text-[#5c6d64]">
                          {description}
                        </p>
                      </div>
                    ),
                  )}
                </div>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="mt-10 flex flex-wrap items-center gap-5"
              >
                <div className="flex items-center gap-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-6 h-6 ${
                        i < 4
                          ? "text-amber-400 fill-amber-400"
                          : "text-[#d4d4d4]"
                      }`}
                    />
                  ))}
                  <span className="ml-1 text-xl font-bold text-[#3e2723]">
                    4.8
                  </span>
                  <span className="text-[#7a8a82]">(247 reviews)</span>
                </div>
                <span className="hidden sm:inline h-6 w-px bg-[#d7d2c8]" />
                <span className="inline-flex items-center gap-2 rounded-full bg-[#e8f5e9] px-4 py-1.5 text-sm font-semibold text-[#1b4332]">
                  <Users className="w-4 h-4" />
                  1.2k+ sold
                </span>
              </motion.div>

              {/* Price card */}
              <motion.div
                variants={itemVariants}
                className="mt-6 rounded-xl bg-gradient-to-br from-[#fff5f0] via-[#fdeee8] to-[#fce9e2] p-4 sm:p-5 shadow-[0_8px_28px_-8px_rgba(124,45,18,0.12)] ring-1 ring-[#edd5c8]"
              >
                <div className="flex flex-wrap items-end gap-2 sm:gap-3">
                  <span className="text-2xl sm:text-3xl font-bold tabular-nums text-[#6b1c23]">
                    ₹{price.toLocaleString("en-IN")}
                  </span>
                  {originalPrice > price && (
                    <>
                      <span className="text-base sm:text-lg text-[#9ca89f] line-through tabular-nums">
                        ₹{originalPrice.toLocaleString("en-IN")}
                      </span>
                      <span className="rounded-full bg-[#22c55e] px-2.5 py-1 text-xs font-bold text-white shadow-sm sm:px-3 sm:text-sm">
                        Save ₹{(originalPrice - price).toLocaleString("en-IN")}
                      </span>
                    </>
                  )}
                </div>
                <p className="mt-2 text-xs font-medium text-[#6d5348] sm:text-sm">
                  Inclusive of all taxes · Free shipping above ₹999
                </p>
              </motion.div>

              {/* Stock row */}
              <motion.div
                variants={itemVariants}
                className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-white/90 px-5 py-4 shadow-[0_8px_30px_-10px_rgba(0,0,0,0.08)] ring-1 ring-[#e8e4dc]"
              >
                <div className="flex items-center gap-3">
                  {stock > 0 ? (
                    <>
                      <span className="relative flex h-3 w-3">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                        <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500" />
                      </span>
                      <span className="font-bold text-[#1b4332]">In stock</span>
                      <span className="text-[#7a8a82]">
                        ({stock} available)
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="h-3 w-3 rounded-full bg-red-500" />
                      <span className="font-bold text-red-700">
                        Out of stock
                      </span>
                    </>
                  )}
                </div>
                <div className="flex items-center gap-2 text-[#5c6d64]">
                  <Eye className="w-4 h-4" />
                  <span className="text-sm font-medium">156 viewing now</span>
                </div>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="mt-2 flex flex-wrap gap-4 text-sm text-[#5c6d64]"
              >
                <span className="inline-flex items-center gap-2">
                  <Truck className="w-4 h-4 text-[#1b4332]" />
                  Delivery in 2–3 days
                </span>
              </motion.div>

              {/* Variants */}
              {variations.length > 0 && (
                <motion.div variants={itemVariants} className="mt-10 space-y-4">
                  <h2 className="text-lg font-bold text-[#3e2723]">
                    Choose your variant
                  </h2>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {variations.map((v) => (
                      <motion.button
                        key={v.id}
                        type="button"
                        whileHover={{ scale: v.stock > 0 ? 1.02 : 1 }}
                        whileTap={{ scale: v.stock > 0 ? 0.98 : 1 }}
                        disabled={v.stock === 0}
                        onClick={() => setSelectedVariation(v)}
                        className={`relative rounded-2xl border-2 p-4 text-left transition-all duration-300 ${
                          selectedVariation?.id === v.id
                            ? "border-[#e8a598] bg-[#fff5f3] shadow-[0_8px_28px_-8px_rgba(232,165,152,0.45)]"
                            : v.stock === 0
                              ? "border-[#e5e5e5] bg-[#f9f9f9] text-[#9ca3af] cursor-not-allowed"
                              : "border-[#e8e4dc] bg-white hover:border-[#a5d6a7] hover:shadow-md"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {v.colorCode && (
                            <span
                              className="h-8 w-8 shrink-0 rounded-full ring-2 ring-white shadow"
                              style={{ backgroundColor: v.colorCode }}
                            />
                          )}
                          <div>
                            <div className="font-bold text-[#3e2723]">
                              {v.name}
                            </div>
                            <div className="text-sm text-[#6d5348]">
                              ₹{v.price.toLocaleString("en-IN")}
                            </div>
                          </div>
                        </div>
                        {selectedVariation?.id === v.id && (
                          <CheckCircle className="absolute right-3 top-3 h-5 w-5 text-[#1b4332]" />
                        )}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}

              <motion.div variants={itemVariants} className="mt-8">
                <motion.button
                  type="button"
                  whileHover={{
                    scale: stock > 0 ? 1.01 : 1,
                    y: stock > 0 ? -2 : 0,
                  }}
                  whileTap={{ scale: stock > 0 ? 0.99 : 1 }}
                  onClick={handleAddToCart}
                  disabled={stock === 0}
                  className={`flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-base font-bold shadow-[0_14px_36px_-8px_rgba(107,28,35,0.45)] transition-all sm:py-4 sm:text-lg ${
                    stock === 0
                      ? "cursor-not-allowed bg-[#d1d5db] text-[#6b7280]"
                      : "bg-red-900 text-white hover:bg-red-800 hover:shadow-[0_18px_44px_-10px_rgba(127,29,29,0.45)]"
                  }`}
                >
                  <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />
                  {stock === 0 ? "Currently out of stock" : "Add to cart"}
                </motion.button>
              </motion.div>
            </div>

            <ProductPremiumStickyVideo
              key={product.id}
              videoUrl={videoUrl}
              productName={product.name}
              sampleVideos={sampleVideos}
            />
          </motion.div>
        </div>

        {/* Description */}
        <motion.section
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="mt-20 rounded-[1.5rem] bg-white p-8 sm:p-12 shadow-[0_24px_60px_-24px_rgba(27,67,50,0.12)] ring-1 ring-[#e8e4dc]"
        >
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <h3 className="mb-6 flex items-center gap-3 font-serif text-2xl font-bold text-[#3e2723]">
                <Info className="h-8 w-8 text-[#6b1c23]" />
                Product details
              </h3>
              <div
                className="text-lg leading-relaxed text-[#5c6d64]"
                dangerouslySetInnerHTML={{
                  __html:
                    product.extra_details?.Description ||
                    product.description ||
                    "No description available.",
                }}
              />
            </div>
            <div>
              <h3 className="mb-6 flex items-center gap-3 font-serif text-2xl font-bold text-[#3e2723]">
                <Clock className="h-8 w-8 text-[#6b1c23]" />
                Usage instructions
              </h3>
              <ol className="space-y-4">
                {Object.values(product.usage_instructions || {}).map(
                  (instruction, index) => (
                    <li key={index} className="flex gap-4">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#fde8dc] text-sm font-bold text-[#7c2d12]">
                        {index + 1}
                      </span>

                      <p className="pt-1 text-[#5c6d64] leading-relaxed">
                        {instruction}
                      </p>
                    </li>
                  ),
                )}
              </ol>
            </div>
          </div>
        </motion.section>

        {/* Similar */}
        <motion.section
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-24"
        >
          <div className="mb-12 text-center">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#3e2723]">
              You might also like
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-[#5c6d64]">
              More picks from our herbal collection
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {similarProducts.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.06 }}
                whileHover={{ y: -8 }}
                className="overflow-hidden rounded-2xl bg-white shadow-[0_16px_48px_-20px_rgba(0,0,0,0.12)] ring-1 ring-[#e8e4dc] transition-shadow hover:shadow-xl"
              >
                <ProductCard product={item} />
              </motion.div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <motion.button
              type="button"
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex rounded-full bg-gradient-to-r from-red-900 to-red-800 px-10 py-4 font-bold text-white shadow-lg hover:from-red-800 hover:to-red-900"
            >
              Browse all products
            </motion.button>
          </div>
        </motion.section>
      </main>

      {/* Mobile sticky bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-[#e8e4dc] bg-[#fffcf7]/95 p-4 backdrop-blur-xl shadow-[0_-8px_30px_rgba(0,0,0,0.08)] lg:hidden">
        <div className="mx-auto flex max-w-lg gap-3">
          <motion.button
            type="button"
            whileTap={{ scale: 0.95 }}
            onClick={handleWishlistToggle}
            className={`rounded-2xl border-2 p-4 ${
              inWishlist
                ? "border-[#fecaca] bg-[#fff1f2] text-red-600"
                : "border-[#e8e4dc] text-[#5c6d64]"
            }`}
          >
            <Heart className={`h-6 w-6 ${inWishlist ? "fill-current" : ""}`} />
          </motion.button>
          <motion.button
            type="button"
            whileTap={{ scale: 0.98 }}
            onClick={handleAddToCart}
            disabled={stock === 0}
            className={`flex flex-1 items-center justify-center gap-2 rounded-2xl py-4 font-bold ${
              stock === 0
                ? "bg-[#d1d5db] text-[#6b7280]"
                : "bg-red-900 text-white hover:bg-red-800 shadow-lg"
            }`}
          >
            <ShoppingCart className="h-5 w-5" />
            {stock === 0 ? "Out of stock" : "Add to cart"}
          </motion.button>
        </div>
      </div>
    </div>
  );
}

export default function ProductDetailsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const slug = searchParams.get("slug");

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const pageRef = useRef(null);

  useEffect(() => {
    if (!slug) {
      setProduct(null);
      setLoading(false);
      return;
    }

    const fetchProduct = async () => {
      try {
        const res = await api.get(`/ecom/products-main?slug=${slug}`);
        const item =
          res.data?.data?.data?.[0] ||
          res.data?.data?.[0] ||
          res.data?.data ||
          null;

        setProduct(item);

        if (item) {
          safeAnimate(() => {
            gsap.fromTo(
              pageRef.current,
              { opacity: 0, y: 16 },
              { opacity: 1, y: 0, duration: 0.55, ease: "power2.out" },
            );
          });
        }
      } catch (err) {
        console.error(err);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#faf8f4]">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#e8f5e9] shadow-inner"
          >
            <Loader2 className="h-9 w-9 animate-spin text-[#1b4332]" />
          </motion.div>
          <h3 className="font-serif text-xl font-semibold text-[#3e2723]">
            Loading product
          </h3>
          <p className="mt-2 text-[#5c6d64]">Preparing your experience…</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#faf8f4] px-6">
        <div className="max-w-md text-center">
          <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-[#e8f5e9] shadow-lg ring-4 ring-[#c8e6c9]/50">
            <Leaf className="h-12 w-12 text-[#1b4332]/40" />
          </div>
          <h3 className="font-serif text-2xl font-bold text-[#3e2723]">
            Product not found
          </h3>
          <p className="mt-3 text-[#5c6d64]">
            The product you&apos;re looking for doesn&apos;t exist or may have
            been removed.
          </p>
          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push("/products")}
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-red-900 px-8 py-3 font-semibold text-white shadow-lg hover:bg-red-800"
          >
            <ArrowLeft className="h-4 w-4" />
            Browse products
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <div ref={pageRef} className="min-h-screen">
      <ProductDetailContent product={product} onBack={() => router.back()} />
    </div>
  );
}
