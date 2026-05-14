"use client";
import React, { useState,useEffect } from "react";
import { Search, User, ShoppingCart, ChevronDown, Heart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { categories, products } from "@/data/products";
import Cart from "./Cart";
import LoginModal from "./LoginModal";
import SearchDropdown from "./SearchDropdown";
import { useSearchParams, useRouter } from "next/navigation";

interface HeaderProps {
  onCategorySelect: (category: string) => void;
  onSearch: (query: string) => void;
  onProductClick?: (productId: number) => void;
}

const Header: React.FC<HeaderProps> = ({
  onCategorySelect,
  onSearch,
  onProductClick,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showCart, setShowCart] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [logo, setLogo] = useState<string>("/logo.webp"); 

  const { getTotalItems } = useCart();
  const { getWishlistCount } = useWishlist();
  const { user, isAuthenticated, logout } = useAuth();

  // Search logic
  const searchResults = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.subcategory.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const suggestions = categories.filter((category) =>
    category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
  const fetchLogo = async () => {
    try {
      const res = await fetch(
        "http://localhost:3000/api/dashboard/logo-settings-open"
      );
      const result = await res.json();

      if (result.status && result.data?.logo) {
        setLogo(result.data.logo);
      }
    } catch (error) {
      console.error("Failed to load logo", error);
    }
  };

  fetchLogo();
}, []);


  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
    setShowSearchDropdown(false);
  };

  const handleCategoryClick = (category: string) => {
    onCategorySelect(category);
    setShowCategoryMenu(false);
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    setShowSearchDropdown(value.length >= 1);
  };

  const handleProductClick = (productId: number) => {
    onProductClick?.(productId);
    setShowSearchDropdown(false);
  };

  const handleLogoClick = () => {
    setSearchQuery("");
    router.push("/");
  };
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get("category");
  const router = useRouter();

  return (
    <>
      <header className="bg-white shadow-md sticky top-0 z-50">
        {/* Top Bar */}
        <div className="bg-[#8B1D3D] text-white py-2 px-4 text-sm text-center">
          🌿 Welcome to Sridevi Herbal & Co – Purely Natural Care 🌿
        </div>

        {/* Main Header */}
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-4">
              <button
                onClick={handleLogoClick}
                className="flex items-center space-x-3 hover:opacity-90 transition-opacity"
              >
                <img
                src={logo}
                  alt="Sridevi Herbal & Co"
                  className="w-10 h-10 object-contain"
                />
                <div className="hidden md:block">
                  <div className="text-xl font-bold text-[#8B1D3D]">
                    Sridevi Herbal & Co
                  </div>
                  <div className="text-xs text-gray-500 -mt-1">
                    Pure Herbal Living
                  </div>
                </div>
              </button>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-xl mx-4 relative">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  placeholder="Search herbal products, powders, oils..."
                  value={searchQuery}
                  onChange={handleSearchInputChange}
                  onFocus={() =>
                    searchQuery.length >= 1 && setShowSearchDropdown(true)
                  }
                  onBlur={() =>
                    setTimeout(() => setShowSearchDropdown(false), 200)
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg
                  focus:outline-none focus:ring-2 focus:ring-[#8B1D3D]"
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  <Search className="w-5 h-5 text-gray-400" />
                </button>
              </form>

              <SearchDropdown
                isOpen={showSearchDropdown}
                searchQuery={searchQuery}
                searchResults={searchResults}
                suggestions={suggestions}
                onProductClick={handleProductClick}
                onCategoryClick={handleCategoryClick}
                onClose={() => setShowSearchDropdown(false)}
              />
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-4">
              {/* About Us (replaced Become a Supplier) */}
              <a
                href="/about-us"
                className="hidden lg:block text-sm text-gray-600 hover:text-[#8B1D3D] font-medium"
              >
                About Us
              </a>

              {/* Profile */}
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center space-x-2 text-gray-600 hover:text-[#8B1D3D]"
                >
                  <User className="w-5 h-5" />
                  <span className="hidden md:block text-sm">
                    {isAuthenticated ? user?.phone : "Profile"}
                  </span>
                  <ChevronDown className="w-4 h-4" />
                </button>

                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-lg shadow-lg z-50 border">
                    {isAuthenticated ? (
                      <>
                        <div className="px-4 py-3 border-b">
                          <p className="text-xs text-gray-500">Signed in as</p>
                          <p className="text-sm font-semibold text-gray-800">
                            {user?.phone}
                          </p>
                        </div>

                        <button
                          onClick={() => {
                            router.push("/account");
                            setShowProfileMenu(false);
                          }}
                          className="w-full px-4 py-2 text-sm flex items-center gap-3 hover:bg-gray-100"
                        >
                          <Heart className="w-4 h-4 text-gray-600" />
                          My Account
                        </button>

                       
                        <button
                          onClick={() => {
                            logout();
                            setShowProfileMenu(false);
                          }}
                          className="w-full px-4 py-2 text-sm flex items-center gap-3 text-red-600 hover:bg-red-50"
                        >
                          🚪 Logout
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => setShowLogin(true)}
                        className="w-full px-4 py-3 text-sm text-white bg-[#8B1D3D]"
                      >
                        Sign Up / Login
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Cart */}
              <button
                onClick={() => setShowCart(true)}
                className="relative flex items-center space-x-2 text-gray-600 hover:text-[#8B1D3D]"
              >
                <ShoppingCart className="w-5 h-5" />
                <span className="hidden md:block text-sm">Cart</span>
                {getTotalItems() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#8B1D3D] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {getTotalItems()}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="bg-[#F7E9ED] border-t">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between py-2">
              {/* Left: Categories */}
              <div className="flex items-center space-x-8 overflow-x-auto">
                {categories.slice(0, 8).map((category) => (
                  <button
                    key={category}
                    onClick={() => handleCategoryClick(category)}
                    className={`text-sm font-medium ${
                      activeCategory === category
                        ? "text-[#8B1D3D] border-b-2 border-[#8B1D3D]"
                        : "text-gray-700 hover:text-[#8B1D3D]"
                    }`}
                  >
                    {category}
                  </button>
                ))}

                <button
                  onClick={() => setShowCategoryMenu(true)}
                  className="flex items-center space-x-1 text-sm hover:text-[#8B1D3D]"
                >
                  <span>More</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>

              {/* Right: Story Links */}
              <div className="flex items-center space-x-6">
                <button
                  onClick={() => router.push("/bath-powder-story")}
                  className="text-sm font-medium text-gray-700 hover:text-[#8B1D3D]"
                >
                  Bath Powder Story
                </button>

                <button
                  onClick={() => router.push("/success-story")}
                  className="text-sm font-medium text-gray-700 hover:text-[#8B1D3D]"
                >
                  Success Story
                </button>
              </div>
            </div>
          </div>
        </nav>
      </header>

      {/* Category Modal */}
      {showCategoryMenu && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg max-w-2xl w-full mx-4 p-4">
            <h3 className="text-lg font-semibold mb-4">All Categories</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryClick(category)}
                  className="text-left p-2 text-sm hover:bg-[#F7E9ED] rounded"
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <Cart isOpen={showCart} onClose={() => setShowCart(false)} />
      <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} />
    </>
  );
};

export default Header;
