"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { 
  Star, Heart, Share2, ShoppingCart, ArrowLeft, Truck, Shield, Package, 
  Leaf, Award, Clock, Play, Volume2, VolumeX, CheckCircle, Info, 
  Zap, Users, ThumbsUp, Eye 
} from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { toast } from "sonner";
import ProductCard from "./ProductCard";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ProductDetailNew({ product, onBack }) {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const containerRef = useRef(null);
  const imageRef = useRef(null);
  const detailsRef = useRef(null);
  const featuresRef = useRef(null);

  useEffect(() => {
    if (!product || !containerRef.current) return;

    const ctx = gsap.context(() => {
      // Hero section animation
      gsap.fromTo(imageRef.current, 
        { opacity: 0, scale: 0.9, rotateY: -15 },
        { 
          opacity: 1, 
          scale: 1, 
          rotateY: 0,
          duration: 1.2, 
          ease: "power3.out",
          delay: 0.2
        }
      );

      gsap.fromTo(detailsRef.current, 
        { opacity: 0, x: 50 },
        { 
          opacity: 1, 
          x: 0,
          duration: 1, 
          ease: "power3.out",
          delay: 0.4
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [product?.id]);
  /* ================= DERIVED DATA ================= */
  const images = useMemo(() => {
    const productImages =
      product?.images?.map((img) => img.image_url).filter(Boolean) || [];
    
    // Fallback images if no product images
    const fallbackImages = [
      "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600&h=600&fit=crop"
    ];
    
    return productImages.length ? productImages : fallbackImages;
  }, [product?.images]);

  /* ================= NORMALIZE VARIANTS ================= */
  const variations = useMemo(() => {
    return (
      product?.variant_combinations?.map((v) => ({
        id: v.id,
        name: v.values?.map((val) => val.value).join(" / ") || "Variant",
        price: Number(v.amount || v.extra_price),
        originalPrice: Number(v.extra_price),
        stock: v.quantity,
        colorCode: v.values?.find(val => val.color_code)?.color_code,
      })) || []
    );
  }, [product?.variant_combinations]);

  /* ================= STATE ================= */
  const [selectedVariation, setSelectedVariation] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const videoRef = useRef(null);

  const inWishlist = product ? isInWishlist(product.id) : false;

  // Sample video URLs for demonstration
  const sampleVideos = [
    "https://www.w3schools.com/html/mov_bbb.mp4",
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    "https://sample-videos.com/zip/10/mp4/SampleVideo_640x360_1mb.mp4"
  ];
  
  const videoUrl = product?.videos?.[0]?.video_url || sampleVideos[0];

  /* ================= DERIVED VALUES ================= */
  const price =
    selectedVariation?.price ?? Number(product?.min_variant_price) ?? 0;
  const originalPrice =
    selectedVariation?.originalPrice ?? Number(product?.max_variant_price) ?? 0;
  const stock = selectedVariation?.stock ?? 10;
  const discount = originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

  useEffect(() => {
    if (variations.length && !selectedVariation) {
      setSelectedVariation(variations.find((v) => v.stock > 0) || variations[0]);
    }
  }, [variations, selectedVariation]);

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-red-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-900 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading product details...</p>
        </div>
      </div>
    );
  }

  /* ================= ACTIONS ================= */
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

  const toggleVideo = () => {
    if (videoRef.current) {
      if (isVideoPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsVideoPlaying(!isVideoPlaying);
    }
  };
  // Static similar products for now
  const similarProducts = [
    {
      id: 999,
      name: "Premium Herbal Tea",
      slug: "premium-herbal-tea",
      min_variant_price: "350",
      max_variant_price: "400",
      category: { name: "Herbal Teas" },
      images: [{ image_url: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&h=400&fit=crop" }],
      variant_combinations: [{ extra_price: "400", discount: "10", quantity: 10, amount: "350" }],
    },
    {
      id: 998,
      name: "Organic Turmeric Powder",
      slug: "organic-turmeric-powder",
      min_variant_price: "420",
      max_variant_price: "450",
      category: { name: "Spices" },
      images: [{ image_url: "https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=400&h=400&fit=crop" }],
      variant_combinations: [{ extra_price: "450", discount: "5", quantity: 15, amount: "420" }],
    },
    {
      id: 997,
      name: "Ayurvedic Hair Oil",
      slug: "ayurvedic-hair-oil",
      min_variant_price: "380",
      max_variant_price: "420",
      category: { name: "Hair Care" },
      images: [{ image_url: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop" }],
      variant_combinations: [{ extra_price: "420", discount: "8", quantity: 20, amount: "380" }],
    },
    {
      id: 996,
      name: "Natural Face Pack",
      slug: "natural-face-pack",
      min_variant_price: "500",
      max_variant_price: "550",
      category: { name: "Skin Care" },
      images: [{ image_url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop" }],
      variant_combinations: [{ extra_price: "550", discount: "12", quantity: 8, amount: "500" }],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-red-50/20" ref={containerRef}>
      {/* PREMIUM NAVIGATION BAR */}
      <div className="bg-white/95 backdrop-blur-xl border-b border-gray-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-8xl mx-auto px-6 py-5">
          <motion.button
            whileHover={{ x: -8, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onBack}
            className="flex items-center gap-4 text-gray-700 hover:text-red-900 transition-all duration-300 group"
          >
            <div className="p-3 rounded-2xl bg-gray-50 group-hover:bg-red-50 transition-all duration-300 shadow-sm">
              <ArrowLeft className="w-6 h-6" />
            </div>
            <span className="font-semibold text-lg">Back to Products</span>
          </motion.button>
        </div>
      </div>

      {/* MAIN CONTENT CONTAINER */}
      <div className="max-w-8xl mx-auto px-6 py-12">
        {/* HERO PRODUCT SECTION */}
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-12 mb-24">
          
          {/* LEFT: PREMIUM IMAGE GALLERY - 2 COLUMNS */}
          <motion.div
            ref={imageRef}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "power3.out" }}
            className="xl:col-span-2 space-y-6"
          >
            {/* Main Product Image */}
            <div className="relative group">
              <motion.div
                key={selectedImage}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="aspect-square bg-white rounded-3xl overflow-hidden shadow-2xl relative border border-gray-100/50"
              >
                <img
                  src={images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                  onError={(e) => {
                    console.log("Image failed to load, using fallback");
                    e.target.src = "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600&h=600&fit=crop";
                  }}
                />
                
                {/* Premium Discount Badge */}
                {discount > 0 && (
                  <motion.div
                    initial={{ scale: 0, rotate: -15 }}
                    animate={{ scale: 1, rotate: -15 }}
                    className="absolute top-8 left-8 bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white px-8 py-4 rounded-2xl font-bold text-xl shadow-2xl"
                  >
                    <div className="flex items-center gap-3">
                      <Zap className="w-6 h-6" />
                      {discount}% OFF
                    </div>
                  </motion.div>
                )}

                {/* Image Navigation */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={() => setSelectedImage(selectedImage === 0 ? images.length - 1 : selectedImage - 1)}
                      className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/95 hover:bg-white p-4 rounded-full shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
                    >
                      <ArrowLeft className="w-6 h-6 text-gray-700" />
                    </button>
                    <button
                      onClick={() => setSelectedImage(selectedImage === images.length - 1 ? 0 : selectedImage + 1)}
                      className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/95 hover:bg-white p-4 rounded-full shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 rotate-180"
                    >
                      <ArrowLeft className="w-6 h-6 text-gray-700" />
                    </button>
                  </>
                )}

                {/* Image Indicators */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3">
                  {images.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImage(i)}
                      className={`w-4 h-4 rounded-full transition-all duration-300 ${
                        selectedImage === i ? "bg-red-600 scale-125 shadow-lg" : "bg-white/70 hover:bg-white/90"
                      }`}
                    />
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Thumbnail Gallery */}
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {images.map((img, i) => (
                <motion.button
                  key={i}
                  whileHover={{ scale: 1.05, y: -4 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedImage(i)}
                  className={`w-24 h-24 rounded-2xl border-3 overflow-hidden flex-shrink-0 transition-all duration-300 ${
                    selectedImage === i
                      ? "border-red-600 ring-4 ring-red-100 shadow-xl"
                      : "border-gray-200 hover:border-red-300 hover:shadow-lg"
                  }`}
                >
                  <img 
                    src={img} 
                    alt="" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=200&h=200&fit=crop";
                    }}
                  />
                </motion.button>
              ))}
            </div>
          </motion.div>
          {/* CENTER: PREMIUM PRODUCT DETAILS - 2 COLUMNS */}
          <motion.div
            ref={detailsRef}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="xl:col-span-2 space-y-10"
          >
            {/* Premium Category Badge */}
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-red-50 to-red-100 text-red-700 px-6 py-3 rounded-full text-sm font-bold border border-red-200 shadow-sm">
              <Leaf className="w-5 h-5" />
              {product.category?.name || product.category_name || "Premium Product"}
            </div>

            {/* Premium Title Section */}
            <div className="space-y-6">
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight font-serif tracking-tight">
                {product.name}
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed max-w-2xl">
                {product.short_description || "Premium quality herbal product crafted with traditional methods for exceptional results"}
              </p>
            </div>

            {/* Enhanced Rating & Social Proof */}
            <div className="flex items-center gap-8 py-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-7 h-7 ${
                        i < 4 ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-2xl font-bold text-gray-800">4.8</span>
                <span className="text-gray-500 text-lg">(247 reviews)</span>
              </div>
              <div className="flex items-center gap-3 text-green-600">
                <Users className="w-6 h-6" />
                <span className="font-semibold text-lg">1.2k+ sold</span>
              </div>
            </div>

            {/* Premium Pricing Section */}
            <div className="bg-gradient-to-br from-red-50 via-red-100 to-red-50 rounded-3xl p-8 border border-red-200 shadow-lg">
              <div className="flex items-baseline gap-6 mb-4">
                <span className="text-6xl font-bold text-red-900 tracking-tight">
                  ₹{price.toLocaleString('en-IN')}
                </span>
                {originalPrice > price && (
                  <>
                    <span className="text-3xl text-gray-400 line-through">
                      ₹{originalPrice.toLocaleString('en-IN')}
                    </span>
                    <div className="bg-green-500 text-white px-4 py-2 rounded-full text-lg font-bold shadow-lg">
                      Save ₹{(originalPrice - price).toLocaleString('en-IN')}
                    </div>
                  </>
                )}
              </div>
              <p className="text-red-700 font-semibold text-lg">Inclusive of all taxes • Free shipping above ₹999</p>
            </div>

            {/* Premium Stock Status */}
            <div className="flex items-center justify-between bg-white rounded-2xl p-6 border border-gray-200 shadow-lg">
              <div className="flex items-center gap-4">
                {stock > 0 ? (
                  <>
                    <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-green-700 font-bold text-lg">In Stock</span>
                    <span className="text-gray-500 text-lg">({stock} units available)</span>
                  </>
                ) : (
                  <>
                    <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                    <span className="text-red-600 font-bold text-lg">Out of Stock</span>
                  </>
                )}
              </div>
              <div className="flex items-center gap-3 text-gray-500">
                <Eye className="w-5 h-5" />
                <span className="font-medium">156 people viewing</span>
              </div>
            </div>

            {/* Premium Variants Selection */}
            {variations.length > 0 && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-900">Choose Your Variant</h3>
                <div className="grid grid-cols-1 gap-4">
                  {variations.map((v) => (
                    <motion.button
                      key={v.id}
                      whileHover={{ scale: v.stock > 0 ? 1.02 : 1 }}
                      whileTap={{ scale: v.stock > 0 ? 0.98 : 1 }}
                      disabled={v.stock === 0}
                      onClick={() => setSelectedVariation(v)}
                      className={`p-6 rounded-2xl border-2 text-left transition-all duration-300 relative ${
                        selectedVariation?.id === v.id
                          ? "border-red-600 bg-red-50 shadow-xl"
                          : v.stock === 0
                          ? "border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed"
                          : "border-gray-300 hover:border-red-400 hover:bg-red-50 hover:shadow-lg"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        {v.colorCode && (
                          <div
                            className="w-8 h-8 rounded-full border-3 border-white shadow-lg"
                            style={{ backgroundColor: v.colorCode }}
                          />
                        )}
                        <div>
                          <div className="font-bold text-lg">{v.name}</div>
                          <div className="text-gray-500 text-lg">₹{v.price.toLocaleString('en-IN')}</div>
                        </div>
                      </div>
                      {selectedVariation?.id === v.id && (
                        <CheckCircle className="w-6 h-6 text-red-600 absolute top-4 right-4" />
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Premium Action Buttons */}
            <div className="space-y-6 pt-4">
              <motion.button
                whileHover={{ scale: stock > 0 ? 1.02 : 1, y: stock > 0 ? -4 : 0 }}
                whileTap={{ scale: stock > 0 ? 0.98 : 1 }}
                onClick={handleAddToCart}
                disabled={stock === 0}
                className={`w-full py-6 rounded-2xl flex items-center justify-center gap-4 font-bold text-xl transition-all duration-300 shadow-2xl ${
                  stock === 0
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-red-900 via-red-800 to-red-900 hover:from-red-800 hover:via-red-700 hover:to-red-800 text-white shadow-red-900/40 hover:shadow-red-900/60"
                }`}
              >
                <ShoppingCart className="w-7 h-7" />
                {stock === 0 ? "Currently Out of Stock" : "Add to Cart"}
              </motion.button>

              <div className="flex gap-4">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleWishlistToggle}
                  className={`flex-1 py-5 rounded-2xl border-2 transition-all duration-300 flex items-center justify-center gap-3 font-bold text-lg ${
                    inWishlist
                      ? "border-red-300 bg-red-50 text-red-600 shadow-xl"
                      : "border-gray-300 text-gray-700 hover:border-red-400 hover:bg-red-50 hover:shadow-lg"
                  }`}
                >
                  <Heart className={`w-6 h-6 ${inWishlist ? "fill-current" : ""}`} />
                  {inWishlist ? "Saved" : "Save"}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 py-5 rounded-2xl border-2 border-gray-300 text-gray-700 hover:border-gray-400 hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-3 font-bold text-lg"
                >
                  <Share2 className="w-6 h-6" />
                  Share
                </motion.button>
              </div>
            </div>

            {/* Premium Trust Badges */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-gray-200">
              <motion.div
                whileHover={{ y: -6, scale: 1.02 }}
                className="text-center p-6 bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
              >
                <Truck className="w-12 h-12 mx-auto mb-4 text-red-600" />
                <p className="font-bold text-gray-900 mb-2 text-lg">Free Delivery</p>
                <p className="text-gray-500">Orders above ₹999</p>
              </motion.div>
              <motion.div
                whileHover={{ y: -6, scale: 1.02 }}
                className="text-center p-6 bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
              >
                <Shield className="w-12 h-12 mx-auto mb-4 text-red-600" />
                <p className="font-bold text-gray-900 mb-2 text-lg">Secure Payment</p>
                <p className="text-gray-500">100% Protected</p>
              </motion.div>
              <motion.div
                whileHover={{ y: -6, scale: 1.02 }}
                className="text-center p-6 bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
              >
                <Package className="w-12 h-12 mx-auto mb-4 text-red-600" />
                <p className="font-bold text-gray-900 mb-2 text-lg">Easy Returns</p>
                <p className="text-gray-500">7 Days Policy</p>
              </motion.div>
            </div>
          </motion.div>
          {/* RIGHT: PREMIUM VIDEO & INFO SECTION - 1 COLUMN */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="xl:col-span-1 space-y-8"
          >
            {/* Premium Video Player */}
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
              {/* Video Header */}
              <div className="bg-gradient-to-r from-red-900 via-red-800 to-red-900 text-white px-8 py-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                      <Play className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-xl">Product Demo</h3>
                      <p className="text-red-100">Watch & Learn</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => {
                        setIsMuted(!isMuted);
                        if (videoRef.current) {
                          videoRef.current.muted = !isMuted;
                        }
                      }}
                      className="p-3 hover:bg-white/20 rounded-full transition-colors"
                    >
                      {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                    </motion.button>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="font-bold">LIVE</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Video Content */}
              <div className="relative bg-black aspect-video group">
                <video
                  ref={videoRef}
                  src={videoUrl}
                  autoPlay
                  muted={isMuted}
                  loop
                  playsInline
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    console.log("Video error, trying fallback...");
                    const currentIndex = sampleVideos.indexOf(e.target.src);
                    const nextIndex = (currentIndex + 1) % sampleVideos.length;
                    if (nextIndex !== currentIndex) {
                      e.target.src = sampleVideos[nextIndex];
                    }
                  }}
                  onLoadStart={() => console.log("Video loading started")}
                  onCanPlay={() => console.log("Video can play")}
                >
                  Your browser does not support the video tag.
                </video>

                {/* Enhanced Video Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent">
                  <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                    <h4 className="font-bold text-xl mb-3">How to Use {product.name}</h4>
                    <p className="opacity-90 leading-relaxed">
                      Discover the traditional preparation methods and amazing benefits.
                    </p>
                  </div>
                </div>

                {/* Play/Pause Control */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={toggleVideo}
                  className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-all duration-300"
                >
                  <div className="bg-white/30 backdrop-blur-sm rounded-full p-8 border border-white/20">
                    {isVideoPlaying ? (
                      <div className="w-8 h-8 bg-white rounded-sm"></div>
                    ) : (
                      <Play className="w-10 h-10 text-white ml-1" />
                    )}
                  </div>
                </motion.button>

                {/* Video Progress Bar */}
                <div className="absolute bottom-0 left-0 right-0 h-2 bg-white/20">
                  <div className="h-full bg-red-500 w-1/3 transition-all duration-1000"></div>
                </div>
              </div>

              {/* Video Footer */}
              <div className="px-8 py-6 bg-gray-50 border-t">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <ThumbsUp className="w-6 h-6 text-green-600" />
                    <span className="font-semibold text-gray-700">98% found this helpful</span>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    onClick={() => toast.info("Full screen feature coming soon!")}
                    className="text-red-600 hover:text-red-700 font-bold transition-colors"
                  >
                    View Fullscreen
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Premium Benefits Card */}
            <motion.div
              whileHover={{ y: -6, scale: 1.02 }}
              className="bg-gradient-to-br from-green-50 via-emerald-50 to-green-100 rounded-3xl p-8 border border-green-200 shadow-xl"
            >
              <div className="flex items-start gap-6">
                <div className="w-16 h-16 bg-red-900 rounded-3xl flex items-center justify-center flex-shrink-0 shadow-xl">
                  <Leaf className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-green-900 text-xl mb-3">100% Natural & Pure</h4>
                  <p className="text-green-700 leading-relaxed mb-4 text-lg">
                    Crafted using traditional Ayurvedic methods with premium herbs sourced directly from organic farms.
                  </p>
                  <div className="flex items-center gap-3 text-green-600">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-semibold">Certified Organic</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Premium Features List */}
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
              <h4 className="font-bold text-gray-900 text-xl mb-6 flex items-center gap-4">
                <Award className="w-8 h-8 text-red-600" />
                Why Choose This Product?
              </h4>
              <div className="space-y-4">
                {[
                  "100% Natural Ingredients",
                  "Traditional Ayurvedic Formula", 
                  "Lab Tested for Purity",
                  "No Artificial Preservatives",
                  "Sustainably Sourced",
                  "Third-Party Certified"
                ].map((feature, index) => (
                  <motion.div
                    key={feature}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl hover:bg-red-50 transition-colors duration-300"
                  >
                    <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700 font-semibold text-lg">{feature}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Customer Reviews Preview */}
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
              <h4 className="font-bold text-gray-900 text-xl mb-6 flex items-center gap-4">
                <Users className="w-8 h-8 text-red-600" />
                Customer Reviews
              </h4>
              <div className="space-y-6">
                <div className="p-6 bg-yellow-50 rounded-2xl border border-yellow-200">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                      ))}
                    </div>
                    <span className="font-bold text-gray-700">Priya S.</span>
                  </div>
                  <p className="text-gray-600 italic leading-relaxed">
                    &ldquo;Amazing quality! Exactly as shown in the video. Highly
                    recommend!&rdquo;
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  className="w-full py-4 text-red-600 font-bold hover:bg-red-50 rounded-2xl transition-colors text-lg"
                >
                  View All 247 Reviews
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
        {/* PREMIUM PRODUCT DESCRIPTION SECTION */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="bg-white rounded-3xl p-12 shadow-2xl border border-gray-100 mb-24"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-4">
                <Info className="w-10 h-10 text-red-600" />
                Product Details
              </h3>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-600 leading-relaxed text-xl">
                  {product.description || "This premium herbal product is carefully crafted using traditional Ayurvedic methods passed down through generations. Each ingredient is sourced from certified organic farms and processed using time-tested techniques to preserve maximum potency and effectiveness."}
                </p>
              </div>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-4">
                <Clock className="w-10 h-10 text-red-600" />
                Usage Instructions
              </h3>
              <div className="space-y-6">
                {[
                  "Take 1-2 teaspoons with warm water",
                  "Best consumed on empty stomach",
                  "Use consistently for 30 days for optimal results",
                  "Store in a cool, dry place"
                ].map((instruction, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center font-bold flex-shrink-0 mt-1">
                      {index + 1}
                    </div>
                    <p className="text-gray-600 leading-relaxed text-lg">{instruction}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* PREMIUM SIMILAR PRODUCTS SECTION */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mb-24"
        >
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-gray-900 mb-6 font-serif">You Might Also Like</h2>
            <p className="text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Discover more premium herbal products from our curated collection
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {similarProducts.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.9 + index * 0.1 }}
                whileHover={{ y: -12, scale: 1.02 }}
                className="group"
              >
                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-500">
                  <ProductCard product={item} />
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-16">
            <motion.button
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-red-900 via-red-800 to-red-900 text-white px-12 py-6 rounded-3xl font-bold text-xl shadow-2xl hover:shadow-red-900/30 transition-all duration-300"
            >
              View All Products
            </motion.button>
          </div>
        </motion.div>

        {/* PREMIUM FLOATING ACTION BAR FOR MOBILE */}
        <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-gray-200 p-6 shadow-2xl lg:hidden z-50">
          <div className="flex gap-4 max-w-md mx-auto">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleWishlistToggle}
              className={`p-5 rounded-2xl border-2 transition-all ${
                inWishlist
                  ? "border-red-300 bg-red-50 text-red-500"
                  : "border-gray-300 text-gray-600"
              }`}
            >
              <Heart className={`w-7 h-7 ${inWishlist ? "fill-current" : ""}`} />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleAddToCart}
              disabled={stock === 0}
              className={`flex-1 py-5 rounded-2xl flex items-center justify-center gap-3 font-bold text-lg transition-all ${
                stock === 0
                  ? "bg-gray-300 text-gray-500"
                  : "bg-red-900 text-white shadow-xl"
              }`}
            >
              <ShoppingCart className="w-6 h-6" />
              {stock === 0 ? "Out of Stock" : "Add to Cart"}
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}