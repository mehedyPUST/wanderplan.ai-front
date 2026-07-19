"use client";

import { useFeaturedDestinations } from "@/hooks/useDestinations";
import DestinationCard from "@/components/ui/DestinationCard";
import SkeletonCard from "@/components/ui/SkeletonCard";

export default function FeaturedDestinations() {
    const { data: destinations, isLoading } = useFeaturedDestinations();

    return (
        <section className="py-16 bg-neutral-light">
            <div className="max-w-7xl mx-auto px-4">
                <h2 className="text-3xl font-bold text-center text-primary-dark mb-10">
                    Featured Destinations
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {isLoading
                        ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
                        : destinations?.map((dest: any, i: number) => (
                            <DestinationCard key={dest._id} destination={dest} index={i} />
                        ))}
                </div>
            </div>
        </section>
    );
}