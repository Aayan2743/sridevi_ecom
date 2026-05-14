"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { CheckCircle } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

export default function OrderDetailsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("id");

  const [order, setOrder] = useState(null);

  /* ================= UI STATUS FLOW ================= */
  const STATUS_FLOW = ["placed", "packed", "shipped", "delivered"];

  /* ================= BACKEND → UI STATUS MAP ================= */
  const STATUS_MAP = {
    placed: "placed",
    bill_sent: "placed",

    ready: "packed",
    packed: "packed",

    in_transit: "shipped",
    shipped: "shipped",

    completed: "delivered",
    delivered: "delivered",
  };

  useEffect(() => {
    if (!orderId) return;
    fetchOrder();
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      const res = await api.get(`/user-dashboard/get-my-orders/${orderId}`);
      setOrder(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading order...</p>
      </div>
    );
  }

  /* ================= STATUS INDEX (FIXED) ================= */
  const mappedStatus = STATUS_MAP[order.order_status] || "placed";

  const currentStepIndex = STATUS_FLOW.indexOf(mappedStatus);

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ================= LEFT SIDE ================= */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow overflow-hidden">
          {/* HEADER */}
          <div className="bg-red-900 text-white p-6 flex items-start justify-between">
            <div>
              <button
                onClick={() => router.back()}
                className="mb-2 inline-flex items-center gap-2 text-sm text-white/90 hover:text-white"
              >
                ← Back
              </button>

              <h2 className="text-xl font-semibold">Order #{order.id}</h2>
              <p className="text-sm opacity-90">
                {new Date(order.createdAt).toLocaleString()}
              </p>
            </div>
          </div>

          {/* ITEMS */}
          <div className="p-6">
            <table className="w-full text-sm">
              <thead className="text-gray-500 border-b">
                <tr>
                  <th className="text-left py-2">Item</th>
                  <th className="text-center">Qty</th>
                  <th className="text-center">Rate</th>
                  <th className="text-right">Amount</th>
                </tr>
              </thead>

              <tbody>
                {order.items.map((item) => (
                  <tr key={item.id} className="border-b">
                    <td className="py-3 font-medium">{item.product?.name}</td>
                    <td className="text-center">{item.quantity}</td>
                    <td className="text-center">₹{item.price}</td>
                    <td className="text-right font-medium">
                      ₹{item.quantity * item.price}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* TOTALS */}
            <div className="mt-6 space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{order.subtotal}</span>
              </div>

              {order.discount_amount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>- ₹{order.discount_amount}</span>
                </div>
              )}

              <div className="flex justify-between font-semibold text-base border-t pt-2">
                <span>Total</span>
                <span>₹{order.total_amount}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ================= RIGHT SIDE (STATUS UI – FIXED) ================= */}
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="font-semibold mb-6">Order Status</h3>

          <div className="relative space-y-6">
            {STATUS_FLOW.map((step, index) => {
              const isCompleted = index <= currentStepIndex;
              const isActive = index === currentStepIndex;

              return (
                <div key={step} className="relative flex items-center gap-4">
                  {/* CONNECTOR LINE */}
                  {index !== STATUS_FLOW.length - 1 && (
                    <span
                      className={`absolute left-[14px] top-8 h-6 w-[2px]
                        ${
                          index < currentStepIndex
                            ? "bg-green-400"
                            : "bg-gray-200"
                        }`}
                    />
                  )}

                  {/* ICON */}
                  <div
                    className={`p-2 rounded-full transition
                      ${
                        isCompleted
                          ? "bg-green-100 text-green-600"
                          : "bg-gray-100 text-gray-400"
                      }`}
                  >
                    <CheckCircle size={16} />
                  </div>

                  {/* LABEL */}
                  <p
                    className={`text-sm
                      ${
                        isActive
                          ? "font-semibold text-gray-900"
                          : isCompleted
                            ? "text-gray-700"
                            : "text-gray-400"
                      }`}
                  >
                    {step.charAt(0).toUpperCase() + step.slice(1)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
