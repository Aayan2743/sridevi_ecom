"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Leaf, Sparkles } from "lucide-react";

const FALLBACK_SLIDES = [
  {
    id: "fb-1",
    name: "Cold-pressed herbal oil",
    slug: null,
    min_variant_price: "299",
    images: [
      {
        image_url:
          "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=600&h=600&fit=crop",
      },
    ],
  },
  {
    id: "fb-2",
    name: "Organic turmeric blend",
    slug: null,
    min_variant_price: "189",
    images: [
      {
        image_url:
          "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&h=600&fit=crop",
      },
    ],
  },
  {
    id: "fb-3",
    name: "Forest honey & herbs",
    slug: null,
    min_variant_price: "349",
    images: [
      {
        image_url:
          "https://images.unsplash.com/photo-1587049352846-4a222e70d839?w=600&h=600&fit=crop",
      },
    ],
  },
  {
    id: "fb-4",
    name: "Ayurvedic bath ritual",
    slug: null,
    min_variant_price: "249",
    images: [
      {
        image_url:
          "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600&h=600&fit=crop",
      },
    ],
  },
  {
    id: "fb-5",
    name: "Herbal tea collection",
    slug: null,
    min_variant_price: "159",
    images: [
      {
        image_url:
          "https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=600&h=600&fit=crop",
      },
    ],
  },
];

function primaryImage(product) {
  return (
    product.images?.find((img) => img.is_primary)?.image_url ||
    product.images?.[0]?.image_url ||
    "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600&h=600&fit=crop"
  );
}

function formatPrice(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return "—";
  return `₹${n.toLocaleString("en-IN")}`;
}

