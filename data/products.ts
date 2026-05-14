// data/products.ts
// Extended Product type and product sample data.
// Adds optional support for color variants, images per color, richer size objects,
// absolute size pricing, and a simple sizeChart field.
// Keep fields optional so older products still work.

export interface SizeObject {
  label: string;            // "S", "M", "L", etc.
  price?: number;           // absolute price for this size (optional)
  modifier?: number;        // delta to add to base price (optional)
  available?: boolean;      // availability flag (optional)
}

export interface ColorObject {
  key: string;              // "black", "navy"
  label?: string;           // human readable label
  swatch?: string;          // hex color like "#000000" or an image url
}

export interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  image: string;
  images: string[];
  category: string;
  subcategory: string;
  rating: number;
  reviews: number;
  description: string;
  // sizes can be simple strings or richer SizeObject entries
  sizes: (string | SizeObject)[];
  features: string[];
  inStock: boolean;
  

  /* Optional enhanced fields for variants and size-based pricing */
  // color options (either strings or ColorObject)
  colors?: (string | ColorObject)[];
  // images keyed by color key (e.g. { black: [...], navy: [...] })
  imagesByColor?: Record<string, string[]>;
  // absolute per-size prices that override modifiers / base price
  sizePrices?: Record<string, number>;
  // arbitrary size chart data (any shape you want)
  sizeChart?: any;

  // allow other metadata
  [key: string]: any;
}

export const categories = [
  "Creams",
  "Cleansers",
  "Bath Powders",
  "Green Tea",
  "Food Products",
  "Hair Oils",
  "Natural Shampoos",
  "Hair Packs",
  "Clay Facepacks",
  "Facepack Powders",
  "Herbal Powders",
  "Combo Offer",
  "Accessories"
];


