"use client";

import { useEffect, useState, useRef } from "react";
import { Loader2, Package, Grid, List, ArrowUpDown, Filter } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ProductCard from "@/components/ProductCard";
import api from "@/lib/api";
import { safeAnimate } from "@/lib/gsap-utils";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function ProductsClient({ categorySlug, filters, viewMode = "grid", searchQuery }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalProducts, setTotalProducts] = useState(0);
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");

  // Refs for animations
  const headerRef = useRef(null);
  const gridRef = useRef(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = {
          ...(categorySlug ? { category: categorySlug } : {}),
          ...(searchQuery ? { q: searchQuery } : {}),
          ...(filters || {}),
          sort: sortBy,
          order: sortOrder,
        };

        const res = await api.get("/ecom/products-main", { params });

        const data = res.data?.data?.data || [];
        const total = res.data?.data?.total || data.length;
        
        setProducts(data);
        setTotalProducts(total);

        // Animate products on load
        safeAnimate(() => {
          gsap.fromTo(
            ".product-card-item",
            { opacity: 0, y: 30, scale: 0.95 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.6,
              stagger: 0.1,
              ease: "power2.out",
              delay: 0.2,
            }
          );
        });

      } catch (err) {
        console.error(err);
        setProducts([]);
        setTotalProducts(0);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categorySlug, searchQuery, JSON.stringify(filters), sortBy, sortOrder]);

  const handleSortChange = (newSortBy) => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(newSortBy);
      setSortOrder("asc");
    }
  };

  // Loading State
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-16 h-16 bg-sage-100 rounded-full flex items-center justify-center mb-6 animate-pulse-soft">
          <Loader2 className="w-8 h-8 text-sage-600 animate-spin" />
        </div>
        <h3 className="heading-nature text-xl mb-2">Loading Natural Products</h3>
        <p className="text-nature">Discovering the best herbal solutions for you...</p>
      </div>
    );
  }

  // Empty State
  if (!products.length) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-24 h-24 bg-sage-100 rounded-full flex items-center justify-center mb-6 organic-shape">
          <Package className="w-12 h-12 text-sage-400" />
        </div>
        <h3 className="heading-nature text-2xl mb-4">No Products Found</h3>
        <p className="text-nature text-center max-w-md mb-6">
          We couldn&apos;t find any products matching your criteria. Try adjusting
          your filters or search terms.
        </p>
        <button 
          onClick={() => window.location.reload()}
          className="btn-nature"
        >
          Reset Filters
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Results Header */}
      <div 
        ref={headerRef}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-white/60 backdrop-blur-sm rounded-2xl border border-sage-200/50 shadow-nature"
      >
        <div>
          <p className="text-sage-800 font-medium">
            Showing <span className="font-bold">{products.length}</span> of{" "}
            <span className="font-bold">{totalProducts}</span> natural products
          </p>
          {searchQuery && (
            <p className="text-sm text-sage-600 mt-1">
              Search results for &ldquo;{searchQuery}&rdquo;
            </p>
          )}
        </div>

        {/* Sort Options */}
        <div className="flex items-center gap-3">
          <span className="text-sm text-sage-600 font-medium">Sort by:</span>
          <div className="flex gap-2">
            {[
              { key: "name", label: "Name" },
              { key: "price", label: "Price" },
              { key: "created_at", label: "Newest" },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => handleSortChange(key)}
                className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  sortBy === key
                    ? "bg-red-100 text-red-900"
                    : "text-sage-600 hover:text-red-900 hover:bg-red-50"
                }`}
              >
                {label}
                {sortBy === key && (
                  <ArrowUpDown className={`w-3 h-3 ${sortOrder === "desc" ? "rotate-180" : ""} transition-transform`} />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Products Grid/List */}
      <div 
        ref={gridRef}
        className={
          viewMode === "grid"
            ? "grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
            : "space-y-4"
        }
      >
        {products.map((product, index) => (
          <div
            key={product.id}
            className="product-card-item"
          >
            <ProductCard 
              product={product} 
              variant={viewMode === "list" ? "list" : "default"}
            />
          </div>
        ))}
      </div>

      {/* Load More / Pagination could go here */}
      {products.length < totalProducts && (
        <div className="text-center py-8">
          <button className="btn-nature-outline">
            Load More Products
          </button>
        </div>
      )}
    </div>
  );
}
