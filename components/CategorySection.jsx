import ProductCard from "./ProductCard.jsx";
import { useRouter } from "next/navigation";

export default function CategorySection({ category, categorySlug, products }) {
  const router = useRouter();

  return (
    <section>
      <div className="flex justify-between items-center mb-3 sm:mb-4">
        <h2 className="text-lg sm:text-xl md:text-2xl font-semibold">{category}</h2>

        <button
          onClick={() => router.push(`/products?category=${categorySlug}`)}
          className="text-xs sm:text-sm text-[#8B1D3D] hover:underline font-medium"
        >
          View all
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
