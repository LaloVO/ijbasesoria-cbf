import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchProperties, CBFProperty } from "@/lib/cbf";

export interface DevelopmentSummary extends CBFProperty {
  fromPrice: number | null;
  unitCount: number;
}

/**
 * Central classification of the CBF property model:
 * - Development: is_unit === false
 * - Standalone unit: is_unit === true && parent_id == null (an individual property)
 * - Child unit: is_unit === true && parent_id != null (belongs to a development, never listed on its own)
 */
export function usePropertyCatalog() {
  const { data: developmentsData, isLoading: loadingDev } = useQuery({
    queryKey: ["properties", { is_unit: false, limit: 50 }],
    queryFn: () => fetchProperties({ is_unit: false, limit: 50 }),
    staleTime: 2 * 60 * 1000,
  });
  const { data: unitsData, isLoading: loadingUnits } = useQuery({
    queryKey: ["properties", { is_unit: true, limit: 100 }],
    queryFn: () => fetchProperties({ is_unit: true, limit: 100 }),
    staleTime: 2 * 60 * 1000,
  });

  const developmentsRaw = (developmentsData?.data ?? []) as CBFProperty[];
  const units = (unitsData?.data ?? []) as CBFProperty[];

  const childUnitsByParent = useMemo(() => {
    const map = new Map<number, CBFProperty[]>();
    units.forEach((u) => {
      if (u.parent_id == null) return;
      const key = Number(u.parent_id);
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(u);
    });
    return map;
  }, [units]);

  const standaloneUnits = useMemo(
    () => units.filter((u) => u.parent_id == null),
    [units]
  );

  const developments: DevelopmentSummary[] = useMemo(
    () =>
      developmentsRaw.map((dev) => {
        const children = childUnitsByParent.get(Number(dev.id)) ?? [];
        const prices = children.map((c) => c.precio).filter((p) => p > 0);
        return {
          ...dev,
          fromPrice: prices.length ? Math.min(...prices) : dev.precio > 0 ? dev.precio : null,
          unitCount: children.length,
        };
      }),
    [developmentsRaw, childUnitsByParent]
  );

  return {
    developments,
    standaloneUnits,
    childUnitsByParent,
    isLoading: loadingDev || loadingUnits,
  };
}
