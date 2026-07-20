"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosInstance";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { FaUser, FaDollarSign, FaHeart, FaLock, FaSave, FaChartBar } from "react-icons/fa";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function ProfilePage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();

    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center mt-16">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent"></div>
            </div>
        );
    }

    if (!user) {
        router.push("/login");
        return null;
    }

    return <ProfileContent user={user} />;
}

function ProfileContent({ user }: any) {
    const queryClient = useQueryClient();
    const [profileMsg, setProfileMsg] = useState("");
    const [passwordMsg, setPasswordMsg] = useState("");

    // Fetch expense data
    const { data: expenseData } = useQuery({
        queryKey: ["user-expenses"],
        queryFn: () => axiosInstance.get("/itineraries/expenses").then(r => r.data),
    });

    const { register: regProfile, handleSubmit: handleProfileSubmit } = useForm({
        values: {
            name: user?.name || "",
            avatar: user?.avatar || "",
            budget: user?.preferences?.budget || 1000,
            interests: user?.preferences?.interests?.join(", ") || "",
            travelStyle: user?.preferences?.travelStyle || "",
        },
    });

    const { register: regPassword, handleSubmit: handlePasswordSubmit, reset: resetPassword } = useForm();

    const profileMutation = useMutation({
        mutationFn: (data: any) => axiosInstance.put("/user/profile", {
            name: data.name,
            avatar: data.avatar,
            preferences: {
                budget: Number(data.budget),
                interests: data.interests.split(",").map((s: string) => s.trim()).filter(Boolean),
                travelStyle: data.travelStyle,
            },
        }),
        onSuccess: () => {
            setProfileMsg("Profile updated successfully! ✅");
            queryClient.invalidateQueries({ queryKey: ["profile"] });
            setTimeout(() => setProfileMsg(""), 3000);
        },
        onError: (err: any) => setProfileMsg(err.response?.data?.message || "Update failed"),
    });

    const passwordMutation = useMutation({
        mutationFn: (data: any) => axiosInstance.put("/user/password", data),
        onSuccess: () => {
            setPasswordMsg("Password changed successfully! ✅");
            resetPassword();
            setTimeout(() => setPasswordMsg(""), 3000);
        },
        onError: (err: any) => setPasswordMsg(err.response?.data?.message || "Failed"),
    });

    // Format expense data for chart
    const chartData = expenseData?.map((item: any) => ({
        month: item._id,
        expenses: item.total,
    })) || [];

    const totalExpenses = chartData.reduce((sum: number, item: any) => sum + item.expenses, 0);

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            {/* Hero */}
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
                <div className="max-w-4xl mx-auto px-4 py-12 mt-16">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4">
                        <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center text-3xl font-bold">
                            {user?.name?.charAt(0)?.toUpperCase() || "U"}
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold">{user?.name || "Traveler"}</h1>
                            <p className="text-emerald-100">{user?.email}</p>
                            <p className="text-emerald-200 text-sm mt-1 capitalize">{user?.provider || "Email"} account</p>
                        </div>
                    </motion.div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* Expense Chart */}
                {chartData.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-2xl shadow-lg p-6 mb-8"
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                <FaChartBar className="text-emerald-500" /> Travel Expenses (Last 6 Months)
                            </h2>
                            <p className="text-emerald-600 font-bold text-lg">${totalExpenses.toLocaleString()}</p>
                        </div>
                        {chartData.length > 0 ? (
                            <ResponsiveContainer width="100%" height={250}>
                                <BarChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                    <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} />
                                    <YAxis stroke="#9ca3af" fontSize={12} />
                                    <Tooltip />
                                    <Bar dataKey="expenses" fill="#10B981" radius={[8, 8, 0, 0]} name="Expenses ($)" />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="text-center py-10 text-gray-400">
                                <FaChartBar className="text-4xl mx-auto mb-3" />
                                <p>No travel data yet. Mark itineraries as travelled to see your expense chart!</p>
                            </div>
                        )}
                    </motion.div>
                )}

                {/* Edit Profile */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white p-6 rounded-2xl shadow-lg mb-8"
                >
                    <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <FaUser className="text-emerald-500" /> Edit Profile
                    </h2>
                    {profileMsg && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-4 p-3 bg-emerald-50 text-emerald-700 rounded-xl text-sm font-medium">
                            {profileMsg}
                        </motion.div>
                    )}
                    <form onSubmit={handleProfileSubmit((data) => profileMutation.mutate(data))} className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Name</label>
                            <input {...regProfile("name")} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:outline-none" placeholder="Your name" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Avatar URL</label>
                            <input {...regProfile("avatar")} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:outline-none" placeholder="https://..." />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1"><FaDollarSign className="text-amber-500" /> Budget ($)</label>
                            <input type="number" {...regProfile("budget")} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1"><FaHeart className="text-rose-500" /> Interests</label>
                            <input {...regProfile("interests")} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:outline-none" placeholder="beach, culture, food" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Travel Style</label>
                            <input {...regProfile("travelStyle")} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:outline-none" placeholder="Luxury, Backpacker, etc." />
                        </div>
                        <button type="submit" disabled={profileMutation.isPending} className="w-full py-3 bg-emerald-500 text-white rounded-xl font-bold hover:bg-emerald-600 disabled:opacity-50 transition-colors flex items-center justify-center gap-2">
                            <FaSave /> {profileMutation.isPending ? "Saving..." : "Update Profile"}
                        </button>
                    </form>
                </motion.div>

                {/* Change Password */}
                {user?.provider !== 'google' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white p-6 rounded-2xl shadow-lg"
                    >
                        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <FaLock className="text-amber-500" /> Change Password
                        </h2>
                        {passwordMsg && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-4 p-3 bg-emerald-50 text-emerald-700 rounded-xl text-sm font-medium">
                                {passwordMsg}
                            </motion.div>
                        )}
                        <form onSubmit={handlePasswordSubmit((data) => passwordMutation.mutate(data))} className="space-y-4">
                            <input type="password" {...regPassword("currentPassword")} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-400 focus:outline-none" placeholder="Current password" />
                            <input type="password" {...regPassword("newPassword")} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-400 focus:outline-none" placeholder="New password" />
                            <button type="submit" disabled={passwordMutation.isPending} className="w-full py-3 bg-amber-400 text-white rounded-xl font-bold hover:bg-amber-500 disabled:opacity-50 transition-colors">
                                {passwordMutation.isPending ? "Changing..." : "Change Password"}
                            </button>
                        </form>
                    </motion.div>
                )}
            </div>
        </div>
    );
}