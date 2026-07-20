"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosInstance";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

const profileSchema = z.object({
    name: z.string().min(2),
    avatar: z.string().optional(),
    budget: z.number().min(0).optional(),
    interests: z.string().optional(),
    travelStyle: z.string().optional(),
});

const passwordSchema = z.object({
    currentPassword: z.string().min(6),
    newPassword: z.string().min(6),
});

export default function ProfilePage() {
    const queryClient = useQueryClient();
    const [profileMsg, setProfileMsg] = useState("");
    const [passwordMsg, setPasswordMsg] = useState("");

    const { data: user, isLoading } = useQuery({
        queryKey: ["profile"],
        queryFn: () => axiosInstance.get("/user/profile").then(r => r.data),
    });

    const { register, handleSubmit, setValue } = useForm({
        resolver: zodResolver(profileSchema),
        values: user ? {
            name: user.name || "",
            avatar: user.avatar || "",
            budget: user.preferences?.budget || 1000,
            interests: user.preferences?.interests?.join(", ") || "",
            travelStyle: user.preferences?.travelStyle || "",
        } : undefined,
    });

    const { register: regPassword, handleSubmit: handlePasswordSubmit, reset: resetPassword } = useForm({
        resolver: zodResolver(passwordSchema),
    });

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
            setProfileMsg("Profile updated!");
            queryClient.invalidateQueries({ queryKey: ["profile"] });
        },
        onError: (err: any) => setProfileMsg(err.response?.data?.message || "Update failed"),
    });

    const passwordMutation = useMutation({
        mutationFn: (data: any) => axiosInstance.put("/user/password", data),
        onSuccess: () => {
            setPasswordMsg("Password changed!");
            resetPassword();
        },
        onError: (err: any) => setPasswordMsg(err.response?.data?.message || "Failed"),
    });

    if (isLoading) return <div className="p-8 text-center">Loading...</div>;

    return (
        <ProtectedRoute>
            <div className="max-w-2xl mx-auto px-4 py-12">
                <h1 className="text-3xl font-bold text-emerald-600 mb-8">My Profile</h1>

                {/* Profile Form */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-6 rounded-2xl shadow-lg mb-8">
                    <h2 className="text-xl font-semibold mb-4">Edit Info</h2>
                    {profileMsg && <p className="text-sm text-emerald-600 mb-3">{profileMsg}</p>}
                    <form onSubmit={handleSubmit((data) => profileMutation.mutate(data))} className="space-y-4">
                        <input {...register("name")} placeholder="Name" className="w-full px-4 py-2 border rounded-xl" />
                        <input {...register("avatar")} placeholder="Avatar URL" className="w-full px-4 py-2 border rounded-xl" />
                        <input {...register("budget", { valueAsNumber: true })} type="number" placeholder="Budget ($)" className="w-full px-4 py-2 border rounded-xl" />
                        <input {...register("interests")} placeholder="Interests (comma-separated)" className="w-full px-4 py-2 border rounded-xl" />
                        <input {...register("travelStyle")} placeholder="Travel style (e.g., luxury, backpacker)" className="w-full px-4 py-2 border rounded-xl" />
                        <button type="submit" className="w-full py-2 bg-emerald-500 text-white rounded-xl font-semibold hover:bg-emerald-600">
                            {profileMutation.isPending ? "Saving..." : "Update Profile"}
                        </button>
                    </form>
                </motion.div>

                {/* Password Form */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white p-6 rounded-2xl shadow-lg">
                    <h2 className="text-xl font-semibold mb-4">Change Password</h2>
                    {passwordMsg && <p className="text-sm text-emerald-600 mb-3">{passwordMsg}</p>}
                    <form onSubmit={handlePasswordSubmit((data) => passwordMutation.mutate(data))} className="space-y-4">
                        <input type="password" {...regPassword("currentPassword")} placeholder="Current password" className="w-full px-4 py-2 border rounded-xl" />
                        <input type="password" {...regPassword("newPassword")} placeholder="New password" className="w-full px-4 py-2 border rounded-xl" />
                        <button type="submit" className="w-full py-2 bg-amber-400 text-white rounded-xl font-semibold hover:bg-amber-500">
                            {passwordMutation.isPending ? "Changing..." : "Change Password"}
                        </button>
                    </form>
                </motion.div>
            </div>
        </ProtectedRoute>

    );
}