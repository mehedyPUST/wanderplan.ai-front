"use client";

import { Suspense, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://wanderplan-ai-back.vercel.app";

function CallbackContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const called = useRef(false);

    useEffect(() => {
        if (called.current) return;
        called.current = true;

        const code = searchParams.get("code");
        const returnUrl = searchParams.get("returnUrl") || "/";

        if (code) {
            fetch(`${API_URL}/api/auth/google/callback?code=${code}`, {
                credentials: "include",
            })
                .then(res => res.json())
                .then(() => {
                    window.location.href = returnUrl;
                })
                .catch(() => {
                    router.push("/login?error=google");
                });
        } else {
            router.push("/login?error=google");
        }
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent"></div>
        </div>
    );
}

export default function GoogleCallbackPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent"></div>
            </div>
        }>
            <CallbackContent />
        </Suspense>
    );
}