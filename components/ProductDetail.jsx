
// "use client";

// import React, { useState, useMemo, useEffect } from "react";
// import { Star, Heart, Share2, ShoppingCart, ArrowLeft, Play } from "lucide-react";
// import { useCart } from "@/contexts/CartContext";
// import { useWishlist } from "@/contexts/WishlistContext";
// import { toast } from "sonner";
// import VideoPopup from "./VideoPopup";

// export default function ProductDetail({ product, onBack }) {
//   const { addToCart } = useCart();
//   const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

//   /* ================= NORMALIZE VARIANTS ================= */

//   const variations = useMemo(() => {
//     return (
//       product.variant_combinations?.map((v) => ({
//         id: v.id,
//         name: v.values?.map((val) => val.value).join(" / ") || "Variant",
//         price: Number(v.extra_price),
//         stock: v.quantity,
//       })) || []
//     );
//   }, [product.variant_combinations]);

//   /* ================= STATE ================= */

//   const [selectedVariation, setSelectedVariation] = useState(
//     variations.find((v) => v.stock > 0) || variations[0] || null,
//   );
//   const [selectedImage, setSelectedImage] = useState(0);
//   const [showVideo, setShowVideo] = useState(false);

//   const inWishlist = isInWishlist(product.id);

//   /* ================= DERIVED ================= */

//   const price = selectedVariation?.price ?? 0;
//   const stock = selectedVariation?.stock ?? 0;

//   const images = useMemo(() => {
//     return product.images?.map((img) => img.image_url) || [];
//   }, [product.images]);

//   const videoUrl = product.videos?.[0]?.video_url;

//   useEffect(() => {
//     if (variations.length && !selectedVariation) {
//       setSelectedVariation(variations[0]);
//     }
//   }, [variations, selectedVariation]);

//   /* ================= ACTIONS ================= */

//   const handleAddToCart = () => {
//     if (!selectedVariation) return;

//     if (stock === 0) {
//       toast.error("This product is out of stock");
//       return;
//     }

//     addToCart({
//       id: product.id,
//       variationId: selectedVariation.id,
//       name: `${product.name} (${selectedVariation.name})`,
//       price,
//       image: images[0],
//       stock,
//     });
//   };

//   const handleWishlistToggle = () => {
//     inWishlist ? removeFromWishlist(product.id) : addToWishlist(product);
//   };

//   /* ================= UI ================= */

//   return (
//     <div className="max-w-7xl mx-auto px-4 py-6">
//       {/* BACK */}
//       <button
//         onClick={onBack}
//         className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
//       >
//         <ArrowLeft className="w-5 h-5" />
//         Back
//       </button>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
//         {/* LEFT: IMAGES WITH VERTICAL THUMBNAILS */}
//         <div className="flex gap-4">
//           {/* Vertical Thumbnails */}
//           <div className="flex flex-col gap-2 overflow-y-auto max-h-[600px]">
//             {images.map((img, i) => (
//               <button
//                 key={i}
//                 onClick={() => setSelectedImage(i)}
//                 className={`w-20 h-20 rounded-lg border overflow-hidden flex-shrink-0 ${
//                   selectedImage === i ? "border-red-900 ring-2 ring-red-900" : "border-gray-200"
//                 }`}
//               >
//                 <img src={img} alt="" className="w-full h-full object-cover" />
//               </button>
//             ))}
            
//             {/* Video Thumbnail */}
//             {videoUrl && (
//               <button
//                 onClick={() => setShowVideo(true)}
//                 className="w-20 h-20 rounded-lg border border-gray-200 overflow-hidden flex-shrink-0 relative bg-black/10 hover:bg-black/20 transition-colors"
//               >
//                 <div className="absolute inset-0 flex items-center justify-center">
//                   <Play className="w-8 h-8 text-red-900 fill-red-900" />
//                 </div>
//               </button>
//             )}
//           </div>

//           {/* Main Image */}
//           <div className="flex-1 aspect-square bg-gray-100 rounded-xl overflow-hidden">
//             <img
//               src={images[selectedImage]}
//               alt={product.name}
//               className="w-full h-full object-cover"
//             />
//           </div>
//         </div>

//         {/* RIGHT: DETAILS */}
//         <div className="space-y-6">
//           <div>
//             <h1 className="text-2xl font-bold">{product.name}</h1>
//             <div className="flex items-center gap-2 mt-1">
//               <Star className="w-4 h-4 text-yellow-400 fill-current" />
//               <span>4.3</span>
//               <span className="text-sm text-gray-500">(120 reviews)</span>
//             </div>
//           </div>

//           {/* PRICE */}
//           <div className="text-3xl font-bold text-green-700">₹{price}</div>

//           {/* VARIANTS */}
//           {variations.length > 0 && (
//             <div>
//               <h3 className="text-sm font-medium mb-2">Select Variant</h3>
//               <div className="flex flex-wrap gap-2">
//                 {variations.map((v) => (
//                   <button
//                     key={v.id}
//                     disabled={v.stock === 0}
//                     onClick={() => setSelectedVariation(v)}
//                     className={`px-4 py-2 rounded-lg border text-sm ${
//                       selectedVariation?.id === v.id
//                         ? "border-[#8B1D3D] bg-[#F7E9ED]"
//                         : "border-gray-300"
//                     } ${v.stock === 0 ? "opacity-40 cursor-not-allowed" : ""}`}
//                   >
//                     {v.name}
//                   </button>
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* ACTIONS */}
//           <div className="flex gap-3">
//             <button
//               onClick={handleAddToCart}
//               disabled={stock === 0}
//               className={`flex-1 py-3 rounded-lg flex items-center justify-center gap-2 ${
//                 stock === 0
//                   ? "bg-gray-400 cursor-not-allowed"
//                   : "bg-[#8B1D3D] hover:bg-[#7a1835] text-white"
//               }`}
//             >
//               <ShoppingCart className="w-5 h-5" />
//               {stock === 0 ? "Out of Stock" : "Add to Cart"}
//             </button>

