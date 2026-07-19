import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosInstance";

export function useFeaturedDestinations() {
    return useQuery({
        queryKey: ["featuredDestinations"],
        queryFn: async () => {
            const res = await axiosInstance.get("/destinations?limit=4&sortBy=rating&sortOrder=desc");
            return res.data.data;
        },
    });
}