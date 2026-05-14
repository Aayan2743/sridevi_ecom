"use client";

import React, { useEffect, useMemo, useState, useRef } from "react";
import {
  ArrowRight,
  BadgeCheck,
  Crown,
  Flower2,
  Gem,
  RotateCcw,
  Scissors,
  ShieldCheck,
  Sparkles,
  Truck,
  Leaf,
  Heart,
  Star,
  Award,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import LoadingAnimation from "@/components/LoadingAnimation";
import AdBanner from "@/components/AdBanner";
import OrganicProductsCarousel from "@/components/OrganicProductsCarousel";
import ProductCard from "@/components/ProductCard";
import api from "@/lib/api";
import { animations, safeAnimate } from "@/lib/gsap-utils";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const DEAL_SECTION_SLUGS = ["flash-sales"];
const CATEGORY_ICONS = [Flower2, Scissors, Sparkles, Crown, Gem, BadgeCheck];

const SECTION_META = {
  "flash-sales": {
    subtitle: "Most loved by our customers",
    chip: "Bestsellers",
    gradient: "from-red-900 to-red-800",
  },
};

const TRUST_POINTS = [
  {
    title: "Secure Payment",
    text: "100% secure transactions",
    icon: ShieldCheck,
    color: "sage",
  },
  {
    title: "Free Shipping",
    text: "On orders above ₹999",
    icon: Truck,
    color: "earth",
  },
  {
    title: "Easy Returns",
    text: "7-day return policy",
    icon: RotateCcw,
    color: "cream",
  },
  {
    title: "Authenticity",
    text: "Crafted with care",
    icon: BadgeCheck,
    color: "sage",
  },
];

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [sections, setSections] = useState([]);
  const [menuCategories, setMenuCategories] = useState([]);

  // Refs for animations
  const heroRef = useRef(null);
  const categoriesRef = useRef(null);
  const trustRef = useRef(null);
  const sectionsRef = useRef(null);

  useEffect(() => {
    const loadHome = async () => {
      try {
        setLoading(true);

        const [sectionsRes, menuRes, productsRes] = await Promise.all([
          api.get("/ecom/home-sections"),
          api.get("/ecom/menu"),
          fetch("https://api-herbal.easybizcart.com/public/api/ecom/products-main?sort=name&order=asc").then(res => res.json())
        ]);

        const sectionData = Array.isArray(sectionsRes.data?.data)
          ? sectionsRes.data.data
          : [];
        const categories = Array.isArray(menuRes.data)
          ? menuRes.data.map((item, index) => ({
              id: index + 1,
              name: item.label,
              slug: item.key,
            }))
          : [];

        // Process API products
        const apiProducts = productsRes.success && Array.isArray(productsRes.data?.data) 
          ? productsRes.data.data.filter(product => product.is_active_ecom === "1").map(product => ({
              id: product.id,
              name: product.name,
              slug: product.slug,
              images: product.images.length > 0 
                ? product.images 
                : [{ image_url: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&h=400&fit=crop", is_primary: true }],
              min_variant_price: product.min_variant_price,
              price: product.variant_combinations?.[0]?.extra_price || product.min_variant_price,
              discount: product.variant_combinations?.[0]?.discount || 0,
              category: product.category,
              variant_combinations: product.variant_combinations || [],
              videos: product.videos || []
            }))
          : [];

        // Create sections from API products if no sections exist
        if (sectionData.length === 0 && apiProducts.length > 0) {
          const createdSections = [
            {
              id: 1,
              name: "Featured Products",
              slug: "flash-sales",
              products: apiProducts,
            },
          ];
          setSections(createdSections);
        } else {
          setSections(sectionData);
        }

        setMenuCategories(categories);
      } catch (err) {
        console.error(err.response?.data || err.message);
        // Don't use any fallback data - only show API data
        setSections([]);
        setMenuCategories([]);
      } finally {
        setLoading(false);
      }
    };

    loadHome();
  }, []);

  /* ================= GSAP ANIMATIONS ================= */
  useEffect(() => {
    if (!loading) {
      safeAnimate(() => {
        const ctx = gsap.context(() => {
          // Hero section timeline
          const heroTl = gsap.timeline();
          heroTl
            .fromTo(
              heroRef.current?.querySelector('.hero-title'),
              { opacity: 0, y: 50 },
              { opacity: 1, y: 0, duration: 1, ease: "power2.out" }
            )
            .fromTo(
              heroRef.current?.querySelector('.hero-subtitle'),
              { opacity: 0, y: 30 },
              { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" },
              "-=0.5"
            )
            .fromTo(
              heroRef.current?.querySelector('.hero-cta'),
              { opacity: 0, scale: 0.9 },
              { opacity: 1, scale: 1, duration: 0.6, ease: "back.out(1.7)" },
              "-=0.3"
            );

          // Categories animation
          if (categoriesRef.current) {
            gsap.fromTo(
              categoriesRef.current.children,
              { opacity: 0, y: 30, scale: 0.9 },
              {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.6,
                stagger: 0.1,
                ease: "power2.out",
                scrollTrigger: {
                  trigger: categoriesRef.current,
                  start: "top 80%",
                  toggleActions: "play none none reverse",
                },
              }
            );
          }

          // Trust points animation
          if (trustRef.current) {
            gsap.fromTo(
              trustRef.current.children,
              { opacity: 0, x: -30 },
              {
                opacity: 1,
                x: 0,
                duration: 0.6,
                stagger: 0.15,
                ease: "power2.out",
                scrollTrigger: {
                  trigger: trustRef.current,
                  start: "top 85%",
                  toggleActions: "play none none reverse",
                },
              }
            );
          }

          // Product sections animation
          gsap.utils.toArray('.product-section').forEach((section) => {
            gsap.fromTo(
              section.querySelector('.section-header'),
              { opacity: 0, y: 20 },
              {
                opacity: 1,
                y: 0,
                duration: 0.6,
                ease: "power2.out",
                scrollTrigger: {
                  trigger: section,
                  start: "top 85%",
                  toggleActions: "play none none reverse",
                },
              }
            );

            gsap.fromTo(
              section.querySelectorAll('.product-card'),
              { opacity: 0, y: 30 },
              {
                opacity: 1,
                y: 0,
                duration: 0.6,
                stagger: 0.1,
                ease: "power2.out",
                scrollTrigger: {
                  trigger: section,
                  start: "top 80%",
                  toggleActions: "play none none reverse",
                },
              }
            );
          });

          // Parallax effects for decorative elements
          gsap.utils.toArray('.parallax-element').forEach((element) => {
            gsap.to(element, {
              yPercent: -30,
              ease: "none",
              scrollTrigger: {
                trigger: element,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            });
          });
        });

        return () => ctx.revert();
      });
    }
  }, [loading, sections, menuCategories]);

  const displaySections = useMemo(() => {
    // Only use API data, no fallback to sample products
    if (!sections.length) return [];

    const nonEmpty = sections.filter(
      (section) => Array.isArray(section.products) && section.products.length > 0,
    );

    const withoutPopular = nonEmpty.filter((section) => {
      const slug = (section.slug || "").toLowerCase();
      const name = (section.name || "").toLowerCase();
      if (slug === "trending") return false;
      if (name.includes("popular items")) return false;
      return true;
    });

    if (!withoutPopular.length) return [];

    const deals = withoutPopular.filter((section) =>
      DEAL_SECTION_SLUGS.includes((section.slug || "").toLowerCase()),
    );

    return deals.length ? deals : withoutPopular;
  }, [sections]);

  const topCategories = useMemo(() => menuCategories.slice(0, 6), [menuCategories]);

  const organicCarouselProducts = useMemo(() => {
    const out = [];
    const seen = new Set();
    for (const section of sections) {
      for (const p of section.products || []) {
        if (p?.id != null && !seen.has(p.id)) {
          seen.add(p.id);
          out.push(p);
          if (out.length >= 18) return out;
        }
      }
    }
    return out;
  }, [sections]);

  if (loading) {
    return <LoadingAnimation onComplete={() => {}} />;
  }

  return (
    <div className="min-h-screen bg-gradient-nature">
      {/* FULL-WIDTH BANNER */}
      <AdBanner />
      
      <main className="w-full pb-0">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16">
        {/* HERO SECTION */}
        <section 
          ref={heroRef}
          className="relative py-16 sm:py-24 lg:py-32 overflow-hidden"
        >
          {/* Background decorations */}
          <div className="absolute inset-0 opacity-10">
            <div className="parallax-element absolute top-10 left-10 w-32 h-32 bg-sage-300 rounded-full organic-shape animate-float"></div>
            <div className="parallax-element absolute top-20 right-16 w-24 h-24 bg-earth-300 rounded-full organic-shape-alt animate-float" style={{ animationDelay: '1s' }}></div>
            <div className="parallax-element absolute bottom-20 left-1/4 w-20 h-20 bg-cream-300 rounded-full organic-shape animate-float" style={{ animationDelay: '2s' }}></div>
            <Leaf className="parallax-element absolute top-32 right-1/3 w-16 h-16 text-sage-400 animate-float" style={{ animationDelay: '0.5s' }} />
            <Sparkles className="parallax-element absolute bottom-32 right-20 w-12 h-12 text-earth-400 animate-float" style={{ animationDelay: '1.5s' }} />
          </div>

          <div className="relative z-10 text-center max-w-4xl mx-auto">
            <div className="hero-title">
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-7xl font-bold text-gradient mb-6">
                Purely Natural Care
              </h1>
            </div>
            <div className="hero-subtitle">
              <p className="text-lg sm:text-xl lg:text-2xl text-sage-700 mb-8 max-w-2xl mx-auto leading-relaxed">
                Discover the power of nature with our handcrafted herbal products. 
                Trusted by crores of Indians for generations.
              </p>
            </div>
            <div className="hero-cta flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={() => router.push("/products")}
                className="bg-red-900 hover:bg-red-800 text-white text-lg px-8 py-4 rounded-full flex items-center gap-3 group transition-all duration-300 shadow-md hover:shadow-lg"
              >
                <Leaf className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                Explore Products
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
              <button
                onClick={() => router.push("/about-us")}
                className="border-2 border-red-900 text-red-900 hover:bg-red-900 hover:text-white text-lg px-8 py-4 rounded-full transition-all duration-300"
              >
                Our Story
              </button>
            </div>
          </div>
        </section>

        {/* CATEGORIES SECTION */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Leaf className="w-6 h-6 text-sage-500" />
              <h2 className="heading-nature text-3xl sm:text-4xl lg:text-5xl">
                Shop by Category
              </h2>
              <Leaf className="w-6 h-6 text-sage-500 scale-x-[-1]" />
            </div>
            <p className="text-nature text-lg max-w-2xl mx-auto">
              Explore our curated collections of natural and herbal products
            </p>
          </div>

          {!topCategories.length ? (
            <div className="text-center py-12 text-sage-600">
              <Leaf className="w-12 h-12 mx-auto mb-4 animate-pulse-soft" />
              <p>Categories are loading...</p>
            </div>
          ) : (
            <div 
              ref={categoriesRef}
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6"
            >
              {topCategories.map((category, index) => {
                const Icon = CATEGORY_ICONS[index % CATEGORY_ICONS.length];
                return (
                  <button
                    key={category.id}
                    onClick={() =>
                      router.push(`/products?category=${encodeURIComponent(category.slug)}`)
                    }
                    className="card-nature text-center group hover:scale-105 transition-all duration-300"
                  >
                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-sage-100 to-earth-100 rounded-full flex items-center justify-center group-hover:shadow-glow transition-all duration-300">
                      <Icon className="w-8 h-8 text-sage-600 group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <h3 className="font-medium text-sage-800 mb-2 group-hover:text-sage-900 transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-sm text-sage-600">Natural & Pure</p>
                  </button>
                );
              })}
            </div>
          )}
        </section>

        {/* TRUST POINTS SECTION */}
        <section className="mb-20">
          <div 
            ref={trustRef}
            className="grid grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {TRUST_POINTS.map((point, index) => {
              const Icon = point.icon;
              const colorClasses = {
                sage: {
                  bg: 'from-sage-100 to-sage-200',
                  text: 'text-sage-600'
                },
                earth: {
                  bg: 'from-earth-100 to-earth-200', 
                  text: 'text-earth-600'
                },
                cream: {
                  bg: 'from-cream-100 to-cream-200',
                  text: 'text-cream-600'
                }
              };
              const colors = colorClasses[point.color] || colorClasses.sage;
              
              return (
                <div
                  key={index}
                  className="text-center p-6 bg-gradient-to-br from-white/80 to-sage-50/50 rounded-3xl border border-sage-200/50 shadow-nature hover:shadow-nature-md transition-all duration-300 group"
                >
                  <div className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-br ${colors.bg} rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`w-8 h-8 ${colors.text}`} />
                  </div>
                  <h3 className="font-semibold text-sage-800 mb-2">{point.title}</h3>
                  <p className="text-sm text-sage-600">{point.text}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* PRODUCT SECTIONS */}
        {!displaySections.length ? (
          <div className="py-20 text-center">
            <div className="w-24 h-24 mx-auto mb-6 bg-sage-100 rounded-full flex items-center justify-center">
              <Leaf className="w-12 h-12 text-sage-400 animate-pulse-soft" />
            </div>
            <h3 className="heading-nature text-2xl mb-4">Loading Products...</h3>
            <p className="text-nature">Fetching fresh herbal products from our collection.</p>
          </div>
        ) : (
          <div className="space-y-20">
            {displaySections.map((section, sectionIndex) => {
              const normalizedSlug = (section.slug || "").toLowerCase();
              const sectionMeta = SECTION_META[normalizedSlug];

              return (
                <React.Fragment key={section.id}>
                  <section className="product-section">
                    <div className="section-header flex items-end justify-between mb-8">
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <span className={`px-4 py-2 rounded-full text-sm font-medium text-white bg-gradient-to-r ${sectionMeta?.gradient || 'from-red-900 to-red-800'}`}>
                            {sectionMeta?.chip || "Featured"}
                          </span>
                        </div>
                        <h2 className="heading-nature text-3xl sm:text-4xl lg:text-5xl mb-3">
                          {section.name}
                        </h2>
                        <p className="text-nature text-lg">
                          {sectionMeta?.subtitle || "Handpicked natural products for you"}
                        </p>
                      </div>

                      <button
                        onClick={() => router.push("/products")}
                        className="hidden md:flex items-center gap-2 text-red-900 hover:text-red-700 font-medium transition-colors group"
                      >
                        View All
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                      {section.products.map((product, productIndex) => (
                        <div
                          key={`${section.id}-${product.id}`}
                          className="product-card"
                        >
                          <ProductCard product={product} variant="showcase" />
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* SPECIAL OFFER BANNER */}
                  {sectionIndex === 0 && (
                    <section className="relative mb-10 overflow-hidden rounded-3xl bg-gradient-to-br from-red-900 via-red-800 to-red-700 p-8 sm:p-12 lg:p-16 text-center text-white shadow-lg md:mb-14">
                      {/* Background decorations */}
                      <div className="absolute inset-0 opacity-20">
                        <Leaf className="absolute top-6 left-8 w-16 h-16 animate-float" />
                        <Sparkles className="absolute top-12 right-12 w-12 h-12 animate-float" style={{ animationDelay: '1s' }} />
                        <Heart className="absolute bottom-8 left-16 w-10 h-10 animate-float" style={{ animationDelay: '2s' }} />
                        <Star className="absolute bottom-12 right-8 w-14 h-14 animate-float" style={{ animationDelay: '0.5s' }} />
                      </div>

                      <div className="relative z-10">
                        <div className="flex items-center justify-center gap-2 mb-4">
                          <Award className="w-6 h-6" />
                          <span className="uppercase tracking-wider text-red-200 text-sm font-medium">
                            Limited Time Offer
                          </span>
                          <Award className="w-6 h-6" />
                        </div>
                        <h3 className="font-serif text-3xl sm:text-4xl lg:text-6xl mb-4 font-bold">
                          Flat 30% Off on Natural Collection
                        </h3>
                        <p className="text-red-100 text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
                          Celebrate wellness with our handpicked natural products. 
                          Use code <span className="font-bold text-red-200">NATURE30</span> at checkout.
                        </p>
                        <button
                          onClick={() => router.push("/products")}
                          className="bg-white text-red-900 font-bold py-4 px-8 rounded-full hover:bg-red-50 transition-colors shadow-md hover:shadow-lg flex items-center gap-3 mx-auto group"
                        >
                          <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                          Shop Now
                          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                        </button>
                      </div>
                    </section>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        )}
        </div>

        {/* Full-bleed carousel — outside max-w so it spans the viewport; spaced below offer banner */}
        <div className="mt-16 w-full border-t border-sage-200/40 bg-gradient-to-b from-sage-50/50 to-transparent pt-12 md:mt-24 md:pt-16 lg:mt-28">
          <OrganicProductsCarousel products={organicCarouselProducts} />
        </div>

        <div className="h-12 w-full shrink-0 md:h-16" aria-hidden />
      </main>
    </div>
  );
}
