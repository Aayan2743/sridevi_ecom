"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Heart, ShoppingCart } from "lucide-react";
import ProductCard from "@/components/ProductCard";

const staticWishlist = [
  {
    id: 101,
    name: "Aloe Vera & Turmeric Face Cream",
    price: 299,
    originalPrice: 399,
    discount: 25,
    image: "https://images.pexels.com/photos/3762879/pexels-photo-3762879.jpeg",
    images: [
      "https://images.pexels.com/photos/3762879/pexels-photo-3762879.jpeg",
    ],
    category: "Creams",
    subcategory: "Face Cream",
    rating: 4.4,
    reviews: 812,
    description:
      "Herbal face cream enriched with Aloe Vera and Turmeric for glowing skin.",
    sizes: ["50g", "100g"],
    features: ["100% Herbal", "No Parabens", "Free Delivery"],
    inStock: true,
  },
  {
    id: 102,
    name: "Traditional Herbal Bath Powder",
    price: 349,
    originalPrice: 499,
    discount: 30,
    image: "https://images.pexels.com/photos/4202926/pexels-photo-4202926.jpeg",
    images: [
      "https://images.pexels.com/photos/4202926/pexels-photo-4202926.jpeg",
    ],
    category: "Bath Powders",
    subcategory: "Ubtan",
    rating: 4.5,
    reviews: 432,
    description:
      "Natural bath powder made with herbs for glowing and healthy skin.",
    sizes: ["200g", "500g"],
    features: ["Chemical Free", "Traditional Recipe", "Free Delivery"],
    inStock: true,
  },
  {
    id: 103,
    name: "Amla & Hibiscus Hair Pack",
    price: 299,
    originalPrice: 399,
    discount: 25,
    image: "https://images.pexels.com/photos/5938417/pexels-photo-5938417.jpeg",
    images: [
      "https://images.pexels.com/photos/5938417/pexels-photo-5938417.jpeg",
    ],
    category: "Hair Packs",
    subcategory: "Hair Treatment",
    rating: 4.2,
    reviews: 321,
    description:
      "Natural hair pack that strengthens roots and improves hair health.",
    sizes: ["200g"],
    features: ["100% Natural", "Chemical Free", "Free Delivery"],
    inStock: true,
  },
];

export default function WishlistPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.back()}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </button>

            <div className="flex items-center space-x-2">
              <Heart className="w-6 h-6 text-red-500" />
              <h1 className="text-2xl font-bold text-gray-900">
                My Wishlist ({staticWishlist.length})
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {staticWishlist.length === 0 ? (
          <div className="text-center">
            <Heart className="w-24 h-24 mx-auto text-gray-300 mb-4" />
            <h2 className="text-2xl font-semibold text-gray-600 mb-2">
              Your wishlist is empty
            </h2>
            <button
              onClick={() => router.push("/")}
              className="bg-[#8B1D3D] text-white px-6 py-3 rounded-lg"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {staticWishlist.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onClick={() => router.push(`/product/${product.id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