export default function OrganicProductsCarousel({ products = [] }) {
  const router = useRouter();
  const slides = useMemo(() => {
    const list = Array.isArray(products) && products.length ? products : FALLBACK_SLIDES;
    return list.slice(0, 18);
  }, [products]);

  const canLoop = slides.length >= 4;

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: canLoop,
    align: "start",
    duration: 16,
    dragFree: false,
    containScroll: "trimSnaps",
  });

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("reInit", onSelect);
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  useEffect(() => {
    if (!emblaApi || paused) return;
    const id = window.setInterval(() => {
      emblaApi.scrollNext();
    }, 1000);
    return () => window.clearInterval(id);
  }, [emblaApi, paused, slides.length]);

  const goProduct = (product) => {
    if (product.slug) {
      router.push(`/product/details?slug=${encodeURIComponent(product.slug)}`);
    } else {
      router.push("/products");
    }
  };

  return (
    <motion.section
      className="relative mb-0 mt-0 w-full max-w-none overflow-hidden rounded-none border-x-0 border-b border-sage-200/50 bg-gradient-to-br from-white via-sage-50/50 to-earth-50/60 pb-12 pt-12 shadow-[0_12px_40px_-20px_rgba(27,67,50,0.12)] sm:pb-16 sm:pt-14 md:pt-16"
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-labelledby="organic-carousel-heading"
    >
      <div className="pointer-events-none absolute -right-20 top-10 h-56 w-56 rounded-full bg-sage-200/30 blur-3xl" />
      <div className="pointer-events-none absolute -left-16 bottom-0 h-48 w-48 rounded-full bg-earth-200/25 blur-3xl" />

      <div className="relative z-10 w-full">
        <div className="mx-auto mb-8 flex max-w-4xl flex-col items-center px-4 text-center sm:mb-10 sm:px-6 lg:px-8">
          <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-sage-700 ring-1 ring-sage-200/80 shadow-sm">
            <Sparkles className="h-3.5 w-3.5 text-earth-600" />
            Curated organics
          </span>
          <h2
            id="organic-carousel-heading"
            className="heading-nature max-w-2xl text-3xl sm:text-4xl lg:text-5xl"
          >
            Pure picks, smooth glide
          </h2>
          <p className="mt-3 max-w-xl text-nature text-base sm:text-lg">
            Drag to browse — advances every second (pauses while you hover).
          </p>
        </div>

        <div className="relative w-full">
          <button
            type="button"
            onClick={scrollPrev}
            className="absolute left-2 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-sage-200/80 bg-white/95 text-sage-800 shadow-md transition hover:border-red-900/30 hover:bg-red-900 hover:text-white sm:left-4 md:flex lg:left-6"
            aria-label="Previous products"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={scrollNext}
            className="absolute right-2 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-sage-200/80 bg-white/95 text-sage-800 shadow-md transition hover:border-red-900/30 hover:bg-red-900 hover:text-white sm:right-4 md:flex lg:right-6"
            aria-label="Next products"
          >
            <ArrowRight className="h-5 w-5" />
          </button>

          <div
            className="overflow-hidden pb-2 pl-3 pr-3 sm:pl-5 sm:pr-5 md:pl-10 md:pr-10 lg:pl-14 lg:pr-14"
            ref={emblaRef}
          >
            <div className="flex cursor-grab touch-pan-y active:cursor-grabbing -ml-3 sm:-ml-4 md:-ml-5">
              {slides.map((product, index) => (
                <div
                  key={`${product.id}-${index}`}
                  className="min-w-0 shrink-0 grow-0 basis-[82%] pl-3 sm:basis-[46%] sm:pl-4 md:basis-[32%] md:pl-5 lg:basis-[24%] xl:basis-[20%] xl:pl-5"
                >
                  <article className="group h-full overflow-hidden rounded-3xl border border-sage-200/50 bg-white/90 shadow-nature transition duration-500 ease-out hover:-translate-y-1 hover:border-sage-300/80 hover:shadow-nature-md">
                    <button
                      type="button"
                      onClick={() => goProduct(product)}
                      className="block w-full text-left"
                    >
                      <div className="relative aspect-square bg-gradient-to-br from-sage-50/90 via-white to-earth-50/80 p-3 sm:p-4">
                        <div className="relative h-full w-full overflow-hidden rounded-2xl bg-white shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] ring-1 ring-sage-200/50">
                          <img
                            src={primaryImage(product)}
                            alt={product.name || "Product"}
                            className="absolute inset-0 m-auto h-full w-full max-h-[92%] max-w-[92%] object-contain object-center transition duration-700 ease-out group-hover:scale-[1.03]"
                            loading="lazy"
                            onError={(e) => {
                              e.target.src =
                                "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=800&h=800&fit=crop";
                            }}
                          />
                        </div>
                        <div className="pointer-events-none absolute inset-x-3 bottom-3 top-auto h-16 rounded-b-2xl bg-gradient-to-t from-sage-900/10 to-transparent sm:inset-x-4 sm:bottom-4" />
                        <span className="pointer-events-none absolute left-4 top-4 inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-sage-800 shadow-sm ring-1 ring-sage-200/80 sm:left-5 sm:top-5">
                          <Leaf className="h-3 w-3 text-emerald-600" />
                          Organic
                        </span>
                      </div>
                      <div className="p-4 sm:p-5">
                        <h3 className="font-serif text-lg font-bold leading-snug text-sage-900 line-clamp-2 sm:text-xl">
                          {product.name}
                        </h3>
                        <div className="mt-3 flex items-center justify-between gap-2">
                          <span className="text-lg font-bold tabular-nums text-red-900">
                            {formatPrice(
                              product.min_variant_price ?? product.price
                            )}
                          </span>
                          <span className="text-sm font-semibold text-red-900 opacity-0 transition group-hover:opacity-100">
                            View →
                          </span>
                        </div>
                      </div>
                    </button>
                  </article>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => emblaApi?.scrollTo(i)}
              className={`h-2 rounded-full transition-all duration-500 ease-out ${
                i === selectedIndex
                  ? "w-8 bg-red-900"
                  : "w-2 bg-sage-300 hover:bg-sage-400"
              }`}
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === selectedIndex ? "true" : undefined}
            />
          ))}
        </div>

        <div className="mt-8 flex justify-center gap-3 md:hidden">
          <button
            type="button"
            onClick={scrollPrev}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-sage-200 bg-white text-sage-800 shadow-sm hover:bg-red-900 hover:text-white"
            aria-label="Previous"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={scrollNext}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-sage-200 bg-white text-sage-800 shadow-sm hover:bg-red-900 hover:text-white"
            aria-label="Next"
          >
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        <p className="mt-6 px-4 text-center text-sm text-sage-600">
          <Link
            href="/products"
            className="font-semibold text-red-900 underline-offset-4 hover:underline"
          >
            Browse the full natural range
          </Link>
        </p>
      </div>
    </motion.section>
  );
}
