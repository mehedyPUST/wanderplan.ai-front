"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaArrowLeft, FaCalendar, FaUser, FaClock, FaTag, FaShare, FaHeart, FaFacebook, FaTwitter } from "react-icons/fa";

const blogPosts: Record<string, any> = {
    "ai-travel-trends-2026": {
        title: "Top 10 AI-Powered Travel Trends in 2026",
        date: "July 15, 2026",
        author: "WanderPlan AI Team",
        category: "Technology",
        readTime: "5 min read",
        image: "https://images.unsplash.com/photo-1488229297570-58520851e868?w=1200&h=600&fit=crop",
        content: `
            <p>Artificial intelligence is transforming the travel industry at an unprecedented pace. From personalized recommendations to real-time language translation, AI is making travel smarter, easier, and more enjoyable than ever before.</p>
            
            <h2>1. Hyper-Personalized Travel Planning</h2>
            <p>Gone are the days of generic travel packages. AI now analyzes your preferences, past trips, social media activity, and even your budget to create perfectly tailored travel experiences. WanderPlan's AI engine uses these signals to recommend destinations you'll truly love.</p>
            
            <h2>2. Real-Time Language Translation</h2>
            <p>Language barriers are becoming a thing of the past. AI-powered translation tools now work in real-time, allowing travelers to communicate effortlessly in over 100 languages. This opens up destinations that were previously inaccessible to many travelers.</p>
            
            <h2>3. Smart Pricing Predictions</h2>
            <p>AI algorithms now predict flight and hotel prices with remarkable accuracy. By analyzing historical data, seasonal trends, and global events, these tools tell you exactly when to book for the best price.</p>
            
            <h2>4. AI-Powered Itinerary Generation</h2>
            <p>Creating a day-by-day itinerary used to take hours of research. Now, AI generates detailed plans in seconds, considering factors like opening hours, travel time between locations, and your personal interests.</p>
            
            <h2>5. Virtual Travel Assistants</h2>
            <p>Chatbots and virtual assistants are now sophisticated enough to handle complex travel queries. They can rebook flights, suggest alternatives during disruptions, and even make restaurant reservations on your behalf.</p>
            
            <h2>Conclusion</h2>
            <p>The future of travel is intelligent, personalized, and incredibly exciting. As AI continues to evolve, we can expect even more innovative solutions that make exploring our world easier and more enriching.</p>
        `
    },
    "budget-european-adventure": {
        title: "How to Plan a Budget-Friendly European Adventure",
        date: "July 10, 2026",
        author: "Sarah Johnson",
        category: "Budget Travel",
        readTime: "7 min read",
        image: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=1200&h=600&fit=crop",
        content: `
            <p>Dreaming of a European adventure but worried about the cost? With smart planning and the right strategies, you can explore the continent without emptying your savings account.</p>
            
            <h2>Choose Your Destinations Wisely</h2>
            <p>Eastern Europe offers incredible experiences at a fraction of the cost of Western European hotspots. Cities like Budapest, Prague, and Krakow offer stunning architecture, rich history, and amazing food at budget-friendly prices.</p>
            
            <h2>Travel During Shoulder Season</h2>
            <p>May-June and September-October offer perfect weather with significantly lower prices and fewer crowds than peak summer months.</p>
            
            <h2>Use Budget Airlines</h2>
            <p>Ryanair, EasyJet, and Wizz Air offer flights between European cities for as little as €20. Just pack light to avoid baggage fees!</p>
            
            <h2>Stay in Hostels or Apartments</h2>
            <p>Modern hostels are clean, social, and affordable. For longer stays, Airbnb or Booking.com apartments often work out cheaper than hotels.</p>
            
            <h2>Eat Like a Local</h2>
            <p>Skip touristy restaurants. Visit local markets, bakeries, and street food stalls for authentic cuisine at local prices.</p>
        `
    }
};

const defaultPost = {
    title: "Blog Post",
    date: "2026",
    author: "WanderPlan AI Team",
    category: "Travel",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&h=600&fit=crop",
    content: "<p>Content coming soon...</p>"
};

export default function BlogDetailPage() {
    const { slug } = useParams();
    const post = blogPosts[slug as string] || defaultPost;

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            {/* Hero Image */}
            <div className="relative h-[50vh] overflow-hidden">
                <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16">
                    <div className="max-w-4xl mx-auto">
                        <Link href="/blog" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4 transition-colors">
                            <FaArrowLeft /> Back to Blog
                        </Link>
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                            <span className="bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full mb-4 inline-block">
                                {post.category}
                            </span>
                            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">{post.title}</h1>
                            <div className="flex flex-wrap items-center gap-4 text-white/70 text-sm">
                                <span className="flex items-center gap-1"><FaUser /> {post.author}</span>
                                <span className="flex items-center gap-1"><FaCalendar /> {post.date}</span>
                                <span className="flex items-center gap-1"><FaClock /> {post.readTime}</span>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-4 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-2xl shadow-lg p-8 md:p-12"
                        >
                            <div
                                className="prose prose-lg max-w-none prose-headings:text-gray-800 prose-p:text-gray-600 prose-strong:text-gray-800 prose-a:text-emerald-600"
                                dangerouslySetInnerHTML={{ __html: post.content }}
                            />
                        </motion.div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Author Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white rounded-2xl shadow-lg p-6"
                        >
                            <h3 className="font-bold text-gray-800 mb-4">About Author</h3>
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 font-bold text-lg">
                                    {post.author.charAt(0)}
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-800">{post.author}</p>
                                    <p className="text-sm text-gray-500">Travel Writer</p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Share */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white rounded-2xl shadow-lg p-6"
                        >
                            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><FaShare /> Share</h3>
                            <div className="flex gap-2">
                                <button className="flex-1 py-2 bg-blue-500 text-white rounded-xl text-sm font-medium hover:bg-blue-600 transition-colors flex items-center justify-center gap-1">
                                    <FaFacebook /> Share
                                </button>
                                <button className="flex-1 py-2 bg-sky-400 text-white rounded-xl text-sm font-medium hover:bg-sky-500 transition-colors flex items-center justify-center gap-1">
                                    <FaTwitter /> Tweet
                                </button>
                            </div>
                        </motion.div>

                        {/* Related Posts */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-white rounded-2xl shadow-lg p-6"
                        >
                            <h3 className="font-bold text-gray-800 mb-4">More Articles</h3>
                            <div className="space-y-3">
                                <Link href="/blog/ai-travel-trends-2026" className="block hover:bg-gray-50 p-2 rounded-xl transition-colors">
                                    <p className="font-medium text-gray-800 text-sm">Top 10 AI Travel Trends</p>
                                    <p className="text-xs text-gray-400">July 15, 2026</p>
                                </Link>
                                <Link href="/blog/budget-european-adventure" className="block hover:bg-gray-50 p-2 rounded-xl transition-colors">
                                    <p className="font-medium text-gray-800 text-sm">Budget European Adventure</p>
                                    <p className="text-xs text-gray-400">July 10, 2026</p>
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}