"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosInstance";
import Link from "next/link";
import { motion } from "framer-motion";

export default function ExplorePage() {
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");
    const [sortBy, setSortBy] = useState("rating");
    const [page, setPage] = useState(1);

    const { data, isLoading } = useQuery({
        queryKey: ["destinations", search, category, sortBy, page],
        queryFn: () =>
            axiosInstance.get("/destinations", {
                params: { search, category, sortBy, page, limit: 8 },
            }).then(r => r.data),
    });

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 mt-16">
            <h1 className="text-3xl font-bold text-emerald-600 mb-8">Explore Destinations</h1>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 mb-8">
                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search..."
                    className="px-4 py-2 border rounded-xl flex-1 min-w-[200px]"
                />
                <select value={category} onChange={(e) => setCategory(e.target.value)} className="px-4 py-2 border rounded-xl">
                    <option value="">All Categories</option>
                    <option value="beach">Beach</option>
                    <option value="city">City</option>
                    <option value="mountain">Mountain</option>
                </select>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="px-4 py-2 border rounded-xl">
                    <option value="rating">Top Rated</option>
                    <option value="priceRange.min">Price: Low to High</option>
                    <option value="createdAt">Newest</option>
                </select>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {isLoading
                    ? Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="bg-white rounded-2xl shadow-lg h-80 animate-pulse">
                            <div className="h-48 bg-gray-200 rounded-t-2xl" />
                            <div className="p-4 space-y-2">
                                <div className="h-4 bg-gray-200 rounded w-3/4" />
                                <div className="h-3 bg-gray-200 rounded w-full" />
                            </div>
                        </div>
                    ))
                    : data?.data?.map((dest: any, i: number) => (
                        <motion.div
                            key={dest._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                        >
                            <img src={dest.images?.[0] || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop"} alt={dest.name} className="h-48 w-full object-cover" />
                            <div className="p-4">
                                <h3 className="font-semibold text-lg">{dest.name}</h3>
                                <p className="text-gray-500 text-sm line-clamp-2">{dest.shortDescription}</p>
                                <div className="mt-3 flex justify-between items-center">
                                    <span className="text-emerald-600 font-bold">${dest.priceRange?.min}+</span>
                                    <Link href={`/destinations/${dest.slug}`} className="text-emerald-600 text-sm font-semibold hover:underline">
                                        View Details
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    ))}
            </div>

            {/* Pagination */}
            {data && data.totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                    {Array.from({ length: data.totalPages }).map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setPage(i + 1)}
                            className={`px-4 py-2 rounded-xl ${page === i + 1 ? "bg-emerald-500 text-white" : "bg-gray-200"}`}
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}