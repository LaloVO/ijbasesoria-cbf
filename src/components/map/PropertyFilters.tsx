import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Slider } from '@/components/ui/slider';
import { ChevronDown, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Filters {
  priceRange: [number, number];
  types: string[];
  bedrooms: number | null;
}

interface PropertyFiltersProps {
  filters: Filters;
  onFiltersChange: (f: Filters) => void;
  resultCount: number;
}

const PROPERTY_TYPES = [
  { id: 'casa', label: 'Casa' },
  { id: 'departamento', label: 'Departamento' },
  { id: 'penthouse', label: 'Penthouse' },
  { id: 'terreno', label: 'Terreno' },
];

export const DEFAULT_FILTERS: Filters = {
  priceRange: [0, 500_000_000],
  types: [],
  bedrooms: null,
};

const formatPrice = (v: number) => {
  if (v === 0) return '$0';
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(0)}M`;
  return `$${(v / 1_000).toFixed(0)}K`;
};

const chip =
  'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors select-none';

const PropertyFilters = ({ filters, onFiltersChange, resultCount }: PropertyFiltersProps) => {
  const priceActive =
    filters.priceRange[0] !== DEFAULT_FILTERS.priceRange[0] ||
    filters.priceRange[1] !== DEFAULT_FILTERS.priceRange[1];
  const typesActive = filters.types.length > 0;
  const bedsActive = filters.bedrooms !== null;
  const anyActive = priceActive || typesActive || bedsActive;

  const typeLabel = typesActive
    ? filters.types.map((t) => PROPERTY_TYPES.find((x) => x.id === t)?.label).join(', ')
    : 'Tipo';

  return (
    <div className="flex items-center gap-1.5 bg-background/90 backdrop-blur-sm border border-border rounded-full px-2 py-1.5 shadow-lg w-fit max-w-full overflow-x-auto">
      {/* Precio */}
      <Popover>
        <PopoverTrigger asChild>
          <button className={cn(chip, priceActive ? 'bg-foreground text-background' : 'hover:bg-muted')}>
            {priceActive
              ? `${formatPrice(filters.priceRange[0])} – ${formatPrice(filters.priceRange[1])}`
              : 'Precio'}
            <ChevronDown className="w-3.5 h-3.5 shrink-0" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-4" align="start">
          <p className="text-xs uppercase tracking-widest font-medium mb-4">Rango de Precio</p>
          <Slider
            value={[filters.priceRange[0], filters.priceRange[1]]}
            max={500_000_000}
            min={0}
            step={1_000_000}
            onValueChange={(v) =>
              onFiltersChange({ ...filters, priceRange: [v[0], v[1]] as [number, number] })
            }
            className="mb-3"
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{formatPrice(filters.priceRange[0])}</span>
            <span>{formatPrice(filters.priceRange[1])}</span>
          </div>
        </PopoverContent>
      </Popover>

      <div className="w-px h-4 bg-border shrink-0" />

      {/* Tipo */}
      <Popover>
        <PopoverTrigger asChild>
          <button
            className={cn(chip, typesActive ? 'bg-foreground text-background' : 'hover:bg-muted')}
          >
            <span className="truncate max-w-[120px]">{typeLabel}</span>
            <ChevronDown className="w-3.5 h-3.5 shrink-0" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-48 p-3" align="start">
          <p className="text-xs uppercase tracking-widest font-medium mb-3">Tipo de Propiedad</p>
          <div className="space-y-1">
            {PROPERTY_TYPES.map((t) => {
              const active = filters.types.includes(t.id);
              return (
                <button
                  key={t.id}
                  onClick={() => {
                    const newTypes = active
                      ? filters.types.filter((x) => x !== t.id)
                      : [...filters.types, t.id];
                    onFiltersChange({ ...filters, types: newTypes });
                  }}
                  className={cn(
                    'w-full text-left px-3 py-2 rounded-lg text-sm transition-colors',
                    active ? 'bg-foreground text-background' : 'hover:bg-muted'
                  )}
                >
                  {t.label}
                </button>
              );
            })}
          </div>
        </PopoverContent>
      </Popover>

      <div className="w-px h-4 bg-border shrink-0" />

      {/* Recámaras */}
      <Popover>
        <PopoverTrigger asChild>
          <button
            className={cn(chip, bedsActive ? 'bg-foreground text-background' : 'hover:bg-muted')}
          >
            {bedsActive ? `${filters.bedrooms}+ Rec` : 'Recámaras'}
            <ChevronDown className="w-3.5 h-3.5 shrink-0" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-44 p-3" align="start">
          <p className="text-xs uppercase tracking-widest font-medium mb-3">Recámaras mínimas</p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => onFiltersChange({ ...filters, bedrooms: null })}
              className={cn(
                'px-3 py-1.5 rounded-full text-sm border transition-colors',
                filters.bedrooms === null
                  ? 'bg-foreground text-background border-foreground'
                  : 'border-border hover:border-foreground'
              )}
            >
              Todas
            </button>
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                onClick={() => onFiltersChange({ ...filters, bedrooms: n })}
                className={cn(
                  'w-9 h-9 rounded-full text-sm border transition-colors',
                  filters.bedrooms === n
                    ? 'bg-foreground text-background border-foreground'
                    : 'border-border hover:border-foreground'
                )}
              >
                {n}+
              </button>
            ))}
          </div>
        </PopoverContent>
      </Popover>

      {anyActive && (
        <>
          <div className="w-px h-4 bg-border shrink-0" />
          <button
            onClick={() => onFiltersChange(DEFAULT_FILTERS)}
            className="p-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            title="Limpiar filtros"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </>
      )}

      <div className="w-px h-4 bg-border shrink-0" />
      <span className="text-xs text-muted-foreground px-2 whitespace-nowrap">
        {resultCount} {resultCount === 1 ? 'propiedad' : 'propiedades'}
      </span>
    </div>
  );
};

export default PropertyFilters;
