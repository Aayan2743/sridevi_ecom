"use client";

import Link from "next/link";

export default function Breadcrumb({ category, productName }) {
  return (
    <nav className="text-sm mb-4 text-gray-600">
      <Link href="/" className="hover:text-[#8B1D3D]">
        Home
      </Link>

      {category && (
        <>
          <span className="mx-2">/</span>
          <Link
            href={`/products?category=${encodeURIComponent(category)}`}
            className="hover:text-[#8B1D3D]"
          >
            {category}
          </Link>
        </>
      )}

      {productName && (
        <>
          <span className="mx-2">/</span>
          <span className="text-gray-900 font-medium">
            {productName}
          </span>
        </>
      )}
    </nav>
  );
}
