import { useQuery } from "@tanstack/react-query";
import { fetchProperties, CBFProperty } from "@/lib/cbf";

export function useProperties(params?: {
  limit?: number;
  offset?: number;
  tipo?: string;
  id_tipo_accion?: number;
}) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["properties", params],
    queryFn: () => fetchProperties(params),
    staleTime: 2 * 60 * 1000,
  });
  return {
    properties: (data?.data ?? []) as CBFProperty[],
    pagination: data?.pagination,
    isLoading,
    error,
  };
}
