"use client";
import { useEffect, useState } from "react";
import axiosInstance from "@/api/axiosInstance";

interface User {
    id: string;
    email: string;
    name: string;
    avatar?: string;
}

export function useAuth() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axiosInstance
            .get("/user/profile")   // corrected path
            .then((res) => setUser(res.data))
            .catch(() => setUser(null))   // not logged in
            .finally(() => setLoading(false));
    }, []);

    return { user, loading };
}