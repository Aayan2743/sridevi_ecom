// import api from "@/lib/api";

// /* ================= FETCH ALL PRODUCTS ================= */

// export const getProducts = async () => {
//   const res = await api.get("/dashboard/product/products");
//   // const res = await api.get("/dashboard/product/products-all");
//   const rawProducts = res.data.data || [];

//   return rawProducts.map((p) => {
//     const basePrice = Number(p.base_price || 0);
//     const discount = Number(p.discount || 0);
//     const finalPrice = basePrice - discount;

//     const imageUrl = p.image_url || "/placeholder.webp";

//     return {
//       id: p.id,
//       slug: p.slug,
//       name: p.name,
//       description: p.description,

//       /* PRICE */
//       price: finalPrice,

//       /* IMAGES */
//       image: imageUrl,
//       images: [imageUrl],

//       /* CATEGORY */
//       categoryId: p.category?.id,
//       categorySlug: p.category?.slug || p.category?.name,
//       categoryName: p.category?.name,

//       /* VARIATIONS */
//       variations: (p.variations || []).map((v) => ({
//         id: v.id,
//         name: v.name,
//         price: v.price,
//         stock: v.stock,
//         images: (v.images || []).map(
//           (img) => img.image_url
//         ),
//       })),

//       /* MOCK RATINGS */
//       rating: 4.3,
//       reviews: 120,
//     };
//   });
// };

// /* ================= FETCH PRODUCT BY ID ================= */

// export const getProductById = async (id:any) => {
//   const products = await getProducts();
//   return products.find((p) => p.id === id) || null;
// };

// /* ================= FETCH PRODUCT BY SLUG ================= */

// export const getProductBySlug = async (slug:any) => {
//   const res = await api.get(
//     // `/dashboard/product/products-all/${slug}`
//     `/dashboard/product/products1/${slug}`
//   );

//   const p = res.data?.data;
//   if (!p) {
//     throw new Error("Product not found");
//   }

//   const basePrice = Number(p.base_price || 0);
//   const discount = Number(p.discount || 0);
//   const imageUrl = p.image_url || "/placeholder.webp";

//   return {
//     id: p.id,
//     slug: p.slug,
//     name: p.name,
//     description: p.description,

//     price: basePrice - discount,

//     image: imageUrl,
//     images: [imageUrl],

//     categoryId: p.category?.id,
//     categorySlug: p.category?.slug || p.category?.name,
//     categoryName: p.category?.name,

//     variations: (p.variations || []).map((v) => ({
//       id: v.id,
//       name: v.name,
//       price: v.price,
//       stock: v.stock,
//       images: (v.images || []).map(
//         (img) => img.image_url
//       ),
//     })),

//     rating: 4.3,
//     reviews: 120,
//   };
// };
