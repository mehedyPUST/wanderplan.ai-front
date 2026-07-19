"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { HiMenu, HiX } from "react-icons/hi";
import { useAuth } from "@/hooks/useAuth";
import { FaUserCircle } from "react-icons/fa";

const navItems = [
    { name: "Home", href: "/" },
    { name: "Explore", href: "/explore" },
    { name: "About", href: "/about" },
    { name: "Blog", href: "/blog" },
];

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();
    const { user, loading } = useAuth();

    return (
        <nav className="fixed top-0 w-full bg-emerald-500 z-50 shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <Link href="/" className="text-2xl font-bold text-white">
                        WanderPlan AI
                    </Link>
                    <div className="hidden md:flex items-center space-x-6">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`text-white hover:text-amber-300 transition-colors ${pathname === item.href ? "border-b-2 border-amber-400" : ""
                                    }`}
                            >
                                {item.name}
                            </Link>
                        ))}
                        {!loading && (
                            <>
                                {user ? (
                                    <div className="flex items-center space-x-3">
                                        <Link href="/profile" className="flex items-center text-white hover:text-amber-300">
                                            <FaUserCircle className="text-xl mr-1" />
                                            {user.name || user.email}
                                        </Link>
                                        <Link href="/itineraries/add" className="bg-amber-400 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-amber-500">
                                            Add Itinerary
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="flex items-center space-x-3">
                                        <Link href="/login" className="text-white hover:text-amber-300">Login</Link>
                                        <Link href="/register" className="bg-white text-emerald-600 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-gray-100">Sign Up</Link>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                    <div className="md:hidden">
                        <button onClick={() => setIsOpen(!isOpen)} className="text-white">
                            {isOpen ? <HiX size={28} /> : <HiMenu size={28} />}
                        </button>
                    </div>
                </div>
            </div>
            <AnimatePresence>
                {isOpen && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="md:hidden bg-emerald-600">
                        <div className="px-4 py-3 space-y-2">
                            {navItems.map((item) => (
                                <Link key={item.href} href={item.href} onClick={() => setIsOpen(false)} className="block text-white px-3 py-2 rounded-md">
                                    {item.name}
                                </Link>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}