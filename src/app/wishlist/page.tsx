"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosInstance";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaHeart, FaTrash, FaMapMarkerAlt, FaArrowLeft } from "react-icons/fa";

export default function WishlistPage() {
    const queryClient = useQueryClient();

    const { data: wishlist, isLoading } = useQuery({
        queryKey: ["wishlist"],
        queryFn: () => axiosInstance.get("/wishlist").then(r => r.data),
    });

    const deleteMutation = useMutation({
        mutationFn: (slug: string) => axiosInstance.delete(`/wishlist/${slug}`),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["wishlist"] }),
    });

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center mt-16">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            {/* Hero */}
            <div className="bg-gradient-to-br from-rose-500 to-pink-600 text-white">
                <div className="max-w-4xl mx-auto px-4 py-16 mt-16">
                    <Link
                        href="/explore"
                        className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4 transition-colors"
                    >
                        <FaArrowLeft /> Back to Explore
                    </Link>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <h1 className="text-4xl font-bold flex items-center gap-3">
                            <FaHeart /> My Wishlist
                        </h1>
                        <p className="text-rose-100 mt-2">
                            {wishlist?.length || 0} saved destinations
                        </p>
                    </motion.div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-8">
                {wishlist?.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-16"
                    >
                        <FaHeart className="text-6xl text-gray-300 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-gray-400 mb-2">Your wishlist is empty</h2>
                        <p className="text-gray-400 mb-6">Start exploring and save destinations you love!</p>
                        <Link
                            href="/explore"
                            className="inline-flex items-center gap-2 bg-emerald-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-emerald-600 transition-colors"
                        >
                            Explore Destinations
                        </Link>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {wishlist?.map((item: any, i: number) => (
                            <motion.div
                                key={item._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow border border-gray-100"
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                            <FaMapMarkerAlt className="text-rose-500" />
                                            {item.name}
                                        </h3>
                                        {item.country && (
                                            <p className="text-sm text-gray-500 mt-1">{item.country}</p>
                                        )}
                                    </div>
                                    <motion.button
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => deleteMutation.mutate(item.slug)}
                                        className="text-gray-400 hover:text-red-500 transition-colors p-2"
                                        disabled={deleteMutation.isPending}
                                    >
                                        <FaTrash />
                                    </motion.button>
                                </div>
                                <Link
                                    href={`/destinations/${item.slug}`}
                                    className="inline-flex items-center gap-1 text-emerald-600 font-semibold text-sm hover:underline mt-2"
                                >
                                    View Details →
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}