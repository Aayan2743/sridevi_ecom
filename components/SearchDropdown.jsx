"use client";

import React from "react";
import { Search, TrendingUp } from "lucide-react";
import { categories } from "@/data/products";

export default function SearchDropdown({
  isOpen,
  searchQuery,
  searchResults,
  suggestions,
  onProductClick,
  onCategoryClick,
  onClose,
}) {
  if (
    !isOpen ||
    (!searchResults.length &&
      !suggestions.length &&
      searchQuery.length < 2)
  ) {
    return null;
  }

  return (
    <div className="search-dropdown">
      {searchQuery.length >= 2 && (
        <>
          {/* Popular Suggestions */}
          {suggestions.length > 0 && (
            <div className="p-2 border-b border-gray-200">
              <h4 className="text-xs font-semibold text-gray-500 mb-2 flex items-center">
                <TrendingUp className="w-3 h-3 mr-1" />
                Popular Searches
              </h4>

              {suggestions.slice(0, 5).map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => {
                    onCategoryClick(suggestion);
                    onClose();
                  }}
                  className="block w-full text-left px-2 py-1 text-sm text-gray-700 hover:bg-red-50 hover:text-red-900 rounded transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}

          {/* Product Results */}
          {searchResults.length > 0 && (
            <div className="p-2">
              <h4 className="text-xs font-semibold text-gray-500 mb-2">
                Products
              </h4>

              {searchResults.slice(0, 8).map((product) => (
                <button
                  key={product.id}
                  onClick={() => {
                    onProductClick(product.id);
                    onClose();
                  }}
                  className="search-item w-full text-left"
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {product.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {product.category}
                      </p>
                      <p className="text-sm font-semibold text-red-900">
                        ₹{product.price}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Empty State */}
          {searchResults.length === 0 &&
            suggestions.length === 0 && (
              <div className="p-4 text-center text-gray-500">
                <Search className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">
                  No results found for &ldquo;{searchQuery}&rdquo;
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Try different keywords
                </p>
              </div>
            )}
        </>
      )}
    </div>
  );
}
