"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp, Search } from "lucide-react";
import { categories } from "@/data/products";

const CategoryFilter = ({
  selectedCategory,
  onCategoryChange,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCategories = categories.filter((category) =>
    category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Categories
        </h3>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-gray-500 hover:text-gray-700"
        >
          {isExpanded ? (
            <ChevronUp className="w-5 h-5" />
          ) : (
            <ChevronDown className="w-5 h-5" />
          )}
        </button>
      </div>

      {isExpanded && (
        <div className="space-y-3">
          {/* Search Categories */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* All Products Option */}
          <button
            onClick={() => onCategoryChange("")}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
              selectedCategory === ""
                ? "bg-purple-100 text-purple-700 font-medium"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            All Products
          </button>

          {/* Category List */}
          <div className="max-h-64 overflow-y-auto">
            {filteredCategories.map((category) => (
              <button
                key={category}
                onClick={() => onCategoryChange(category)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  selectedCategory === category
                    ? "bg-purple-100 text-purple-700 font-medium"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {filteredCategories.length === 0 && (
            <div className="text-center py-4 text-gray-500 text-sm">
              No categories found
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CategoryFilter;
