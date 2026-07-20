"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff, LogIn, Sparkles, ArrowRight, Globe } from "lucide-react";

const loginSchema = z.object({
    email: z.string().email("Please enter a valid email"),
    password: z.string().min(1, "Password is required"),
});

type LoginForm = z.infer<typeof loginSchema>;

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://wanderplan-ai-back.vercel.app";

export default function LoginPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent"></div>
            </div>
        }>
            <LoginContent />
        </Suspense>
    );
}

function LoginContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const returnUrl = searchParams.get("returnUrl") || "/";

    const [showPassword, setShowPassword] = useState(false);
    const [serverError, setServerError] = useState("");
    const [loading, setLoading] = useState(false);
    const [isDemoLoading, setIsDemoLoading] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginForm) => {
        setServerError("");
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/api/auth/sign-in/email`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
                credentials: "include",
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.message || "Login failed");
            window.location.replace(returnUrl);
        } catch (err: any) {
            setServerError(err.message || "Login failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleDemoLogin = async () => {
        setIsDemoLoading(true);
        setServerError("");
        try {
            const response = await fetch(`${API_URL}/api/auth/sign-in/email`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: "console@test.com", password: "Test@123" }),
                credentials: "include",
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.message || "Demo login failed");
            window.location.replace(returnUrl);
        } catch (err: any) {
            setServerError(err.message || "Demo login failed.");
        } finally {
            setIsDemoLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 py-10 sm:py-12">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="w-full max-w-5xl bg-white rounded-3xl shadow-xl shadow-emerald-100/50 overflow-hidden grid md:grid-cols-2 border border-emerald-100"
            >
                {/* Left panel */}
                <div className="hidden md:flex bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-700 p-10 flex-col justify-center items-center text-white relative overflow-hidden">
                    <div className="absolute top-10 right-10 w-40 h-40 bg-emerald-400/20 rounded-full blur-3xl" />
                    <div className="absolute bottom-10 left-10 w-48 h-48 bg-teal-400/20 rounded-full blur-3xl" />
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, delay: 0.2 }} className="relative z-10 bg-white/10 backdrop-blur-sm p-5 rounded-3xl mb-8">
                        <Globe className="w-16 h-16 sm:w-20 sm:h-20" />
                    </motion.div>
                    <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} className="text-2xl sm:text-3xl font-extrabold mb-4 tracking-tight">Welcome Back!</motion.h2>
                    <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }} className="text-center text-emerald-100 text-sm sm:text-base leading-relaxed mb-8">Sign in to continue your AI‑powered travel journey.</motion.p>
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.5 }} className="space-y-3">
                        {["Personalized destination recommendations", "AI-generated itineraries", "Track your wishlist"].map((item, i) => (
                            <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.6 + i * 0.1 }} className="flex items-center gap-3 bg-white/10 rounded-xl px-4 py-2.5 backdrop-blur-sm">
                                <div className="w-2 h-2 bg-emerald-300 rounded-full flex-shrink-0" /><span className="text-sm">{item}</span>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>

                {/* Right panel */}
                <div className="p-8 sm:p-10 md:p-12">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="mb-8">
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">Sign In</h1>
                        <p className="text-sm sm:text-base text-gray-500 mt-2">Access your travel plans</p>
                    </motion.div>

                    {serverError && <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-xs sm:text-sm font-medium">{serverError}</motion.div>}

                    <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        <div>
                            <label htmlFor="email" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">Email</label>
                            <div className="relative"><Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" /><input id="email" type="email" {...register("email")} autoComplete="email" className="w-full pl-11 sm:pl-12 pr-4 py-3 sm:py-3.5 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-sm sm:text-base placeholder-gray-400" placeholder="you@example.com" /></div>
                            {errors.email && <p className="mt-1.5 text-xs text-rose-500 font-medium">{errors.email.message}</p>}
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">Password</label>
                            <div className="relative"><Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" /><input id="password" type={showPassword ? "text" : "password"} {...register("password")} autoComplete="current-password" className="w-full pl-11 sm:pl-12 pr-12 py-3 sm:py-3.5 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-sm sm:text-base placeholder-gray-400" placeholder="Your password" />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-emerald-600 transition-colors">{showPassword ? <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5" />}</button></div>
                            {errors.password && <p className="mt-1.5 text-xs text-rose-500 font-medium">{errors.password.message}</p>}
                        </div>
                        <motion.button type="submit" disabled={loading} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-3.5 sm:py-4 rounded-2xl font-bold text-sm sm:text-base hover:from-emerald-700 hover:to-teal-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-md shadow-emerald-200">
                            {loading ? "Signing in..." : <><LogIn className="w-4 h-4 sm:w-5 sm:h-5" /> Sign In</>}
                        </motion.button>
                    </motion.form>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} className="mt-6 space-y-3">
                        <div className="relative"><div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div><div className="relative flex justify-center text-xs sm:text-sm"><span className="bg-white px-4 text-gray-400 font-medium">or continue with</span></div></div>
                        <motion.button onClick={handleDemoLogin} disabled={isDemoLoading} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} className="w-full bg-amber-500 text-white py-3 sm:py-3.5 rounded-2xl font-bold text-sm sm:text-base hover:bg-amber-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm">
                            {isDemoLoading ? "Loading demo..." : <><Sparkles className="w-4 h-4" /> Demo Login</>}
                        </motion.button>
                        <a href={`${API_URL}/api/auth/google/redirect?returnUrl=${encodeURIComponent(returnUrl)}`} className="w-full py-3 border border-gray-300 rounded-2xl flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors text-gray-700 font-medium">
                            <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
                            Continue with Google
                        </a>
                    </motion.div>

                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.5 }} className="mt-8 text-center text-xs sm:text-sm text-gray-500">
                        Don&apos;t have an account?{" "}
                        <Link href={`/register?returnUrl=${encodeURIComponent(returnUrl)}`} className="text-emerald-600 font-bold hover:text-emerald-700 transition-colors">Create one<ArrowRight className="w-3.5 h-3.5 inline ml-1" /></Link>
                    </motion.p>
                </div>
            </motion.div>
        </div>
    );
}