export const products: Product[] = [
  // ===================== CREAMS =====================
  {
    id: 1,
    name: "Aloe Vera & Turmeric Face Cream",
    price: 299,
    originalPrice: 399,
    discount: 25,
    image: "https://images.pexels.com/photos/3762879/pexels-photo-3762879.jpeg",
    images: [
      "https://images.pexels.com/photos/3762879/pexels-photo-3762879.jpeg"
    ],
    category: "Creams",
    subcategory: "Face Cream",
    rating: 4.4,
    reviews: 812,
    description:
      "Herbal face cream enriched with Aloe Vera and Turmeric to nourish skin, reduce acne, and improve glow.",
    sizes: ["50g", "100g"],
    features: ["100% Herbal", "No Parabens", "Free Delivery"],
    inStock: true
  },

  // ===================== CLEANSERS =====================
  {
    id: 2,
    name: "Neem & Tulsi Herbal Face Cleanser",
    price: 249,
    originalPrice: 349,
    discount: 29,
    image: "https://images.pexels.com/photos/6621339/pexels-photo-6621339.jpeg",
    images: [
      "https://images.pexels.com/photos/6621339/pexels-photo-6621339.jpeg"
    ],
    category: "Cleansers",
    subcategory: "Face Wash",
    rating: 4.3,
    reviews: 654,
    description:
      "Gentle herbal cleanser with Neem and Tulsi that removes dirt and controls excess oil.",
    sizes: ["100ml", "200ml"],
    features: ["Soap Free", "Ayurvedic Formula", "Free Delivery"],
    inStock: true
  },

  // ===================== BATH POWDERS =====================
  {
    id: 3,
    name: "Traditional Herbal Bath Powder",
    price: 349,
    originalPrice: 499,
    discount: 30,
    image: "https://images.pexels.com/photos/4202926/pexels-photo-4202926.jpeg",
    images: [
      "https://images.pexels.com/photos/4202926/pexels-photo-4202926.jpeg"
    ],
    category: "Bath Powders",
    subcategory: "Ubtan",
    rating: 4.5,
    reviews: 432,
    description:
      "Natural bath powder made with herbs, pulses, and roots for glowing and healthy skin.",
    sizes: ["200g", "500g"],
    features: ["Chemical Free", "Traditional Recipe", "Free Delivery"],
    inStock: true
  },

  // ===================== GREEN TEA =====================
  {
    id: 4,
    name: "Organic Green Tea Leaves",
    price: 399,
    originalPrice: 599,
    discount: 33,
    image: "https://images.pexels.com/photos/1417945/pexels-photo-1417945.jpeg",
    images: [
      "https://images.pexels.com/photos/1417945/pexels-photo-1417945.jpeg"
    ],
    category: "Green Tea",
    subcategory: "Herbal Tea",
    rating: 4.6,
    reviews: 987,
    description:
      "Premium organic green tea leaves rich in antioxidants for detox and weight management.",
    sizes: ["100g", "250g"],
    features: ["Organic Certified", "Rich Antioxidants", "Free Delivery"],
    inStock: true
  },

  // ===================== FOOD PRODUCTS =====================
  {
    id: 5,
    name: "Cold Pressed Virgin Coconut Oil",
    price: 499,
    originalPrice: 699,
    discount: 29,
    image: "https://images.pexels.com/photos/4110258/pexels-photo-4110258.jpeg",
    images: [
      "https://images.pexels.com/photos/4110258/pexels-photo-4110258.jpeg"
    ],
    category: "Food Products",
    subcategory: "Edible Oils",
    rating: 4.7,
    reviews: 1143,
    description:
      "Pure cold pressed coconut oil suitable for cooking, skin care, and hair nourishment.",
    sizes: ["250ml", "500ml", "1L"],
    features: ["Cold Pressed", "Multi Purpose", "Free Delivery"],
    inStock: true
  },

  // ===================== HAIR OILS =====================
  {
    id: 6,
    name: "Herbal Hair Growth Oil",
    price: 349,
    originalPrice: 499,
    discount: 30,
    image: "https://images.pexels.com/photos/3737594/pexels-photo-3737594.jpeg",
    images: [
      "https://images.pexels.com/photos/3737594/pexels-photo-3737594.jpeg"
    ],
    category: "Hair Oils",
    subcategory: "Hair Care",
    rating: 4.4,
    reviews: 765,
    description:
      "Ayurvedic hair oil with Bhringraj and Amla to reduce hair fall and promote growth.",
    sizes: ["100ml", "200ml"],
    features: ["Ayurvedic", "No Mineral Oil", "Free Delivery"],
    inStock: true
  },

  // ===================== NATURAL SHAMPOOS =====================
  {
    id: 7,
    name: "Shikakai & Reetha Herbal Shampoo",
    price: 299,
    originalPrice: 449,
    discount: 33,
    image: "https://images.pexels.com/photos/6621479/pexels-photo-6621479.jpeg",
    images: [
      "https://images.pexels.com/photos/6621479/pexels-photo-6621479.jpeg"
    ],
    category: "Natural Shampoos",
    subcategory: "Hair Cleanser",
    rating: 4.3,
    reviews: 543,
    description:
      "Mild herbal shampoo made from Shikakai and Reetha for gentle hair cleansing.",
    sizes: ["200ml", "400ml"],
    features: ["Sulphate Free", "Herbal Formula", "Free Delivery"],
    inStock: true
  },

  // ===================== HAIR PACKS =====================
  {
    id: 8,
    name: "Amla & Hibiscus Hair Pack",
    price: 299,
    originalPrice: 399,
    discount: 25,
    image: "https://images.pexels.com/photos/5938417/pexels-photo-5938417.jpeg",
    images: [
      "https://images.pexels.com/photos/5938417/pexels-photo-5938417.jpeg"
    ],
    category: "Hair Packs",
    subcategory: "Hair Treatment",
    rating: 4.2,
    reviews: 321,
    description:
      "Natural hair pack that strengthens roots, improves shine, and reduces dandruff.",
    sizes: ["200g"],
    features: ["100% Natural", "Chemical Free", "Free Delivery"],
    inStock: true
  },

  // ===================== CLAY FACEPACKS =====================
  {
    id: 9,
    name: "Multani Mitti Clay Face Pack",
    price: 199,
    originalPrice: 299,
    discount: 33,
    image: "https://images.pexels.com/photos/6621333/pexels-photo-6621333.jpeg",
    images: [
      "https://images.pexels.com/photos/6621333/pexels-photo-6621333.jpeg"
    ],
    category: "Clay Facepacks",
    subcategory: "Face Pack",
    rating: 4.5,
    reviews: 654,
    description:
      "Natural Multani Mitti face pack for deep cleansing and oil control.",
    sizes: ["100g", "250g"],
    features: ["Oil Control", "100% Natural", "Free Delivery"],
    inStock: true
  },

  // ===================== COMBO OFFER =====================
  {
    id: 10,
    name: "Complete Herbal Skin Care Combo",
    price: 899,
    originalPrice: 1299,
    discount: 31,
    image: "https://images.pexels.com/photos/6621340/pexels-photo-6621340.jpeg",
    images: [
      "https://images.pexels.com/photos/6621340/pexels-photo-6621340.jpeg"
    ],
    category: "Combo Offer",
    subcategory: "Skin Care Combo",
    rating: 4.6,
    reviews: 289,
    description:
      "Complete herbal skincare combo including cleanser, face pack, and cream.",
    sizes: ["Combo Pack"],
    features: ["Best Value", "Herbal Products", "Free Delivery"],
    inStock: true
  },

  // ===================== CREAMS =====================

{
  id: 11,
  name: "Saffron & Almond Night Cream",
  price: 449,
  originalPrice: 599,
  discount: 25,
  image: "https://images.pexels.com/photos/3738349/pexels-photo-3738349.jpeg",
  images: ["https://images.pexels.com/photos/3738349/pexels-photo-3738349.jpeg"],
  category: "Creams",
  subcategory: "Night Cream",
  rating: 4.5,
  reviews: 542,
  description: "Deep nourishing night cream with saffron and almond oil.",
  sizes: ["50g"],
  features: ["Brightening", "Herbal Formula", "Free Delivery"],
  inStock: true
},
{
  id: 12,
  name: "Rose & Sandalwood Moisturizing Cream",
  price: 329,
  originalPrice: 449,
  discount: 27,
  image: "https://images.pexels.com/photos/6621338/pexels-photo-6621338.jpeg",
  images: ["https://images.pexels.com/photos/6621338/pexels-photo-6621338.jpeg"],
  category: "Creams",
  subcategory: "Moisturizer",
  rating: 4.3,
  reviews: 389,
  description: "Cooling herbal cream for daily hydration and glow.",
  sizes: ["50g", "100g"],
  features: ["Cooling Effect", "No Chemicals", "Free Delivery"],
  inStock: true
},
{
  id: 13,
  name: "Vitamin E Herbal Day Cream",
  price: 299,
  originalPrice: 399,
  discount: 25,
  image: "https://images.pexels.com/photos/3762878/pexels-photo-3762878.jpeg",
  images: ["https://images.pexels.com/photos/3762878/pexels-photo-3762878.jpeg"],
  category: "Creams",
  subcategory: "Day Cream",
  rating: 4.2,
  reviews: 271,
  description: "Lightweight day cream enriched with Vitamin E.",
  sizes: ["50g"],
  features: ["Non Sticky", "Daily Use", "Free Delivery"],
  inStock: true
},
{
  id: 14,
  name: "Kumkumadi Ayurvedic Face Cream",
  price: 549,
  originalPrice: 749,
  discount: 27,
  image: "https://images.pexels.com/photos/6621342/pexels-photo-6621342.jpeg",
  images: ["https://images.pexels.com/photos/6621342/pexels-photo-6621342.jpeg"],
  category: "Creams",
  subcategory: "Ayurvedic Cream",
  rating: 4.7,
  reviews: 618,
  description: "Traditional Kumkumadi cream for radiant skin.",
  sizes: ["30g"],
  features: ["Ayurvedic", "Glow Boosting", "Free Delivery"],
  inStock: true
},

  // ===================== Cleansers =====================

{
  id: 15,
  name: "Aloe Vera Gentle Face Cleanser",
  price: 229,
  originalPrice: 329,
  discount: 30,
  image: "https://images.pexels.com/photos/6621344/pexels-photo-6621344.jpeg",
  images: ["https://images.pexels.com/photos/6621344/pexels-photo-6621344.jpeg"],
  category: "Cleansers",
  subcategory: "Face Wash",
  rating: 4.4,
  reviews: 412,
  description: "Soothing cleanser for sensitive skin.",
  sizes: ["100ml"],
  features: ["Soap Free", "Hydrating", "Free Delivery"],
  inStock: true
},
{
  id: 16,
  name: "Charcoal Herbal Deep Clean Face Wash",
  price: 269,
  originalPrice: 369,
  discount: 27,
  image: "https://images.pexels.com/photos/6621337/pexels-photo-6621337.jpeg",
  images: ["https://images.pexels.com/photos/6621337/pexels-photo-6621337.jpeg"],
  category: "Cleansers",
  subcategory: "Deep Clean",
  rating: 4.3,
  reviews: 358,
  description: "Activated charcoal face wash for deep pore cleansing.",
  sizes: ["100ml"],
  features: ["Oil Control", "Detox", "Free Delivery"],
  inStock: true
},
{
  id: 17,
  name: "Rose Water Herbal Cleanser",
  price: 199,
  originalPrice: 299,
  discount: 33,
  image: "https://images.pexels.com/photos/6621345/pexels-photo-6621345.jpeg",
  images: ["https://images.pexels.com/photos/6621345/pexels-photo-6621345.jpeg"],
  category: "Cleansers",
  subcategory: "Face Cleanser",
  rating: 4.2,
  reviews: 245,
  description: "Mild rose-based cleanser for everyday use.",
  sizes: ["100ml"],
  features: ["Refreshing", "Gentle", "Free Delivery"],
  inStock: true
},
{
  id: 18,
  name: "Lemon & Honey Herbal Face Wash",
  price: 239,
  originalPrice: 339,
  discount: 29,
  image: "https://images.pexels.com/photos/6621341/pexels-photo-6621341.jpeg",
  images: ["https://images.pexels.com/photos/6621341/pexels-photo-6621341.jpeg"],
  category: "Cleansers",
  subcategory: "Face Wash",
  rating: 4.1,
  reviews: 198,
  description: "Brightening face wash with lemon and honey.",
  sizes: ["100ml"],
  features: ["Glow Boost", "Herbal", "Free Delivery"],
  inStock: true
},


  // ===================== BathPowders =====================
{
  id: 19,
  name: "Rose Petal Herbal Bath Powder",
  price: 299,
  originalPrice: 399,
  discount: 25,
  image: "https://images.pexels.com/photos/4202925/pexels-photo-4202925.jpeg",
  images: ["https://images.pexels.com/photos/4202925/pexels-photo-4202925.jpeg"],
  category: "Bath Powders",
  subcategory: "Ubtan",
  rating: 4.4,
  reviews: 286,
  description: "Fragrant rose bath powder for soft glowing skin.",
  sizes: ["200g"],
  features: ["Natural Fragrance", "Soft Skin", "Free Delivery"],
  inStock: true
},
{
  id: 20,
  name: "Sandalwood Herbal Snana Powder",
  price: 379,
  originalPrice: 499,
  discount: 24,
  image: "https://images.pexels.com/photos/4202924/pexels-photo-4202924.jpeg",
  images: ["https://images.pexels.com/photos/4202924/pexels-photo-4202924.jpeg"],
  category: "Bath Powders",
  subcategory: "Snana Powder",
  rating: 4.6,
  reviews: 341,
  description: "Cooling sandalwood powder for daily bath.",
  sizes: ["200g"],
  features: ["Cooling", "Ayurvedic", "Free Delivery"],
  inStock: true
},
{
  id: 21,
  name: "Neem Herbal Bath Powder",
  price: 269,
  originalPrice: 369,
  discount: 27,
  image: "https://images.pexels.com/photos/4202923/pexels-photo-4202923.jpeg",
  images: ["https://images.pexels.com/photos/4202923/pexels-photo-4202923.jpeg"],
  category: "Bath Powders",
  subcategory: "Skin Care",
  rating: 4.3,
  reviews: 214,
  description: "Neem-based powder for acne-prone skin.",
  sizes: ["200g"],
  features: ["Anti Bacterial", "Natural", "Free Delivery"],
  inStock: true
},
{
  id: 22,
  name: "Turmeric Herbal Bath Powder",
  price: 289,
  originalPrice: 389,
  discount: 26,
  image: "https://images.pexels.com/photos/4202922/pexels-photo-4202922.jpeg",
  images: ["https://images.pexels.com/photos/4202922/pexels-photo-4202922.jpeg"],
  category: "Bath Powders",
  subcategory: "Ubtan",
  rating: 4.5,
  reviews: 367,
  description: "Traditional turmeric bath powder for clear skin.",
  sizes: ["200g"],
  features: ["Glow Enhancing", "Herbal", "Free Delivery"],
  inStock: true
},

];

export const getProductsByCategory = (category: string): Product[] => {
  return products.filter(product => product.category === category);
};

export const getProductById = (id: number): Product | undefined => {
  return products.find(product => product.id === id);
};

export const getRecommendedProducts = (excludeId: number, limit: number = 4): Product[] => {
  return products.filter(product => product.id !== excludeId).slice(0, limit);
};

