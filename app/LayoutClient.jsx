// "use client";

// import { Suspense } from "react";
// import { useRouter } from "next/navigation";
// import Header from "@/components/Header";
// import Footer from "@/components/Footer";
// import { CartProvider } from "@/contexts/CartContext";
// import { WishlistProvider } from "@/contexts/WishlistContext";
// import { AuthProvider } from "@/contexts/AuthContext";

// export default function LayoutClient({ children }) {
//   const router = useRouter();

//   const handleCategorySelect = (category) => {
//     router.push(`/products?category=${encodeURIComponent(category)}`);
//   };

//   const handleSearch = (query) => {
//     router.push(`/products?search=${encodeURIComponent(query)}`);
//   };

//   const handleProductClick = (productId) => {
//     router.push(`/product/${productId}`);
//   };

//   return (
//     <AuthProvider>
//       <WishlistProvider>
//         <CartProvider>
//           {/* ✅ THIS FIXES ALL YOUR ERRORS */}
//           <Suspense fallback={<div />}>
//             <Header
//               onCategorySelect={handleCategorySelect}
//               onSearch={handleSearch}
//               onProductClick={handleProductClick}
//             />
//           </Suspense>

//           {children}

//           <Footer />
//         </CartProvider>
//       </WishlistProvider>
//     </AuthProvider>
//   );
// }

"use client";

import { Suspense } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { WishlistProvider } from "@/contexts/WishlistContext";
import LoginModal from "@/components/LoginModal";
import { Toaster } from "sonner";

export default function LayoutClient({ children }) {
  const router = useRouter();
  const { loginOpen, closeLogin } = useAuth();

  const handleCategorySelect = (category) => {
    router.push(`/products?category=${encodeURIComponent(category)}`);
  };

  const handleSearch = (query) => {
    router.push(`/products?search=${encodeURIComponent(query)}`);
  };

  const handleProductClick = (productId) => {
    router.push(`/product/${productId}`);
  };

  return (
    <WishlistProvider>
      {/* HEADER */}
      <Suspense fallback={<div />}>
        <Header
          onCategorySelect={handleCategorySelect}
          onSearch={handleSearch}
          onProductClick={handleProductClick}
        />
      </Suspense>

      {/* PAGE CONTENT */}
      {children}

      {/* FOOTER */}
      <Footer />

      {/* ✅ SINGLE GLOBAL LOGIN MODAL */}
      <LoginModal isOpen={loginOpen} onClose={closeLogin} />

      {/* ✅ TOAST NOTIFICATIONS */}
      <Toaster position="top-right" richColors closeButton />
    </WishlistProvider>
  );
}
