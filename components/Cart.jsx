"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Minus,
  Plus,
  Trash2,
  Gift,
  ChevronDown,
  ChevronUp,
  ShoppingBag,
} from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import CheckoutFlow from "./CheckoutFlow";

export default function Cart({ isOpen, onClose }) {
  const { cart, updateQuantity, removeFromCart, getTotalItems, getTotalPrice } =
    useCart();
  const { isAuthenticated, openLogin } = useAuth();

  const [showCheckout, setShowCheckout] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [showSavings, setShowSavings] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Milestone thresholds
  const milestones = [
    { amount: 999, discount: "8% OFF", achieved: false },
    { amount: 1299, discount: "10% OFF + Gift", achieved: false },
    { amount: 1599, discount: "12% OFF + Gift", achieved: false },
    { amount: 2999, discount: "Free Gift ₹1218", achieved: false },
  ];

  const totalPrice = getTotalPrice();
  const currentMilestone =
    milestones.find((m) => totalPrice >= m.amount) || milestones[0];
  const nextMilestone = milestones.find((m) => totalPrice < m.amount);
  const progressPercentage = nextMilestone
    ? (totalPrice / nextMilestone.amount) * 100
    : 100;

  // Update milestone achievements
  milestones.forEach((milestone) => {
    milestone.achieved = totalPrice >= milestone.amount;
  });

  // Animation effect when cart opens/closes
  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const calculateSavings = () => {
    // Mock calculation - you can implement actual discount logic
    return Math.floor(totalPrice * 0.15);
  };

  return (
    <>
      {/* CART OVERLAY */}
      <div className="fixed inset-0 z-50">
        {/* BACKDROP */}
        <div
          className={`absolute inset-0 bg-black transition-opacity duration-300 ${
            isAnimating ? "opacity-0" : "opacity-50"
          }`}
          onClick={onClose}
        />

        {/* CART */}
        <div
          className={`absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl transform transition-transform duration-300 ease-out ${
            isAnimating ? "translate-x-full" : "translate-x-0"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex flex-col h-full">
            {/* HEADER */}
            <div className="flex justify-between items-center p-4 border-b bg-white">
              <h2 className="text-lg font-semibold text-gray-800">
                YOUR CART ({getTotalItems()})
              </h2>
              <button
                onClick={onClose}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* MILESTONE PROGRESS */}

            {/* ITEMS */}
            <div className="flex-1 overflow-y-auto p-4">
              {cart.length === 0 ? (
                <div className="text-center py-10 text-gray-500">
                  <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p>Your cart is empty</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {cart.map((item) => (
                    <div
                      key={`${item.id}-${item.variationId}`}
                      className="flex gap-3 p-3 bg-white rounded-lg border border-gray-100"
                    >
                      <img
                        src={item.image}
                        className="w-16 h-16 rounded-lg object-cover"
                        alt={item.name}
                      />

                      <div className="flex-1">
                        <h3 className="font-medium text-gray-800 text-sm leading-tight mb-1">
                          {item.name}
                        </h3>
                        <p className="text-xs text-gray-500 mb-2">1 Combo</p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() =>
                                removeFromCart(item.id, item.variationId)
                              }
                              className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>

                            <div className="flex items-center border border-gray-200 rounded-md">
                              <button
                                onClick={() =>
                                  updateQuantity(
                                    item.id,
                                    item.variationId,
                                    item.quantity - 1,
                                  )
                                }
                                className="p-1 hover:bg-gray-50 transition-colors"
                              >
                                <Minus className="w-3 h-3 text-gray-600" />
                              </button>

                              <span className="px-3 py-1 text-sm font-medium min-w-[40px] text-center">
                                {item.quantity}
                              </span>

                              <button
                                onClick={() =>
                                  updateQuantity(
                                    item.id,
                                    item.variationId,
                                    item.quantity + 1,
                                  )
                                }
                                className="p-1 hover:bg-gray-50 transition-colors"
                              >
                                <Plus className="w-3 h-3 text-gray-600" />
                              </button>
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="font-bold text-lg text-gray-900">
                              ₹{(item.price * item.quantity).toLocaleString()}
                            </div>
                            {item.originalPrice &&
                              item.originalPrice > item.price && (
                                <div className="text-xs text-gray-400 line-through">
                                  ₹
                                  {(
                                    item.originalPrice * item.quantity
                                  ).toLocaleString()}
                                </div>
                              )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Free Gift Item - Only show if cart total is above certain threshold */}
                  {totalPrice >= 2999 && (
                    <div className="flex gap-3 p-3 bg-white rounded-lg border border-gray-100">
                      <div className="w-16 h-16 bg-red-50 rounded-lg flex items-center justify-center relative">
                        <img
                          src="https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=64&h=64&fit=crop"
                          className="w-full h-full rounded-lg object-cover"
                          alt="Wooden Tumbler"
                        />
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-900 rounded-full flex items-center justify-center">
                          <Gift className="w-3 h-3 text-white" />
                        </div>
                      </div>

                      <div className="flex-1">
                        <h3 className="font-medium text-gray-800 text-sm leading-tight mb-1">
                          Wooden Tumbler 500ml
                        </h3>
                        <p className="text-xs text-gray-500 mb-2">500 ml</p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center border border-gray-200 rounded-md">
                            <button className="p-1 hover:bg-gray-50 transition-colors">
                              <Minus className="w-3 h-3 text-gray-600" />
                            </button>
                            <span className="px-3 py-1 text-sm font-medium min-w-[40px] text-center">
                              1
                            </span>
                            <button className="p-1 hover:bg-gray-50 transition-colors">
                              <Plus className="w-3 h-3 text-gray-600" />
                            </button>
                          </div>

                          <div className="text-right">
                            <div className="font-bold text-lg text-red-800">
                              FREE!
                            </div>
                            <div className="text-xs text-gray-400 line-through">
                              ₹1,218
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* FOOTER */}
            {cart.length > 0 && (
              <div className="border-t bg-white p-4 space-y-4">
                {/* Coupon Code */}
                <div className="flex items-center gap-2 p-3 border rounded-lg">
                  <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-xs">%</span>
                  </div>
                  <input
                    type="text"
                    placeholder="Enter coupon code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-1 outline-none text-sm"
                  />
                </div>

                {/* Savings Section */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <button
                    onClick={() => setShowSavings(!showSavings)}
                    className="flex items-center justify-between w-full text-sm font-medium text-yellow-800"
                  >
                    <span>💰 FREE! Saved with discounts!</span>
                    {showSavings ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>

                  {showSavings && (
                    <div className="mt-2 text-xs text-yellow-700">
                      You saved ₹{calculateSavings()} with current offers!
                    </div>
                  )}
                </div>

                {/* Total */}
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-gray-200 rounded flex items-center justify-center">
                      <span className="text-xs">📊</span>
                    </div>
                    <span className="font-medium">Estimated total</span>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">
                      ₹{totalPrice.toLocaleString()}
                    </div>
                    <div className="text-sm text-red-800">
                      You saved ₹{calculateSavings().toLocaleString()}!
                    </div>
                  </div>
                </div>

                {/* Checkout Button */}
                {isAuthenticated ? (
                  <button
                    onClick={() => setShowCheckout(true)}
                    className="w-full bg-red-900 text-white py-4 rounded-lg font-medium text-lg flex items-center justify-center gap-3 hover:bg-red-800 transition-colors"
                  >
                    Checkout
                    <div className="flex gap-1">
                      <div className="w-6 h-4 bg-red-950 rounded-sm"></div>
                      <div className="w-6 h-4 bg-red-700 rounded-sm"></div>
                      <div className="w-6 h-4 bg-red-600 rounded-sm"></div>
                    </div>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      onClose();
                      openLogin();
                    }}
                    className="w-full border-2 border-red-900 text-red-900 py-4 rounded-lg font-medium text-lg hover:bg-red-50 transition-colors"
                  >
                    Login First
                  </button>
                )}

                {/* Powered by */}
                <div className="text-center text-xs text-gray-400">
                  Powered by ⚡ shopflo
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CHECKOUT FLOW */}
      <CheckoutFlow
        isOpen={showCheckout}
        onClose={() => {
          setShowCheckout(false);
          onClose();
        }}
      />
    </>
  );
}
