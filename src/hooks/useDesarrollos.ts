import { usePropertyCatalog } from "./usePropertyCatalog";

export function useDesarrollos() {
  const { developments, isLoading } = usePropertyCatalog();
  return { desarrollos: developments, isLoading };
}
