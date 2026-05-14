"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Check, Package, Box, Truck, House } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  getOrderFlowStepIndex,
  orderTrackingPhaseLabel,
} from "@/lib/orderTracking";

const STEPS = [
  {
    key: "placed",
    title: "Confirmed",
    Icon: Package,
  },
  {
    key: "packed",
    title: "Preparing",
    Icon: Box,
  },
  {
    key: "shipped",
    title: "In transit",
    Icon: Truck,
  },
  {
    key: "delivered",
    title: "Delivered",
    Icon: House,
  },
];

function lineItemImage(item) {
  const fromVariant =
    item?.variant?.images?.[0]?.image_url ||
    item?.product?.images?.find?.((img) => img.is_primary)?.image_url ||
    item?.product?.images?.[0]?.image_url;
  return (
    fromVariant ||
    "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=80&h=80&fit=crop&q=80"
  );
}

function lineItemName(item) {
  return item?.product?.name || item?.name || "Item";
}

export function OrderLineItemsPreview({ items, className }) {
  const list = Array.isArray(items) ? items : [];
  if (list.length === 0) return null;

  return (
    <div
      className={cn("flex min-w-0 items-center gap-2", className)}
    >
      <p className="shrink-0 text-[10px] font-bold uppercase tracking-wider text-sage-500">
        Items
      </p>
      <div className="flex min-w-0 flex-1 gap-2 overflow-x-auto py-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {list.map((line, i) => {
          const qty = line.quantity ?? line.qty ?? 1;
          const src = lineItemImage(line);
          const name = lineItemName(line);
          const key = line.id ?? line.product_id ?? `${i}-${name}`;
          return (
            <div
              key={key}
              className="group flex shrink-0 items-center gap-2 rounded-xl border border-sage-200/60 bg-sage-50/40 pr-2.5 pl-1 py-1"
              title={name}
            >
              <div className="relative h-10 w-10 overflow-hidden rounded-lg bg-sage-100 ring-1 ring-sage-200/50">
                <Image
                  src={src}
                  alt=""
                  fill
                  className="object-cover transition duration-300 group-hover:scale-105"
                  sizes="40px"
                />
              </div>
              <div className="min-w-0 max-w-[7rem] sm:max-w-[9rem]">
                <p className="truncate text-xs font-semibold text-sage-900">
                  {name}
                </p>
                <p className="text-[10px] font-medium text-sage-600">×{qty}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/**
 * @param {{ status: string; className?: string; showPhaseHint?: boolean }} props
 */
export default function OrderTrackingBar({
  status,
  className,
  showPhaseHint = true,
}) {
  const current = getOrderFlowStepIndex(status);
  const phaseHint = showPhaseHint ? orderTrackingPhaseLabel(status) : null;
  const segments = STEPS.length - 1;
  const fillRatio = segments <= 0 ? 0 : current / segments;

  return (
    <div className={cn("space-y-2.5", className)}>
      <div className="relative pt-1">
        {/* baseline track */}
        <div
          className="pointer-events-none absolute left-[calc(12.5%-0.5rem)] right-[calc(12.5%-0.5rem)] top-[18px] hidden h-[3px] rounded-full bg-sage-200/90 sm:block"
          aria-hidden
        />
        <motion.div
          className="pointer-events-none absolute left-[calc(12.5%-0.5rem)] top-[18px] hidden h-[3px] origin-left rounded-full bg-gradient-to-r from-sage-800 via-earth-600 to-emerald-600 shadow-[0_0_12px_rgba(22,101,52,0.25)] sm:block"
          initial={false}
          animate={{ scaleX: Math.max(0.04, fillRatio) }}
          transition={{ type: "spring", stiffness: 120, damping: 22 }}
          style={{
            width: "calc(75% + 1rem)",
            transformOrigin: "left center",
          }}
          aria-hidden
        />

        {/* Mobile: simple segmented bar */}
        <div className="mb-4 flex h-1.5 gap-1 overflow-hidden rounded-full bg-sage-200/80 sm:hidden">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.key}
              className={cn(
                "h-full flex-1 rounded-full",
                i <= current
                  ? "bg-gradient-to-r from-sage-800 to-emerald-700"
                  : "bg-transparent",
              )}
              initial={false}
              animate={{ opacity: i <= current ? 1 : 0.35 }}
              transition={{ duration: 0.25 }}
            />
          ))}
        </div>

        <div className="relative z-[1] grid grid-cols-4 gap-1">
          {STEPS.map((step, index) => {
            const done = index < current;
            const active = index === current;
            const StepIcon = step.Icon;

            return (
              <div
                key={step.key}
                className="flex flex-col items-center text-center"
              >
                <motion.div
                  className="relative flex h-9 w-9 items-center justify-center sm:h-10 sm:w-10"
                  initial={false}
                  animate={{
                    scale: active ? 1.06 : 1,
                  }}
                  transition={{ type: "spring", stiffness: 380, damping: 24 }}
                >
                  {active && (
                    <span className="absolute inset-0 animate-pulse rounded-full bg-earth-400/20" />
                  )}
                  <span
                    className={cn(
                      "relative flex h-9 w-9 items-center justify-center rounded-full border-2 transition-colors duration-300 sm:h-10 sm:w-10",
                      done &&
                        "border-sage-800 bg-sage-800 text-white shadow-md shadow-sage-900/15",
                      active &&
                        !done &&
                        "border-earth-600 bg-white text-earth-700 shadow-md ring-4 ring-earth-200/60",
                      !done &&
                        !active &&
                        "border-sage-200 bg-sage-50/90 text-sage-400",
                    )}
                  >
                    {done ? (
                      <motion.span
                        initial={{ scale: 0.2, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{
                          type: "spring",
                          stiffness: 500,
                          damping: 28,
                        }}
                      >
                        <Check
                          className="h-4 w-4 sm:h-[18px] sm:w-[18px]"
                          strokeWidth={2.5}
                          aria-hidden
                        />
                      </motion.span>
                    ) : (
                      <StepIcon
                        className={cn(
                          "h-4 w-4 sm:h-[18px] sm:w-[18px]",
                          active ? "opacity-100" : "opacity-55",
                        )}
                        strokeWidth={2}
                        aria-hidden
                      />
                    )}
                  </span>
                </motion.div>
                <p
                  className={cn(
                    "mt-2 max-w-[4.5rem] text-[10px] font-bold uppercase leading-tight tracking-wide sm:max-w-none sm:text-[11px]",
                    done && "text-sage-800",
                    active && !done && "text-earth-800",
                    !done && !active && "text-sage-400",
                  )}
                >
                  {step.title}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {phaseHint && (
        <motion.p
          key={phaseHint}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-[11px] font-medium text-sage-600 sm:text-left"
        >
          {phaseHint}
        </motion.p>
      )}

    </div>
  );
}
