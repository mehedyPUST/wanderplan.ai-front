"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosInstance";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import Link from "next/link";

const schema = z.object({
    budget: z.number().min(1, "Budget required"),
    interests: z.string().min(2, "Interests required"),
    travelStyle: z.string().min(2, "Travel style required"),
});

type FormData = z.infer<typeof schema>;

export default function AiRecommendPage() {
    const [results, setResults] = useState<any[]>([]);
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(schema),
    });

    const mutation = useMutation({
        mutationFn: (data: FormData) =>
            axiosInstance.post("/ai/recommend", {
                budget: data.budget,
                interests: data.interests.split(",").map((s) => s.trim()).filter(Boolean),
                travelStyle: data.travelStyle,
            }).then((r) => r.data),
        onSuccess: (data) => setResults(data),
    });

    return (
        <div className="max-w-4xl mx-auto px-4 py-12 mt-16">
            <h1 className="text-3xl font-bold text-emerald-600 mb-8">AI Recommendations</h1>

            {/* Form */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-6 rounded-2xl shadow-lg mb-10">
                <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Budget ($)</label>
                        <input type="number" {...register("budget", { valueAsNumber: true })} className="mt-1 w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-emerald-400" placeholder="e.g., 2000" />
                        {errors.budget && <p className="text-red-500 text-xs mt-1">{errors.budget.message}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Interests (comma-separated)</label>
                        <input {...register("interests")} className="mt-1 w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-emerald-400" placeholder="e.g., beach, culture, food" />
                        {errors.interests && <p className="text-red-500 text-xs mt-1">{errors.interests.message}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Travel Style</label>
                        <input {...register("travelStyle")} className="mt-1 w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-emerald-400" placeholder="e.g., luxury, backpacker, family" />
                        {errors.travelStyle && <p className="text-red-500 text-xs mt-1">{errors.travelStyle.message}</p>}
                    </div>
                    <button type="submit" disabled={mutation.isPending} className="w-full py-2.5 bg-emerald-500 text-white rounded-xl font-semibold hover:bg-emerald-600 disabled:opacity-50">
                        {mutation.isPending ? "Generating..." : "Get Recommendations"}
                    </button>
                </form>
            </motion.div>

            {/* Results */}
            {results.length > 0 && (
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Recommended Destinations</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {results.map((item: any, i: number) => (
                            <motion.div
                                key={item._id || i}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <h3 className="text-xl font-semibold text-gray-800">{item.name || `Destination ${i + 1}`}</h3>
                                    <span className="bg-emerald-100 text-emerald-700 text-sm font-bold px-3 py-1 rounded-full">Score: {item.score}</span>
                                </div>
                                <p className="text-gray-500 mb-4">{item.reason}</p>
                                {item._id && (
                                    <Link href={`/destinations/${item._id}`} className="text-emerald-600 font-semibold hover:underline text-sm">
                                        View Details →
                                    </Link>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}

            {mutation.isError && (
                <p className="text-red-500 text-center mt-4">Failed to get recommendations. Please try again.</p>
            )}
        </div>
    );
}