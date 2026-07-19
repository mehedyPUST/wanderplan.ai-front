"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";

const API_URL = "https://wanderplan-ai-back.vercel.app";

export default function LoginPage() {
    const router = useRouter();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        const form = e.currentTarget;
        const email = (form.elements.namedItem("email") as HTMLInputElement)?.value;
        const password = (form.elements.namedItem("password") as HTMLInputElement)?.value;

        try {
            const response = await fetch(`${API_URL}/api/auth/sign-in/email`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
                credentials: "include",
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.message || "Login failed");
            router.push("/");
            router.refresh();
        } catch (err: any) {
            setError(err.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    const fillDemo = (e: React.MouseEvent) => {
        e.preventDefault();
        const form = document.querySelector("form")!;
        (form.elements.namedItem("email") as HTMLInputElement).value = "demo@wanderplan.ai";
        (form.elements.namedItem("password") as HTMLInputElement).value = "Demo@123";
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl">
                <h1 className="text-3xl font-bold text-center text-emerald-600 mb-6">Welcome Back</h1>
                {error && <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-xl text-sm">{error}</div>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input id="email" name="email" type="email" className="mt-1 w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-emerald-400 focus:outline-none" placeholder="you@example.com" required />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                        <input id="password" name="password" type="password" className="mt-1 w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-emerald-400 focus:outline-none" placeholder="••••••••" required />
                    </div>
                    <button type="submit" disabled={loading} className="w-full py-2.5 bg-emerald-500 text-white rounded-xl font-semibold hover:bg-emerald-600 disabled:opacity-50 transition-colors">
                        {loading ? "Loading..." : "Login"}
                    </button>
                </form>
                <div className="mt-4 text-center">
                    <button onClick={fillDemo} className="text-emerald-600 hover:text-emerald-800 font-semibold text-sm transition-colors">
                        Demo Login (auto‑fill)
                    </button>
                </div>
                <p className="mt-6 text-center text-sm text-gray-500">
                    Don&apos;t have an account?{" "}
                    <Link href="/register" className="text-emerald-600 font-semibold hover:text-emerald-800 transition-colors">
                        Sign up
                    </Link>
                </p>
            </motion.div>
        </div>
    );
}
