"use client";

import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosInstance";

export function useFeaturedDestinations() {
  return useQuery({
    queryKey: ["featured-destinations"],
    queryFn: () => axiosInstance.get("/featured").then(r => r.data),
    staleTime: 60 * 60 * 1000, // 1 hour
  });
}