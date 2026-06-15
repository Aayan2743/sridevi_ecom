"use client";

import React, { useEffect, useState, useRef } from "react";
import {
  Search,
  User,
  ShoppingCart,
  ChevronDown,
  Heart,
  Menu,
  X,
  Leaf,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import api from "@/lib/api";
import { animations, safeAnimate } from "@/lib/gsap-utils";

import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useWishlist } from "@/contexts/WishlistContext";

import Cart from "./Cart";
import LoginModal from "./LoginModal";
import { useHome } from "@/contexts/HomeContext";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Header() {
  const router = useRouter();
  const { menuCategories } = useHome();

  const categories = menuCategories || [];

  const searchParams = useSearchParams();
  const activeCategory = searchParams.get("category");

  // Refs for animations
  const headerRef = useRef(null);
  const logoRef = useRef(null);
  const searchRef = useRef(null);
  const navRef = useRef(null);
  const topBarRef = useRef(null);

  // const [categories, setCategories] = useState([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [showCart, setShowCart] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [logo, setLogo] = useState("/logo.webp");
  const [isScrolled, setIsScrolled] = useState(false);

  const { getTotalItems } = useCart();
  const { user, isAuthenticated, logout } = useAuth();

  /* ================= SCROLL EFFECT ================= */
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* ================= GSAP ANIMATIONS ================= */
  useEffect(() => {
    safeAnimate(() => {
      const ctx = gsap.context(() => {
        // Header entrance animation
        gsap.fromTo(
          headerRef.current,
          { y: -100, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" },
        );

        // Logo animation with floating effect
        gsap.fromTo(
          logoRef.current,
          { scale: 0.8, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.6,
            delay: 0.2,
            ease: "back.out(1.7)",
          },
        );

        // Search bar slide in
        gsap.fromTo(
          searchRef.current,
          { x: 50, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.6, delay: 0.4, ease: "power2.out" },
        );

        // Navigation stagger animation
        if (navRef.current) {
          gsap.fromTo(
            navRef.current.children,
            { y: 20, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.5,
              stagger: 0.1,
              delay: 0.6,
              ease: "power2.out",
            },
          );
        }

        // Top bar slide down
        gsap.fromTo(
          topBarRef.current,
          { height: 0, opacity: 0 },
          { height: "auto", opacity: 1, duration: 0.5, ease: "power2.out" },
        );

        // Scroll-triggered header transformation
        ScrollTrigger.create({
          trigger: "body",
          start: "top -20px",
          end: "bottom bottom",
          onUpdate: (self) => {
            if (self.direction === 1 && self.progress > 0.01) {
              gsap.to(headerRef.current, {
                backdropFilter: "blur(20px)",
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                boxShadow: "0 8px 30px rgba(76, 175, 80, 0.12)",
                duration: 0.3,
              });
            } else if (self.direction === -1 && self.progress < 0.01) {
              gsap.to(headerRef.current, {
                backdropFilter: "blur(0px)",
                backgroundColor: "rgba(255, 255, 255, 1)",
                boxShadow: "0 4px 20px rgba(76, 175, 80, 0.08)",
                duration: 0.3,
              });
            }
          },
        });
      });

      return () => ctx.revert();
    });
  }, []);

  /* ================= FETCH CATEGORIES ================= */

  /* ================= FETCH LOGO ================= */
  useEffect(() => {
    const loadLogo = async () => {
      try {
        const res = await api.get("/ecom/app-logo-settings");
        if (res.data?.success && res.data?.data?.app_logo) {
          setLogo(res.data.data.app_logo_url);
        }
      } catch (err) {
        console.error("Logo load failed", err.response?.data || err.message);
      }
    };

    loadLogo();
  }, []);

  /* ================= HANDLERS ================= */
  const handleCategoryClick = (slug) => {
    setShowCategoryMenu(false);
    setShowMobileSidebar(false);
    router.push(slug ? `/products?category=${slug}` : "/products");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setShowMobileSidebar(false);
    router.push(`/products?q=${encodeURIComponent(searchQuery)}`);
  };

  const handleLogoClick = () => {
    setSearchQuery("");
    router.push("/");
  };

  const handleNavigate = (path) => {
    setShowMobileSidebar(false);
    router.push(path);
  };

  /* ================= UI ================= */
  return (
    <>
      <header
        ref={headerRef}
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-md shadow-nature-md"
            : "bg-white shadow-nature"
        }`}
      >
        {/* NATURE-INSPIRED TOP BAR */}
        <div
          ref={topBarRef}
          className="bg-gradient-to-r from-sage-600 via-sage-500 to-earth-600 text-white py-3 text-center relative overflow-hidden"
        >
          {/* Floating leaf decorations */}
          <div className="absolute inset-0 opacity-20">
            <Leaf
              className="absolute top-1 left-4 w-4 h-4 animate-float"
              style={{ animationDelay: "0s" }}
            />
            <Leaf
              className="absolute top-2 right-8 w-3 h-3 animate-float"
              style={{ animationDelay: "1s" }}
            />
            <Leaf
              className="absolute top-1 left-1/3 w-3 h-3 animate-float"
              style={{ animationDelay: "2s" }}
            />
            <Leaf
              className="absolute top-2 right-1/4 w-4 h-4 animate-float"
              style={{ animationDelay: "0.5s" }}
            />
          </div>

          <div className="relative z-10 px-4">
            <p className="text-sm sm:text-base font-medium font-serif">
              🌿 Welcome to Sridevi Herbal & Co – Purely Natural Care 🌿
            </p>
            <p className="text-xs sm:text-sm opacity-90 mt-1">
              Trusted by crores • Free delivery • Cash on delivery
            </p>
          </div>
        </div>

        {/* MAIN HEADER */}
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* MOBILE MENU BUTTON */}
            <button
              onClick={() => setShowMobileSidebar(true)}
              className="lg:hidden p-2 text-sage-600 hover:text-sage-700 hover:bg-sage-50 rounded-full transition-nature"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* LOGO */}
            <button
              ref={logoRef}
              onClick={handleLogoClick}
              className="flex items-center gap-3 flex-shrink-0 group"
            >
              <div className="relative">
                <img
                  src={logo}
                  alt="Logo"
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full shadow-nature transition-nature group-hover:shadow-nature-md"
                />
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-sage-200/20 to-earth-200/20 opacity-0 group-hover:opacity-100 transition-nature"></div>
              </div>
              <div className="hidden md:block">
                <h1 className="text-xl lg:text-2xl font-bold font-serif text-gradient">
                  Sridevi Herbal & Co
                </h1>
                <p className="text-sm text-sage-600 font-medium">
                  Pure Herbal Living
                </p>
              </div>
            </button>

            {/* SEARCH */}
            <form
              ref={searchRef}
              onSubmit={handleSearch}
              className="relative flex-1 max-w-2xl mx-4 sm:mx-8"
            >
              <div className="relative group">
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for natural products..."
                  className="w-full px-4 sm:px-6 py-3 text-sm bg-sage-50/50 border-2 border-sage-200 rounded-full focus:ring-2 focus:ring-sage-400 focus:border-sage-400 focus:outline-none transition-nature placeholder-sage-500"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-red-900 text-white rounded-full hover:bg-red-800 transition-nature group-hover:scale-105"
                >
                  <Search className="w-4 h-4" />
                </button>
              </div>
            </form>

            {/* RIGHT MENU */}
            <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
              <a
                href="/about-us"
                className="hidden lg:block text-sm font-medium text-sage-700 hover:text-sage-800 transition-nature relative group"
              >
                About Us
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-sage-500 transition-all duration-300 group-hover:w-full"></span>
              </a>

              {/* PROFILE */}
              <div className="relative">
                <button
                  onClick={() =>
                    isAuthenticated
                      ? setShowProfileMenu(!showProfileMenu)
                      : setShowLogin(true)
                  }
                  className="flex items-center gap-2 p-2 text-sage-600 hover:text-sage-700 hover:bg-sage-50 rounded-full transition-nature group"
                >
                  <div className="relative">
                    <User className="w-6 h-6" />
                    {isAuthenticated && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-sage-500 rounded-full"></div>
                    )}
                  </div>
                  <ChevronDown className="w-4 h-4 hidden sm:block group-hover:rotate-180 transition-transform duration-300" />
                </button>

                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-white/95 backdrop-blur-md border border-sage-200 rounded-2xl shadow-nature-lg z-50 overflow-hidden">
                    <div className="px-4 py-3 bg-gradient-to-r from-sage-50 to-earth-50 border-b border-sage-200">
                      <p className="text-xs text-sage-600 font-medium">
                        Signed in as
                      </p>
                      <p className="font-semibold text-sm text-sage-800">
                        {user?.phone}
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        router.push("/account");
                        setShowProfileMenu(false);
                      }}
                      className="w-full px-4 py-3 text-sm text-left hover:bg-sage-50 transition-nature flex items-center gap-3"
                    >
                      <Heart className="w-4 h-4 text-sage-500" />
                      My Account
                    </button>

                    <button
                      onClick={logout}
                      className="w-full px-4 py-3 text-sm text-left text-red-600 hover:bg-red-50 transition-nature"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>

              {/* CART */}
              <button
                onClick={() => setShowCart(true)}
                className="relative p-2 text-sage-600 hover:text-sage-700 hover:bg-sage-50 rounded-full transition-nature group"
              >
                <ShoppingCart className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
                {getTotalItems() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-sage-500 to-sage-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-medium shadow-nature animate-pulse-soft">
                    {getTotalItems()}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* CATEGORY NAV - Desktop Only */}
        <nav className="hidden lg:block bg-gradient-to-r from-sage-50 via-cream-50 to-earth-50 border-t border-sage-200/50">
          <div className="container mx-auto px-6 py-3">
            <div
              ref={navRef}
              className="flex items-center justify-between gap-6"
            >
              <div className="flex gap-8">
                {(categories || []).slice(0, 8).map((c) => (
                  <button
                    key={c.id}
                    onClick={() => handleCategoryClick(c.slug)}
                    className={`text-sm font-medium whitespace-nowrap pb-2 relative transition-nature group ${
                      activeCategory === c.slug
                        ? "text-sage-700"
                        : "text-sage-600 hover:text-sage-700"
                    }`}
                  >
                    {c.name}
                    <span
                      className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-sage-500 to-earth-500 transition-all duration-300 ${
                        activeCategory === c.slug
                          ? "w-full"
                          : "w-0 group-hover:w-full"
                      }`}
                    ></span>
                  </button>
                ))}

                <button
                  onClick={() => setShowCategoryMenu(true)}
                  className="flex items-center gap-2 text-sm font-medium text-sage-600 hover:text-sage-700 transition-nature group"
                >
                  More
                  <ChevronDown className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300" />
                </button>
              </div>

              <div className="flex gap-8 text-sm">
                <button
                  onClick={() => router.push("/bath-powder-story")}
                  className="whitespace-nowrap font-medium text-sage-600 hover:text-sage-700 transition-nature relative group"
                >
                  Bath Powder Story
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-sage-500 transition-all duration-300 group-hover:w-full"></span>
                </button>
                <button
                  onClick={() => router.push("/success-story")}
                  className="whitespace-nowrap font-medium text-sage-600 hover:text-sage-700 transition-nature relative group"
                >
                  Success Story
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-sage-500 transition-all duration-300 group-hover:w-full"></span>
                </button>
              </div>
            </div>
          </div>
        </nav>
      </header>

      {/* NATURE-INSPIRED MOBILE SIDEBAR */}
      {showMobileSidebar && (
        <>
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 lg:hidden"
            onClick={() => setShowMobileSidebar(false)}
          />
          <div className="fixed left-0 top-0 h-full w-[320px] bg-gradient-to-b from-white via-sage-50/30 to-cream-50/30 z-50 shadow-nature-lg lg:hidden overflow-y-auto">
            {/* Sidebar Header */}
            <div className="bg-gradient-to-r from-sage-600 via-sage-500 to-earth-600 text-white p-6 relative overflow-hidden">
              {/* Floating decorations */}
              <div className="absolute inset-0 opacity-20">
                <Leaf className="absolute top-2 right-4 w-6 h-6 animate-float" />
                <Leaf
                  className="absolute bottom-3 left-6 w-4 h-4 animate-float"
                  style={{ animationDelay: "1s" }}
                />
              </div>

              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={logo}
                    alt="Logo"
                    className="w-10 h-10 rounded-full shadow-nature"
                  />
                  <div>
                    <span className="font-serif font-semibold text-lg">
                      Menu
                    </span>
                    <p className="text-xs opacity-90">Natural Products</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowMobileSidebar(false)}
                  className="p-2 hover:bg-white/20 rounded-full transition-nature"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* User Section */}
            <div className="p-6 border-b border-sage-200/50 bg-gradient-to-r from-sage-50/50 to-cream-50/50">
              {isAuthenticated ? (
                <div>
                  <p className="text-xs text-sage-600 font-medium">
                    Signed in as
                  </p>
                  <p className="font-semibold text-sage-800 mt-1">
                    {user?.phone}
                  </p>
                  <button
                    onClick={() => handleNavigate("/account")}
                    className="mt-4 w-full bg-gradient-to-r from-sage-500 to-sage-600 text-white py-3 rounded-full text-sm font-medium shadow-nature hover:shadow-nature-md transition-nature"
                  >
                    My Account
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setShowMobileSidebar(false);
                    setShowLogin(true);
                  }}
                  className="w-full bg-gradient-to-r from-sage-500 to-sage-600 text-white py-3 rounded-full text-sm font-medium shadow-nature hover:shadow-nature-md transition-nature"
                >
                  Login / Sign Up
                </button>
              )}
            </div>

            {/* Categories */}
            <div className="p-6">
              <h3 className="text-xs font-semibold text-sage-600 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Leaf className="w-3 h-3" />
                Categories
              </h3>
              <button
                onClick={() => handleCategoryClick(null)}
                className={`block w-full text-left py-3 px-4 rounded-2xl text-sm mb-2 transition-nature ${
                  !activeCategory
                    ? "bg-gradient-to-r from-sage-100 to-cream-100 text-sage-700 font-semibold shadow-nature"
                    : "text-sage-600 hover:bg-sage-50"
                }`}
              >
                All Products
              </button>
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => handleCategoryClick(c.slug)}
                  className={`block w-full text-left py-3 px-4 rounded-2xl text-sm mb-2 transition-nature ${
                    activeCategory === c.slug
                      ? "bg-gradient-to-r from-sage-100 to-cream-100 text-sage-700 font-semibold shadow-nature"
                      : "text-sage-600 hover:bg-sage-50"
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>

            {/* Quick Links */}
            <div className="p-6 border-t border-sage-200/50">
              <h3 className="text-xs font-semibold text-sage-600 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Leaf className="w-3 h-3" />
                Quick Links
              </h3>
              <button
                onClick={() => handleNavigate("/about-us")}
                className="block w-full text-left py-3 px-4 rounded-2xl text-sm text-sage-600 hover:bg-sage-50 transition-nature mb-2"
              >
                About Us
              </button>
              <button
                onClick={() => handleNavigate("/bath-powder-story")}
                className="block w-full text-left py-3 px-4 rounded-2xl text-sm text-sage-600 hover:bg-sage-50 transition-nature mb-2"
              >
                Bath Powder Story
              </button>
              <button
                onClick={() => handleNavigate("/success-story")}
                className="block w-full text-left py-3 px-4 rounded-2xl text-sm text-sage-600 hover:bg-sage-50 transition-nature mb-2"
              >
                Success Story
              </button>

              {isAuthenticated && (
                <button
                  onClick={logout}
                  className="block w-full text-left py-3 px-4 rounded-2xl text-sm text-red-600 hover:bg-red-50 transition-nature mt-4"
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        </>
      )}
      {/* NATURE-INSPIRED CATEGORY MODAL */}
      {showCategoryMenu && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 max-w-3xl w-full max-h-[80vh] overflow-y-auto shadow-nature-lg border border-sage-200">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-serif font-semibold text-2xl text-sage-800 mb-2">
                  All Categories
                </h3>
                <p className="text-sage-600 text-sm">
                  Explore our natural product categories
                </p>
              </div>
              <button
                onClick={() => setShowCategoryMenu(false)}
                className="text-sage-500 hover:text-sage-700 p-2 hover:bg-sage-50 rounded-full transition-nature"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => handleCategoryClick(c.slug)}
                  className="text-left p-4 text-sm bg-gradient-to-br from-sage-50 to-cream-50 hover:from-sage-100 hover:to-cream-100 rounded-2xl transition-nature shadow-nature hover:shadow-nature-md border border-sage-200/50"
                >
                  <span className="font-medium text-sage-700">{c.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <Cart isOpen={showCart} onClose={() => setShowCart(false)} />
      <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} />
    </>
  );
}
