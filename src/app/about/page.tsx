import { FaGlobe, FaRobot, FaUsers } from "react-icons/fa";

export default function AboutPage() {
    return (
        <div className="max-w-4xl mx-auto px-4 py-16 mt-16">
            <h1 className="text-4xl font-bold text-emerald-600 text-center mb-8">About WanderPlan AI</h1>
            <p className="text-gray-600 text-center max-w-2xl mx-auto mb-16">
                We combine artificial intelligence with travel expertise to create personalized, unforgettable journeys.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                    { icon: <FaGlobe className="text-4xl text-emerald-500" />, title: "Curated Destinations", desc: "Handpicked locations from around the world." },
                    { icon: <FaRobot className="text-4xl text-amber-500" />, title: "AI-Powered Planning", desc: "Smart algorithms that learn your preferences." },
                    { icon: <FaUsers className="text-4xl text-teal-600" />, title: "Community Driven", desc: "Reviews and tips from real travelers." },
                ].map((item) => (
                    <div key={item.title} className="text-center p-6 bg-white rounded-2xl shadow-lg">
                        <div className="flex justify-center mb-4">{item.icon}</div>
                        <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                        <p className="text-gray-500">{item.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}