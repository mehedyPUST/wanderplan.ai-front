"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosInstance";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { FaPlus, FaTrash, FaEye, FaMapMarkerAlt, FaDollarSign, FaArrowLeft, FaList, FaCheckCircle, FaCalendarAlt, FaChartBar, FaTimes } from "react-icons/fa";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

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
    const [showStats, setShowStats] = useState(false);

    const { data: itineraries, isLoading } = useQuery({
        queryKey: ["my-itineraries"],
        queryFn: () => axiosInstance.get("/itineraries/user").then(r => r.data),
    });

    const { data: expenseData } = useQuery({
        queryKey: ["user-expenses"],
        queryFn: () => axiosInstance.get("/itineraries/expenses").then(r => r.data),
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => axiosInstance.delete(`/itineraries/${id}`),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["my-itineraries"] }),
    });

    const travelMutation = useMutation({
        mutationFn: (id: string) => axiosInstance.patch(`/itineraries/${id}/travel`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["my-itineraries"] });
            queryClient.invalidateQueries({ queryKey: ["user-expenses"] });
        },
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

    // Chart data
    const chartData = expenseData?.map((item: any) => ({
        month: item._id,
        expenses: item.total,
    })) || [];
    const totalExpenses = chartData.reduce((sum: number, item: any) => sum + item.expenses, 0);

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
                        <div className="flex gap-2">
                            <button
                                onClick={() => setShowStats(true)}
                                className="bg-white/20 backdrop-blur-sm text-white px-5 py-3 rounded-xl font-bold hover:bg-white/30 transition-colors flex items-center gap-2"
                            >
                                <FaChartBar /> View Statistics
                            </button>
                            <Link href="/itineraries/add" className="bg-white text-emerald-600 px-5 py-3 rounded-xl font-bold hover:bg-gray-100 transition-colors flex items-center gap-2 shadow-lg">
                                <FaPlus /> Add New
                            </Link>
                        </div>
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
                                            <span className="flex items-center gap-1"><FaMapMarkerAlt className="text-emerald-500" /> {item.destination || "No destination"}</span>
                                            <span className="flex items-center gap-1"><FaDollarSign className="text-amber-500" /> ${(item.budget || 0).toLocaleString()}</span>
                                            {item.travelledAt && (
                                                <span className="text-green-600 text-xs">Travelled: {new Date(item.travelledAt).toLocaleDateString()}</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <Link href={`/itineraries/${item._id}`} className="flex items-center gap-1 text-emerald-600 hover:bg-emerald-50 px-4 py-2 rounded-xl font-medium text-sm transition-colors"><FaEye /> View</Link>
                                        {!item.travelled && (
                                            <motion.button whileTap={{ scale: 0.95 }} onClick={() => handleMarkTravelled(item._id)} disabled={travelMutation.isPending} className="flex items-center gap-1 text-green-600 hover:bg-green-50 px-4 py-2 rounded-xl font-medium text-sm transition-colors">
                                                <FaCheckCircle /> Mark Travelled
                                            </motion.button>
                                        )}
                                        <motion.button whileTap={{ scale: 0.95 }} onClick={() => handleDelete(item._id, item.title)} disabled={deleteMutation.isPending} className="flex items-center gap-1 text-red-500 hover:bg-red-50 px-4 py-2 rounded-xl font-medium text-sm transition-colors">
                                            <FaTrash /> Delete
                                        </motion.button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* Statistics Modal */}
            <AnimatePresence>
                {showStats && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                            onClick={() => setShowStats(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative bg-white rounded-3xl shadow-2xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto z-10"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                                    <FaChartBar className="text-emerald-500" /> Travel Statistics
                                </h2>
                                <button onClick={() => setShowStats(false)} className="text-gray-400 hover:text-gray-600">
                                    <FaTimes size={20} />
                                </button>
                            </div>

                            {/* Summary Cards */}
                            <div className="grid grid-cols-3 gap-4 mb-6">
                                <div className="bg-emerald-50 rounded-xl p-4 text-center">
                                    <p className="text-2xl font-black text-emerald-600">{itineraries?.length || 0}</p>
                                    <p className="text-xs text-gray-500">Total Plans</p>
                                </div>
                                <div className="bg-amber-50 rounded-xl p-4 text-center">
                                    <p className="text-2xl font-black text-amber-600">{travelledCount}</p>
                                    <p className="text-xs text-gray-500">Travelled</p>
                                </div>
                                <div className="bg-purple-50 rounded-xl p-4 text-center">
                                    <p className="text-2xl font-black text-purple-600">${totalExpenses.toLocaleString()}</p>
                                    <p className="text-xs text-gray-500">Total Spent</p>
                                </div>
                            </div>

                            {/* Chart */}
                            {chartData.length > 0 ? (
                                <div>
                                    <h3 className="font-semibold text-gray-700 mb-4">📊 Monthly Expenses (Last 6 Months)</h3>
                                    <ResponsiveContainer width="100%" height={250}>
                                        <BarChart data={chartData}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                            <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} />
                                            <YAxis stroke="#9ca3af" fontSize={12} />
                                            <Tooltip />
                                            <Bar dataKey="expenses" fill="#10B981" radius={[8, 8, 0, 0]} name="Expenses ($)" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            ) : (
                                <div className="text-center py-10 text-gray-400">
                                    <FaChartBar className="text-4xl mx-auto mb-3" />
                                    <p>No travel data yet.</p>
                                    <p className="text-sm">Mark itineraries as travelled to see your expense chart!</p>
                                </div>
                            )}

                            <button
                                onClick={() => setShowStats(false)}
                                className="w-full mt-6 py-3 bg-emerald-500 text-white rounded-xl font-bold hover:bg-emerald-600 transition-colors"
                            >
                                Close
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}