"use client";

import { useSearchParams } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { Filter, Grid, List, SlidersHorizontal, Leaf, Sparkles } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import EnhancedSidebar from "@/components/EnhancedSidebar";
import ProductsClient from "./ProductsClient";
import { safeAnimate } from "@/lib/gsap-utils";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const category = searchParams.get("category");
  const searchQuery = searchParams.get("q");
  
  const [filters, setFilters] = useState({});
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState("grid");

  // Refs for animations
  const pageRef = useRef(null);
  const headerRef = useRef(null);
  const sidebarRef = useRef(null);
  const productsRef = useRef(null);

  useEffect(() => {
    safeAnimate(() => {
      const ctx = gsap.context(() => {
        // Page entrance animation
        gsap.fromTo(
          pageRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
        );

        // Header animation
        gsap.fromTo(
          headerRef.current?.children || [],
          { opacity: 0, y: -20 },
          { 
            opacity: 1, 
            y: 0, 
            duration: 0.5, 
            stagger: 0.1, 
            ease: "power2.out",
            delay: 0.2
          }
        );

        // Sidebar slide in
        gsap.fromTo(
          sidebarRef.current,
          { opacity: 0, x: -30 },
          { 
            opacity: 1, 
            x: 0, 
            duration: 0.6, 
            ease: "power2.out",
            delay: 0.3
          }
        );

        // Products area fade in
        gsap.fromTo(
          productsRef.current,
          { opacity: 0, x: 30 },
          { 
            opacity: 1, 
            x: 0, 
            duration: 0.6, 
            ease: "power2.out",
            delay: 0.4
          }
        );
      });

      return () => ctx.revert();
    });
  }, []);

  const getCategoryDisplayName = () => {
    if (searchQuery) return `Search results for "${searchQuery}"`;
    if (category) return category.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    return "All Products";
  };

  return (
    <div 
      ref={pageRef}
      className="min-h-screen bg-gradient-nature"
    >
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-sage-300 rounded-full organic-shape animate-float"></div>
        <div className="absolute top-40 right-16 w-24 h-24 bg-earth-300 rounded-full organic-shape-alt animate-float" style={{ animationDelay: '1s' }}></div>
        <Leaf className="absolute top-60 left-1/4 w-16 h-16 text-sage-400 animate-float" style={{ animationDelay: '2s' }} />
        <Sparkles className="absolute bottom-40 right-1/3 w-12 h-12 text-earth-400 animate-float" style={{ animationDelay: '0.5s' }} />
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div 
          ref={headerRef}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <Leaf className="w-6 h-6 text-sage-600" />
            <h1 className="heading-nature text-3xl sm:text-4xl lg:text-5xl">
              {getCategoryDisplayName()}
            </h1>
          </div>
          
          <p className="text-nature text-lg mb-6">
            Discover our premium collection of natural and herbal products
          </p>

          {/* Mobile Filter Toggle & View Mode */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-sage-200 hover:bg-white transition-colors"
            >
              <SlidersHorizontal className="w-4 h-4 text-sage-600" />
              <span className="text-sage-700 font-medium">Filters</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === "grid" 
                    ? "bg-red-100 text-red-900" 
                    : "text-sage-500 hover:text-red-900"
                }`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === "list" 
                    ? "bg-red-100 text-red-900" 
                    : "text-sage-500 hover:text-red-900"
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* SIDEBAR */}
          <div 
            ref={sidebarRef}
            className={`lg:col-span-1 ${showFilters ? 'block' : 'hidden lg:block'}`}
          >
            <div className="sticky top-24">
              <EnhancedSidebar
                selectedCategory={category}
                onFiltersChange={setFilters}
              />
            </div>
          </div>

          {/* PRODUCTS */}
          <div 
            ref={productsRef}
            className="lg:col-span-3"
          >
            <ProductsClient 
              categorySlug={category} 
              filters={filters}
              viewMode={viewMode}
              searchQuery={searchQuery}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
