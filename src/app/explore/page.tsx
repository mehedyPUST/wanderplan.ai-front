"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosInstance";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaSearch, FaFilter, FaStar, FaDollarSign, FaMapMarkerAlt } from "react-icons/fa";

const categories = [
    { value: "", label: "All Categories" },
    { value: "beach", label: "🏖️ Beach" },
    { value: "city", label: "🏙️ City" },
    { value: "mountain", label: "🏔️ Mountain" },
    { value: "countryside", label: "🌾 Countryside" },
];

const sortOptions = [
    { value: "rating", label: "Top Rated" },
    { value: "priceRange.min", label: "Price: Low to High" },
    { value: "-priceRange.min", label: "Price: High to Low" },
    { value: "createdAt", label: "Newest" },
    { value: "name", label: "Name A-Z" },
];

export default function ExplorePage() {
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [minRating, setMinRating] = useState("");
    const [sortBy, setSortBy] = useState("rating");
    const [page, setPage] = useState(1);
    const [showFilters, setShowFilters] = useState(false);

    const { data, isLoading } = useQuery({
        queryKey: ["destinations", search, category, minPrice, maxPrice, minRating, sortBy, page],
        queryFn: () =>
            axiosInstance
                .get("/destinations", {
                    params: {
                        search: search || undefined,
                        category: category || undefined,
                        minPrice: minPrice || undefined,
                        maxPrice: maxPrice || undefined,
                        rating: minRating || undefined,
                        sortBy,
                        page,
                        limit: 8,
                    },
                })
                .then((r) => r.data),
    });

    const clearFilters = () => {
        setSearch("");
        setCategory("");
        setMinPrice("");
        setMaxPrice("");
        setMinRating("");
        setSortBy("rating");
        setPage(1);
    };

    const hasActiveFilters = search || category || minPrice || maxPrice || minRating;

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            {/* Hero */}
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
                <div className="max-w-6xl mx-auto px-4 py-14 mt-16">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">Explore Destinations</h1>
                        <p className="text-xl text-emerald-100">Discover your next adventure from our curated collection</p>
                    </motion.div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Search & Filter Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl shadow-lg p-4 mb-8"
                >
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Search */}
                        <div className="flex-1 relative">
                            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                value={search}
                                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                                placeholder="Search destinations..."
                                className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:outline-none text-sm"
                            />
                        </div>

                        {/* Sort */}
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-400 focus:outline-none bg-white"
                        >
                            {sortOptions.map((opt) => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>

                        {/* Filter Toggle */}
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium transition-colors ${showFilters || hasActiveFilters
                                    ? "bg-emerald-500 text-white"
                                    : "border border-gray-200 text-gray-600 hover:bg-gray-50"
                                }`}
                        >
                            <FaFilter />
                            Filters
                            {hasActiveFilters && (
                                <span className="bg-white text-emerald-600 w-5 h-5 rounded-full text-xs flex items-center justify-center font-bold">
                                    !
                                </span>
                            )}
                        </button>

                        {/* Clear */}
                        {hasActiveFilters && (
                            <button
                                onClick={clearFilters}
                                className="text-red-500 text-sm font-medium hover:underline px-2"
                            >
                                Clear All
                            </button>
                        )}
                    </div>

                    {/* Expandable Filters */}
                    {showFilters && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
                        >
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1">Category</label>
                                <select
                                    value={category}
                                    onChange={(e) => { setCategory(e.target.value); setPage(1); }}
                                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-400 focus:outline-none bg-white"
                                >
                                    {categories.map((cat) => (
                                        <option key={cat.value} value={cat.value}>{cat.label}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1">Min Price ($)</label>
                                <input
                                    type="number"
                                    value={minPrice}
                                    onChange={(e) => { setMinPrice(e.target.value); setPage(1); }}
                                    placeholder="0"
                                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-400 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1">Max Price ($)</label>
                                <input
                                    type="number"
                                    value={maxPrice}
                                    onChange={(e) => { setMaxPrice(e.target.value); setPage(1); }}
                                    placeholder="5000"
                                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-400 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1">Min Rating</label>
                                <select
                                    value={minRating}
                                    onChange={(e) => { setMinRating(e.target.value); setPage(1); }}
                                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-400 focus:outline-none bg-white"
                                >
                                    <option value="">Any Rating</option>
                                    <option value="4.5">4.5+ ★</option>
                                    <option value="4">4.0+ ★</option>
                                    <option value="3.5">3.5+ ★</option>
                                    <option value="3">3.0+ ★</option>
                                </select>
                            </div>
                        </motion.div>
                    )}
                </motion.div>

                {/* Results Info */}
                {data && (
                    <div className="flex justify-between items-center mb-6">
                        <p className="text-gray-500 text-sm">
                            {data.total} destination{data.total !== 1 ? "s" : ""} found
                        </p>
                    </div>
                )}

                {/* Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {isLoading
                        ? Array.from({ length: 8 }).map((_, i) => (
                            <div key={i} className="bg-white rounded-2xl shadow-lg h-80 animate-pulse">
                                <div className="h-48 bg-gray-200 rounded-t-2xl" />
                                <div className="p-4 space-y-2">
                                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                                    <div className="h-3 bg-gray-200 rounded w-full" />
                                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                                </div>
                            </div>
                        ))
                        : data?.data?.map((dest: any, i: number) => (
                            <motion.div
                                key={dest._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                whileHover={{ y: -5 }}
                                className="bg-white rounded-2xl shadow-lg overflow-hidden group hover:shadow-xl transition-all"
                            >
                                <div className="relative overflow-hidden">
                                    <img
                                        src={dest.images?.[0] || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop"}
                                        alt={dest.name}
                                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                                        <FaStar className="text-amber-500 text-xs" /> {dest.rating}
                                    </div>
                                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-3">
                                        <span className="text-white text-xs font-medium capitalize bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded-full">
                                            {dest.category}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <h3 className="font-bold text-gray-800 text-lg mb-1 truncate">{dest.name}</h3>
                                    <p className="text-gray-500 text-sm line-clamp-2 mb-3">{dest.shortDescription}</p>
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <span className="text-emerald-600 font-bold">${dest.priceRange?.min}</span>
                                            <span className="text-gray-400 text-xs"> - ${dest.priceRange?.max}</span>
                                        </div>
                                        <Link
                                            href={`/destinations/${dest.slug}`}
                                            className="text-emerald-600 text-sm font-semibold hover:bg-emerald-50 px-3 py-1.5 rounded-lg transition-colors"
                                        >
                                            View Details →
                                        </Link>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                </div>

                {/* Empty State */}
                {!isLoading && data?.data?.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-16"
                    >
                        <FaSearch className="text-6xl text-gray-300 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-gray-400 mb-2">No destinations found</h2>
                        <p className="text-gray-400 mb-4">Try adjusting your filters or search terms</p>
                        <button onClick={clearFilters} className="text-emerald-600 font-semibold hover:underline">
                            Clear all filters
                        </button>
                    </motion.div>
                )}

                {/* Pagination */}
                {data && data.totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-10">
                        <button
                            onClick={() => setPage(Math.max(1, page - 1))}
                            disabled={page === 1}
                            className="px-4 py-2 rounded-xl bg-white border border-gray-200 text-sm font-medium disabled:opacity-50 hover:bg-gray-50 transition-colors"
                        >
                            ← Prev
                        </button>
                        {Array.from({ length: data.totalPages }, (_, i) => i + 1)
                            .filter((p) => p === 1 || p === data.totalPages || Math.abs(p - page) <= 2)
                            .map((p, i, arr) => (
                                <span key={p}>
                                    {i > 0 && arr[i - 1] !== p - 1 && <span className="text-gray-400 mx-1">...</span>}
                                    <button
                                        onClick={() => setPage(p)}
                                        className={`w-10 h-10 rounded-xl text-sm font-medium transition-colors ${page === p
                                                ? "bg-emerald-500 text-white"
                                                : "bg-white border border-gray-200 hover:bg-gray-50"
                                            }`}
                                    >
                                        {p}
                                    </button>
                                </span>
                            ))}
                        <button
                            onClick={() => setPage(Math.min(data.totalPages, page + 1))}
                            disabled={page === data.totalPages}
                            className="px-4 py-2 rounded-xl bg-white border border-gray-200 text-sm font-medium disabled:opacity-50 hover:bg-gray-50 transition-colors"
                        >
                            Next →
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}