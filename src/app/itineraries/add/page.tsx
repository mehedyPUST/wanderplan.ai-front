"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import axiosInstance from "@/api/axiosInstance";

const schema = z.object({
    title: z.string().min(3, "Title required"),
    shortDescription: z.string().min(10, "Short description required"),
    fullDescription: z.string().min(20, "Full description required"),
    budget: z.number().min(1, "Budget required"),
    destination: z.string().min(1, "Destination required"),
    imageUrl: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function AddItineraryPage() {
    const router = useRouter();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema) });

    const onSubmit = async (data: FormData) => {
        setError("");
        setLoading(true);
        try {
            await axiosInstance.post("/itineraries", data);
            router.push("/itineraries/manage");
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to create");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto px-4 py-12 mt-16">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-8 rounded-2xl shadow-lg">
                <h1 className="text-3xl font-bold text-emerald-600 mb-6">Add Itinerary</h1>
                {error && <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-xl">{error}</div>}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Title</label>
                        <input {...register("title")} className="mt-1 w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-emerald-400" />
                        {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Short Description</label>
                        <input {...register("shortDescription")} className="mt-1 w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-emerald-400" />
                        {errors.shortDescription && <p className="text-red-500 text-xs mt-1">{errors.shortDescription.message}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Full Description</label>
                        <textarea {...register("fullDescription")} rows={4} className="mt-1 w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-emerald-400" />
                        {errors.fullDescription && <p className="text-red-500 text-xs mt-1">{errors.fullDescription.message}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Budget ($)</label>
                        <input type="number" {...register("budget", { valueAsNumber: true })} className="mt-1 w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-emerald-400" />
                        {errors.budget && <p className="text-red-500 text-xs mt-1">{errors.budget.message}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Destination</label>
                        <input {...register("destination")} placeholder="e.g., Santorini, Greece" className="mt-1 w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-emerald-400" />
                        {errors.destination && <p className="text-red-500 text-xs mt-1">{errors.destination.message}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Image URL (optional)</label>
                        <input {...register("imageUrl")} className="mt-1 w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-emerald-400" />
                    </div>
                    <button type="submit" disabled={loading} className="w-full py-2.5 bg-emerald-500 text-white rounded-xl font-semibold hover:bg-emerald-600 disabled:opacity-50">
                        {loading ? "Saving..." : "Add Itinerary"}
                    </button>
                </form>
            </motion.div>
        </div>
    );
}