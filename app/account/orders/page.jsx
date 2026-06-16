"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import api from "@/lib/api";
import { STATIC_ORDERS } from "@/lib/accountStaticData";
import OrderTrackingBar, {
  OrderLineItemsPreview,
} from "@/components/account/OrderTrackingBar";
import AccountPagination from "@/components/account/AccountPagination";
import { clampPage, getTotalPages, paginateSlice } from "@/lib/paginationUtils";
import {
  Package,
  ChevronRight,
  Sparkles,
  Truck,
  CheckCircle2,
  FileText,
  Wallet,
} from "lucide-react";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.03 },
  },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1] },
  },
};

const ORDERS_PAGE_SIZE = 3;

function normalizeStatus(o) {
  return (o.status || o.order_status || "placed").toLowerCase();
}

function orderDate(o) {
  const raw = o.created_at || o.createdAt || o.date;
  if (!raw) return new Date();
  return new Date(raw);
}

function orderImage(o) {
  const firstItem = o.items?.[0];
  const fromVariant =
    firstItem?.variant?.images?.[0]?.image_url ||
    firstItem?.product?.images?.find?.((img) => img.is_primary)?.image_url ||
    firstItem?.product?.images?.[0]?.image_url;
  return (
    fromVariant ||
    "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=200&h=200&fit=crop&q=80"
  );
}

function orderTitle(o) {
  const firstItem = o.items?.[0];
  return firstItem?.product?.name || firstItem?.name || "Order";
}

function statusStyle(status) {
  const s = status.replace(/_/g, " ");
  const map = {
    completed: "bg-emerald-100 text-emerald-900 ring-emerald-200/80",
    in_transit: "bg-sky-100 text-sky-900 ring-sky-200/80",
    ready: "bg-violet-100 text-violet-900 ring-violet-200/80",
    bill_sent: "bg-amber-100 text-amber-950 ring-amber-200/80",
    paid: "bg-lime-100 text-lime-950 ring-lime-200/80",
    placed: "bg-sage-100 text-sage-900 ring-sage-200/80",
  };
  return map[status] || "bg-slate-100 text-slate-800 ring-slate-200/80";
}

function statusIcon(status) {
  if (status === "completed") return CheckCircle2;
  if (status === "in_transit") return Truck;
  if (status === "bill_sent") return FileText;
  if (status === "paid") return Wallet;
  return Package;
}

