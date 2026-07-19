"use client";
import { motion } from "framer-motion";

export default function Button({
    children,
    variant = "primary",
    className = "",
    type = "button",
    loading = false,
    disabled = false,
    onClick,
}: {
    children: React.ReactNode;
    variant?: "primary" | "secondary" | "outline";
    className?: string;
    type?: "button" | "submit";
    loading?: boolean;
    disabled?: boolean;
    onClick?: () => void;
}) {
    const base =
        "px-6 py-2.5 rounded-xl font-semibold text-sm transition-all disabled:opacity-50";
    const variants = {
        primary: "bg-primary text-white hover:bg-primary-dark",
        secondary: "bg-secondary text-white hover:bg-secondary-dark",
        outline: "border-2 border-primary text-primary hover:bg-primary hover:text-white",
    };

    return (
        <motion.button
            whileTap={{ scale: 0.97 }}
            type={type}
            disabled={disabled || loading}
            onClick={onClick}
            className={`${base} ${variants[variant]} ${className}`}
        >
            {loading ? "Loading..." : children}
        </motion.button>
    );
}