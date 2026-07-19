"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosInstance";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import Link from "next/link";
import { FaStar, FaDollarSign, FaCalendarAlt, FaLightbulb, FaMapMarkerAlt, FaHeart, FaGlobe } from "react-icons/fa";

const schema = z.object({
    budget: z.number().min(1, "Budget required"),
    interests: z.string().min(2, "Interests required"),
    travelStyle: z.string().min(2, "Travel style required"),
});

type FormData = z.infer<typeof schema>;

const budgetOptions = [
    { value: 500, label: "Budget ($500)" },
    { value: 1000, label: "Economy ($1,000)" },
    { value: 2000, label: "Comfort ($2,000)" },
    { value: 5000, label: "Premium ($5,000)" },
    { value: 10000, label: "Luxury ($10K+)" },
];

const interestOptions = [
    "Beach", "Mountains", "Culture", "Food", "Adventure",
    "History", "Nightlife", "Shopping", "Nature", "Relaxation",
    "Photography", "Festivals", "Architecture", "Wildlife"
];

const styleOptions = [
    "Luxury Traveler", "Budget Backpacker", "Family Friendly",
    "Romantic Getaway", "Solo Explorer", "Digital Nomad",
    "Adventure Seeker", "Cultural Immersion"
];

const worldCountries = [
    "Australia", "Brazil", "Canada", "China", "Egypt",
    "France", "Germany", "Greece", "Iceland", "India",
    "Indonesia", "Italy", "Japan", "Kenya", "Maldives",
    "Mexico", "Morocco", "Nepal", "New Zealand", "Peru",
    "Portugal", "Singapore", "South Africa", "South Korea",
    "Spain", "Switzerland", "Thailand", "Turkey", "UAE",
    "United Kingdom", "United States", "Vietnam"
];

