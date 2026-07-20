"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import axiosInstance from "@/api/axiosInstance";
import Link from "next/link";
import { FaMapMarkerAlt, FaDollarSign, FaCalendarAlt, FaImage, FaInfoCircle, FaArrowLeft, FaPlus, FaRobot } from "react-icons/fa";

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

export default function AddItineraryPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center mt-16">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent"></div>
            </div>
        }>
            <AddItineraryContent />
        </Suspense>
    );
}

function AddItineraryContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const destinationFromUrl = searchParams.get("destination") || "";

    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [aiGenerating, setAiGenerating] = useState(false);

    const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            budget: 500,
            destination: destinationFromUrl,
        },
    });

    const title = watch("title");
    const destination = watch("destination");
    const budget = watch("budget");
    const startDate = watch("startDate");
    const endDate = watch("endDate");

    const getDays = () => {
        if (startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            const diff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
            return diff > 0 ? diff : 3;
        }
        return 3;
    };

    const generateWithAI = async () => {
        const dest = watch("destination");
        const budg = watch("budget");
        const days = getDays();
        const dateRange = startDate && endDate ? `${startDate} to ${endDate}` : `${days} days`;

        if (!dest) {
            setError("Please enter a destination first");
            return;
        }
        if (!budg || budg < 1) {
            setError("Please enter a budget first");
            return;
        }

        setAiGenerating(true);
        setError("");

        try {
            const response = await fetch("/api/ai/generate-itinerary", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    destination: dest,
                    days: days,
                    budget: budg,
                    interests: ["sightseeing", "food", "culture", "adventure"],
                    length: "detailed",
                    dates: dateRange,
                }),
                credentials: "include",
            });

            const reader = response.body?.getReader();
            const decoder = new TextDecoder();
            let fullText = "";

            while (reader) {
                const { done, value } = await reader.read();
                if (done) break;
                const chunk = decoder.decode(value);
                const lines = chunk.split("\n");
                for (const line of lines) {
                    if (line.startsWith("data: ")) {
                        const data = line.slice(6);
                        if (data === "[DONE]") break;
                        try {
                            const parsed = JSON.parse(data);
                            fullText += parsed.text;
                        } catch { }
                    }
                }
            }

            setValue("title", `${days}-Day Adventure in ${dest}`);
            setValue("shortDescription", `A ${days}-day trip to ${dest} with a budget of $${budg}. Dates: ${dateRange}.`);
            setValue("fullDescription", fullText.trim());

        } catch (err: any) {
            setError("AI generation failed. Please try again.");
        } finally {
            setAiGenerating(false);
        }
    };

    const onSubmit = async (data: FormData) => {
        setError("");
        setLoading(true);
        try {
            await axiosInstance.post("/itineraries", {
                ...data,
                travelDates: data.startDate && data.endDate ? { start: data.startDate, end: data.endDate } : undefined,
            });
            setSuccess(true);
            setTimeout(() => router.push("/itineraries/manage"), 1500);
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to create itinerary");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            {/* Hero */}
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
                <div className="max-w-3xl mx-auto px-4 py-12 mt-16">
                    <Link href="/itineraries/manage" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4 transition-colors">
                        <FaArrowLeft /> Back to My Itineraries
                    </Link>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <h1 className="text-4xl font-bold flex items-center gap-3">
                            <FaPlus /> Create New Itinerary
                        </h1>
                        <p className="text-emerald-100 mt-2">Fill in the details and let AI generate your perfect plan</p>
                    </motion.div>
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-4 -mt-6">
                {/* Success Message */}
                {success && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-emerald-50 border-2 border-emerald-500 text-emerald-700 p-6 rounded-2xl mb-6 text-center"
                    >
                        <p className="text-xl font-bold">✅ Itinerary Created Successfully!</p>
                        <p className="text-sm mt-1">Redirecting to your itineraries...</p>
                    </motion.div>
                )}

                {/* Error Message */}
                {error && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl mb-6 text-center"
                    >
                        {error}
                    </motion.div>
                )}

                {/* Form Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white rounded-2xl shadow-xl p-8 mb-12 border border-gray-100"
                >
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                        {/* Step 1: Destination */}
                        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="bg-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">1</span>
                                <h3 className="text-lg font-bold text-blue-700">Where do you want to go?</h3>
                            </div>
                            <div className="flex items-center gap-2">
                                <FaMapMarkerAlt className="text-blue-500 text-xl" />
                                <input
                                    {...register("destination")}
                                    placeholder="e.g., Bali, Indonesia or Paris, France"
                                    className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:outline-none transition text-lg"
                                />
                            </div>
                            {errors.destination && <p className="text-red-500 text-xs mt-1">{errors.destination.message}</p>}
                        </div>

                        {/* Step 2: Budget */}
                        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="bg-amber-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">2</span>
                                <h3 className="text-lg font-bold text-amber-700">What's your budget?</h3>
                            </div>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">$</span>
                                <input
                                    type="number"
                                    {...register("budget", { valueAsNumber: true })}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:outline-none transition text-lg"
                                    placeholder="Enter your total trip budget"
                                />
                            </div>
                            {errors.budget && <p className="text-red-500 text-xs mt-1">{errors.budget.message}</p>}
                        </div>

                        {/* Step 3: Dates */}
                        <div className="bg-purple-50 border border-purple-200 rounded-2xl p-5">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="bg-purple-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">3</span>
                                <h3 className="text-lg font-bold text-purple-700">When are you traveling?</h3>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1">Start Date</label>
                                    <input
                                        type="date"
                                        {...register("startDate")}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:outline-none transition"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1">End Date</label>
                                    <input
                                        type="date"
                                        {...register("endDate")}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:outline-none transition"
                                    />
                                </div>
                            </div>
                            {startDate && endDate && (
                                <p className="text-purple-600 text-sm mt-2 font-medium">
                                    📅 {getDays()} days trip
                                </p>
                            )}
                        </div>

                        {/* AI Generate Button */}
                        <motion.button
                            type="button"
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={generateWithAI}
                            disabled={aiGenerating || !destination || !budget}
                            className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-bold text-lg hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 transition-all shadow-lg flex items-center justify-center gap-2"
                        >
                            {aiGenerating ? (
                                <>
                                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                    AI is generating your itinerary...
                                </>
                            ) : (
                                <>
                                    <FaRobot className="text-xl" /> Generate with AI
                                </>
                            )}
                        </motion.button>
                        {(!destination || !budget) && (
                            <p className="text-center text-gray-400 text-sm -mt-4">
                                👆 Enter destination and budget to enable AI generation
                            </p>
                        )}

                        {/* Divider */}
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-white text-gray-400">Or fill manually</span>
                            </div>
                        </div>

                        {/* Title */}
                        <div>
                            <label className="flex items-center gap-2 text-lg font-bold text-gray-800 mb-2">
                                <FaInfoCircle className="text-blue-500" />
                                Trip Title
                            </label>
                            <input
                                {...register("title")}
                                placeholder="e.g., Summer Vacation in Bali"
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:outline-none transition"
                            />
                            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
                        </div>

                        {/* Short Description */}
                        <div>
                            <label className="flex items-center gap-2 text-lg font-bold text-gray-800 mb-2">
                                <FaInfoCircle className="text-orange-500" />
                                Short Description
                            </label>
                            <input
                                {...register("shortDescription")}
                                placeholder="A quick summary of your trip"
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:outline-none transition"
                            />
                            {errors.shortDescription && <p className="text-red-500 text-xs mt-1">{errors.shortDescription.message}</p>}
                        </div>

                        {/* Full Description */}
                        <div>
                            <label className="flex items-center gap-2 text-lg font-bold text-gray-800 mb-2">
                                <FaInfoCircle className="text-teal-500" />
                                Full Itinerary Plan
                            </label>
                            <textarea
                                {...register("fullDescription")}
                                rows={10}
                                placeholder="Your day-by-day plan will appear here after AI generation, or type manually..."
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:outline-none transition resize-none"
                            />
                            {errors.fullDescription && <p className="text-red-500 text-xs mt-1">{errors.fullDescription.message}</p>}
                        </div>

                        {/* Image URL */}
                        <div>
                            <label className="flex items-center gap-2 text-lg font-bold text-gray-800 mb-2">
                                <FaImage className="text-pink-500" />
                                Cover Image URL (Optional)
                            </label>
                            <input
                                {...register("imageUrl")}
                                placeholder="https://example.com/your-image.jpg"
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:outline-none transition"
                            />
                        </div>

                        {/* Preview Card */}
                        {(title || destination) && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-2xl p-6"
                            >
                                <h3 className="text-sm font-bold text-emerald-700 mb-3">📋 Preview</h3>
                                <div className="bg-white rounded-xl p-4 shadow-sm">
                                    <h4 className="text-lg font-bold text-gray-800">{title || "Your Trip Title"}</h4>
                                    <div className="flex flex-wrap gap-3 mt-2">
                                        {destination && (
                                            <p className="text-emerald-600 font-medium text-sm flex items-center gap-1">
                                                <FaMapMarkerAlt className="text-xs" /> {destination}
                                            </p>
                                        )}
                                        <p className="text-amber-600 font-medium text-sm flex items-center gap-1">
                                            <FaDollarSign className="text-xs" /> ${budget || 0}
                                        </p>
                                        {startDate && endDate && (
                                            <p className="text-purple-600 font-medium text-sm flex items-center gap-1">
                                                <FaCalendarAlt className="text-xs" /> {getDays()} days
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Submit Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <motion.button
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                                type="submit"
                                disabled={loading}
                                className="flex-1 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-bold text-lg hover:from-emerald-600 hover:to-teal-700 disabled:opacity-50 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                        </svg>
                                        Creating...
                                    </>
                                ) : (
                                    <>
                                        <FaPlus /> Create Itinerary
                                    </>
                                )}
                            </motion.button>
                            <Link
                                href="/itineraries/manage"
                                className="flex-1 py-4 border-2 border-gray-300 text-gray-600 rounded-xl font-bold text-lg hover:bg-gray-50 transition-all text-center"
                            >
                                Cancel
                            </Link>
                        </div>
                    </form>
                </motion.div>
            </div>
        </div>
    );
}