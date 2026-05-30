import { useQuery } from "@tanstack/react-query";
import { fetchPosts, CBFPost } from "@/lib/cbf";

export function usePosts(params?: { post_type?: "post" | "blog"; limit?: number }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["posts", params],
    queryFn: () => fetchPosts(params),
    staleTime: 2 * 60 * 1000,
  });

  return {
    posts: (data?.data ?? []) as CBFPost[],
    isLoading,
    error,
  };
}