export default function AiRecommendPage() {
    const [results, setResults] = useState<any[]>([]);
    const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
    const [selectedCountry, setSelectedCountry] = useState("");
    const [selectedCity, setSelectedCity] = useState("");

    const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(schema),
    });

    const toggleInterest = (interest: string) => {
        setSelectedInterests(prev => {
            const newInterests = prev.includes(interest)
                ? prev.filter(i => i !== interest)
                : [...prev, interest];
            setValue("interests", newInterests.join(", "));
            return newInterests;
        });
    };

    const mutation = useMutation({
        mutationFn: (data: FormData) =>
            axiosInstance.post("/ai/recommend", {
                budget: data.budget,
                interests: data.interests.split(",").map((s) => s.trim()).filter(Boolean),
                travelStyle: data.travelStyle,
                country: selectedCountry || undefined,
                city: selectedCity || undefined,
            }).then((r) => r.data),
        onSuccess: (data) => setResults(data),
    });

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            {/* Hero Section */}
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
                <div className="max-w-4xl mx-auto px-4 py-16 mt-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center"
                    >
                        <h1 className="text-5xl font-bold mb-4">Discover Your Perfect Destination</h1>
                        <p className="text-xl text-emerald-100 max-w-2xl mx-auto">
                            Let our AI analyze your preferences and match you with destinations you&apos;ll love
                        </p>
                    </motion.div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 -mt-8">
                {/* Form Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white p-8 rounded-2xl shadow-2xl mb-12 border border-gray-100"
                >
                    <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="space-y-8">
                        {/* Country & City Section */}
                        <div>
                            <label className="flex items-center gap-2 text-lg font-bold text-gray-800 mb-4">
                                <FaGlobe className="text-blue-500" />
                                Where Do You Want to Go?
                            </label>
                            <p className="text-sm text-gray-500 mb-4">Optional — leave empty for worldwide recommendations</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-2">Country</label>
                                    <select
                                        value={selectedCountry}
                                        onChange={(e) => {
                                            setSelectedCountry(e.target.value);
                                            setSelectedCity("");
                                        }}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:outline-none"
                                    >
                                        <option value="">🌍 Any Country</option>
                                        {worldCountries.map((country: string) => (
                                            <option key={country} value={country}>{country}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-2">
                                        City / Destination
                                    </label>
                                    <input
                                        type="text"
                                        value={selectedCity}
                                        onChange={(e) => setSelectedCity(e.target.value)}
                                        placeholder="e.g., Paris, Bali, Tokyo"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:outline-none"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Budget Section */}
                        <div>
                            <label className="flex items-center gap-2 text-lg font-bold text-gray-800 mb-4">
                                <FaDollarSign className="text-emerald-500" />
                                Your Budget
                            </label>
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                                {budgetOptions.map((opt) => (
                                    <motion.button
                                        key={opt.value}
                                        type="button"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => setValue("budget", opt.value)}
                                        className={`p-4 rounded-xl border-2 text-center transition-all ${watch("budget") === opt.value
                                                ? "border-emerald-500 bg-emerald-50 text-emerald-700 font-semibold"
                                                : "border-gray-200 hover:border-gray-300 text-gray-600"
                                            }`}
                                    >
                                        <div className="text-lg font-bold">{opt.label}</div>
                                    </motion.button>
                                ))}
                            </div>
                            <div className="mt-3 flex items-center gap-2">
                                <span className="text-sm text-gray-500">Custom budget:</span>
                                <input
                                    type="number"
                                    {...register("budget", { valueAsNumber: true })}
                                    className="w-32 px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-400"
                                    placeholder="$ Amount"
                                />
                            </div>
                            {errors.budget && <p className="text-red-500 text-xs mt-1">{errors.budget.message}</p>}
                        </div>

                        {/* Interests Section */}
                        <div>
                            <label className="flex items-center gap-2 text-lg font-bold text-gray-800 mb-4">
                                <FaHeart className="text-rose-500" />
                                Your Interests
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {interestOptions.map((interest) => (
                                    <motion.button
                                        key={interest}
                                        type="button"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => toggleInterest(interest)}
                                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedInterests.includes(interest)
                                                ? "bg-emerald-500 text-white shadow-md"
                                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                            }`}
                                    >
                                        {interest}
                                    </motion.button>
                                ))}
                            </div>
                            <input type="hidden" {...register("interests")} />
                            {errors.interests && <p className="text-red-500 text-xs mt-1">{errors.interests.message}</p>}
                        </div>

                        {/* Travel Style Section */}
                        <div>
                            <label className="flex items-center gap-2 text-lg font-bold text-gray-800 mb-4">
                                <FaStar className="text-amber-500" />
                                Travel Style
                            </label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {styleOptions.map((style) => (
                                    <motion.button
                                        key={style}
                                        type="button"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => setValue("travelStyle", style)}
                                        className={`p-4 rounded-xl border-2 text-left transition-all ${watch("travelStyle") === style
                                                ? "border-emerald-500 bg-emerald-50 text-emerald-700 font-semibold"
                                                : "border-gray-200 hover:border-gray-300 text-gray-600"
                                            }`}
                                    >
                                        <div className="text-sm font-medium">{style}</div>
                                    </motion.button>
                                ))}
                            </div>
                            {errors.travelStyle && <p className="text-red-500 text-xs mt-1">{errors.travelStyle.message}</p>}
                        </div>

                        {/* Submit Button */}
                        <motion.button
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            type="submit"
                            disabled={mutation.isPending}
                            className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-bold text-lg hover:from-emerald-600 hover:to-teal-700 disabled:opacity-50 transition-all shadow-lg hover:shadow-xl"
                        >
                            {mutation.isPending ? (
                                <span className="flex items-center justify-center gap-3">
                                    <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                    AI is analyzing your preferences...
                                </span>
                            ) : (
                                "🔍 Discover My Destinations"
                            )}
                        </motion.button>
                    </form>
                </motion.div>

                {/* Loading State */}
                {mutation.isPending && (
                    <div className="text-center py-16">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            className="inline-block rounded-full h-20 w-20 border-4 border-emerald-500 border-t-transparent"
                        />
                        <p className="text-gray-500 mt-6 text-lg">Our AI is finding your perfect destinations...</p>
                    </div>
                )}

                {/* Error State */}
                {mutation.isError && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-red-50 border border-red-200 text-red-700 p-8 rounded-2xl text-center"
                    >
                        <p className="text-xl font-semibold mb-2">Oops! Something went wrong</p>
                        <p className="text-sm">Please try again with different preferences.</p>
                    </motion.div>
                )}

                {/* Results */}
                {results.length > 0 && !mutation.isPending && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                        <div className="text-center mb-10">
                            <h2 className="text-3xl font-bold text-gray-800 mb-2">Your Personalized Matches</h2>
                            <p className="text-gray-500">AI-powered recommendations based on your preferences</p>
                        </div>

                        <div className="space-y-6 mb-12">
                            {results.map((item: any, i: number) => (
                                <motion.div
                                    key={`${item.name}-${i}-${item.matchScore || item.score}`}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.15 }}
                                    className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden group"
                                >
                                    <div className="flex flex-col lg:flex-row">
                                        {/* Score Badge */}
                                        <div className="lg:w-48 bg-gradient-to-br from-emerald-500 to-teal-600 flex lg:flex-col items-center justify-center p-6 gap-2">
                                            <div className="text-5xl font-black text-white">{item.matchScore || item.score}</div>
                                            <div className="text-white/80 text-sm font-medium">/10</div>
                                            <div className="text-white/60 text-xs">Match Score</div>
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 p-6">
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                                                        <FaMapMarkerAlt className="text-emerald-500" />
                                                        {item.name}
                                                    </h3>
                                                    {item.budgetFit && (
                                                        <p className="text-emerald-600 font-medium mt-1 flex items-center gap-1">
                                                            <FaDollarSign className="text-sm" />
                                                            {item.budgetFit}
                                                        </p>
                                                    )}
                                                </div>
                                                <motion.div
                                                    whileHover={{ scale: 1.05 }}
                                                    className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full text-sm font-semibold"
                                                >
                                                    {i === 0 ? "🥇 Best Match" : i === 1 ? "🥈 Great Pick" : i === 2 ? "🥉 Good Choice" : `#${i + 1} Pick`}
                                                </motion.div>
                                            </div>

                                            <div className="bg-gray-50 rounded-xl p-4 mb-4">
                                                <p className="text-gray-700 leading-relaxed">{item.reason}</p>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                                {item.highlights && item.highlights.length > 0 && (
                                                    <div>
                                                        <h4 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                                                            <FaStar className="text-amber-500" />
                                                            Must-See Highlights
                                                        </h4>
                                                        <ul className="space-y-2">
                                                            {item.highlights.map((h: string, j: number) => (
                                                                <li key={j} className="flex items-start gap-2 text-sm text-gray-600">
                                                                    <span className="text-amber-500 mt-0.5">✦</span>
                                                                    {h}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}

                                                <div className="space-y-4">
                                                    {item.bestTime && (
                                                        <div className="bg-blue-50 rounded-xl p-4">
                                                            <p className="text-sm text-blue-800">
                                                                <span className="font-bold flex items-center gap-1">
                                                                    <FaCalendarAlt className="text-blue-500" />
                                                                    Best Time to Visit
                                                                </span>
                                                                <span className="block mt-1">{item.bestTime}</span>
                                                            </p>
                                                        </div>
                                                    )}

                                                    {item.tips && (
                                                        <div className="bg-amber-50 rounded-xl p-4">
                                                            <p className="text-sm text-amber-800">
                                                                <span className="font-bold flex items-center gap-1">
                                                                    <FaLightbulb className="text-amber-500" />
                                                                    Travel Tip
                                                                </span>
                                                                <span className="block mt-1">{item.tips}</span>
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <Link
                                                href={`/destinations/${item.name?.toLowerCase().replace(/[, ]+/g, "-").replace(/-+/g, "-")}`}
                                                className="inline-flex items-center gap-2 bg-emerald-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-emerald-600 transition-colors shadow-md hover:shadow-lg"
                                            >
                                                Explore {item.name}
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                                </svg>
                                            </Link>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Empty State */}
                {!mutation.isPending && !mutation.isError && results.length === 0 && mutation.isSuccess && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16 text-gray-500">
                        <p className="text-xl">No destinations found matching your criteria.</p>
                        <p className="mt-2">Try broadening your preferences!</p>
                    </motion.div>
                )}
            </div>
        </div>
    );
}