"use client";

import React, { useEffect, useState } from "react";
import { ArrowLeft, X, MapPin, CreditCard, Package } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/lib/api";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";

const CheckoutFlow = ({ isOpen, onClose }) => {
  const { cart, getTotalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const ref = searchParams.get("ref");

  const [currentStep, setCurrentStep] = useState(1);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [loadingAddresses, setLoadingAddresses] = useState(false);

  const [paymentGateways, setPaymentGateways] = useState({});
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [razorpayKey, setRazorpayKey] = useState("");

  const [finalAmount, setFinalAmount] = useState(0);
  const [processingPayment, setProcessingPayment] = useState(false);

  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressForm, setAddressForm] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
  });

  /* ================= LOAD RAZORPAY SCRIPT ================= */
  const loadRazorpay = () => {
    return new Promise((resolve) => {
      if (typeof window === "undefined") return resolve(false);
      if (window.Razorpay) return resolve(true);

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    if (!isOpen) return;

    const initializeCheckout = async () => {
      try {
        setLoadingAddresses(true);
        setFinalAmount(getTotalPrice());
        setCurrentStep(1);
        setSelectedPaymentMethod("");

        // Fetch addresses
        const addrRes = await api.get("/user-dashboard/cart/get-address");
        const addressList = addrRes.data?.data || [];
        setAddresses(addressList);

        if (addressList.length > 0) {
          setSelectedAddress(addressList[0].id);
        }

        // Fetch payment gateways
        const pgRes = await api.get("/user-dashboard/list-payment-gateways");
        if (pgRes.data?.success) {
          const gatewayData = pgRes.data.data || {};
          setPaymentGateways(gatewayData);

          // Store Razorpay key for later use
          if (gatewayData.razorpay_key) {
            setRazorpayKey(gatewayData.razorpay_key);
          }
        }
      } catch (err) {
        console.error("Checkout init error:", err);
        toast.error("Failed to load checkout data");
      } finally {
        setLoadingAddresses(false);
      }
    };

    initializeCheckout();
  }, [isOpen]);

  /* ================= PINCODE LOOKUP ================= */
  const handlePincodeChange = async (pin) => {
    setAddressForm((prev) => ({ ...prev, pincode: pin }));

    if (pin.length !== 6) return;

    try {
      const res = await fetch(`https://api.postalpincode.in/pincode/${pin}`);
      const data = await res.json();

      if (data[0]?.Status === "Success") {
        const po = data[0].PostOffice[0];
        setAddressForm((prev) => ({
          ...prev,
          city: po.District,
          state: po.State,
          country: po.Country,
        }));
      }
    } catch (err) {
      console.error("Pincode lookup error:", err);
    }
  };

  /* ================= SAVE ADDRESS ================= */
  const handleSaveAddress = async () => {
    const { name, phone, address, pincode } = addressForm;

    if (!name || !phone || !address || !pincode) {
      toast.error("Please fill all required fields");
      return;
    }

    if (phone.length !== 10) {
      toast.error("Please enter a valid 10-digit phone number");
      return;
    }

    try {
      const res = await api.post(
        "/user-dashboard/cart/add-address",
        addressForm,
      );
      const newAddress = res.data.data;

      setAddresses((prev) => [newAddress, ...prev]);
      setSelectedAddress(newAddress.id);
      setShowAddressForm(false);

      toast.success("Address added successfully");

      // Reset form
      setAddressForm({
        name: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        country: "",
        pincode: "",
      });
    } catch (err) {
      console.error("Save address error:", err);
      toast.error(err.response?.data?.message || "Failed to save address");
    }
  };

  /* ================= BUILD ORDER PAYLOAD ================= */
  const buildOrderPayload = (paymentData) => ({
    user_id: user?.id,
    address_id: selectedAddress,
    // affiliate_id: localStorage.getItem("affiliate_id"),
    // affiliate_code: localStorage.getItem("affiliate_code"),

    affiliate_code: ref || null,
    payment: paymentData,
    price_details: {
      subtotal: getTotalPrice(),
      discount: 0,
      coupon_code: null, // ✅ Added required field
      total_amount: finalAmount,
    },
    items: cart.map((item) => ({
      product_id: item.id,
      variation_id: item.variationId || null,
      quantity: item.quantity,
      price: item.price,
      total: item.price * item.quantity,
    })),
  });

  /* ================= HANDLE RAZORPAY ================= */
  const handleRazorpayPayment = async () => {
    setProcessingPayment(true);

    try {
      // ✅ Validate Razorpay Key
      if (!razorpayKey) {
        toast.error("Razorpay configuration missing. Please contact support.");
        setProcessingPayment(false);
        return;
      }

      // ✅ Recalculate final amount
      const currentTotal = getTotalPrice();
      setFinalAmount(currentTotal);

      // 1️⃣ Load Razorpay SDK
      const scriptLoaded = await loadRazorpay();
      if (!scriptLoaded) {
        toast.error("Razorpay SDK failed to load. Please try again.");
        setProcessingPayment(false);
        return;
      }

      // 2️⃣ Create Razorpay Order
      const { data } = await api.post("/user-dashboard/cart/create-order", {
        amount: currentTotal,
      });

      if (!data?.success || !data?.order) {
        toast.error("Failed to create order. Please try again.");
        setProcessingPayment(false);
        return;
      }

      const order = data.order;

      console.log("📦 Razorpay Order Created:", {
        order_id: order.id,
        amount: order.amount,
        currency: "INR",
      });

      // 3️⃣ Configure Razorpay Options
      const options = {
        key: razorpayKey, // ✅ Use key from API
        amount: order.amount,
        currency: "INR",
        name: "Sridevi Herbal & Co",
        description: "Order Payment",
        order_id: order.id,

        handler: async function (response) {
          console.log("✅ Razorpay Success:", response);

          try {
            // 4️⃣ Verify Payment
            const verifyRes = await api.post(
              "/user-dashboard/cart/verify-payment",
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              },
            );

            if (!verifyRes.data?.success) {
              toast.error(
                "Payment verification failed. Please contact support.",
              );
              setProcessingPayment(false);
              return;
            }

            console.log("✅ Payment verified");

            // 5️⃣ Save Order
            const saveRes = await api.post(
              "/user-dashboard/orders",
              buildOrderPayload({
                method: "razorpay",
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                amount: currentTotal,
              }),
            );

            if (!saveRes.data?.success) {
              toast.error("Order saving failed. Please contact support.");
              setProcessingPayment(false);
              // router.push("/account/orders");
              return;

              // setTimeout(() => {
              //   router.push("/account/orders");
              // }, 1500);
            }

            console.log("🧾 Order saved:", saveRes.data);

            // 6️⃣ Success
            clearCart();
            toast.success("Payment Successful! 🎉");
            onClose();
            setProcessingPayment(false);
            router.push("/account/orders");
          } catch (err) {
            console.error("❌ Payment processing error:", err);
            toast.error(
              err.response?.data?.message ||
                "Payment processing failed. Please contact support.",
            );
            setProcessingPayment(false);
          }
        },

        prefill: {
          name: user?.name || "",
          email: user?.email || "",
          contact: user?.phone || "",
        },

        theme: {
          color: "#7f1d1d",
        },

        modal: {
          ondismiss: function () {
            console.log("⚠ Razorpay popup closed by user");
            setProcessingPayment(false);
          },
        },
      };

      // 6️⃣ Open Razorpay
      const rzp = new window.Razorpay(options);

      rzp.on("payment.failed", function (response) {
        console.error("❌ Payment Failed:", response.error);
        toast.error(
          response.error.description || "Payment failed. Please try again.",
        );
        setProcessingPayment(false);
      });

      rzp.open();
    } catch (err) {
      console.error("❌ Razorpay Error:", err);
      toast.error(
        err.response?.data?.message ||
          "Something went wrong. Please try again.",
      );
      setProcessingPayment(false);
    }
  };

  /* ================= HANDLE PHONEPE PAYMENT ================= */
  const handlePhonePePayment = async () => {
    setProcessingPayment(true);

    try {
      // ✅ Recalculate final amount
      const currentTotal = getTotalPrice();
      setFinalAmount(currentTotal);

      // 1️⃣ Create PhonePe Order
      const { data } = await api.post(
        "/user-dashboard/create-phone-order",
        buildOrderPayload({
          method: "phonepe",
          amount: currentTotal,
        }),
      );

      if (!data?.success) {
        toast.error("Failed to create PhonePe order. Please try again.");
        setProcessingPayment(false);
        return;
      }

      console.log("📱 PhonePe Order Created:", data);

      // 2️⃣ Success - Show confirmation
      clearCart();
      toast.success("Order Confirmed! 🎉");
      onClose();
      setProcessingPayment(false);
    } catch (err) {
      console.error("❌ PhonePe Error:", err);
      toast.error(
        err.response?.data?.message ||
          "Something went wrong. Please try again.",
      );
      setProcessingPayment(false);
    }
  };

  /* ================= HANDLE PLACE ORDER ================= */
  const handlePlaceOrder = async () => {
    // Validation
    if (!selectedPaymentMethod) {
      toast.error("Please select a payment method");
      return;
    }

    if (!selectedAddress) {
      toast.error("Please select a delivery address");
      return;
    }

    if (cart.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    setProcessingPayment(true);

    try {
      // Handle different payment methods
      if (selectedPaymentMethod === "razorpay") {
        await handleRazorpayPayment();
      } else if (selectedPaymentMethod === "cashfree") {
        // TODO: Implement Cashfree payment
        toast.info("Cashfree payment integration coming soon!");
        setProcessingPayment(false);
      } else if (selectedPaymentMethod === "phonepe") {
        await handlePhonePePayment();
      } else if (selectedPaymentMethod === "payu") {
        // TODO: Implement PayU payment
        toast.info("PayU payment integration coming soon!");
        setProcessingPayment(false);
      } else if (selectedPaymentMethod === "cod") {
        // Cash on Delivery
        const saveRes = await api.post(
          "/user-dashboard/orders",
          buildOrderPayload({
            method: "cod",
            amount: finalAmount,
          }),
        );

        if (!saveRes.data?.success) {
          toast.error("Order placement failed. Please try again.");
          setProcessingPayment(false);
          return;
        }

        toast.success("Order placed successfully! 🎉");
        clearCart();
        onClose();
        setProcessingPayment(false);
      } else {
        // Generic payment method
        const saveRes = await api.post(
          "/user-dashboard/orders",
          buildOrderPayload({
            method: selectedPaymentMethod,
            amount: finalAmount,
          }),
        );

        if (!saveRes.data?.success) {
          toast.error("Order placement failed. Please try again.");
          setProcessingPayment(false);
          return;
        }

        toast.success("Order placed successfully! 🎉");
        clearCart();
        onClose();
        setProcessingPayment(false);
      }
    } catch (err) {
      console.error("❌ Order Error:", err);
      toast.error(
        err.response?.data?.message ||
          "Order placement failed. Please try again.",
      );
      setProcessingPayment(false);
    }
  };

  /* ================= HANDLE NEXT STEP ================= */
  const handleNextStep = () => {
    if (currentStep === 1) {
      if (!selectedAddress) {
        toast.error("Please select a delivery address");
        return;
      }
      setCurrentStep(2);
    }
  };

  if (!isOpen) return null;

  // Get enabled payment gateways dynamically from API
  const enabledGateways = Object.entries(paymentGateways)
    .filter(([key, value]) => key.endsWith("_enabled") && value === true)
    .map(([key]) => key.replace("_enabled", ""));

  // Helper function to format payment method name
  const formatPaymentMethodName = (method) => {
    // Capitalize first letter of each word
    return method
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Helper function to get icon based on method name
  const getPaymentIcon = (method) => {
    const lowerMethod = method.toLowerCase();
    if (lowerMethod.includes("razorpay")) return "💳";
    if (lowerMethod.includes("cashfree")) return "💳";
    if (lowerMethod.includes("phonepe") || lowerMethod.includes("phone"))
      return "📱";
    if (lowerMethod.includes("payu")) return "💰";
    if (lowerMethod.includes("cod") || lowerMethod.includes("cash"))
      return "💵";
    if (lowerMethod.includes("upi")) return "📱";
    if (lowerMethod.includes("card")) return "💳";
    if (lowerMethod.includes("wallet")) return "👛";
    return "💳"; // default icon
  };

  return (
    <div className="fixed inset-0 z-[60]">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div className="absolute right-0 top-0 h-full w-full sm:max-w-md md:max-w-2xl bg-white flex flex-col">
        {/* HEADER */}
        <div className="flex justify-between items-center p-4 sm:p-5 bg-red-900 text-white">
          <h2 className="text-base sm:text-lg font-semibold">Checkout</h2>
          <button
            onClick={onClose}
            className="hover:bg-red-800 p-1.5 sm:p-2 rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* STEP INDICATOR */}
        <div className="flex items-center justify-center gap-2 sm:gap-4 p-3 sm:p-4 bg-gray-50 border-b">
          <div
            className={`flex items-center gap-1.5 sm:gap-2 ${currentStep >= 1 ? "text-red-900" : "text-gray-400"}`}
          >
            <div
              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-sm ${currentStep >= 1 ? "bg-red-900 text-white" : "bg-gray-300"}`}
            >
              1
            </div>
            <span className="text-xs sm:text-sm font-medium">Address</span>
          </div>

          <div
            className={`h-px w-8 sm:w-12 ${currentStep >= 2 ? "bg-red-900" : "bg-gray-300"}`}
          />

          <div
            className={`flex items-center gap-1.5 sm:gap-2 ${currentStep >= 2 ? "text-red-900" : "text-gray-400"}`}
          >
            <div
              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-sm ${currentStep >= 2 ? "bg-red-900 text-white" : "bg-gray-300"}`}
            >
              2
            </div>
            <span className="text-sm font-medium">Payment</span>
          </div>
        </div>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {/* STEP 1: ADDRESS SELECTION */}
          {currentStep === 1 && (
            <>
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-red-900" />
                <h3 className="text-base sm:text-lg font-semibold">
                  Select Delivery Address
                </h3>
              </div>

              <button
                onClick={() => setShowAddressForm(true)}
                className="w-full border-2 border-dashed border-red-900 text-red-900 py-2.5 sm:py-3 rounded-lg mb-4 text-sm sm:text-base font-medium hover:bg-red-50 transition"
              >
                + Add New Address
              </button>

              {loadingAddresses && (
                <div className="text-center py-10">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-red-900"></div>
                  <p className="mt-2 text-sm text-gray-600">
                    Loading addresses...
                  </p>
                </div>
              )}

              {!loadingAddresses && addresses.length === 0 && (
                <div className="text-center text-gray-500 py-10">
                  <MapPin className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 text-gray-300" />
                  <p className="font-medium text-sm sm:text-base">
                    No address found
                  </p>
                  <p className="text-xs sm:text-sm mt-1">
                    Please add a delivery address to continue
                  </p>
                </div>
              )}

              {!loadingAddresses &&
                addresses.map((a) => (
                  <div
                    key={a.id}
                    onClick={() => setSelectedAddress(a.id)}
                    className={`border-2 p-3 sm:p-4 rounded-lg mb-3 cursor-pointer transition ${
                      selectedAddress === a.id
                        ? "border-red-900 bg-red-50"
                        : "border-gray-200 hover:border-red-300"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-semibold text-sm sm:text-base text-gray-900">
                          {a.name}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-600 mt-1">
                          {a.phone}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-600 mt-2">
                          {a.address}, {a.city}, {a.state} - {a.pincode}
                        </p>
                      </div>
                      {selectedAddress === a.id && (
                        <div className="w-5 h-5 rounded-full bg-red-900 flex items-center justify-center flex-shrink-0 ml-2">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
            </>
          )}

          {/* STEP 2: PAYMENT METHOD */}
          {currentStep === 2 && (
            <>
              <div className="flex items-center gap-2 mb-4">
                <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-red-900" />
                <h3 className="text-base sm:text-lg font-semibold">
                  Select Payment Method
                </h3>
              </div>

              {enabledGateways.length === 0 ? (
                <div className="text-center text-gray-500 py-10">
                  <p className="text-sm">No payment methods available</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {enabledGateways.map((method) => {
                    return (
                      <div
                        key={method}
                        onClick={() => setSelectedPaymentMethod(method)}
                        className={`border-2 p-4 sm:p-6 rounded-lg cursor-pointer transition ${
                          selectedPaymentMethod === method
                            ? "border-red-900 bg-red-50"
                            : "border-gray-200 hover:border-red-300"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-2xl sm:text-3xl mb-2">
                              {getPaymentIcon(method)}
                            </div>
                            <p className="font-semibold text-sm sm:text-base text-gray-900">
                              {formatPaymentMethodName(method)}
                            </p>
                          </div>
                          {selectedPaymentMethod === method && (
                            <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-red-900 flex items-center justify-center flex-shrink-0">
                              <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-white rounded-full"></div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* ORDER SUMMARY */}
              <div className="mt-6 border-t pt-6">
                <div className="flex items-center gap-2 mb-4">
                  <Package className="w-5 h-5 text-red-900" />
                  <h3 className="text-lg font-semibold">Order Summary</h3>
                </div>

                <div className="space-y-3">
                  {cart.slice(0, 3).map((item) => (
                    <div
                      key={`${item.id}-${item.variationId}`}
                      className="flex gap-3"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 rounded object-cover"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium line-clamp-1">
                          {item.name}
                        </p>
                        <p className="text-xs text-gray-600">
                          Qty: {item.quantity}
                        </p>
                        <p className="text-sm font-semibold text-red-900">
                          ₹{item.price * item.quantity}
                        </p>
                      </div>
                    </div>
                  ))}

                  {cart.length > 3 && (
                    <p className="text-sm text-gray-600">
                      +{cart.length - 3} more item
                      {cart.length - 3 > 1 ? "s" : ""}
                    </p>
                  )}
                </div>

                <div className="border-t mt-4 pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">₹{getTotalPrice()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Delivery</span>
                    <span className="font-medium text-green-600">FREE</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t pt-2">
                    <span>Total</span>
                    <span className="text-red-900">₹{finalAmount}</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* FOOTER */}
        <div className="border-t p-5 flex justify-between items-center bg-white">
          {currentStep > 1 ? (
            <button
              onClick={() => setCurrentStep(1)}
              className="flex items-center gap-1 text-sm text-gray-600 hover:text-red-900 transition"
            >
              <ArrowLeft size={16} /> Back
            </button>
          ) : (
            <div />
          )}

          {currentStep < 2 ? (
            <button
              onClick={handleNextStep}
              disabled={!selectedAddress}
              className={`px-8 py-3 rounded-lg font-medium transition ${
                !selectedAddress
                  ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                  : "bg-red-900 text-white hover:bg-red-800"
              }`}
            >
              Continue to Payment
            </button>
          ) : (
            <button
              onClick={handlePlaceOrder}
              disabled={processingPayment || !selectedPaymentMethod}
              className={`px-8 py-3 rounded-lg font-medium transition ${
                processingPayment || !selectedPaymentMethod
                  ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                  : "bg-red-900 text-white hover:bg-red-800"
              }`}
            >
              {processingPayment ? "Processing..." : "Place Order"}
            </button>
          )}
        </div>
      </div>

      {/* ADD ADDRESS MODAL */}
      {showAddressForm && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60">
          <div className="bg-white w-full max-w-md rounded-xl p-6 m-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Add New Address</h3>
              <button
                onClick={() => setShowAddressForm(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={addressForm.name}
                  placeholder="Enter your full name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 focus:border-transparent outline-none"
                  onChange={(e) =>
                    setAddressForm({ ...addressForm, name: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mobile Number <span className="text-red-600">*</span>
                </label>
                <input
                  type="tel"
                  value={addressForm.phone}
                  placeholder="10-digit mobile number"
                  maxLength={10}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 focus:border-transparent outline-none"
                  onChange={(e) =>
                    setAddressForm({
                      ...addressForm,
                      phone: e.target.value.replace(/\D/g, ""),
                    })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address <span className="text-red-600">*</span>
                </label>
                <textarea
                  value={addressForm.address}
                  placeholder="House No, Street, Area"
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 focus:border-transparent outline-none resize-none"
                  onChange={(e) =>
                    setAddressForm({
                      ...addressForm,
                      address: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pincode <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={addressForm.pincode}
                  placeholder="6-digit pincode"
                  maxLength={6}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 focus:border-transparent outline-none"
                  onChange={(e) =>
                    handlePincodeChange(e.target.value.replace(/\D/g, ""))
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <input
                  type="text"
                  value={addressForm.city}
                  readOnly
                  placeholder="Auto-filled from pincode"
                  className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State
                </label>
                <input
                  type="text"
                  value={addressForm.state}
                  readOnly
                  placeholder="Auto-filled from pincode"
                  className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddressForm(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveAddress}
                className="flex-1 px-4 py-2 bg-red-900 text-white rounded-lg hover:bg-red-800 transition"
              >
                Save Address
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutFlow;
