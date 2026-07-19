"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosInstance";
import SectionHeader from "@/components/ui/SectionHeader";
import Button from "@/components/ui/Button";

// Hero Slider Data
const slides = [
  {
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80",
    title: "Breathtaking Beaches",
    subtitle: "AI‑powered recommendations for your dream vacation",
  },
  {
    image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1200&q=80",
    title: "Majestic Mountains",
    subtitle: "Custom itineraries that fit your soul",
  },
];

// Animated Hero Component
function HeroSection() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCurrent((prev) => (prev + 1) % slides.length), 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative h-[70vh] overflow-hidden">
      <AnimatePresence>
        <motion.img
          key={slides[current].image}
          src={slides[current].image}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 w-full h-full object-cover"
          alt=""
        />
      </AnimatePresence>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/70 via-teal-700/50 to-amber-400/30 z-10" />

      {/* Content */}
      <div className="relative z-20 flex flex-col items-center justify-center h-full text-white text-center px-4">
        <motion.h1
          key={`title-${current}`}
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg"
        >
          {slides[current].title}
        </motion.h1>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-xl md:text-2xl mb-8 max-w-2xl drop-shadow-md"
        >
          {slides[current].subtitle}
        </motion.p>
        <div className="flex gap-4 flex-wrap justify-center">
          <Link href="/explore">
            <Button variant="secondary" className="text-lg px-8 py-3">
              Explore Destinations
            </Button>
          </Link>
          <Link href="/ai-recommend">
            <Button variant="outline" className="border-white text-white hover:bg-white hover:text-emerald-700 text-lg px-8 py-3">
              AI Recommendations
            </Button>
          </Link>
        </div>
        {/* Indicator Dots */}
        <div className="flex gap-2 mt-8">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-3 h-3 rounded-full transition-all ${i === current ? "bg-white scale-125" : "bg-white/50"
                }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// Main Home Page
export default function HomePage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["featured-destinations"],
    queryFn: () => axiosInstance.get("/destinations?limit=4").then((res) => res.data),
    staleTime: 30_000,
  });

  // Log any error to console for debugging
  if (error) console.error("Failed to load destinations:", error);

  return (
    <div>
      <HeroSection />

      {/* Featured Destinations Section */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <SectionHeader title="Popular Destinations" subtitle="Handpicked by our AI for you" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
                <div className="h-52 bg-gray-200" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-full" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            ))
            : data?.data?.map((dest: any, i: number) => (
              <motion.div
                key={dest._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden group"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={dest.images?.[0] || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop"}
                    alt={dest.name}
                    className="h-52 w-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm text-emerald-700 text-xs font-bold px-2 py-1 rounded-full">
                    ★ {dest.rating}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg text-gray-800">{dest.name}</h3>
                  <p className="text-gray-500 text-sm mt-1 line-clamp-2">{dest.shortDescription}</p>
                  <div className="mt-4 flex justify-between items-end">
                    <div>
                      <span className="text-emerald-600 font-bold">${dest.priceRange.min}</span>
                      <span className="text-gray-400 text-sm"> – ${dest.priceRange.max}</span>
                    </div>
                    <Link href={`/destinations/${dest.slug}`}>
                      <Button variant="outline" className="text-xs py-1.5 px-3">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHeader title="How It Works" subtitle="Three simple steps to your perfect trip" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: "1", title: "Tell Us Your Preferences", desc: "Budget, interests, travel style." },
              { step: "2", title: "AI Recommendations", desc: "Our agentic AI selects the best matches." },
              { step: "3", title: "Generate Itinerary", desc: "Get a detailed day‑by‑day plan." },
            ].map((item) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center p-6"
              >
                <div className="w-16 h-16 bg-emerald-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-500">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 bg-emerald-500 text-white">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { number: "20+", label: "Destinations" },
            { number: "98%", label: "Happy Travelers" },
            { number: "24/7", label: "AI Support" },
            { number: "100%", label: "Customizable" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="text-4xl font-bold">{stat.number}</div>
              <div className="text-lg mt-2">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <SectionHeader title="What Travelers Say" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { name: "Alice", text: "WanderPlan AI made our honeymoon unforgettable!" },
            { name: "Bob", text: "The AI itinerary was spot‑on. Saved us hours of planning." },
            { name: "Carol", text: "I never thought a bot could understand my taste so well." },
          ].map((t) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white p-6 rounded-xl shadow-md"
            >
              <p className="text-gray-600 italic mb-4">“{t.text}”</p>
              <p className="font-semibold">— {t.name}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-2xl mx-auto text-center px-4">
          <SectionHeader title="Stay Inspired" subtitle="Get weekly travel tips and AI‑generated ideas" />
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <input
              type="email"
              placeholder="Your email"
              className="px-4 py-3 rounded-xl border border-gray-300 flex-1 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
            <Button>Subscribe</Button>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-emerald-500 to-teal-700 text-white text-center">
        <div className="max-w-4xl mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            Ready to Plan Your Next Trip?
          </motion.h2>
          <Link href="/explore">
            <Button variant="secondary" className="text-lg px-8 py-3">
              Get Started Free
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}