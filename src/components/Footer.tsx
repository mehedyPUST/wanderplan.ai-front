import Link from "next/link";
import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";

export default function Footer() {
    return (
        <footer className="bg-emerald-600 text-white py-8">
            <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                    <h3 className="text-xl font-bold mb-3">WanderPlan AI</h3>
                    <p className="text-sm text-gray-200">AI-powered travel planning and destination discovery.</p>
                </div>
                <div>
                    <h4 className="font-semibold mb-3">Quick Links</h4>
                    <ul className="space-y-1 text-sm text-gray-200">
                        <li><Link href="/about">About Us</Link></li>
                        <li><Link href="/blog">Blog</Link></li>
                        <li><Link href="/explore">Explore</Link></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-semibold mb-3">Follow Us</h4>
                    <div className="flex space-x-3 text-xl">
                        <a href="#" className="hover:text-amber-300"><FaFacebook /></a>
                        <a href="#" className="hover:text-amber-300"><FaTwitter /></a>
                        <a href="#" className="hover:text-amber-300"><FaInstagram /></a>
                    </div>
                </div>
            </div>
            <div className="text-center text-sm text-gray-300 mt-6">
                &copy; {new Date().getFullYear()} WanderPlan AI. All rights reserved.
            </div>
        </footer>
    );
}