"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosInstance";

export default function DestinationPage() {
    const { slug } = useParams();

    const { data, isLoading } = useQuery({
        queryKey: ["destination", slug],
        queryFn: () => axiosInstance.get(`/destinations/${slug}`).then(r => r.data),
    });

    if (isLoading) return <div className="p-8 text-center">Loading...</div>;
    if (!data) return <div className="p-8 text-center">Not found</div>;

    return (
        <div className="max-w-4xl mx-auto px-4 py-8 mt-16">
            <img src={data.images?.[0] || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=400&fit=crop"} alt={data.name} className="w-full h-64 md:h-96 object-cover rounded-2xl mb-8" />
            <h1 className="text-3xl md:text-4xl font-bold text-emerald-600 mb-4">{data.name}</h1>
            <p className="text-gray-500 mb-2">{data.country}</p>
            <p className="text-amber-500 font-bold text-lg mb-4">★ {data.rating}</p>
            <p className="text-gray-700 mb-6">{data.fullDescription}</p>
            <div className="bg-gray-50 p-4 rounded-xl">
                <p className="font-semibold">Price: ${data.priceRange?.min} - ${data.priceRange?.max}</p>
                <p className="text-sm text-gray-500">Best time: {data.bestTimeToVisit}</p>
            </div>
        </div>
    );
}