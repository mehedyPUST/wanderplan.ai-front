"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosInstance";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaPlus, FaTrash, FaEye, FaMapMarkerAlt, FaDollarSign, FaArrowLeft, FaList } from "react-icons/fa";

export default function ManageItinerariesPage() {
    const queryClient = useQueryClient();

    const { data: itineraries, isLoading, isError, error } = useQuery({
        queryKey: ["my-itineraries"],
        queryFn: () => axiosInstance.get("/itineraries/user").then(r => r.data),
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => axiosInstance.delete(`/itineraries/${id}`),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["my-itineraries"] }),
    });

    const handleDelete = (id: string, title: string) => {
        if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
            deleteMutation.mutate(id);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            {/* Hero */}
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
                <div className="max-w-5xl mx-auto px-4 py-12 mt-16">
                    <Link href="/explore" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4 transition-colors">
                        <FaArrowLeft /> Back to Explore
                    </Link>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between items-center">
                        <div>
                            <h1 className="text-4xl font-bold flex items-center gap-3">
                                <FaList /> My Itineraries
                            </h1>
                            <p className="text-emerald-100 mt-2">
                                {itineraries?.length || 0} trip plans
                            </p>
                        </div>
                        <Link
                            href="/itineraries/add"
                            className="bg-white text-emerald-600 px-5 py-3 rounded-xl font-bold hover:bg-gray-100 transition-colors flex items-center gap-2 shadow-lg"
                        >
                            <FaPlus /> Add New
                        </Link>
                    </motion.div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 py-8">
                {/* Loading */}
                {isLoading && (
                    <div className="flex justify-center py-16">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                            className="rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent"
                        />
                    </div>
                )}

                {/* Error */}
                {isError && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-red-50 text-red-600 p-6 rounded-2xl text-center">
                        <p className="font-semibold">Failed to load itineraries</p>
                        <p className="text-sm mt-1">{(error as any)?.response?.data?.message || "Please try again later"}</p>
                    </motion.div>
                )}

                {/* Empty State */}
                {!isLoading && !isError && itineraries?.length === 0 && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-16">
                        <FaList className="text-6xl text-gray-300 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-gray-400 mb-2">No itineraries yet</h2>
                        <p className="text-gray-400 mb-6">Create your first trip plan and make it memorable!</p>
                        <Link
                            href="/itineraries/add"
                            className="inline-flex items-center gap-2 bg-emerald-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-emerald-600 transition-colors"
                        >
                            <FaPlus /> Create Your First Itinerary
                        </Link>
                    </motion.div>
                )}

                {/* Itinerary List */}
                {!isLoading && !isError && itineraries?.length > 0 && (
                    <div className="space-y-4">
                        {itineraries.map((item: any, i: number) => (
                            <motion.div
                                key={item._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow border border-gray-100"
                            >
                                <div className="flex flex-col sm:flex-row justify-between gap-4">
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold text-gray-800 mb-2">{item.title}</h3>
                                        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                                            <span className="flex items-center gap-1">
                                                <FaMapMarkerAlt className="text-emerald-500" />
                                                {item.destination || "No destination"}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <FaDollarSign className="text-amber-500" />
                                                ${item.budget || 0}
                                            </span>
                                            {item.createdAt && (
                                                <span className="text-gray-400">
                                                    {new Date(item.createdAt).toLocaleDateString()}
                                                </span>
                                            )}
                                        </div>
                                        {item.shortDescription && (
                                            <p className="text-gray-600 mt-2 text-sm line-clamp-2">{item.shortDescription}</p>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Link
                                            href={`/itineraries/${item._id}`}
                                            className="flex items-center gap-1 text-emerald-600 hover:bg-emerald-50 px-4 py-2 rounded-xl font-medium text-sm transition-colors"
                                        >
                                            <FaEye /> View
                                        </Link>
                                        <motion.button
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => handleDelete(item._id, item.title)}
                                            disabled={deleteMutation.isPending}
                                            className="flex items-center gap-1 text-red-500 hover:bg-red-50 px-4 py-2 rounded-xl font-medium text-sm transition-colors"
                                        >
                                            <FaTrash /> Delete
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