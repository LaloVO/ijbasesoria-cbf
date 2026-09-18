import { useQuery } from "@tanstack/react-query";
import { fetchTaxonomy } from "@/lib/cbf";

export function useTaxonomy() {
  const query = useQuery({
    queryKey: ["cbf-taxonomy"],
    queryFn: fetchTaxonomy,
    staleTime: 60 * 60 * 1000,
    retry: 1,
  });

  return {
    taxonomy: query.data,
    isLoading: query.isLoading,
    error: query.error,
  };
}
