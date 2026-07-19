"use client";

import { motion } from "framer-motion";
import Link from "next/link";

interface Destination {
    _id: string;
    name: string;
    slug: string;
    images: string[];
    shortDescription: string;
    priceRange: { min: number; max: number };
    rating: number;
}

export default function DestinationCard({ destination, index }: { destination: Destination; index: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-2xl shadow-lg overflow-hidden"
        >
            <img
                src={destination.images[0] || "https://via.placeholder.com/400"}
                alt={destination.name}
                className="h-48 w-full object-cover"
            />
            <div className="p-4">
                <h3 className="text-lg font-bold text-primary-dark">{destination.name}</h3>
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">{destination.shortDescription}</p>
                <div className="flex justify-between items-center mt-3 text-sm">
                    <span className="text-secondary-dark font-semibold">
                        ${destination.priceRange.min} - ${destination.priceRange.max}
                    </span>
                    <span className="text-yellow-500">⭐ {destination.rating}</span>
                </div>
                <Link
                    href={`/destinations/${destination.slug}`}
                    className="mt-3 block text-center bg-primary text-white py-1.5 rounded-lg text-sm hover:bg-primary-dark transition"
                >
                    View Details
                </Link>
            </div>
        </motion.div>
    );
}