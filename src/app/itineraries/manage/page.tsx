"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosInstance";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaPlus, FaTrash, FaEye, FaMapMarkerAlt, FaDollarSign, FaArrowLeft, FaList } from "react-icons/fa";

export default function ManageItinerariesPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();

    if (authLoading) return <div className="min-h-screen flex items-center justify-center mt-16"><div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent"></div></div>;
    if (!user) { router.push("/login"); return null; }

    const queryClient = useQueryClient();
    const { data: itineraries, isLoading } = useQuery({ queryKey: ["my-itineraries"], queryFn: () => axiosInstance.get("/itineraries/user").then(r => r.data) });
    const deleteMutation = useMutation({ mutationFn: (id: string) => axiosInstance.delete(`/itineraries/${id}`), onSuccess: () => queryClient.invalidateQueries({ queryKey: ["my-itineraries"] }) });

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white"><div className="max-w-5xl mx-auto px-4 py-12 mt-16"><Link href="/explore" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4"><FaArrowLeft /> Back to Explore</Link><motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between items-center"><div><h1 className="text-4xl font-bold flex items-center gap-3"><FaList /> My Itineraries</h1><p className="text-emerald-100 mt-2">{itineraries?.length || 0} trip plans</p></div><Link href="/itineraries/add" className="bg-white text-emerald-600 px-5 py-3 rounded-xl font-bold hover:bg-gray-100 transition-colors flex items-center gap-2 shadow-lg"><FaPlus /> Add New</Link></motion.div></div></div>
            <div className="max-w-5xl mx-auto px-4 py-8">
                {isLoading && <div className="flex justify-center py-16"><div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent"></div></div>}
                {!isLoading && itineraries?.length === 0 && <div className="text-center py-16"><FaList className="text-6xl text-gray-300 mx-auto mb-4" /><h2 className="text-2xl font-bold text-gray-400 mb-2">No itineraries yet</h2><Link href="/itineraries/add" className="inline-flex items-center gap-2 bg-emerald-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-emerald-600 transition-colors"><FaPlus /> Create Your First Itinerary</Link></div>}
                {!isLoading && itineraries?.length > 0 && (
                    <div className="space-y-4">
                        {itineraries.map((item: any, i: number) => (
                            <motion.div key={item._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow border border-gray-100">
                                <div className="flex flex-col sm:flex-row justify-between gap-4">
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold text-gray-800 mb-2">{item.title}</h3>
                                        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                                            <span className="flex items-center gap-1"><FaMapMarkerAlt className="text-emerald-500" />{item.destination || "No destination"}</span>
                                            <span className="flex items-center gap-1"><FaDollarSign className="text-amber-500" />${item.budget || 0}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Link href={`/itineraries/${item._id}`} className="flex items-center gap-1 text-emerald-600 hover:bg-emerald-50 px-4 py-2 rounded-xl font-medium text-sm transition-colors"><FaEye /> View</Link>
                                        <motion.button whileTap={{ scale: 0.95 }} onClick={() => { if (confirm("Delete?")) deleteMutation.mutate(item._id); }} className="flex items-center gap-1 text-red-500 hover:bg-red-50 px-4 py-2 rounded-xl font-medium text-sm transition-colors"><FaTrash /> Delete</motion.button>
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