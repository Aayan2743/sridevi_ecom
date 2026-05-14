/** Canonical fulfilment stages (align with account order details STATUS_FLOW). */
export const ORDER_FLOW_KEYS = ["placed", "packed", "shipped", "delivered"];

/** Backend / list status → flow key for the progress rail. */
export const ORDER_STATUS_TO_FLOW = {
  placed: "placed",
  paid: "placed",
  bill_sent: "placed",
  ready: "packed",
  packed: "packed",
  in_transit: "shipped",
  shipped: "shipped",
  completed: "delivered",
  delivered: "delivered",
};

export function orderStatusToFlowKey(status) {
  const s = String(status || "placed")
    .toLowerCase()
    .trim();
  return ORDER_STATUS_TO_FLOW[s] ?? "placed";
}

/** 0–3 index into ORDER_FLOW_KEYS. */
export function getOrderFlowStepIndex(status) {
  const flow = orderStatusToFlowKey(status);
  const i = ORDER_FLOW_KEYS.indexOf(flow);
  return i === -1 ? 0 : i;
}

/** Human hint under the rail for granular backend states (same flow bucket). */
export function orderTrackingPhaseLabel(rawStatus) {
  const s = String(rawStatus || "")
    .toLowerCase()
    .trim();
  if (s === "paid") return "Payment received";
  if (s === "bill_sent") return "Invoice sent — awaiting dispatch";
  if (s === "ready") return "Order packed — handoff soon";
  if (s === "in_transit") return "Courier has your parcel";
  if (s === "completed" || s === "delivered") return "Delivered successfully";
  if (s === "placed") return "We’re confirming your order";
  return null;
}
