"use client";

import { useParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosInstance";
import { FaMapMarkerAlt, FaCalendarAlt, FaDollarSign, FaStar, FaHeart, FaLightbulb, FaArrowLeft } from "react-icons/fa";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";

export default function DestinationPage() {
    const { slug } = useParams();
    const { user } = useAuth();
    const queryClient = useQueryClient();

    const { data: dbDestination, isLoading } = useQuery({
        queryKey: ["destination", slug],
        queryFn: () => axiosInstance.get(`/destinations/${slug}`).then(r => r.data),
        retry: false,
    });

    const { data: wishlistData } = useQuery({
        queryKey: ["wishlist", slug],
        queryFn: () => axiosInstance.get(`/wishlist/${slug}`).then(r => r.data),
        enabled: !!user,
    });

    const isSaved = wishlistData?.saved || false;

    const wishlistMutation = useMutation({
        mutationFn: () => {
            if (isSaved) {
                return axiosInstance.delete(`/wishlist/${slug}`);
            } else {
                return axiosInstance.post("/wishlist", {
                    name: dbDestination?.name || formattedName,
                    country: dbDestination?.country || "",
                    slug,
                });
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["wishlist", slug] });
        },
    });

    const formattedName = (slug as string)
        .split("-")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center mt-16">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    className="rounded-full h-16 w-16 border-4 border-emerald-500 border-t-transparent"
                />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            {/* Hero Section */}
            <div className="relative bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
                <div className="max-w-5xl mx-auto px-4 py-20 mt-16">
                    <Link href="/explore" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors">
                        <FaArrowLeft /> Back to Explore
                    </Link>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <h1 className="text-5xl md:text-6xl font-bold mb-3">
                            {dbDestination?.name || formattedName}
                        </h1>
                        <p className="text-xl text-emerald-100 flex items-center gap-2">
                            <FaMapMarkerAlt /> {dbDestination?.country || "Worldwide Destination"}
                        </p>
                    </motion.div>
                </div>
                <div className="absolute bottom-0 w-full">
                    <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="#f9fafb" />
                    </svg>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 py-12">
                {dbDestination ? (
                    <div className="space-y-8">
                        {/* Image Gallery */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <img
                                src={dbDestination.images?.[0] || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=500&fit=crop"}
                                alt={dbDestination.name}
                                className="w-full h-80 object-cover rounded-2xl shadow-lg"
                            />
                            <div className="bg-white rounded-2xl p-6 shadow-lg flex flex-col justify-center">
                                <h2 className="text-2xl font-bold text-gray-800 mb-4">About {dbDestination.name}</h2>
                                <p className="text-gray-600 leading-relaxed">{dbDestination.fullDescription}</p>
                            </div>
                        </motion.div>

                        {/* Quick Info Cards */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-white rounded-2xl p-6 shadow-lg text-center hover:shadow-xl transition-shadow">
                                <FaDollarSign className="text-emerald-500 text-3xl mx-auto mb-3" />
                                <p className="text-2xl font-bold text-gray-800">${dbDestination.priceRange?.min}</p>
                                <p className="text-sm text-gray-500">Starting Price</p>
                            </div>
                            <div className="bg-white rounded-2xl p-6 shadow-lg text-center hover:shadow-xl transition-shadow">
                                <FaStar className="text-amber-500 text-3xl mx-auto mb-3" />
                                <p className="text-2xl font-bold text-gray-800">{dbDestination.rating}/5</p>
                                <p className="text-sm text-gray-500">Rating</p>
                            </div>
                            <div className="bg-white rounded-2xl p-6 shadow-lg text-center hover:shadow-xl transition-shadow">
                                <FaCalendarAlt className="text-blue-500 text-3xl mx-auto mb-3" />
                                <p className="text-sm font-bold text-gray-800">{dbDestination.bestTimeToVisit}</p>
                                <p className="text-sm text-gray-500">Best Time</p>
                            </div>
                            <div className="bg-white rounded-2xl p-6 shadow-lg text-center hover:shadow-xl transition-shadow">
                                <FaHeart className="text-rose-500 text-3xl mx-auto mb-3" />
                                <p className="text-sm font-bold text-gray-800 capitalize">{dbDestination.category}</p>
                                <p className="text-sm text-gray-500">Category</p>
                            </div>
                        </motion.div>

                        {/* Tags */}
                        {dbDestination.tags && dbDestination.tags.length > 0 && (
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-2xl p-6 shadow-lg">
                                <h3 className="text-lg font-bold text-gray-800 mb-3">Tags</h3>
                                <div className="flex flex-wrap gap-2">
                                    {dbDestination.tags.map((tag: string) => (
                                        <span key={tag} className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-sm font-medium capitalize">{tag}</span>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </div>
                ) : (
                    <div className="space-y-8">
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-8 text-center">
                            <FaStar className="text-amber-500 text-5xl mx-auto mb-4" />
                            <h2 className="text-3xl font-bold text-gray-800 mb-2">{formattedName}</h2>
                            <p className="text-gray-600 text-lg mb-4">This destination was recommended by our AI based on your travel preferences.</p>
                            <p className="text-gray-500">Want a detailed itinerary? Use our <Link href="/ai-recommend" className="text-emerald-600 font-semibold hover:underline">AI Itinerary Generator</Link></p>
                        </motion.div>
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-2xl p-8 shadow-lg">
                            <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2"><FaHeart className="text-rose-500" /> Why Visit {formattedName}?</h3>
                            <p className="text-gray-600 leading-relaxed">{formattedName} is a fantastic destination that matches your travel preferences. This location offers a unique blend of culture, attractions, and experiences.</p>
                        </motion.div>
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-2xl p-8 shadow-lg">
                            <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2"><FaLightbulb className="text-amber-500" /> Travel Tips</h3>
                            <ul className="space-y-3 text-gray-600">
                                <li className="flex items-start gap-2"><span className="text-emerald-500 mt-1">✦</span> Research the best time to visit</li>
                                <li className="flex items-start gap-2"><span className="text-emerald-500 mt-1">✦</span> Book accommodations in advance</li>
                                <li className="flex items-start gap-2"><span className="text-emerald-500 mt-1">✦</span> Learn a few local phrases</li>
                                <li className="flex items-start gap-2"><span className="text-emerald-500 mt-1">✦</span> Check visa requirements</li>
                            </ul>
                        </motion.div>
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-white rounded-2xl p-6 shadow-lg text-center"><FaCalendarAlt className="text-blue-500 text-3xl mx-auto mb-3" /><h4 className="font-bold text-gray-800">Best Time</h4><p className="text-sm text-gray-500 mt-1">Varies by season</p></div>
                            <div className="bg-white rounded-2xl p-6 shadow-lg text-center"><FaDollarSign className="text-emerald-500 text-3xl mx-auto mb-3" /><h4 className="font-bold text-gray-800">Budget</h4><p className="text-sm text-gray-500 mt-1">Depends on your style</p></div>
                            <div className="bg-white rounded-2xl p-6 shadow-lg text-center"><FaStar className="text-amber-500 text-3xl mx-auto mb-3" /><h4 className="font-bold text-gray-800">Rating</h4><p className="text-sm text-gray-500 mt-1">Highly recommended</p></div>
                        </motion.div>
                    </div>
                )}

                {/* CTA Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="flex flex-col sm:flex-row gap-4 mt-8"
                >
                    {user ? (
                        <Link
                            href={`/itineraries/add?destination=${encodeURIComponent(dbDestination?.name || formattedName)}`}
                            className="flex-1 bg-emerald-500 text-white py-4 rounded-2xl font-bold text-lg hover:bg-emerald-600 transition-colors shadow-lg hover:shadow-xl text-center"
                        >
                            ✈️ Plan Your Trip
                        </Link>
                    ) : (
                        <Link
                            href="/login"
                            className="flex-1 bg-emerald-500 text-white py-4 rounded-2xl font-bold text-lg hover:bg-emerald-600 transition-colors shadow-lg hover:shadow-xl text-center"
                        >
                            ✈️ Login to Plan Your Trip
                        </Link>
                    )}

                    {user ? (
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => wishlistMutation.mutate()}
                            disabled={wishlistMutation.isPending}
                            className={`flex-1 py-4 rounded-2xl font-bold text-lg transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 ${isSaved ? "bg-rose-500 text-white hover:bg-rose-600" : "bg-amber-400 text-white hover:bg-amber-500"
                                }`}
                        >
                            {wishlistMutation.isPending ? "Saving..." : isSaved ? <><FaHeart className="text-lg" /> Saved to Wishlist</> : <><FaHeart className="text-lg" /> Save to Wishlist</>}
                        </motion.button>
                    ) : (
                        <Link
                            href="/login"
                            className="flex-1 bg-amber-400 text-white py-4 rounded-2xl font-bold text-lg hover:bg-amber-500 transition-colors shadow-lg hover:shadow-xl text-center"
                        >
                            ❤️ Login to Save
                        </Link>
                    )}
                </motion.div>
            </div>
        </div>
    );
}