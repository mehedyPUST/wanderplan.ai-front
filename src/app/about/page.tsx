"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { FaGlobe, FaRobot, FaUsers, FaHeart, FaLightbulb, FaShieldAlt, FaArrowRight, FaCheckCircle } from "react-icons/fa";

const stats = [
    { number: "10,000+", label: "Happy Travelers" },
    { number: "50+", label: "Countries Covered" },
    { number: "98%", label: "Satisfaction Rate" },
    { number: "24/7", label: "AI Support" },
];

const features = [
    {
        icon: <FaRobot className="text-4xl text-emerald-500" />,
        title: "AI-Powered Planning",
        description: "Our advanced AI analyzes thousands of destinations, weather patterns, and traveler preferences to create the perfect itinerary for you."
    },
    {
        icon: <FaGlobe className="text-4xl text-amber-500" />,
        title: "Global Destinations",
        description: "From hidden gems to popular hotspots, we cover destinations across 50+ countries with detailed, up-to-date information."
    },
    {
        icon: <FaHeart className="text-4xl text-rose-500" />,
        title: "Personalized Experience",
        description: "Every recommendation is tailored to your unique preferences — budget, interests, travel style, and past trips."
    },
    {
        icon: <FaShieldAlt className="text-4xl text-blue-500" />,
        title: "Safe & Secure",
        description: "Your data is protected with enterprise-grade security. We never share your personal information with third parties."
    },
    {
        icon: <FaLightbulb className="text-4xl text-purple-500" />,
        title: "Smart Recommendations",
        description: "Our AI learns from your interactions to continuously improve suggestions and find destinations you'll truly love."
    },
    {
        icon: <FaUsers className="text-4xl text-teal-500" />,
        title: "Community Driven",
        description: "Join thousands of travelers sharing reviews, tips, and experiences to help each other discover the world."
    },
];

const team = [
    {
        name: "WanderPlan AI",
        role: "Your Travel Companion",
        description: "We're a team of passionate travelers and AI engineers dedicated to making travel planning effortless and enjoyable.",
        image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=400&fit=crop"
    }
];

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            {/* Hero */}
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
                <div className="max-w-4xl mx-auto px-4 py-20 mt-16 text-center">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <h1 className="text-5xl md:text-6xl font-bold mb-6">About WanderPlan</h1>
                        <p className="text-xl text-emerald-100 max-w-3xl mx-auto leading-relaxed">
                            We're on a mission to make travel planning smarter, faster, and more personalized
                            using the power of Artificial Intelligence.
                        </p>
                    </motion.div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 -mt-8">
                {/* Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16"
                >
                    {stats.map((stat, i) => (
                        <div key={i} className="bg-white rounded-2xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
                            <div className="text-3xl md:text-4xl font-black text-emerald-600">{stat.number}</div>
                            <div className="text-gray-500 text-sm mt-2">{stat.label}</div>
                        </div>
                    ))}
                </motion.div>

                {/* Mission */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl shadow-lg p-8 md:p-12 mb-16 text-center"
                >
                    <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Mission</h2>
                    <p className="text-gray-600 text-lg leading-relaxed max-w-3xl mx-auto">
                        Travel planning shouldn't be stressful. We believe everyone deserves a personalized,
                        well-researched travel experience without spending hours browsing countless websites.
                        Our AI does the heavy lifting — analyzing, comparing, and recommending — so you can
                        focus on what matters: enjoying your journey.
                    </p>
                </motion.div>

                {/* Features */}
                <div className="mb-16">
                    <h2 className="text-3xl font-bold text-gray-800 text-center mb-10">Why Choose WanderPlan?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((feature, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow"
                            >
                                <div className="mb-4">{feature.icon}</div>
                                <h3 className="text-xl font-bold text-gray-800 mb-2">{feature.title}</h3>
                                <p className="text-gray-500 text-sm leading-relaxed">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* How It Works */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-10 md:p-16 text-white text-center mb-16"
                >
                    <h2 className="text-3xl font-bold mb-8">How It Works</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { step: "1", title: "Tell Us Your Preferences", desc: "Budget, interests, travel style, and destination preferences." },
                            { step: "2", title: "AI Does the Magic", desc: "Our AI analyzes and recommends the best matches for you." },
                            { step: "3", title: "Start Your Adventure", desc: "Book with confidence and enjoy your personalized trip!" },
                        ].map((item, i) => (
                            <div key={i} className="text-center">
                                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                                    {item.step}
                                </div>
                                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                                <p className="text-emerald-100 text-sm">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    className="text-center pb-16"
                >
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">Ready to Explore the World?</h2>
                    <p className="text-gray-500 mb-8 max-w-xl mx-auto">
                        Join thousands of happy travelers who use WanderPlan AI to discover their perfect destinations.
                    </p>
                    <div className="flex gap-4 justify-center">
                        <Link
                            href="/explore"
                            className="bg-emerald-500 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-emerald-600 transition-colors shadow-lg flex items-center gap-2"
                        >
                            Explore Destinations <FaArrowRight />
                        </Link>
                        <Link
                            href="/register"
                            className="border-2 border-emerald-500 text-emerald-600 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-emerald-50 transition-colors"
                        >
                            Sign Up Free
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}