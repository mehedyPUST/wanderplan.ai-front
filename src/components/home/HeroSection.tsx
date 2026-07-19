"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";

const slides = [
    {
        image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200",
        title: "Discover Your Next Adventure",
        subtitle: "AI-powered travel planning tailored just for you.",
    },
    {
        image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200",
        title: "Explore Hidden Gems",
        subtitle: "From Santorini to Kyoto, we've got you covered.",
    },
    {
        image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1200",
        title: "Plan with Ease",
        subtitle: "Generate detailed itineraries in seconds.",
    },
];

export default function HeroSection() {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <section className="relative h-[70vh] overflow-hidden">
            <AnimatePresence mode="wait">
                <motion.div
                    key={current}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0"
                >
                    <img
                        src={slides[current].image}
                        alt="Hero"
                        className="w-full h-full object-cover"
                    />
                </motion.div>
            </AnimatePresence>
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <div className="text-center text-white px-4">
                    <motion.h1
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="text-4xl md:text-6xl font-bold"
                    >
                        {slides[current].title}
                    </motion.h1>
                    <motion.p
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="mt-4 text-lg md:text-xl"
                    >
                        {slides[current].subtitle}
                    </motion.p>
                    <Link
                        href="/explore"
                        className="mt-6 inline-block bg-secondary hover:bg-secondary-dark text-white font-semibold px-8 py-3 rounded-full transition"
                    >
                        Start Exploring
                    </Link>
                </div>
            </div>
        </section>
    );
}