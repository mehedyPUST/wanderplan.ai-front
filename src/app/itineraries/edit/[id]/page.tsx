"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import axiosInstance from "@/api/axiosInstance";
import Link from "next/link";
import { FaMapMarkerAlt, FaDollarSign, FaCalendarAlt, FaImage, FaInfoCircle, FaArrowLeft, FaSave } from "react-icons/fa";

const schema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    shortDescription: z.string().min(10, "Short description must be at least 10 characters"),
    fullDescription: z.string().min(20, "Full description must be at least 20 characters"),
    budget: z.number().min(1, "Budget is required"),
    destination: z.string().min(1, "Destination is required"),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    imageUrl: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function EditItineraryPage() {
    const { id } = useParams();
    const router = useRouter();
    const queryClient = useQueryClient();
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const { data: itinerary, isLoading: isFetching } = useQuery({
        queryKey: ["itinerary", id],
        queryFn: () => axiosInstance.get(`/itineraries/${id}`).then(r => r.data),
    });

    const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(schema),
    });

    useEffect(() => {
        if (itinerary) {
            setValue("title", itinerary.title);
            setValue("shortDescription", itinerary.shortDescription);
            setValue("fullDescription", itinerary.fullDescription);
            setValue("budget", itinerary.budget);
            setValue("destination", itinerary.destination);
            setValue("imageUrl", itinerary.imageUrl || "");
            if (itinerary.travelDates) {
                setValue("startDate", itinerary.travelDates.start?.split("T")[0] || "");
                setValue("endDate", itinerary.travelDates.end?.split("T")[0] || "");
            }
        }
    }, [itinerary, setValue]);

    const title = watch("title");
    const destination = watch("destination");

    const onSubmit = async (data: FormData) => {
        setError("");
        setLoading(true);
        try {
            await axiosInstance.put(`/itineraries/${id}`, {
                ...data,
                travelDates: data.startDate && data.endDate ? { start: data.startDate, end: data.endDate } : undefined,
            });
            setSuccess(true);
            queryClient.invalidateQueries({ queryKey: ["itinerary", id] });
            queryClient.invalidateQueries({ queryKey: ["my-itineraries"] });
            setTimeout(() => router.push(`/itineraries/${id}`), 1000);
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to update itinerary");
        } finally {
            setLoading(false);
        }
    };

    if (isFetching) {
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
            {/* Hero */}
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
                <div className="max-w-3xl mx-auto px-4 py-12 mt-16">
                    <Link href={`/itineraries/${id}`} className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4 transition-colors">
                        <FaArrowLeft /> Back to Itinerary
                    </Link>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <h1 className="text-4xl font-bold flex items-center gap-3">
                            <FaSave /> Edit Itinerary
                        </h1>
                        <p className="text-emerald-100 mt-2">Update your trip details</p>
                    </motion.div>
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-4 -mt-6">
                {success && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-emerald-50 border-2 border-emerald-500 text-emerald-700 p-6 rounded-2xl mb-6 text-center"
                    >
                        <p className="text-xl font-bold">✅ Itinerary Updated Successfully!</p>
                        <p className="text-sm mt-1">Redirecting...</p>
                    </motion.div>
                )}

                {error && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl mb-6 text-center">
                        {error}
                    </motion.div>
                )}

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl shadow-xl p-8 mb-12 border border-gray-100"
                >
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div>
                            <label className="flex items-center gap-2 text-lg font-bold text-gray-800 mb-2">
                                <FaMapMarkerAlt className="text-emerald-500" /> Destination
                            </label>
                            <input {...register("destination")} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:outline-none text-lg" />
                            {errors.destination && <p className="text-red-500 text-xs mt-1">{errors.destination.message}</p>}
                        </div>

                        <div>
                            <label className="flex items-center gap-2 text-lg font-bold text-gray-800 mb-2">
                                <FaInfoCircle className="text-blue-500" /> Trip Title
                            </label>
                            <input {...register("title")} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:outline-none" />
                            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
                        </div>

                        <div>
                            <label className="flex items-center gap-2 text-lg font-bold text-gray-800 mb-2">
                                <FaDollarSign className="text-amber-500" /> Budget ($)
                            </label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">$</span>
                                <input type="number" {...register("budget", { valueAsNumber: true })} className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:outline-none text-lg" />
                            </div>
                            {errors.budget && <p className="text-red-500 text-xs mt-1">{errors.budget.message}</p>}
                        </div>

                        <div>
                            <label className="flex items-center gap-2 text-lg font-bold text-gray-800 mb-2">
                                <FaCalendarAlt className="text-purple-500" /> Travel Dates (Optional)
                            </label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1">Start Date</label>
                                    <input type="date" {...register("startDate")} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1">End Date</label>
                                    <input type="date" {...register("endDate")} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:outline-none" />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="flex items-center gap-2 text-lg font-bold text-gray-800 mb-2">
                                <FaInfoCircle className="text-orange-500" /> Short Description
                            </label>
                            <input {...register("shortDescription")} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:outline-none" />
                            {errors.shortDescription && <p className="text-red-500 text-xs mt-1">{errors.shortDescription.message}</p>}
                        </div>

                        <div>
                            <label className="flex items-center gap-2 text-lg font-bold text-gray-800 mb-2">
                                <FaInfoCircle className="text-teal-500" /> Full Description
                            </label>
                            <textarea {...register("fullDescription")} rows={5} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:outline-none resize-none" />
                            {errors.fullDescription && <p className="text-red-500 text-xs mt-1">{errors.fullDescription.message}</p>}
                        </div>

                        <div>
                            <label className="flex items-center gap-2 text-lg font-bold text-gray-800 mb-2">
                                <FaImage className="text-pink-500" /> Cover Image URL (Optional)
                            </label>
                            <input {...register("imageUrl")} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:outline-none" />
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <motion.button
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                                type="submit"
                                disabled={loading}
                                className="flex-1 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-bold text-lg hover:from-emerald-600 hover:to-teal-700 disabled:opacity-50 transition-all shadow-lg flex items-center justify-center gap-2"
                            >
                                {loading ? "Saving..." : <><FaSave /> Save Changes</>}
                            </motion.button>
                            <Link href={`/itineraries/${id}`} className="flex-1 py-4 border-2 border-gray-300 text-gray-600 rounded-xl font-bold text-lg hover:bg-gray-50 transition-all text-center">
                                Cancel
                            </Link>
                        </div>
                    </form>
                </motion.div>
            </div>
        </div>
    );
}