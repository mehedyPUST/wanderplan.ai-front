"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { HiMenu, HiX } from "react-icons/hi";
import { FaUserCircle, FaSignOutAlt, FaPlus, FaList, FaHeart } from "react-icons/fa";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://wanderplan-ai-back.vercel.app';

const navItems = [
  { name: "Home", href: "/" },
  { name: "Explore", href: "/explore" },
  { name: "AI Recommend", href: "/ai-recommend" },
  { name: "About", href: "/about" },
  { name: "Blog", href: "/blog" },
];

const loggedOutItems = [
  { name: "Home", href: "/" },
  { name: "Explore", href: "/explore" },
  { name: "About", href: "/about" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    fetch(`${API_URL}/api/user/profile`, { credentials: 'include' })
      .then((res) => {
        if (!res.ok) throw new Error('Not authenticated');
        return res.json();
      })
      .then((data) => setUser(data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, [pathname]);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
    setUserMenuOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await fetch(`${API_URL}/api/auth/sign-out`, {
        method: 'POST',
        credentials: 'include',
      });
      setUser(null);
      setUserMenuOpen(false);
      setIsOpen(false);
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Logout failed");
    }
  };

  const displayItems = user ? navItems : loggedOutItems;

  return (
    <nav className="fixed top-0 w-full bg-emerald-500 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          {/* Logo - Fully Responsive */}
          <Link href="/" className="flex items-center gap-1.5 sm:gap-2 text-white">
            <span className="flex flex-col leading-tight">
              <span className="text-base sm:text-xl md:text-2xl font-bold tracking-tight">
                WanderPlan
              </span>
              <span className="text-[8px] sm:text-[10px] md:text-xs opacity-90 hidden xs:block">
                AI Driven Travel Assistant
              </span>
            </span>
          </Link>

          {/* Desktop Navigation - Hidden on small screens */}
          <div className="hidden lg:flex items-center space-x-1">
            {displayItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-2.5 py-1.5 rounded-lg text-white hover:bg-emerald-600 transition-colors text-sm font-medium ${pathname === item.href ? "bg-emerald-600" : ""
                  }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Desktop User Actions - Hidden on small screens */}
          <div className="hidden lg:flex items-center space-x-2 xl:space-x-3">
            {!loading && user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center text-white hover:text-amber-300 transition-colors gap-1.5 xl:gap-2 px-2 xl:px-3 py-1.5 rounded-lg hover:bg-emerald-600"
                >
                  <FaUserCircle className="text-lg xl:text-xl" />
                  <span className="text-xs xl:text-sm font-medium max-w-[80px] xl:max-w-[120px] truncate hidden sm:inline">
                    {user.name || user.email}
                  </span>
                  <svg className={`w-3 h-3 xl:w-4 xl:h-4 transition-transform ${userMenuOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-48 sm:w-56 bg-white rounded-xl shadow-lg py-2 border border-gray-100 z-50"
                    >
                      <Link href="/profile" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 px-3 sm:px-4 py-2 sm:py-2.5 text-gray-700 hover:bg-gray-50 text-xs sm:text-sm">
                        <FaUserCircle className="text-base sm:text-lg" /> My Profile
                      </Link>
                      <Link href="/wishlist" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 px-3 sm:px-4 py-2 sm:py-2.5 text-gray-700 hover:bg-gray-50 text-xs sm:text-sm">
                        <FaHeart className="text-base sm:text-lg text-rose-500" /> My Wishlist
                      </Link>
                      <Link href="/itineraries/add" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 px-3 sm:px-4 py-2 sm:py-2.5 text-gray-700 hover:bg-gray-50 text-xs sm:text-sm">
                        <FaPlus className="text-base sm:text-lg" /> Add Itinerary
                      </Link>
                      <Link href="/itineraries/manage" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 px-3 sm:px-4 py-2 sm:py-2.5 text-gray-700 hover:bg-gray-50 text-xs sm:text-sm">
                        <FaList className="text-base sm:text-lg" /> Manage Itineraries
                      </Link>
                      <hr className="my-1 border-gray-100" />
                      <button onClick={() => { setUserMenuOpen(false); handleLogout(); }} className="flex items-center gap-3 px-3 sm:px-4 py-2 sm:py-2.5 text-red-600 hover:bg-red-50 text-xs sm:text-sm w-full">
                        <FaSignOutAlt className="text-base sm:text-lg" /> Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : !loading ? (
              <div className="flex items-center space-x-1.5 xl:space-x-2">
                <Link href="/login" className="text-white hover:text-amber-300 transition-colors px-2 xl:px-3 py-1.5 text-xs xl:text-sm font-medium">
                  Login
                </Link>
                <Link href="/register" className="bg-white text-emerald-600 px-3 xl:px-4 py-1.5 xl:py-2 rounded-xl text-xs xl:text-sm font-semibold hover:bg-gray-100 transition-colors">
                  Sign Up
                </Link>
              </div>
            ) : null}
          </div>

          {/* Tablet Navigation - Visible on medium screens */}
          <div className="hidden md:flex lg:hidden items-center space-x-1">
            {displayItems.slice(0, 3).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-2 py-1.5 rounded-lg text-white hover:bg-emerald-600 transition-colors text-xs font-medium ${pathname === item.href ? "bg-emerald-600" : ""
                  }`}
              >
                {item.name}
              </Link>
            ))}
            {displayItems.length > 3 && (
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="px-2 py-1.5 rounded-lg text-white hover:bg-emerald-600 transition-colors text-xs font-medium"
              >
                More
              </button>
            )}
          </div>

          {/* Tablet User Actions */}
          <div className="hidden md:flex lg:hidden items-center space-x-2">
            {!loading && user ? (
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center text-white hover:text-amber-300 transition-colors gap-1.5 px-2 py-1.5 rounded-lg hover:bg-emerald-600"
              >
                <FaUserCircle className="text-lg" />
                <span className="text-xs font-medium max-w-[60px] truncate hidden sm:inline">
                  {user.name || user.email}
                </span>
                <svg className={`w-3 h-3 transition-transform ${userMenuOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            ) : !loading ? (
              <Link href="/login" className="text-white hover:text-amber-300 transition-colors px-2 py-1.5 text-xs font-medium">
                Login
              </Link>
            ) : null}
          </div>

          {/* Mobile Menu Button - Visible on smallest screens */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white focus:outline-none p-1.5 hover:bg-emerald-600 rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <HiX size={22} /> : <HiMenu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile & Tablet Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-emerald-600 border-t border-emerald-400 max-h-[80vh] overflow-y-auto"
          >
            <div className="px-3 sm:px-4 py-3 space-y-1">
              {/* Navigation Links - All visible in mobile/tablet */}
              {displayItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`block text-white px-3 py-2.5 sm:py-3 rounded-lg text-sm font-medium ${pathname === item.href ? "bg-emerald-700" : "hover:bg-emerald-700"
                    }`}
                >
                  {item.name}
                </Link>
              ))}

              <hr className="my-2 sm:my-3 border-emerald-400" />

              {/* Mobile User Actions */}
              {!loading && user ? (
                <div className="space-y-1">
                  <div className="px-3 py-2 text-white text-xs sm:text-sm font-medium">
                    <span className="opacity-75">Signed in as</span>
                    <div className="font-bold mt-0.5 truncate">{user.name || user.email}</div>
                  </div>

                  <Link href="/profile" onClick={() => setIsOpen(false)} className="flex items-center gap-3 text-white px-3 py-2.5 sm:py-3 rounded-lg hover:bg-emerald-700 text-sm">
                    <FaUserCircle className="text-base sm:text-lg" /> Profile
                  </Link>

                  <Link href="/wishlist" onClick={() => setIsOpen(false)} className="flex items-center gap-3 text-white px-3 py-2.5 sm:py-3 rounded-lg hover:bg-emerald-700 text-sm">
                    <FaHeart className="text-base sm:text-lg text-rose-300" /> My Wishlist
                  </Link>

                  <Link href="/itineraries/add" onClick={() => setIsOpen(false)} className="flex items-center gap-3 text-white px-3 py-2.5 sm:py-3 rounded-lg hover:bg-emerald-700 text-sm">
                    <FaPlus className="text-base sm:text-lg" /> Add Itinerary
                  </Link>

                  <Link href="/itineraries/manage" onClick={() => setIsOpen(false)} className="flex items-center gap-3 text-white px-3 py-2.5 sm:py-3 rounded-lg hover:bg-emerald-700 text-sm">
                    <FaList className="text-base sm:text-lg" /> Manage Itineraries
                  </Link>

                  <button
                    onClick={() => { setIsOpen(false); handleLogout(); }}
                    className="flex items-center gap-3 text-red-300 px-3 py-2.5 sm:py-3 rounded-lg hover:bg-emerald-700 text-sm w-full"
                  >
                    <FaSignOutAlt className="text-base sm:text-lg" /> Logout
                  </button>
                </div>
              ) : !loading ? (
                <div className="space-y-2 pt-2">
                  <Link href="/login" onClick={() => setIsOpen(false)} className="block text-white px-3 py-2.5 sm:py-3 rounded-lg hover:bg-emerald-700 text-sm text-center">
                    Login
                  </Link>
                  <Link href="/register" onClick={() => setIsOpen(false)} className="block bg-white text-emerald-600 px-3 py-2.5 sm:py-3 rounded-lg font-semibold text-sm text-center hover:bg-gray-100 transition-colors">
                    Sign Up
                  </Link>
                </div>
              ) : (
                <div className="flex justify-center py-4">
                  <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}