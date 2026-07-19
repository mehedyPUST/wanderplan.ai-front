"use client";
import { motion } from "framer-motion";

export default function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
        >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800">{title}</h2>
            {subtitle && <p className="mt-3 text-gray-500 max-w-2xl mx-auto">{subtitle}</p>}
            <div className="mt-4 h-1 w-20 bg-primary mx-auto rounded-full" />
        </motion.div>
    );
}