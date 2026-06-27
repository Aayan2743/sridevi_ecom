/**
 * Affiliate static data — demo rows for purchases, wallet credits & withdrawals.
 * Replace with API data when backend is ready.
 */

export const AFFILIATE_REDEEM_THRESHOLD = 100;

/**
 * Referred product purchases.
 * Commission credited to wallet only when deliveryStatus === "completed".
 */
export const STATIC_AFFILIATE_PURCHASES = [
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
    commissionAmount: 245,
    deliveryStatus: "completed",
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
    deliveryStatus: "ready",
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
    commissionAmount: 200,
    deliveryStatus: "placed",
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
    commissionAmount: 340,
    deliveryStatus: "completed",
  },
  {
    id: "ac-6",
    orderRef: "SH-10655",
    date: new Date(Date.now() - 86400000 * 28).toISOString(),
    purchaserName: "Deepak Menon",
    productName: "Neem & aloe face wash",
    quantity: 2,
    orderTotal: 598,
    commissionRate: 12,
    commissionAmount: 270,
    deliveryStatus: "completed",
  },
  {
    id: "ac-7",
    orderRef: "SH-10418",
    date: new Date(Date.now() - 86400000 * 35).toISOString(),
    purchaserName: "Lakshmi Narayanan",
    productName: "Herbal wellness combo pack",
    quantity: 2,
    orderTotal: 3299,
    commissionRate: 10,
    commissionAmount: 330,
    deliveryStatus: "completed",
  },
  {
    id: "ac-8",
    orderRef: "SH-10372",
    date: new Date(Date.now() - 86400000 * 42).toISOString(),
    purchaserName: "Sangeetha Ravi",
    productName: "Organic turmeric powder — bulk",
    quantity: 1,
    orderTotal: 1599,
    commissionRate: 15,
    commissionAmount: 240,
    deliveryStatus: "paid",
  },
];

/**
 * Wallet transactions.
 * type: "credit" = commission earned when order delivered
 * type: "debit" = withdrawal request submitted / paid by admin
 */
export const STATIC_WALLET_TRANSACTIONS = [
  {
    id: "wt-1",
    date: new Date(Date.now() - 86400000 * 9).toISOString(),
    type: "credit",
    amount: 245,
    description: "Commission — SH-10821 (Ayurvedic hair oil)",
    orderRef: "SH-10821",
  },
  {
    id: "wt-2",
    date: new Date(Date.now() - 86400000 * 21).toISOString(),
    type: "credit",
    amount: 340,
    description: "Commission — SH-10690 (Herbal body lotion)",
    orderRef: "SH-10690",
  },
  {
    id: "wt-3",
    date: new Date(Date.now() - 86400000 * 28).toISOString(),
    type: "credit",
    amount: 270,
    description: "Commission — SH-10655 (Neem & aloe face wash)",
    orderRef: "SH-10655",
  },
  {
    id: "wt-4",
    date: new Date(Date.now() - 86400000 * 35).toISOString(),
    type: "credit",
    amount: 330,
    description: "Commission — SH-10418 (Herbal wellness combo pack)",
    orderRef: "SH-10418",
  },
  {
    id: "wt-5",
    date: new Date(Date.now() - 86400000 * 10).toISOString(),
    type: "debit",
    amount: 1185,
    description: "Withdrawal to priya@okaxis — Paid",
    upiId: "priya@okaxis",
    status: "paid",
    transactionRef: "TXN-20260616-AF01",
  },
  {
    id: "wt-6",
    date: new Date(Date.now() - 86400000 * 45).toISOString(),
    type: "debit",
    amount: 1425,
    description: "Withdrawal to priya@okaxis — Paid",
    upiId: "priya@okaxis",
    status: "paid",
    transactionRef: "TXN-20260510-AF02",
  },
];
