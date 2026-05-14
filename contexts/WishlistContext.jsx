"use client";

import { createContext, useContext, useEffect, useState } from "react";
import api from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();

  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ================= LOAD WISHLIST ================= */
  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const res = await api.get("/user-dashboard/get-wishlist");
      setWishlist(res.data?.data || []);
    } catch (err) {
      console.error("Failed to load wishlist");
      setWishlist([]);
    } finally {
      setLoading(false);
    }
  };

  /* ================= LOAD AFTER LOGIN ================= */
  useEffect(() => {
    if (isAuthenticated) {
      fetchWishlist();
    } else {
      setWishlist([]);
    }
  }, [isAuthenticated]);

  /* ================= TOGGLE (OPTIMISTIC) ================= */
  const toggleWishlist = async (product) => {
    try {
      const res = await api.post("/user-dashboard/wishlist-toggle", {
        product_id: product.id,
      });

      if (res.data.action === "added") {
        setWishlist((prev) => [...prev, product]);
      }

      if (res.data.action === "removed") {
        setWishlist((prev) => prev.filter((p) => p.id !== product.id));
      }
    } catch (err) {
      console.error("Wishlist toggle failed", err.message);
    }
  };

  /* ================= HELPERS ================= */
  const isInWishlist = (productId) => wishlist.some((p) => p.id === productId);

  const getWishlistCount = () => wishlist.length;

  const clearWishlist = () => setWishlist([]);

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        toggleWishlist,
        isInWishlist,
        getWishlistCount,
        clearWishlist,
        loading,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const ctx = useContext(WishlistContext);
  if (!ctx) {
    throw new Error("useWishlist must be used inside WishlistProvider");
  }
  return ctx;
};

// "use client";

// import { createContext, useContext, useEffect, useState } from "react";
// import api from "@/lib/api";
// import { useAuth } from "@/contexts/AuthContext";

// const WishlistContext = createContext(null);

// export const WishlistProvider = ({ children }) => {
//   const { isAuthenticated } = useAuth();

//   const [wishlistIds, setWishlistIds] = useState([]);
//   const [loading, setLoading] = useState(false);

//   /* ================= LOAD WISHLIST ================= */
//   const fetchWishlist = async () => {
//     try {
//       setLoading(true);
//       const res = await api.get("/cart/get-wishlist");

//       // ✅ STORE ONLY IDS
//       setWishlistIds(res.data?.data.map((p) => p.id) || []);
//     } catch (err) {
//       setWishlistIds([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (isAuthenticated) fetchWishlist();
//     else setWishlistIds([]);
//   }, [isAuthenticated]);

//   /* ================= TOGGLE ================= */
//   const toggleWishlist = async (productId) => {
//     try {
//       const res = await api.post("/cart/wishlist-toggle", {
//         product_id: productId,
//       });

//       if (res.data.action === "added") {
//         setWishlistIds((prev) => [...prev, productId]);
//       }

//       if (res.data.action === "removed") {
//         setWishlistIds((prev) => prev.filter((id) => id !== productId));
//       }
//     } catch (err) {
//       console.error("Wishlist toggle failed");
//     }
//   };

//   const isInWishlist = (productId) => wishlistIds.includes(productId);

//   return (
//     <WishlistContext.Provider
//       value={{
//         wishlistIds,
//         toggleWishlist,
//         isInWishlist,
//         loading,
//       }}
//     >
//       {children}
//     </WishlistContext.Provider>
//   );
// };

// export const useWishlist = () => useContext(WishlistContext);
