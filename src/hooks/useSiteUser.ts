import { useQuery } from "@tanstack/react-query";
import { fetchSiteUser, CBFUser, CBFSite } from "@/lib/cbf";

export function useSiteUser() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["siteUser"],
    queryFn: fetchSiteUser,
    staleTime: 5 * 60 * 1000,
  });
  return {
    user: data?.user as CBFUser | undefined,
    site: data?.site as CBFSite | undefined,
    isLoading,
    error,
  };
}
