"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { FaCalendar, FaUser, FaArrowRight, FaTag } from "react-icons/fa";

const blogPosts = [
    {
        id: 1,
        title: "Top 10 AI-Powered Travel Trends in 2026",
        excerpt: "Discover how artificial intelligence is revolutionizing the way we plan, book, and experience travel. From personalized itineraries to real-time language translation.",
        date: "July 15, 2026",
        author: "WanderPlan AI Team",
        category: "Technology",
        image: "https://images.unsplash.com/photo-1488229297570-58520851e868?w=600&h=400&fit=crop",
        slug: "ai-travel-trends-2026",
        readTime: "5 min read"
    },
    {
        id: 2,
        title: "How to Plan a Budget-Friendly European Adventure",
        excerpt: "Explore Europe without breaking the bank. Our AI analyzed thousands of itineraries to find the most cost-effective routes across 15 European countries.",
        date: "July 10, 2026",
        author: "Sarah Johnson",
        category: "Budget Travel",
        image: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=600&h=400&fit=crop",
        slug: "budget-european-adventure",
        readTime: "7 min read"
    },
    {
        id: 3,
        title: "Best Destinations for Digital Nomads in Asia",
        excerpt: "From Bali's coworking spaces to Chiang Mai's coffee culture, discover the top cities for remote workers looking to combine work with wanderlust.",
        date: "July 5, 2026",
        author: "Mike Chen",
        category: "Digital Nomad",
        image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop",
        slug: "digital-nomad-asia",
        readTime: "6 min read"
    },
    {
        id: 4,
        title: "Why Solo Travel is Booming Among Gen Z",
        excerpt: "Generation Z is embracing solo adventures more than any previous generation. Here's why and how to plan your first solo trip safely.",
        date: "June 28, 2026",
        author: "Emma Williams",
        category: "Solo Travel",
        image: "https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?w=600&h=400&fit=crop",
        slug: "gen-z-solo-travel",
        readTime: "4 min read"
    },
    {
        id: 5,
        title: "Sustainable Travel: How to Explore Without Harming the Planet",
        excerpt: "Eco-friendly travel is no longer optional. Learn practical tips for reducing your carbon footprint while still enjoying amazing destinations.",
        date: "June 20, 2026",
        author: "WanderPlan AI Team",
        category: "Sustainability",
        image: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=600&h=400&fit=crop",
        slug: "sustainable-travel-guide",
        readTime: "8 min read"
    },
    {
        id: 6,
        title: "Hidden Gems: 10 Underrated Destinations You Must Visit",
        excerpt: "Skip the tourist crowds. Our AI has identified these lesser-known paradises that offer unforgettable experiences without the queues.",
        date: "June 12, 2026",
        author: "Alex Turner",
        category: "Destinations",
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop",
        slug: "hidden-gems-2026",
        readTime: "6 min read"
    }
];

const categories = ["All", "Technology", "Budget Travel", "Digital Nomad", "Solo Travel", "Sustainability", "Destinations"];

export default function BlogPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            {/* Hero */}
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
                <div className="max-w-4xl mx-auto px-4 py-16 mt-16 text-center">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <h1 className="text-5xl font-bold mb-4">WanderPlan Blog</h1>
                        <p className="text-xl text-emerald-100 max-w-2xl mx-auto">
                            Travel stories, tips, and AI-powered insights to inspire your next adventure
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Categories */}
            <div className="max-w-6xl mx-auto px-4 -mt-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl shadow-lg p-4 mb-12 flex flex-wrap gap-2 justify-center"
                >
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            className="px-4 py-2 rounded-full text-sm font-medium bg-gray-100 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                        >
                            {cat}
                        </button>
                    ))}
                </motion.div>

                {/* Featured Post */}
                <Link href={`/blog/${blogPosts[0].slug}`}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-2xl shadow-lg overflow-hidden mb-12 group cursor-pointer hover:shadow-xl transition-shadow"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2">
                            <img
                                src={blogPosts[0].image}
                                alt={blogPosts[0].title}
                                className="w-full h-64 md:h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="p-8 flex flex-col justify-center">
                                <span className="text-emerald-600 font-semibold text-sm mb-2">
                                    {blogPosts[0].category}
                                </span>
                                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 group-hover:text-emerald-600 transition-colors">
                                    {blogPosts[0].title}
                                </h2>
                                <p className="text-gray-600 mb-6">{blogPosts[0].excerpt}</p>
                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                    <span className="flex items-center gap-1"><FaUser className="text-xs" /> {blogPosts[0].author}</span>
                                    <span className="flex items-center gap-1"><FaCalendar className="text-xs" /> {blogPosts[0].date}</span>
                                    <span>{blogPosts[0].readTime}</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </Link>

                {/* Blog Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                    {blogPosts.slice(1).map((post, i) => (
                        <Link href={`/blog/${post.slug}`} key={post.id}>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-white rounded-2xl shadow-lg overflow-hidden group cursor-pointer hover:shadow-xl transition-all h-full flex flex-col"
                            >
                                <div className="relative overflow-hidden">
                                    <img
                                        src={post.image}
                                        alt={post.title}
                                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-emerald-700 text-xs font-bold px-3 py-1 rounded-full">
                                        {post.category}
                                    </span>
                                </div>
                                <div className="p-6 flex flex-col flex-1">
                                    <h3 className="text-lg font-bold text-gray-800 mb-3 group-hover:text-emerald-600 transition-colors line-clamp-2">
                                        {post.title}
                                    </h3>
                                    <p className="text-gray-500 text-sm mb-4 flex-1 line-clamp-3">{post.excerpt}</p>
                                    <div className="flex items-center justify-between text-xs text-gray-400 pt-4 border-t border-gray-100">
                                        <span className="flex items-center gap-1"><FaUser className="text-xs" /> {post.author}</span>
                                        <span>{post.readTime}</span>
                                    </div>
                                </div>
                            </motion.div>
                        </Link>
                    ))}
                </div>

                {/* Newsletter */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-10 text-center text-white mb-16"
                >
                    <h2 className="text-3xl font-bold mb-4">Stay Inspired</h2>
                    <p className="text-emerald-100 mb-6 max-w-md mx-auto">
                        Get weekly travel tips, destination guides, and AI-powered recommendations straight to your inbox.
                    </p>
                    <div className="flex gap-2 max-w-md mx-auto">
                        <input
                            type="email"
                            placeholder="Your email address"
                            className="flex-1 px-4 py-3 rounded-xl text-gray-800 focus:outline-none"
                        />
                        <button className="bg-amber-400 text-white px-6 py-3 rounded-xl font-bold hover:bg-amber-500 transition-colors">
                            Subscribe
                        </button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}