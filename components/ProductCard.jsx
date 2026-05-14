"use client";

import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { ShoppingCart, Heart, Play, Star, Leaf, Sparkles } from "lucide-react";
import { gsap } from "gsap";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { animations, safeAnimate } from "@/lib/gsap-utils";
import VideoPopup from "./VideoPopup";

export default function ProductCard({ product, variant = "default" }) {
  const router = useRouter();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { isAuthenticated, openLogin } = useAuth();

  // Refs for animations
  const cardRef = useRef(null);
  const imageRef = useRef(null);
  const contentRef = useRef(null);
  const badgeRef = useRef(null);

  const [showVideo, setShowVideo] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const inWishlist = isInWishlist(product.id);
  const variants = product.variant_combinations || [];
  const firstVariant = variants[0] || null;
  const inStockVariant =
    variants.find((v) => Number(v?.quantity || 0) > 0) || firstVariant;
  const isShowcase = variant === "showcase";

  const toNumber = (value) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  };

  const primaryImage =
    product.images?.find((img) => img.is_primary)?.image_url ||
    product.images?.[0]?.image_url ||
    "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&h=400&fit=crop";

  const rawDiscount =
    toNumber(inStockVariant?.discount) ??
    toNumber(firstVariant?.discount) ??
    toNumber(product.discount) ??
    null;

  const price =
    toNumber(inStockVariant?.amount) ??
    toNumber(product.min_variant_price) ??
    toNumber(product.final_price) ??
    toNumber(inStockVariant?.extra_price) ??
    toNumber(product.price) ??
    0;

  const originalPrice =
    toNumber(inStockVariant?.extra_price) ??
    toNumber(firstVariant?.extra_price) ??
    (price > 0 && rawDiscount > 0 ? Math.round(price / (1 - rawDiscount / 100)) : null) ??
    null;

  const computedDiscount =
    originalPrice && originalPrice > price
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : null;

  const discountPercent =
    computedDiscount && computedDiscount > 0
      ? computedDiscount
      : rawDiscount && rawDiscount > 0 && rawDiscount <= 100
        ? Math.round(rawDiscount)
        : null;

  const category =
    product.category?.name || product.category_name || product.category_main?.name;

  const videoUrl = product.videos?.[0]?.video_url;

  /* ================= GSAP ANIMATIONS ================= */
  useEffect(() => {
    safeAnimate(() => {
      // Initial card animation
      animations.fadeUp(cardRef.current, 0);
      
      // Floating animation for the card
      animations.float(cardRef.current);
    });
  }, []);

  const handleMouseEnter = () => {
    setIsHovered(true);
    safeAnimate(() => {
      gsap.to(cardRef.current, {
        y: -8,
        scale: 1.02,
        boxShadow: "0 15px 40px rgba(76, 175, 80, 0.15)",
        duration: 0.3,
        ease: "power2.out",
      });

      gsap.to(imageRef.current, {
        scale: 1.1,
        duration: 0.4,
        ease: "power2.out",
      });

      if (badgeRef.current) {
        gsap.to(badgeRef.current, {
          scale: 1.1,
          rotate: 5,
          duration: 0.3,
          ease: "back.out(1.7)",
        });
      }
    });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    safeAnimate(() => {
      gsap.to(cardRef.current, {
        y: 0,
        scale: 1,
        boxShadow: "0 4px 20px rgba(76, 175, 80, 0.08)",
        duration: 0.3,
        ease: "power2.out",
      });

      gsap.to(imageRef.current, {
        scale: 1,
        duration: 0.4,
        ease: "power2.out",
      });

      if (badgeRef.current) {
        gsap.to(badgeRef.current, {
          scale: 1,
          rotate: 0,
          duration: 0.3,
          ease: "power2.out",
        });
      }
    });
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();

    if (!price || !primaryImage) {
      toast.error("Product information incomplete");
      return;
    }

    const selectedVariant =
      product.variant_combinations?.find((v) => Number(v?.quantity || 0) > 0) ||
      product.variant_combinations?.[0];

    if (!selectedVariant) {
      toast.error("No variants available");
      return;
    }

    const variantPrice =
      toNumber(selectedVariant.amount) ??
      toNumber(selectedVariant.extra_price) ??
      toNumber(selectedVariant.price) ??
      price;

    const variantStock = Number(selectedVariant.quantity || 0);

    // Add to cart animation
    safeAnimate(() => {
      gsap.to(e.target, {
        scale: 0.95,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        ease: "power2.inOut",
      });
    });

    addToCart({
      id: product.id,
      variationId: selectedVariant.id,
      name: product.name,
      price: variantPrice,
      image: primaryImage,
      stock: variantStock,
      category: category,
    });

    toast.success("Added to cart!", {
      description: `${product.name} has been added to your cart.`,
    });
  };
  const handleOpenProduct = () => {
    if (product.slug) {
      router.push(`/product/details?slug=${product.slug}`);
    }
  };

  const handleWishlist = (e) => {
    e.stopPropagation();

    if (!isAuthenticated) {
      openLogin();
      return;
    }

    // Wishlist animation
    safeAnimate(() => {
      gsap.to(e.target, {
        scale: 1.2,
        duration: 0.2,
        yoyo: true,
        repeat: 1,
        ease: "power2.inOut",
      });
    });

    toggleWishlist(product);
    toast.success(inWishlist ? "Removed from wishlist" : "Added to wishlist");
  };

  const handleVideoClick = (e) => {
    e.stopPropagation();
    setShowVideo(true);
  };

  if (!product.name || !primaryImage) {
    return null;
  }

  return (
    <>
      <div
        ref={cardRef}
        className="relative bg-gradient-to-br from-white via-sage-50/30 to-cream-50/30 rounded-3xl border border-sage-200/50 overflow-hidden group cursor-pointer shadow-nature hover:shadow-nature-lg transition-all duration-500 backdrop-blur-sm"
        onClick={handleOpenProduct}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Organic background decoration */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-4 right-6 w-16 h-16 bg-sage-300 rounded-full organic-shape"></div>
          <div className="absolute bottom-8 left-4 w-12 h-12 bg-earth-300 rounded-full organic-shape-alt"></div>
        </div>

        {/* Discount Badge */}
        {discountPercent && (
          <div 
            ref={badgeRef}
            className="absolute top-3 left-3 z-10 bg-gradient-to-r from-red-900 to-red-800 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md flex items-center gap-1"
          >
            <Sparkles className="w-3 h-3" />
            -{discountPercent}%
          </div>
        )}

        {/* Wishlist Button */}
        <button
          onClick={handleWishlist}
          className="absolute top-3 right-3 z-10 bg-white/90 backdrop-blur-sm p-2.5 rounded-full shadow-nature hover:shadow-nature-md transition-all duration-300 group/heart"
        >
          <Heart
            className={`w-4 h-4 transition-all duration-300 group-hover/heart:scale-110 ${
              inWishlist
                ? "fill-red-500 text-red-500"
                : "text-sage-600 hover:text-red-500"
            }`}
          />
        </button>

        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-sage-50 to-cream-50 rounded-t-3xl">
          <img
            ref={imageRef}
            src={primaryImage}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500"
            loading="lazy"
          />

          {/* Natural overlay on hover */}
          <div className={`absolute inset-0 bg-gradient-to-t from-sage-900/20 via-transparent to-transparent transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}></div>

          {/* Video Play Button */}
          {videoUrl && (
            <button
              onClick={handleVideoClick}
              className="absolute bottom-3 right-3 bg-red-900/90 backdrop-blur-sm hover:bg-red-800 text-white p-2 rounded-full transition-all duration-300 hover:scale-110"
            >
              <Play className="w-4 h-4" />
            </button>
          )}

          {/* Natural elements decoration */}
          <div className="absolute top-2 left-2 opacity-20">
            <Leaf className="w-4 h-4 text-sage-600 animate-float" />
          </div>
        </div>

        {/* Product Content */}
        <div ref={contentRef} className="p-4 space-y-3">
          {/* Category */}
          {category && (
            <div className="flex items-center gap-2">
              <Leaf className="w-3 h-3 text-sage-500" />
              <span className="text-xs text-sage-600 uppercase tracking-wider font-medium">
                {category}
              </span>
            </div>
          )}

          {/* Product Name */}
          <h3 className="text-sm font-semibold text-sage-800 line-clamp-2 min-h-[2.5rem] font-serif leading-tight">
            {product.name}
          </h3>

          {/* Rating (if showcase variant) */}
          {isShowcase && (
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, idx) => (
                <Star
                  key={idx}
                  className={`w-3.5 h-3.5 ${idx < 4 ? "fill-earth-400 text-earth-400" : "text-sage-200"}`}
                />
              ))}
              <span className="text-xs text-sage-600 ml-1">(148)</span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-sage-800 font-serif">
              ₹{price.toLocaleString("en-IN")}
            </span>
            {originalPrice && originalPrice > price && (
              <span className="text-sm text-sage-500 line-through">
                ₹{originalPrice.toLocaleString("en-IN")}
              </span>
            )}
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            className="w-full bg-red-900 hover:bg-red-800 text-white font-medium py-3 rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg group/cart"
          >
            <ShoppingCart className="w-4 h-4 group-hover/cart:scale-110 transition-transform duration-300" />
            <span className="text-sm">Add to Cart</span>
          </button>
        </div>

        {/* Hover glow effect */}
        <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br from-sage-400/10 via-transparent to-earth-400/10 transition-opacity duration-300 pointer-events-none ${isHovered ? 'opacity-100' : 'opacity-0'}`}></div>
      </div>

      <VideoPopup
        videoUrl={videoUrl}
        isOpen={showVideo}
        onClose={() => setShowVideo(false)}
      />
    </>
  );
}
