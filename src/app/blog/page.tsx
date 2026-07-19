const posts = [
    { title: "Top 10 Beaches in 2026", excerpt: "Discover the most stunning beaches recommended by our AI.", date: "July 15, 2026" },
    { title: "How AI is Changing Travel", excerpt: "Agentic AI creates personalized itineraries in seconds.", date: "July 10, 2026" },
    { title: "Mountain Escapes for Summer", excerpt: "Beat the heat with these cool mountain destinations.", date: "July 5, 2026" },
];

export default function BlogPage() {
    return (
        <div className="max-w-4xl mx-auto px-4 py-16 mt-16">
            <h1 className="text-4xl font-bold text-emerald-600 text-center mb-12">Travel Blog</h1>
            <div className="space-y-8">
                {posts.map((post) => (
                    <div key={post.title} className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                        <p className="text-sm text-gray-400 mb-2">{post.date}</p>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">{post.title}</h2>
                        <p className="text-gray-500">{post.excerpt}</p>
                        <button className="mt-3 text-emerald-600 font-semibold hover:underline">Read More →</button>
                    </div>
                ))}
            </div>
        </div>
    );
}