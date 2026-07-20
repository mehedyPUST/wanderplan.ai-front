"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import axiosInstance from "@/api/axiosInstance";
import Link from "next/link";
import { FaMapMarkerAlt, FaDollarSign, FaCalendarAlt, FaImage, FaInfoCircle, FaArrowLeft, FaPlus, FaRobot, FaCheckCircle, FaList, FaHome } from "react-icons/fa";

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

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://wanderplan-ai-back.vercel.app";

export default function AddItineraryPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();

    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center mt-16">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent"></div>
            </div>
        );
    }

    if (!user) {
        router.push("/login");
        return null;
    }

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
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [aiGenerating, setAiGenerating] = useState(false);

    const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: { budget: 500, destination: destinationFromUrl },
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
        if (!dest) { setError("Please enter a destination first"); return; }
        if (!budg || budg < 1) { setError("Please enter a budget first"); return; }
        setAiGenerating(true); setError("");
        try {
            const response = await fetch(`${API_URL}/api/ai/generate-itinerary`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ destination: dest, days: getDays(), budget: budg, interests: ["sightseeing", "food", "culture"], length: "detailed" }),
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
                        try { const parsed = JSON.parse(data); fullText += parsed.text; } catch { }
                    }
                }
            }
            setValue("title", `${getDays()}-Day Adventure in ${dest}`);
            setValue("shortDescription", `A ${getDays()}-day trip to ${dest} with a budget of $${budg}.`);
            setValue("fullDescription", fullText.trim());
        } catch { setError("AI generation failed."); }
        finally { setAiGenerating(false); }
    };

    const onSubmit = async (data: FormData) => {
        setError(""); setLoading(true);
        try {
            await axiosInstance.post("/itineraries", { ...data, travelDates: data.startDate && data.endDate ? { start: data.startDate, end: data.endDate } : undefined });
            setShowSuccessModal(true);
        } catch (err: any) { setError(err.response?.data?.message || "Failed to create itinerary"); }
        finally { setLoading(false); }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
                <div className="max-w-3xl mx-auto px-4 py-12 mt-16">
                    <Link href="/itineraries/manage" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4"><FaArrowLeft /> Back to My Itineraries</Link>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <h1 className="text-4xl font-bold flex items-center gap-3"><FaPlus /> Create New Itinerary</h1>
                        <p className="text-emerald-100 mt-2">Fill in the details and let AI generate your perfect plan</p>
                    </motion.div>
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-4 -mt-6">
                {error && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl mb-6 text-center">{error}</motion.div>}

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-2xl shadow-xl p-8 mb-12 border border-gray-100">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5">
                            <div className="flex items-center gap-2 mb-3"><span className="bg-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">1</span><h3 className="text-lg font-bold text-blue-700">Where do you want to go?</h3></div>
                            <div className="flex items-center gap-2"><FaMapMarkerAlt className="text-blue-500 text-xl" /><input {...register("destination")} placeholder="e.g., Bali, Indonesia" className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:outline-none transition text-lg" /></div>
                            {errors.destination && <p className="text-red-500 text-xs mt-1">{errors.destination.message}</p>}
                        </div>
                        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
                            <div className="flex items-center gap-2 mb-3"><span className="bg-amber-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">2</span><h3 className="text-lg font-bold text-amber-700">What's your budget?</h3></div>
                            <div className="relative"><span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">$</span><input type="number" {...register("budget", { valueAsNumber: true })} className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:outline-none transition text-lg" placeholder="Enter your total trip budget" /></div>
                            {errors.budget && <p className="text-red-500 text-xs mt-1">{errors.budget.message}</p>}
                        </div>
                        <div className="bg-purple-50 border border-purple-200 rounded-2xl p-5">
                            <div className="flex items-center gap-2 mb-3"><span className="bg-purple-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">3</span><h3 className="text-lg font-bold text-purple-700">When are you traveling?</h3></div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div><label className="block text-sm font-medium text-gray-600 mb-1">Start Date</label><input type="date" {...register("startDate")} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:outline-none transition" /></div>
                                <div><label className="block text-sm font-medium text-gray-600 mb-1">End Date</label><input type="date" {...register("endDate")} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:outline-none transition" /></div>
                            </div>
                            {startDate && endDate && <p className="text-purple-600 text-sm mt-2 font-medium">📅 {getDays()} days trip</p>}
                        </div>
                        <motion.button type="button" whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} onClick={generateWithAI} disabled={aiGenerating || !destination || !budget} className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-bold text-lg hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 transition-all shadow-lg flex items-center justify-center gap-2">
                            {aiGenerating ? <><svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>AI is generating...</> : <><FaRobot className="text-xl" /> Generate with AI</>}
                        </motion.button>
                        <div className="relative"><div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div><div className="relative flex justify-center text-sm"><span className="px-4 bg-white text-gray-400">Or fill manually</span></div></div>
                        <div><label className="flex items-center gap-2 text-lg font-bold text-gray-800 mb-2"><FaInfoCircle className="text-blue-500" />Trip Title</label><input {...register("title")} placeholder="e.g., Summer Vacation in Bali" className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:outline-none transition" />{errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}</div>
                        <div><label className="flex items-center gap-2 text-lg font-bold text-gray-800 mb-2"><FaInfoCircle className="text-orange-500" />Short Description</label><input {...register("shortDescription")} placeholder="A quick summary of your trip" className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:outline-none transition" />{errors.shortDescription && <p className="text-red-500 text-xs mt-1">{errors.shortDescription.message}</p>}</div>
                        <div><label className="flex items-center gap-2 text-lg font-bold text-gray-800 mb-2"><FaInfoCircle className="text-teal-500" />Full Itinerary Plan</label><textarea {...register("fullDescription")} rows={10} placeholder="Your day-by-day plan will appear here after AI generation..." className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:outline-none transition resize-none" />{errors.fullDescription && <p className="text-red-500 text-xs mt-1">{errors.fullDescription.message}</p>}</div>
                        <div><label className="flex items-center gap-2 text-lg font-bold text-gray-800 mb-2"><FaImage className="text-pink-500" />Cover Image URL (Optional)</label><input {...register("imageUrl")} placeholder="https://example.com/your-image.jpg" className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:outline-none transition" /></div>
                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} type="submit" disabled={loading} className="flex-1 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-bold text-lg hover:from-emerald-600 hover:to-teal-700 disabled:opacity-50 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2">
                                {loading ? "Creating..." : <><FaPlus /> Create Itinerary</>}
                            </motion.button>
                            <Link href="/itineraries/manage" className="flex-1 py-4 border-2 border-gray-300 text-gray-600 rounded-xl font-bold text-lg hover:bg-gray-50 transition-all text-center">Cancel</Link>
                        </div>
                    </form>
                </motion.div>
            </div>

            {/* Success Modal */}
            <AnimatePresence>
                {showSuccessModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                            onClick={() => setShowSuccessModal(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center z-10"
                        >
                            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <FaCheckCircle className="text-5xl text-emerald-500" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">Itinerary Created!</h2>
                            <p className="text-gray-500 mb-8">Your trip plan has been saved successfully.</p>

                            <div className="space-y-3">
                                <Link
                                    href="/itineraries/manage"
                                    className="w-full py-3.5 bg-emerald-500 text-white rounded-2xl font-bold text-lg hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2 shadow-md"
                                >
                                    <FaList /> Manage Itineraries
                                </Link>
                                <button
                                    onClick={() => { setShowSuccessModal(false); }}
                                    className="w-full py-3.5 bg-amber-400 text-white rounded-2xl font-bold text-lg hover:bg-amber-500 transition-colors flex items-center justify-center gap-2 shadow-md"
                                >
                                    <FaPlus /> Add More
                                </button>
                                <Link
                                    href="/"
                                    className="w-full py-3.5 border-2 border-gray-300 text-gray-600 rounded-2xl font-bold text-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                                >
                                    <FaHome /> Back to Home
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}