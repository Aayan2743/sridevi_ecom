"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import api from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const CartContext = createContext(undefined);
let syncTimer = null;

export function CartProvider({ children }) {
  const { token } = useAuth();
  const [cart, setCart] = useState([]);

  /* ===== Load cart from localStorage ===== */
  useEffect(() => {
    const savedCart = localStorage.getItem("jb-fashions-cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  /* ===== Persist cart ===== */
  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem("jb-fashions-cart", JSON.stringify(cart));
    } else {
      localStorage.removeItem("jb-fashions-cart");
    }
  }, [cart]);

  /* ================= SYNC ON LOGIN ================= */
  useEffect(() => {
    if (token) {
      syncCartToDB();
    }
  }, [token]);

  /* ================= SYNC FUNCTION ================= */
  const syncCartToDB = async () => {
    const localCart = JSON.parse(
      localStorage.getItem("jb-fashions-cart") || "[]",
    );

    if (!token || localCart.length === 0) return;
    if (localStorage.getItem("cartSynced") === "true") return;

    try {
      await api.post("/user-dashboard/cart/sync", { cart: localCart });
      localStorage.setItem("cartSynced", "true");
      console.log("✅ Cart synced after login");
    } catch (err) {
      console.error("❌ Cart sync failed", err);
    }
  };

  /* ================= REAL-TIME SYNC ================= */
  const syncLive = (updatedCart) => {
    if (!token) return;

    clearTimeout(syncTimer);
    syncTimer = setTimeout(async () => {
      try {
        await api.post("/user-dashboard/art/sync", { cart: updatedCart });
        console.log("🔄 Cart synced live");
      } catch (err) {
        console.error("❌ Live sync failed", err);
      }
    }, 400);
  };

  /* ================= ACTIONS ================= */

  const addToCart = (item) => {
    if (item.stock === 0) {
      toast.error("This product is out of stock");
      return;
    }

    setCart((prev) => {
      const existing = prev.find(
        (p) => p.id === item.id && p.variationId === item.variationId,
      );

      let updated;

      if (existing) {
        if (existing.quantity >= existing.stock) {
          toast.warning(`Only ${existing.stock} item(s) available`);
          return prev;
        }

        updated = prev.map((p) =>
          p.id === item.id && p.variationId === item.variationId
            ? { ...p, quantity: p.quantity + 1 }
            : p,
        );
      } else {
        updated = [...prev, { ...item, quantity: 1 }];
      }

      syncLive(updated);
      return updated;
    });
  };

  const updateQuantity = (id, variationId, qty) => {
    setCart((prev) => {
      const updated = prev.map((item) => {
        if (item.id === id && item.variationId === variationId) {
          if (qty > item.stock) {
            toast.warning(`Only ${item.stock} item(s) available`);
            return item;
          }
          return { ...item, quantity: Math.max(1, qty) };
        }
        return item;
      });

      syncLive(updated);
      return updated;
    });
  };

  const removeFromCart = (id, variationId) => {
    setCart((prev) => {
      const updated = prev.filter(
        (i) => !(i.id === id && i.variationId === variationId),
      );

      syncLive(updated);
      return updated;
    });
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("jb-fashions-cart");
    localStorage.removeItem("cartSynced");
  };

  const getTotalItems = () => cart.reduce((t, i) => t + i.quantity, 0);

  const getTotalPrice = () =>
    cart.reduce((t, i) => t + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalItems,
        getTotalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
