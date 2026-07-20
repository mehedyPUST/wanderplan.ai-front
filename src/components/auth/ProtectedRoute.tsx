"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://wanderplan-ai-back.vercel.app";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [checking, setChecking] = useState(true);

    useEffect(() => {
        fetch(`${API_URL}/api/user/profile`, { credentials: "include" })
            .then((res) => {
                if (!res.ok) throw new Error("Not authenticated");
                return res.json();
            })
            .then(() => setChecking(false))
            .catch(() => {
                router.push(`/login?returnUrl=${encodeURIComponent(pathname)}`);
            });
    }, []);

    if (checking) {
        return (
            <div className="min-h-screen flex items-center justify-center mt-16">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent"></div>
            </div>
        );
    }

    return <>{children}</>;
}