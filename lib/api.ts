



import axios from "axios";

/* ================= API ENDPOINTS ================= */
export const API_ENDPOINTS = {
  HOME_SECTIONS: "/ecom/home-sections",
  MENU: "/ecom/menu",
  CATEGORIES_WITH_PRODUCTS: "/ecom/categories-with-products",
  PRODUCTS_MAIN: "/ecom/products-main",
  PRODUCTS: "/ecom/products",
  PRODUCT_DETAILS: "/ecom/product",
  SEARCH: "/ecom/search",
  WISHLIST: "/ecom/wishlist",
  CART: "/ecom/cart",
  CHECKOUT: "/ecom/checkout",
  ORDERS: "/ecom/orders",
  USER_PROFILE: "/ecom/profile",
  AUTH_LOGIN: "/ecom/auth/login",
  AUTH_REGISTER: "/ecom/auth/register",
  AUTH_LOGOUT: "/ecom/auth/logout",
};

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    // Accept: "application/json",
  },
  timeout: 50000,
});

/* ================= REQUEST INTERCEPTOR ================= */
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("jb-fashions-token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

/* ================= RESPONSE INTERCEPTOR ================= */
api.interceptors.response.use(







  (response) => response,
  (error) => {
    // ❌ DO NOT clear localStorage blindly
    if (
      typeof window !== "undefined" &&
      error.response?.status === 401
    ) {
      console.warn(
        "401 error detected from:",
        error.config?.url
      );
      // Let AuthContext decide what to do
    }

    return Promise.reject(error);
  }
);

export default api;
