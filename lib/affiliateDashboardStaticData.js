/**
 * Demo affiliate conversion rows for the dashboard.
 * Replace with API e.g. GET /affiliate/commissions when backend is ready.
 */

export const AFFILIATE_REDEEM_THRESHOLD = 500;

/** @typedef {{ id: string; orderRef: string; date: string; purchaserName: string; productName: string; quantity: number; orderTotal: number; commissionRate: number; commissionAmount: number; deliveryStatus: string; commissionStatus: "confirmed" | "pending" | "held"; }} AffiliateConversionRow */

/** @type {AffiliateConversionRow[]} */
export const STATIC_AFFILIATE_CONVERSIONS = [
  {
    id: "ac-1",
    orderRef: "SH-10842",
    date: new Date(Date.now() - 86400000 * 2).toISOString(),
    purchaserName: "Priya Sharma",
    productName: "Herbal bath powder — family pack",
    quantity: 1,
    orderTotal: 1849,
    commissionRate: 12,
    commissionAmount: 148,
    deliveryStatus: "in_transit",
    commissionStatus: "pending",
  },
  {
    id: "ac-2",
    orderRef: "SH-10821",
    date: new Date(Date.now() - 86400000 * 9).toISOString(),
    purchaserName: "Rahul Verma",
    productName: "Ayurvedic hair oil",
    quantity: 2,
    orderTotal: 1298,
    commissionRate: 11,
    commissionAmount: 165,
    deliveryStatus: "completed",
    commissionStatus: "confirmed",
  },
  {
    id: "ac-3",
    orderRef: "SH-10798",
    date: new Date(Date.now() - 86400000 * 14).toISOString(),
    purchaserName: "Ananya Krishnan",
    productName: "Natural soap bar set (3)",
    quantity: 1,
    orderTotal: 2199,
    commissionRate: 10,
    commissionAmount: 107,
    deliveryStatus: "bill_sent",
    commissionStatus: "held",
  },
  {
    id: "ac-4",
    orderRef: "SH-10765",
    date: new Date(Date.now() - 86400000 * 1).toISOString(),
    purchaserName: "Karthik Iyer",
    productName: "Herbal face pack",
    quantity: 3,
    orderTotal: 1497,
    commissionRate: 10,
    commissionAmount: 100,
    deliveryStatus: "ready",
    commissionStatus: "pending",
  },
  {
    id: "ac-5",
    orderRef: "SH-10690",
    date: new Date(Date.now() - 86400000 * 21).toISOString(),
    purchaserName: "Meera Patel",
    productName: "Herbal body lotion",
    quantity: 1,
    orderTotal: 899,
    commissionRate: 10,
    commissionAmount: 90,
    deliveryStatus: "completed",
    commissionStatus: "confirmed",
  },
  {
    id: "ac-6",
    orderRef: "SH-10655",
    date: new Date(Date.now() - 86400000 * 28).toISOString(),
    purchaserName: "Deepak Menon",
    productName: "Neem & aloe face wash",
    quantity: 2,
    orderTotal: 598,
    commissionRate: 11,
    commissionAmount: 77,
    deliveryStatus: "completed",
    commissionStatus: "confirmed",
  },
];
