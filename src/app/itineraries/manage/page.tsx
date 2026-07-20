"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosInstance";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaPlus, FaTrash, FaEye, FaMapMarkerAlt, FaDollarSign, FaArrowLeft, FaList, FaCheckCircle, FaCalendarAlt } from "react-icons/fa";

export default function ManageItinerariesPage() {
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

    return <ManageItinerariesContent />;
}

function ManageItinerariesContent() {
    const queryClient = useQueryClient();

    const { data: itineraries, isLoading } = useQuery({
        queryKey: ["my-itineraries"],
        queryFn: () => axiosInstance.get("/itineraries/user").then(r => r.data),
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => axiosInstance.delete(`/itineraries/${id}`),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["my-itineraries"] }),
    });

    const travelMutation = useMutation({
        mutationFn: (id: string) => axiosInstance.patch(`/itineraries/${id}/travel`),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["my-itineraries"] }),
    });

    const handleDelete = (id: string, title: string) => {
        if (window.confirm(`Delete "${title}"?`)) {
            deleteMutation.mutate(id);
        }
    };

    const handleMarkTravelled = (id: string) => {
        if (window.confirm("Mark this itinerary as travelled? This will add it to your expense tracking.")) {
            travelMutation.mutate(id);
        }
    };

    const totalBudget = itineraries?.reduce((sum: number, item: any) => sum + (item.budget || 0), 0) || 0;
    const travelledCount = itineraries?.filter((item: any) => item.travelled).length || 0;

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            {/* Hero */}
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
                <div className="max-w-5xl mx-auto px-4 py-12 mt-16">
                    <Link href="/explore" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4">
                        <FaArrowLeft /> Back to Explore
                    </Link>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <h1 className="text-4xl font-bold flex items-center gap-3"><FaList /> My Itineraries</h1>
                            <p className="text-emerald-100 mt-2">
                                {itineraries?.length || 0} trip plans • {travelledCount} travelled • ${totalBudget.toLocaleString()} total budget
                            </p>
                        </div>
                        <Link href="/itineraries/add" className="bg-white text-emerald-600 px-5 py-3 rounded-xl font-bold hover:bg-gray-100 transition-colors flex items-center gap-2 shadow-lg">
                            <FaPlus /> Add New
                        </Link>
                    </motion.div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 py-8">
                {isLoading ? (
                    <div className="flex justify-center py-16">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent"></div>
                    </div>
                ) : itineraries?.length === 0 ? (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-16">
                        <FaList className="text-6xl text-gray-300 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-gray-400 mb-2">No itineraries yet</h2>
                        <p className="text-gray-400 mb-6">Create your first trip plan and make it memorable!</p>
                        <Link href="/itineraries/add" className="inline-flex items-center gap-2 bg-emerald-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-emerald-600 transition-colors">
                            <FaPlus /> Create Your First Itinerary
                        </Link>
                    </motion.div>
                ) : (
                    <div className="space-y-4">
                        {itineraries.map((item: any, i: number) => (
                            <motion.div
                                key={item._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className={`bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow border ${item.travelled ? 'border-green-200 bg-green-50/30' : 'border-gray-100'
                                    }`}
                            >
                                <div className="flex flex-col sm:flex-row justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <h3 className="text-xl font-bold text-gray-800">{item.title}</h3>
                                            {item.travelled && (
                                                <span className="bg-green-100 text-green-700 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                                                    <FaCheckCircle /> Travelled
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                                            <span className="flex items-center gap-1">
                                                <FaMapMarkerAlt className="text-emerald-500" /> {item.destination || "No destination"}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <FaDollarSign className="text-amber-500" /> ${(item.budget || 0).toLocaleString()}
                                            </span>
                                            {item.travelDates && (
                                                <span className="flex items-center gap-1">
                                                    <FaCalendarAlt className="text-purple-500" />
                                                    {item.travelDates.start ? new Date(item.travelDates.start).toLocaleDateString() : 'N/A'}
                                                    {item.travelDates.end && ` - ${new Date(item.travelDates.end).toLocaleDateString()}`}
                                                </span>
                                            )}
                                            {item.travelledAt && (
                                                <span className="text-green-600 text-xs">
                                                    Travelled: {new Date(item.travelledAt).toLocaleDateString()}
                                                </span>
                                            )}
                                        </div>
                                        {item.shortDescription && (
                                            <p className="text-gray-600 mt-2 text-sm">{item.shortDescription.slice(0, 100)}...</p>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <Link
                                            href={`/itineraries/${item._id}`}
                                            className="flex items-center gap-1 text-emerald-600 hover:bg-emerald-50 px-4 py-2 rounded-xl font-medium text-sm transition-colors"
                                        >
                                            <FaEye /> View
                                        </Link>
                                        {!item.travelled && (
                                            <motion.button
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => handleMarkTravelled(item._id)}
                                                disabled={travelMutation.isPending}
                                                className="flex items-center gap-1 text-green-600 hover:bg-green-50 px-4 py-2 rounded-xl font-medium text-sm transition-colors"
                                            >
                                                <FaCheckCircle /> {travelMutation.isPending ? 'Marking...' : 'Mark Travelled'}
                                            </motion.button>
                                        )}
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