"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Toaster from "@/components/ui/Toaster";

// Create QueryClient with optimized settings to reduce unnecessary API calls
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // Data is considered fresh for 5 minutes
      gcTime: 10 * 60 * 1000, // Cache persists for 10 minutes (formerly cacheTime)
      refetchOnWindowFocus: false, // Don't refetch on window focus
      refetchOnMount: false, // Don't refetch on component mount if data exists
      refetchOnReconnect: false, // Don't refetch on reconnect
      retry: (failureCount, error: any) => {
        // Don't retry on authentication errors
        if (error?.response?.status === 401 || error?.response?.status === 403) {
          return false;
        }
        // Don't retry on network errors (server not available)
        if (!error?.response) {
          return false;
        }
        // Retry once for other errors
        return failureCount < 1;
      },
      retryDelay: 1000,
    },
  },
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster />
    </QueryClientProvider>
  );
}