export default function OrdersPage() {
  const router = useRouter();
  const listAnchorRef = useRef(null);
  const [orders, setOrders] = useState([]);

  const [usingDemo, setUsingDemo] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [orderPage, setOrderPage] = useState(1);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await api.get("/user-dashboard/orders");
        const list = res?.data?.data ?? res?.data ?? [];
        if (cancelled) return;
        if (Array.isArray(list) && list.length > 0) {
          setOrders(list);
          setUsingDemo(false);
        } else {
          setOrders(STATIC_ORDERS);
          setUsingDemo(true);
        }
      } catch {
        if (!cancelled) {
          setOrders(STATIC_ORDERS);
          setUsingDemo(true);
        }
      } finally {
        if (!cancelled) setLoaded(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const filteredOrders = orders;

  const ordersTotalPages = useMemo(
    () => getTotalPages(orders.length, ORDERS_PAGE_SIZE),
    [orders.length],
  );

  useEffect(() => {
    setOrderPage((p) => clampPage(p, ordersTotalPages || 1));
  }, [ordersTotalPages]);

  const pagedOrders = useMemo(
    () => paginateSlice(filteredOrders, orderPage, ORDERS_PAGE_SIZE),
    [filteredOrders, orderPage],
  );

  const scrollToOrderList = useCallback(() => {
    requestAnimationFrame(() => {
      listAnchorRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  }, []);

  const handleOrderPageChange = useCallback(
    (p) => {
      setOrderPage(p);
      scrollToOrderList();
    },
    [scrollToOrderList],
  );

  if (!loaded) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-sage-200 border-t-sage-700" />
        <p className="text-sm font-medium text-sage-700">Loading orders…</p>
      </div>
    );
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      <motion.header variants={item} className="space-y-3">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-sage-200/80 bg-sage-50/80 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-sage-800">
              <Sparkles className="h-3.5 w-3.5 text-earth-600" aria-hidden />
              Orders
            </div>
            <h1 className="mt-2 font-serif text-3xl font-bold tracking-tight text-sage-950 sm:text-4xl">
              My orders
            </h1>
            <p className="mt-1 max-w-xl text-sm text-sage-700/90">
              Track every shipment—from payment to delivery—with a clear
              timeline for each purchase.
            </p>
          </div>
        </div>
        {usingDemo && (
          <div className="inline-flex items-center gap-2 rounded-2xl border border-amber-200/80 bg-amber-50/90 px-4 py-2 text-xs font-medium text-amber-950">
            Showing sample orders until your account has live order history.
          </div>
        )}
      </motion.header>

      <section
        ref={listAnchorRef}
        id="account-orders-list"
        className="scroll-mt-28 space-y-4"
      >
        <AccountPagination
          page={orderPage}
          pageSize={ORDERS_PAGE_SIZE}
          totalItems={orders.length}
          onPageChange={handleOrderPageChange}
          itemLabel="orders"
        />

        <motion.div
          key={orderPage}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className="space-y-4"
        >
          <AnimatePresence mode="popLayout">
            {pagedOrders.map((order, idx) => {
              const st = normalizeStatus(order);
              const Icon = statusIcon(st);
              const total = order.total_amount ?? order.total ?? 0;

              return (
                <motion.article
                  layout
                  key={order.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ delay: idx * 0.04 }}
                  whileHover={{ y: -2 }}
                  className="flex flex-col gap-0 rounded-2xl border border-sage-200/50 bg-white/95 p-4 shadow-sm transition-shadow hover:shadow-nature-md sm:p-5"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                    <div className="relative h-24 w-full shrink-0 overflow-hidden rounded-xl bg-sage-100 sm:h-24 sm:w-24">
                      <Image
                        src={orderImage(order)}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="96px"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-mono text-xs font-semibold uppercase tracking-wide text-sage-600">
                          Order #{order.id}
                        </p>
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ring-1 ${statusStyle(st)}`}
                        >
                          <Icon className="h-3 w-3" aria-hidden />
                          {st.replace(/_/g, " ")}
                        </span>
                      </div>
                      <p className="mt-1 font-semibold text-sage-950">
                        {orderTitle(order)}
                      </p>
                      <p className="text-xs text-sage-600">
                        {orderDate(order).toLocaleDateString("en-IN", {
                          weekday: "short",
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>

                    <div className="flex shrink-0 flex-row items-center justify-between gap-4 border-t border-sage-100 pt-4 sm:flex-col sm:border-0 sm:border-l sm:pl-5 sm:pt-0 sm:text-right">
                      <div>
                        <p className="text-xs font-medium uppercase text-sage-500">
                          Total
                        </p>
                        <p className="text-lg font-bold text-sage-900">
                          ₹{Number(total).toLocaleString("en-IN")}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          router.push(
                            `/account/orders/details/?id=${encodeURIComponent(order.id)}`,
                          )
                        }
                        className="inline-flex items-center gap-1 rounded-xl bg-sage-800 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sage-900"
                      >
                        View
                        <ChevronRight className="h-4 w-4" aria-hidden />
                      </button>
                    </div>
                  </div>

                  <div
                    className="mt-4 border-t border-sage-100/90 pt-4"
                    role="group"
                    aria-label="Order items and delivery tracking"
                  >
                    <OrderLineItemsPreview items={order.items} />
                    <OrderTrackingBar
                      status={st}
                      className={order.items?.length ? "mt-4" : undefined}
                    />
                  </div>
                </motion.article>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {filteredOrders.length === 0 && (
          <div className="rounded-2xl border border-dashed border-sage-200 bg-sage-50/50 px-6 py-12 text-center">
            <Package className="mx-auto h-10 w-10 text-sage-400" />
            <p className="mt-3 font-medium text-sage-800">
              No orders in this tab
            </p>
            <p className="mt-1 text-sm text-sage-600">
              Try another filter or continue shopping to build your history.
            </p>
          </div>
        )}

        {filteredOrders.length > 0 && ordersTotalPages > 1 && (
          <AccountPagination
            className="mt-2"
            page={orderPage}
            pageSize={ORDERS_PAGE_SIZE}
            totalItems={orders.length}
            onPageChange={handleOrderPageChange}
            itemLabel="orders"
          />
        )}
      </section>
    </motion.div>
  );
}
