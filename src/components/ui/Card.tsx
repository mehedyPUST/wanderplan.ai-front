"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface CardProps {
    children: ReactNode;
    className?: string;
    delay?: number; // for staggered animations
}

export default function Card({ children, className = "", delay = 0 }: CardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay }}
            whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)" }}
            className={`bg-white rounded-2xl shadow-lg overflow-hidden ${className}`}
        >
            {children}
        </motion.div>
    );
}