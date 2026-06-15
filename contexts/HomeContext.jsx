"use client";

import { createContext, useContext, useEffect, useState } from "react";
import api from "@/lib/api";

const HomeContext = createContext();

export const HomeProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);

  const [menuCategories, setMenuCategories] = useState([]);
  const [sections, setSections] = useState([]);
  const [categoriesWithProducts, setCategoriesWithProducts] = useState([]);

  const fetchHomeData = async () => {
    try {
      setLoading(true);

      // MENU API
      const menuRes = await api.get("/ecom/menu");

      const categories = menuRes.data.map((item, index) => ({
        id: index + 1,
        name: item.label,
        slug: item.key,
      }));

      setMenuCategories(categories);

      // PRODUCTS API
      const productsRes = await api.get(
        "/ecom/products-main?sort=name&order=asc",
      );

      const products = (productsRes.data.data.data || [])
        .filter((product) => product.is_active_ecom == 1)
        .map((product) => ({
          id: product.id,
          name: product.name,
          slug: product.slug,
          images: product.images || [],
          min_variant_price: product.min_variant_price,
          price:
            product.variant_combinations?.[0]?.extra_price ||
            product.min_variant_price,
        }));

      setSections([
        {
          id: 1,
          name: "Featured Products",
          slug: "flash-sales",
          products,
        },
      ]);

      // Category with products
      const categoriesRes = await api.get("/ecom/categories-with-products");

      console.log("sssssss", categoriesRes);

      if (categoriesRes.data.success) {
        setCategoriesWithProducts(categoriesRes.data.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHomeData();
  }, []);

  return (
    <HomeContext.Provider
      value={{
        loading,
        sections,
        menuCategories,
        categoriesWithProducts,
        fetchHomeData,
      }}
    >
      {children}
    </HomeContext.Provider>
  );
};

export const useHome = () => useContext(HomeContext);
