"use client";
import { useQuery } from "@tanstack/react-query";
import { AuthService } from "@/services/auth.service";

type UseAuthOptions = {
  enabled?: boolean;
};

export function useAuth(options: UseAuthOptions = {}) {
  const { enabled = true } = options;

  const { data, isLoading, error } = useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      try {
        return await AuthService.me();
      } catch (err: any) {
        // Silently handle expected auth failures
        // Only log unexpected errors
        if (err.response?.status !== 401 && err.response?.status !== 403 && err.code !== 'ERR_NETWORK') {
          console.error("[useAuth] Unexpected error:", err.message);
        }
        throw err;
      }
    },
    retry: false, // Don't retry at all to prevent multiple failed requests
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    refetchOnWindowFocus: false, // Don't refetch on window focus
    refetchOnMount: false, // Don't refetch on mount if we have data
    refetchOnReconnect: false, // Don't refetch on reconnect
    enabled,
  });

  // The API response structure is { data: { ...user fields } }
  const userData = data?.data;

  return {
    user: userData,
    isLoading,
    error,
    isAuthenticated: !!data,
  };
}