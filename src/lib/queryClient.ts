import { QueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: (failureCount, error: unknown) => {
        // Don't retry on 4xx errors except 408, 429
        const errorResponse = error as { response?: { status?: number } };
        const status = errorResponse?.response?.status;
        if (status && status >= 400 && status < 500) {
          if (status === 408 || status === 429) {
            return failureCount < 2;
          }
          return false;
        }
        // Retry up to 3 times for other errors
        return failureCount < 3;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
    mutations: {
      retry: false,
      onError: (error: unknown) => {
        // Handle mutation errors globally
        const errorResponse = error as {
          response?: { data?: { message?: string } };
          message?: string;
        };
        if (errorResponse?.response?.data?.message) {
          toast.error(errorResponse.response.data.message);
        } else if (errorResponse?.message) {
          toast.error(errorResponse.message);
        } else {
          toast.error("An unexpected error occurred");
        }
      },
    },
  },
});
