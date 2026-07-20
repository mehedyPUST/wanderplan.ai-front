"use client";

import { Suspense, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function CallbackContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const called = useRef(false);

    useEffect(() => {
        if (called.current) return;
        called.current = true;

        const token = searchParams.get("token");

        if (token) {
            // Cookie already set by backend, just redirect to home
            window.location.href = "/";
        } else {
            router.push("/login?error=google");
        }
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent"></div>
            <p className="ml-4 text-gray-500">Completing sign in...</p>
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