"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosInstance";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaMapMarkerAlt, FaDollarSign, FaCalendarAlt, FaArrowLeft, FaTrash, FaEdit, FaImage } from "react-icons/fa";

export default function ItineraryDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const queryClient = useQueryClient();

    const { data: itinerary, isLoading, isError } = useQuery({
        queryKey: ["itinerary", id],
        queryFn: () => axiosInstance.get(`/itineraries/${id}`).then(r => r.data),
    });

    const deleteMutation = useMutation({
        mutationFn: () => axiosInstance.delete(`/itineraries/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["my-itineraries"] });
            router.push("/itineraries/manage");
        },
    });

    const handleDelete = () => {
        if (window.confirm("Are you sure you want to delete this itinerary?")) {
            deleteMutation.mutate();
        }
    };

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

    if (isError || !itinerary) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center mt-16">
                <p className="text-2xl text-gray-400 mb-4">Itinerary not found</p>
                <Link href="/itineraries/manage" className="text-emerald-600 font-semibold hover:underline">
                    ← Back to My Itineraries
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            {/* Hero */}
            <div
                className="relative bg-gradient-to-br from-emerald-500 to-teal-600 text-white"
                style={itinerary.imageUrl ? {
                    backgroundImage: `linear-gradient(to bottom right, rgba(16,185,129,0.9), rgba(15,118,110,0.9)), url(${itinerary.imageUrl})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                } : {}}
            >
                <div className="max-w-4xl mx-auto px-4 py-20 mt-16">
                    <Link href="/itineraries/manage" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors">
                        <FaArrowLeft /> Back to My Itineraries
                    </Link>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <h1 className="text-4xl md:text-5xl font-bold mb-3">{itinerary.title}</h1>
                        <div className="flex flex-wrap gap-4 text-emerald-100">
                            <span className="flex items-center gap-2">
                                <FaMapMarkerAlt /> {itinerary.destination || "No destination"}
                            </span>
                            <span className="flex items-center gap-2">
                                <FaDollarSign /> ${itinerary.budget || 0}
                            </span>
                            {itinerary.travelDates && (
                                <span className="flex items-center gap-2">
                                    <FaCalendarAlt />
                                    {new Date(itinerary.travelDates.start).toLocaleDateString()}
                                    {itinerary.travelDates.end && ` - ${new Date(itinerary.travelDates.end).toLocaleDateString()}`}
                                </span>
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* Content */}
                <div className="space-y-6">
                    {/* Short Description */}
                    {itinerary.shortDescription && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
                        >
                            <h2 className="text-xl font-bold text-gray-800 mb-3">Overview</h2>
                            <p className="text-gray-600 leading-relaxed">{itinerary.shortDescription}</p>
                        </motion.div>
                    )}

                    {/* Full Description */}
                    {itinerary.fullDescription && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
                        >
                            <h2 className="text-xl font-bold text-gray-800 mb-3">Full Plan</h2>
                            <p className="text-gray-600 leading-relaxed whitespace-pre-line">{itinerary.fullDescription}</p>
                        </motion.div>
                    )}

                    {/* Quick Info Cards */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="grid grid-cols-2 md:grid-cols-4 gap-4"
                    >
                        <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
                            <FaDollarSign className="text-emerald-500 text-2xl mx-auto mb-2" />
                            <p className="font-bold text-gray-800 text-lg">${itinerary.budget || 0}</p>
                            <p className="text-sm text-gray-500">Budget</p>
                        </div>
                        <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
                            <FaMapMarkerAlt className="text-rose-500 text-2xl mx-auto mb-2" />
                            <p className="font-bold text-gray-800 text-sm">{itinerary.destination || "N/A"}</p>
                            <p className="text-sm text-gray-500">Destination</p>
                        </div>
                        <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
                            <FaCalendarAlt className="text-blue-500 text-2xl mx-auto mb-2" />
                            <p className="font-bold text-gray-800 text-sm">
                                {itinerary.createdAt ? new Date(itinerary.createdAt).toLocaleDateString() : "N/A"}
                            </p>
                            <p className="text-sm text-gray-500">Created</p>
                        </div>
                        <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
                            <FaImage className="text-purple-500 text-2xl mx-auto mb-2" />
                            <p className="font-bold text-gray-800 text-sm">{itinerary.imageUrl ? "Yes" : "No"}</p>
                            <p className="text-sm text-gray-500">Cover Image</p>
                        </div>
                    </motion.div>

                    {/* Action Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="flex flex-col sm:flex-row gap-4"
                    >
                        <Link
                            href={`/itineraries/edit/${itinerary._id}`}
                            className="flex-1 bg-emerald-500 text-white py-4 rounded-2xl font-bold text-lg hover:bg-emerald-600 transition-colors shadow-lg hover:shadow-xl text-center flex items-center justify-center gap-2"
                        >
                            <FaEdit /> Edit Itinerary
                        </Link>
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={handleDelete}
                            disabled={deleteMutation.isPending}
                            className="flex-1 bg-red-500 text-white py-4 rounded-2xl font-bold text-lg hover:bg-red-600 transition-colors shadow-lg hover:shadow-xl flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            <FaTrash /> {deleteMutation.isPending ? "Deleting..." : "Delete Itinerary"}
                        </motion.button>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}