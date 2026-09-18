import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchAllProperties, CBFProperty } from "@/lib/cbf";

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
  const { data: developmentsRaw = [], isLoading: loadingDev, error: developmentsError } = useQuery({
    queryKey: ["properties", "all", { is_unit: false }],
    queryFn: () => fetchAllProperties({ is_unit: false }),
    staleTime: 2 * 60 * 1000,
  });
  const { data: units = [], isLoading: loadingUnits, error: unitsError } = useQuery({
    queryKey: ["properties", "all", { is_unit: true }],
    queryFn: () => fetchAllProperties({ is_unit: true }),
    staleTime: 2 * 60 * 1000,
  });

  const childUnitsByParent = useMemo(() => {
    const map = new Map<string | number, CBFProperty[]>();
    units.forEach((u) => {
      if (u.parent_id == null) return;
      const stringKey = String(u.parent_id);
      const numericKey = Number(u.parent_id);
      if (!map.has(stringKey)) map.set(stringKey, []);
      map.get(stringKey)!.push(u);
      if (!Number.isNaN(numericKey)) map.set(numericKey, map.get(stringKey)!);
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
        const children = childUnitsByParent.get(String(dev.id)) ?? childUnitsByParent.get(Number(dev.id)) ?? [];
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
    allUnits: units,
    isLoading: loadingDev || loadingUnits,
    error: developmentsError ?? unitsError,
  };
}
