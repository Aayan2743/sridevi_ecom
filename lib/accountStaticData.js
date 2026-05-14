/** Demo catalog for account pages when API returns empty or fails. */

const img = (photoId) =>
  `https://images.unsplash.com/photo-${photoId}?w=400&h=400&fit=crop&q=80`;

export const STATIC_ORDERS = [
  {
    id: 10842,
    status: "in_transit",
    total_amount: 1849,
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    items: [
      {
        id: 1,
        quantity: 1,
        product: {
          name: "Herbal bath powder — family pack",
          images: [
            { image_url: img("1608571423902-eed4a5ad8108"), is_primary: true },
          ],
        },
      },
      {
        id: 2,
        quantity: 2,
        product: {
          name: "Neem & aloe face wash",
          images: [
            { image_url: img("1556228578-0d85b1a4d571"), is_primary: true },
          ],
        },
      },
    ],
  },
  {
    id: 10821,
    status: "completed",
    total_amount: 649,
    created_at: new Date(Date.now() - 86400000 * 9).toISOString(),
    items: [
      {
        product: {
          name: "Ayurvedic hair oil",
          images: [
            { image_url: img("1526947425960-945c224e4885"), is_primary: true },
          ],
        },
      },
    ],
  },
  {
    id: 10798,
    status: "bill_sent",
    total_amount: 2199,
    created_at: new Date(Date.now() - 86400000 * 14).toISOString(),
    items: [
      {
        product: {
          name: "Natural soap bar set (3)",
          images: [
            { image_url: img("1540555700478-4be289fbecef"), is_primary: true },
          ],
        },
      },
    ],
  },
  {
    id: 10765,
    status: "ready",
    total_amount: 999,
    created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
    items: [
      {
        product: {
          name: "Herbal face pack",
          images: [
            { image_url: img("1556228578-0d85b1a4d571"), is_primary: true },
          ],
        },
      },
    ],
  },
];

export const STATIC_WISHLIST = [
  {
    id: 501,
    name: "Herbal wellness starter kit",
    price: 1499,
    slug: "herbal-wellness-kit",
    image: img("1505576399279-565b52d4ac71"),
  },
  {
    id: 502,
    name: "Herbal body lotion — lavender",
    price: 449,
    slug: "herbal-body-lotion",
    image: img("1612817288484-6f916006741a"),
  },
  {
    id: 503,
    name: "Organic turmeric powder",
    price: 289,
    slug: "organic-turmeric-powder",
    image: img("1596040036889-6b43bfa6e143"),
  },
];
