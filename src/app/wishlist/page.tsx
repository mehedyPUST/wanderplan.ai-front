"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosInstance";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaHeart, FaTrash, FaMapMarkerAlt, FaArrowLeft, FaCalendarAlt, FaStar, FaEye } from "react-icons/fa";

export default function WishlistPage() {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.replace("/login");
        }
    }, [user, loading]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center mt-16">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent"></div>
            </div>
        );
    }

    if (!user) return null;

    return <WishlistContent />;
}

function WishlistContent() {
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
                <div className="max-w-6xl mx-auto px-4 py-16 mt-16">
                    <Link href="/explore" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4 transition-colors">
                        <FaArrowLeft /> Back to Explore
                    </Link>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <h1 className="text-4xl font-bold flex items-center gap-3"><FaHeart /> My Wishlist</h1>
                            <p className="text-rose-100 mt-2">{wishlist?.length || 0} saved destinations</p>
                        </div>
                    </motion.div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 py-8">
                {wishlist?.length === 0 ? (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-20">
                        <FaHeart className="text-8xl text-gray-300 mx-auto mb-6" />
                        <h2 className="text-3xl font-bold text-gray-400 mb-3">Your wishlist is empty</h2>
                        <p className="text-gray-400 text-lg mb-8">Start exploring and save destinations you love!</p>
                        <Link href="/explore" className="inline-flex items-center gap-2 bg-rose-500 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-rose-600 transition-colors shadow-lg">
                            <FaMapMarkerAlt /> Explore Destinations
                        </Link>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {wishlist.map((item: any, i: number) => (
                            <motion.div
                                key={item._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="bg-white rounded-2xl shadow-lg overflow-hidden group hover:shadow-2xl transition-all duration-300 border border-gray-100"
                            >
                                {/* Image Section */}
                                <div className="relative h-48 bg-gradient-to-br from-rose-100 to-pink-100 flex items-center justify-center overflow-hidden">
                                    <FaMapMarkerAlt className="text-6xl text-rose-300 group-hover:scale-125 transition-transform duration-500" />
                                    <div className="absolute top-3 right-3">
                                        <motion.button
                                            whileTap={{ scale: 0.9 }}
                                            onClick={() => deleteMutation.mutate(item.slug)}
                                            disabled={deleteMutation.isPending}
                                            className="bg-white/90 backdrop-blur-sm text-gray-400 hover:text-red-500 hover:bg-red-50 p-2.5 rounded-full transition-all shadow-sm"
                                        >
                                            <FaTrash className="text-sm" />
                                        </motion.button>
                                    </div>
                                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/40 to-transparent p-4">
                                        <h3 className="text-white font-bold text-xl">{item.name}</h3>
                                    </div>
                                </div>

                                {/* Content Section */}
                                <div className="p-5">
                                    {/* Country */}
                                    {item.country && (
                                        <div className="flex items-center gap-2 text-gray-500 text-sm mb-3">
                                            <FaMapMarkerAlt className="text-rose-500 text-xs" />
                                            <span>{item.country}</span>
                                        </div>
                                    )}

                                    {/* Quick Info */}
                                    <div className="grid grid-cols-2 gap-3 mb-4">
                                        <div className="bg-gray-50 rounded-xl p-3 text-center">
                                            <FaStar className="text-amber-500 text-sm mx-auto mb-1" />
                                            <p className="text-xs text-gray-500">Rating</p>
                                            <p className="font-bold text-gray-800 text-sm">4.5/5</p>
                                        </div>
                                        <div className="bg-gray-50 rounded-xl p-3 text-center">
                                            <FaCalendarAlt className="text-blue-500 text-sm mx-auto mb-1" />
                                            <p className="text-xs text-gray-500">Best Time</p>
                                            <p className="font-bold text-gray-800 text-xs">Varies</p>
                                        </div>
                                    </div>

                                    {/* Added Date */}
                                    {item.createdAt && (
                                        <p className="text-xs text-gray-400 mb-4 flex items-center gap-1">
                                            <FaCalendarAlt className="text-xs" />
                                            Saved on {new Date(item.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                        </p>
                                    )}

                                    {/* Action Buttons */}
                                    <div className="flex gap-2">
                                        <Link
                                            href={`/destinations/${item.slug}`}
                                            className="flex-1 bg-emerald-500 text-white text-center py-2.5 rounded-xl font-semibold text-sm hover:bg-emerald-600 transition-colors flex items-center justify-center gap-1"
                                        >
                                            <FaEye className="text-xs" /> View Details
                                        </Link>
                                        <motion.button
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => deleteMutation.mutate(item.slug)}
                                            disabled={deleteMutation.isPending}
                                            className="bg-red-50 text-red-500 px-4 py-2.5 rounded-xl font-semibold text-sm hover:bg-red-100 transition-colors"
                                        >
                                            <FaTrash />
                                        </motion.button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}