//             <button
//               onClick={handleWishlistToggle}
//               className={`p-3 rounded-lg border ${
//                 inWishlist
//                   ? "border-red-300 text-red-500"
//                   : "border-gray-300 text-gray-600"
//               }`}
//             >
//               <Heart
//                 className={`w-5 h-5 ${inWishlist ? "fill-current" : ""}`}
//               />
//             </button>
//           </div>

//           {/* DESCRIPTION */}
//           <div>
//             <h3 className="font-semibold mb-1">Description</h3>
//             <p className="text-gray-700 text-sm leading-relaxed">
//               {product.description}
//             </p>
//           </div>

//           {/* SHARE */}
//           <button className="flex items-center gap-2 text-gray-600 hover:text-blue-500">
//             <Share2 className="w-4 h-4" />
//             Share
//           </button>
//         </div>
//       </div>

//       {/* Video Popup */}
//       <VideoPopup
//         videoUrl={videoUrl}
//         isOpen={showVideo}
//         onClose={() => setShowVideo(false)}
//       />
//     </div>
//   );
// }


"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Star, Heart, Share2, ShoppingCart, ArrowLeft, Play } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { toast } from "sonner";
import VideoPopup from "./VideoPopup";

export default function ProductDetail({ product, onBack }) {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  /* ================= STATIC SIMILAR PRODUCTS ================= */

  const similarProducts = [
    {
      id: 1,
      name: "Elegant Red Dress",
      price: 1999,
      image:
        "https://images.unsplash.com/photo-1520975922323-6c2a8c1d6f5b?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: 2,
      name: "Classic Black Heels",
      price: 1499,
      image:
        "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: 3,
      name: "Stylish Handbag",
      price: 2499,
      image:
        "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: 4,
      name: "Summer Floral Top",
      price: 999,
      image:
        "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80",
    },
  ];

  /* ================= NORMALIZE VARIANTS ================= */

  const variations = useMemo(() => {
    return (
      product.variant_combinations?.map((v) => ({
        id: v.id,
        name: v.values?.map((val) => val.value).join(" / ") || "Variant",
        price: Number(v.extra_price),
        stock: v.quantity,
      })) || []
    );
  }, [product.variant_combinations]);

  /* ================= STATE ================= */

  const [selectedVariation, setSelectedVariation] = useState(
    variations.find((v) => v.stock > 0) || variations[0] || null,
  );
  const [selectedImage, setSelectedImage] = useState(0);
  const [showVideo, setShowVideo] = useState(false);

  const inWishlist = isInWishlist(product.id);

  /* ================= DERIVED ================= */

  const price = selectedVariation?.price ?? 0;
  const stock = selectedVariation?.stock ?? 0;

  const images = useMemo(() => {
    return product.images?.map((img) => img.image_url) || [];
  }, [product.images]);

  const videoUrl = product.videos?.[0]?.video_url;

  useEffect(() => {
    if (variations.length && !selectedVariation) {
      setSelectedVariation(variations[0]);
    }
  }, [variations, selectedVariation]);

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
  };

  const handleWishlistToggle = () => {
    inWishlist ? removeFromWishlist(product.id) : addToWishlist(product);
  };

  /* ================= UI ================= */

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* BACK */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-5 h-5" />
        Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* LEFT SIDE */}
        <div className="flex gap-4">
          <div className="flex flex-col gap-2 overflow-y-auto max-h-[600px]">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setSelectedImage(i)}
                className={`w-20 h-20 rounded-lg border overflow-hidden ${
                  selectedImage === i
                    ? "border-red-900 ring-2 ring-red-900"
                    : "border-gray-200"
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}

            {videoUrl && (
              <button
                onClick={() => setShowVideo(true)}
                className="w-20 h-20 rounded-lg border border-gray-200 relative bg-black/10"
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <Play className="w-8 h-8 text-red-900 fill-red-900" />
                </div>
              </button>
            )}
          </div>

          <div className="flex-1">
            <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden">
              <img
                src={images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            {videoUrl && (
              <div className="mt-4 rounded-xl overflow-hidden bg-black">
                <video src={videoUrl} controls className="w-full rounded-xl" />
              </div>
            )}
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="space-y-6">
          <h1 className="text-2xl font-bold">{product.name}</h1>
          <div className="text-3xl font-bold text-green-700">₹{price}</div>
          <p className="text-gray-700 text-sm">{product.description}</p>
        </div>
      </div>

      {/* ================= STATIC SIMILAR PRODUCTS ================= */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-6">Similar Products</h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {similarProducts.map((item) => (
            <div
              key={item.id}
              className="border rounded-xl p-3 hover:shadow-md transition cursor-pointer"
            >
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <h3 className="mt-3 text-sm font-medium line-clamp-2">
                {item.name}
              </h3>

              <div className="text-green-700 font-semibold mt-1">
                ₹{item.price}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Video Popup */}
      <VideoPopup
        videoUrl={videoUrl}
        isOpen={showVideo}
        onClose={() => setShowVideo(false)}
      />
    </div>
  );
}
