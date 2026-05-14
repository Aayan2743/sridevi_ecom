"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { 
  Leaf, 
  Filter, 
  DollarSign, 
  Tag, 
  Sparkles, 
  RotateCcw,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { gsap } from "gsap";
import api from "@/lib/api";
import { safeAnimate } from "@/lib/gsap-utils";

export default function EnhancedSidebar({ selectedCategory, onFiltersChange }) {
  const router = useRouter();
  const sidebarRef = useRef(null);

  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    price: true,
    brands: true,
  });

  const [price, setPrice] = useState({
    min: 0,
    max: 3000,
  });

  const [sortBy, setSortBy] = useState("popularity");

  /* ================= ANIMATIONS ================= */
  useEffect(() => {
    safeAnimate(() => {
      gsap.fromTo(
        sidebarRef.current?.children || [],
        { opacity: 0, x: -20 },
        {
          opacity: 1,
          x: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: "power2.out",
          delay: 0.2,
        }
      );
    });
  }, []);

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    const load = async () => {
      try {
        const [catRes, brandRes] = await Promise.all([
          api.get("/ecom/menu"),
          api.get("/ecom/list-brand"),
        ]);

        const normalizedCategories = (catRes.data ?? []).map((c, index) => ({
          id: index + 1,
          name: c.label,
          slug: c.key,
        }));

        setCategories(normalizedCategories);
        setBrands(brandRes.data?.data ?? []);
      } catch (error) {
        console.error("Failed to load sidebar data:", error);
      }
    };

    load();
  }, []);

  /* ================= HANDLERS ================= */
  const toggleBrand = (id) => {
    setSelectedBrands((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const applyFilters = () => {
    if (onFiltersChange) {
      onFiltersChange({
        brands: selectedBrands,
        price_min: price.min,
        price_max: price.max,
        sortBy,
      });
    }
  };

  const clearFilters = () => {
    setSelectedBrands([]);
    setPrice({ min: 0, max: 3000 });
    setSortBy("popularity");
    if (onFiltersChange) {
      onFiltersChange({});
    }
  };

  const SectionHeader = ({ title, icon: Icon, section, count }) => (
    <button
      onClick={() => toggleSection(section)}
      className="flex items-center justify-between w-full p-3 bg-gradient-to-r from-sage-50 to-cream-50 rounded-xl border border-sage-200/50 hover:from-sage-100 hover:to-cream-100 transition-all duration-300 group"
    >
      <div className="flex items-center gap-3">
        <Icon className="w-5 h-5 text-sage-600 group-hover:text-sage-700 transition-colors" />
        <span className="font-semibold text-sage-800">{title}</span>
        {count && (
          <span className="px-2 py-1 bg-sage-200 text-sage-700 text-xs rounded-full">
            {count}
          </span>
        )}
      </div>
      {expandedSections[section] ? (
        <ChevronUp className="w-4 h-4 text-sage-600 transition-transform duration-300" />
      ) : (
        <ChevronDown className="w-4 h-4 text-sage-600 transition-transform duration-300" />
      )}
    </button>
  );

  return (
    <aside 
      ref={sidebarRef}
      className="w-full bg-white/80 backdrop-blur-sm rounded-3xl border border-sage-200/50 shadow-nature p-6 space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Filter className="w-5 h-5 text-sage-600" />
          <h2 className="font-serif font-bold text-xl text-sage-800">Filters</h2>
        </div>
        <button
          onClick={clearFilters}
          className="flex items-center gap-2 px-3 py-2 text-sm text-sage-600 hover:text-sage-700 hover:bg-sage-50 rounded-lg transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          Clear
        </button>
      </div>

      {/* ================= CATEGORIES ================= */}
      <div className="space-y-3">
        <SectionHeader 
          title="Categories" 
          icon={Leaf} 
          section="categories"
          count={categories.length}
        />
        
        {expandedSections.categories && (
          <div className="space-y-2 pl-4">
            <button
              onClick={() => router.push("/products")}
              className={`flex items-center gap-3 w-full text-left py-2 px-3 rounded-lg transition-colors ${
                !selectedCategory 
                  ? "bg-red-100 text-red-900 font-semibold" 
                  : "text-sage-600 hover:bg-red-50"
              }`}
            >
              <Sparkles className="w-4 h-4" />
              All Products
            </button>

            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => router.push(`/products?category=${c.slug}`)}
                className={`flex items-center gap-3 w-full text-left py-2 px-3 rounded-lg transition-colors ${
                  selectedCategory === c.slug
                    ? "bg-red-100 text-red-900 font-semibold"
                    : "text-sage-600 hover:bg-red-50"
                }`}
              >
                <Leaf className="w-4 h-4" />
                {c.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ================= PRICE RANGE ================= */}
      <div className="space-y-3">
        <SectionHeader 
          title="Price Range" 
          icon={DollarSign} 
          section="price"
        />
        
        {expandedSections.price && (
          <div className="space-y-4 pl-4">
            <div className="flex gap-3 items-center">
              <div className="flex-1">
                <label className="block text-xs text-sage-600 mb-1">Min Price</label>
                <input
                  type="number"
                  value={price.min}
                  min={0}
                  onChange={(e) =>
                    setPrice({
                      ...price,
                      min: Number(e.target.value),
                    })
                  }
                  className="w-full border border-sage-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-sage-400 focus:border-sage-400 transition-colors"
                  placeholder="₹0"
                />
              </div>
              
              <div className="flex items-center justify-center pt-5">
                <span className="text-sage-400">—</span>
              </div>
              
              <div className="flex-1">
                <label className="block text-xs text-sage-600 mb-1">Max Price</label>
                <input
                  type="number"
                  value={price.max}
                  min={price.min}
                  onChange={(e) =>
                    setPrice({
                      ...price,
                      max: Number(e.target.value),
                    })
                  }
                  className="w-full border border-sage-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-sage-400 focus:border-sage-400 transition-colors"
                  placeholder="₹3000"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-sage-600 bg-sage-50 px-3 py-2 rounded-lg">
              <span>₹{price.min}</span>
              <span>to</span>
              <span>₹{price.max}</span>
            </div>
          </div>
        )}
      </div>

      {/* ================= BRANDS ================= */}
      {brands.length > 0 && (
        <div className="space-y-3">
          <SectionHeader 
            title="Brands" 
            icon={Tag} 
            section="brands"
            count={brands.length}
          />
          
          {expandedSections.brands && (
            <div className="space-y-2 pl-4 max-h-48 overflow-y-auto">
              {brands.map((b) => (
                <label
                  key={b.id}
                  className="flex items-center gap-3 text-sm cursor-pointer py-2 px-3 rounded-lg hover:bg-sage-50 transition-colors group"
                >
                  <input
                    type="checkbox"
                    checked={selectedBrands.includes(b.id)}
                    onChange={() => toggleBrand(b.id)}
                    className="w-4 h-4 text-sage-600 border-sage-300 rounded focus:ring-sage-500 focus:ring-2"
                  />
                  <span className="text-sage-700 group-hover:text-sage-800 transition-colors">
                    {b.name}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ================= APPLY FILTERS ================= */}
      <div className="space-y-3 pt-4 border-t border-sage-200">
        <button
          onClick={applyFilters}
          className="w-full bg-gradient-to-r from-sage-500 to-sage-600 hover:from-sage-600 hover:to-sage-700 text-white font-semibold py-3 rounded-xl transition-all duration-300 shadow-nature hover:shadow-nature-md flex items-center justify-center gap-2"
        >
          <Filter className="w-4 h-4" />
          Apply Filters
        </button>
        
        <p className="text-xs text-sage-600 text-center">
          Find the perfect natural products for your needs
        </p>
      </div>
    </aside>
  );
}
