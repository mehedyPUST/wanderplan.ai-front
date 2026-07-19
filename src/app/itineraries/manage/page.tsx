"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosInstance";
import Link from "next/link";

export default function ManageItinerariesPage() {
    const queryClient = useQueryClient();

    const { data, isLoading } = useQuery({
        queryKey: ["my-itineraries"],
        queryFn: () => axiosInstance.get("/itineraries/user").then(r => r.data),
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => axiosInstance.delete(`/itineraries/${id}`),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["my-itineraries"] }),
    });

    if (isLoading) return <div className="p-8 text-center mt-16">Loading...</div>;

    return (
        <div className="max-w-5xl mx-auto px-4 py-8 mt-16">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-emerald-600">My Itineraries</h1>
                <Link href="/itineraries/add" className="bg-emerald-500 text-white px-4 py-2 rounded-xl hover:bg-emerald-600">
                    Add New
                </Link>
            </div>

            {data?.length === 0 ? (
                <p className="text-gray-500 text-center py-12">No itineraries yet. Create your first one!</p>
            ) : (
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">Title</th>
                                <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">Destination</th>
                                <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">Budget</th>
                                <th className="text-right px-6 py-3 text-sm font-semibold text-gray-600">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {data?.map((item: any) => (
                                <tr key={item._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium">{item.title}</td>
                                    <td className="px-6 py-4 text-gray-500">{item.destination}</td>
                                    <td className="px-6 py-4">${item.budget}</td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => deleteMutation.mutate(item._id)}
                                            className="text-red-500 hover:text-red-700 font-semibold text-sm"
                                            disabled={deleteMutation.isPending}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}