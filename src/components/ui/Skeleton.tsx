export function CardSkeleton() {
    return (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
            <div className="h-48 bg-gray-200" />
            <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-full" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
            </div>
        </div>
    );
}

export function TextSkeleton({ lines = 3 }: { lines?: number }) {
    return (
        <div className="space-y-3 animate-pulse">
            {Array.from({ length: lines }).map((_, i) => (
                <div key={i} className="h-4 bg-gray-200 rounded" />
            ))}
        </div>
    );
}