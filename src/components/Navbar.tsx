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

  const handleLogout = async () => {
    try {
      await fetch(`${API_URL}/api/auth/sign-out`, {
        method: 'POST',
        credentials: 'include',
      });
      setUser(null);
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Logout failed");
    }
  };

  const displayItems = user ? navItems : loggedOutItems;

  return (
    <nav className="fixed top-0 w-full bg-emerald-500 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-2xl font-bold text-white flex items-center gap-2">
            <span>🌍</span>
            <span className="hidden sm:inline">WanderPlan AI</span>
          </Link>

          <div className="hidden md:flex items-center space-x-1">
            {displayItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-2 rounded-lg text-white hover:bg-emerald-600 transition-colors text-sm font-medium ${
                  pathname === item.href ? "bg-emerald-600" : ""
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center space-x-3">
            {!loading && user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center text-white hover:text-amber-300 transition-colors gap-2 px-3 py-2 rounded-lg hover:bg-emerald-600"
                >
                  <FaUserCircle className="text-xl" />
                  <span className="text-sm font-medium max-w-[120px] truncate">
                    {user.name || user.email}
                  </span>
                  <svg className={`w-4 h-4 transition-transform ${userMenuOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg py-2 border border-gray-100 z-50"
                    >
                      <Link href="/profile" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 text-sm">
                        <FaUserCircle className="text-lg" /> My Profile
                      </Link>
                      <Link href="/wishlist" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 text-sm">
                        <FaHeart className="text-lg text-rose-500" /> My Wishlist
                      </Link>
                      <Link href="/itineraries/add" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 text-sm">
                        <FaPlus className="text-lg" /> Add Itinerary
                      </Link>
                      <Link href="/itineraries/manage" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 text-sm">
                        <FaList className="text-lg" /> Manage Itineraries
                      </Link>
                      <hr className="my-1 border-gray-100" />
                      <button onClick={() => { setUserMenuOpen(false); handleLogout(); }} className="flex items-center gap-3 px-4 py-2.5 text-red-600 hover:bg-red-50 text-sm w-full">
                        <FaSignOutAlt className="text-lg" /> Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : !loading ? (
              <div className="flex items-center space-x-2">
                <Link href="/login" className="text-white hover:text-amber-300 transition-colors px-3 py-2 text-sm font-medium">Login</Link>
                <Link href="/register" className="bg-white text-emerald-600 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-gray-100 transition-colors">Sign Up</Link>
              </div>
            ) : null}
          </div>

          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-white focus:outline-none p-2">
              {isOpen ? <HiX size={24} /> : <HiMenu size={24} />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="md:hidden bg-emerald-600 border-t border-emerald-400">
            <div className="px-4 py-3 space-y-1">
              {displayItems.map((item) => (
                <Link key={item.href} href={item.href} onClick={() => setIsOpen(false)} className={`block text-white px-3 py-2.5 rounded-lg text-sm font-medium ${pathname === item.href ? "bg-emerald-700" : "hover:bg-emerald-700"}`}>
                  {item.name}
                </Link>
              ))}
              <hr className="my-2 border-emerald-400" />
              {!loading && user ? (
                <>
                  <Link href="/profile" onClick={() => setIsOpen(false)} className="flex items-center gap-2 text-white px-3 py-2.5 rounded-lg hover:bg-emerald-700 text-sm"><FaUserCircle /> Profile</Link>
                  <Link href="/wishlist" onClick={() => setIsOpen(false)} className="flex items-center gap-2 text-white px-3 py-2.5 rounded-lg hover:bg-emerald-700 text-sm"><FaHeart /> My Wishlist</Link>
                  <Link href="/itineraries/add" onClick={() => setIsOpen(false)} className="flex items-center gap-2 text-white px-3 py-2.5 rounded-lg hover:bg-emerald-700 text-sm"><FaPlus /> Add Itinerary</Link>
                  <Link href="/itineraries/manage" onClick={() => setIsOpen(false)} className="flex items-center gap-2 text-white px-3 py-2.5 rounded-lg hover:bg-emerald-700 text-sm"><FaList /> Manage Itineraries</Link>
                  <button onClick={() => { setIsOpen(false); handleLogout(); }} className="flex items-center gap-2 text-red-300 px-3 py-2.5 rounded-lg hover:bg-emerald-700 text-sm w-full"><FaSignOutAlt /> Logout</button>
                </>
              ) : !loading ? (
                <>
                  <Link href="/login" onClick={() => setIsOpen(false)} className="block text-white px-3 py-2.5 rounded-lg hover:bg-emerald-700 text-sm">Login</Link>
                  <Link href="/register" onClick={() => setIsOpen(false)} className="block bg-white text-emerald-600 px-3 py-2.5 rounded-lg font-semibold text-sm text-center">Sign Up</Link>
                </>
              ) : null}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
