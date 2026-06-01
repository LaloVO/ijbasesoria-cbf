import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ChevronDown, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Filters {
  priceRange: [number, number];
  types: string[];
  bedrooms: number | null;
  bathrooms: number | null;
  parking: number | null;
}

interface PropertyFiltersProps {
  filters: Filters;
  onFiltersChange: (f: Filters) => void;
  resultCount: number;
}

const PROPERTY_TYPES = [
  { id: 'casa', label: 'Casa' },
  { id: 'departamento', label: 'Departamento' },
  { id: 'oficina', label: 'Oficina' },
  { id: 'local', label: 'Local' },
  { id: 'bodega', label: 'Bodega' },
  { id: 'industria', label: 'Industria' },
  { id: 'lote', label: 'Lote' },
  { id: 'terreno', label: 'Terreno' },
  { id: 'hotel', label: 'Hotel' },
  { id: 'hospital', label: 'Hospital' },
];

export const DEFAULT_FILTERS: Filters = {
  priceRange: [0, 500_000_000],
  types: [],
  bedrooms: null,
  bathrooms: null,
  parking: null,
};

const formatPrice = (v: number) => {
  if (v === 0) return '$0';
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(0)}M`;
  return `$${(v / 1_000).toFixed(0)}K`;
};

const chip =
  'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors select-none shrink-0';

const PropertyFilters = ({ filters, onFiltersChange, resultCount }: PropertyFiltersProps) => {
  const priceActive =
    filters.priceRange[0] !== DEFAULT_FILTERS.priceRange[0] ||
    filters.priceRange[1] !== DEFAULT_FILTERS.priceRange[1];
  const typesActive = filters.types.length > 0;
  
  const bedsActive = filters.bedrooms !== null;
  const bathsActive = filters.bathrooms !== null;
  const parkingActive = filters.parking !== null;
  
  const moreFiltersActive = bedsActive || bathsActive || parkingActive;
  const anyActive = priceActive || typesActive || moreFiltersActive;

  const typeLabel = typesActive
    ? filters.types.map((t) => PROPERTY_TYPES.find((x) => x.id === t)?.label).join(', ')
    : 'Tipo';

  const activeCount = [bedsActive, bathsActive, parkingActive].filter(Boolean).length;
  const moreFiltersLabel = activeCount > 0 ? `Más Filtros (${activeCount})` : 'Más Filtros';

  return (
    <div className="flex items-center gap-1.5 bg-background/90 backdrop-blur-sm border border-border rounded-full px-2 py-1.5 shadow-lg w-fit max-w-full overflow-x-auto scrollbar-none">
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
        <PopoverContent className="w-72 p-4" align="start">
          <p className="text-xs uppercase tracking-widest font-bold mb-3">Rango de Precio</p>
          <div className="flex items-center gap-2 mb-2">
            <div className="flex-1">
              <label className="text-[9px] text-muted-foreground uppercase block mb-1 font-bold">Mínimo</label>
              <input
                type="number"
                value={filters.priceRange[0] === 0 ? '' : filters.priceRange[0]}
                placeholder="Ej. 1,000,000"
                onChange={(e) => {
                  const minVal = e.target.value === '' ? 0 : Math.max(0, parseInt(e.target.value, 10));
                  onFiltersChange({
                    ...filters,
                    priceRange: [minVal, filters.priceRange[1]],
                  });
                }}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs outline-none focus:border-primary/50 text-slate-950 dark:text-white font-medium"
              />
            </div>
            <span className="text-muted-foreground self-end mb-2">—</span>
            <div className="flex-1">
              <label className="text-[9px] text-muted-foreground uppercase block mb-1 font-bold">Máximo</label>
              <input
                type="number"
                value={filters.priceRange[1] === 500_000_000 ? '' : filters.priceRange[1]}
                placeholder="Ej. 10,000,000"
                onChange={(e) => {
                  const maxVal = e.target.value === '' ? 500_000_000 : Math.max(0, parseInt(e.target.value, 10));
                  onFiltersChange({
                    ...filters,
                    priceRange: [filters.priceRange[0], maxVal],
                  });
                }}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs outline-none focus:border-primary/50 text-slate-950 dark:text-white font-medium"
              />
            </div>
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
        <PopoverContent className="w-56 p-3 max-h-80 overflow-y-auto rounded-2xl shadow-elegant" align="start">
          <p className="text-xs uppercase tracking-widest font-bold mb-3 px-1">Tipo de Propiedad</p>
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
                    'w-full text-left px-3 py-2 rounded-lg text-xs transition-colors font-medium',
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

      {/* Más Filtros (Beds, Baths, Parking) */}
      <Popover>
        <PopoverTrigger asChild>
          <button
            className={cn(chip, moreFiltersActive ? 'bg-foreground text-background' : 'hover:bg-muted')}
          >
            <span className="truncate max-w-[120px]">{moreFiltersLabel}</span>
            <ChevronDown className="w-3.5 h-3.5 shrink-0" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-4 space-y-4 rounded-2xl shadow-elegant" align="start">
          {/* Recámaras */}
          <div>
            <p className="text-xs uppercase tracking-widest font-bold mb-2">Recámaras</p>
            <div className="flex flex-wrap gap-1">
              <button
                onClick={() => onFiltersChange({ ...filters, bedrooms: null })}
                className={cn(
                  'px-2.5 py-1 text-[10px] border transition-colors rounded-full font-bold uppercase tracking-wider',
                  filters.bedrooms === null
                    ? 'bg-foreground text-background border-foreground'
                    : 'border-border hover:border-foreground text-muted-foreground hover:text-foreground bg-transparent'
                )}
              >
                Todas
              </button>
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  onClick={() => onFiltersChange({ ...filters, bedrooms: n })}
                  className={cn(
                    'w-7 h-7 rounded-full text-[10px] border transition-colors font-bold flex items-center justify-center',
                    filters.bedrooms === n
                      ? 'bg-foreground text-background border-foreground'
                      : 'border-border hover:border-foreground text-muted-foreground hover:text-foreground bg-transparent'
                  )}
                >
                  {n}+
                </button>
              ))}
            </div>
          </div>

          {/* Baños */}
          <div className="border-t border-slate-100 dark:border-slate-800 pt-3">
            <p className="text-xs uppercase tracking-widest font-bold mb-2">Baños</p>
            <div className="flex flex-wrap gap-1">
              <button
                onClick={() => onFiltersChange({ ...filters, bathrooms: null })}
                className={cn(
                  'px-2.5 py-1 text-[10px] border transition-colors rounded-full font-bold uppercase tracking-wider',
                  filters.bathrooms === null
                    ? 'bg-foreground text-background border-foreground'
                    : 'border-border hover:border-foreground text-muted-foreground hover:text-foreground bg-transparent'
                )}
              >
                Todos
              </button>
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  onClick={() => onFiltersChange({ ...filters, bathrooms: n })}
                  className={cn(
                    'w-7 h-7 rounded-full text-[10px] border transition-colors font-bold flex items-center justify-center',
                    filters.bathrooms === n
                      ? 'bg-foreground text-background border-foreground'
                      : 'border-border hover:border-foreground text-muted-foreground hover:text-foreground bg-transparent'
                  )}
                >
                  {n}+
                </button>
              ))}
            </div>
          </div>

          {/* Estacionamientos */}
          <div className="border-t border-slate-100 dark:border-slate-800 pt-3">
            <p className="text-xs uppercase tracking-widest font-bold mb-2">Estacionamientos</p>
            <div className="flex flex-wrap gap-1">
              <button
                onClick={() => onFiltersChange({ ...filters, parking: null })}
                className={cn(
                  'px-2.5 py-1 text-[10px] border transition-colors rounded-full font-bold uppercase tracking-wider',
                  filters.parking === null
                    ? 'bg-foreground text-background border-foreground'
                    : 'border-border hover:border-foreground text-muted-foreground hover:text-foreground bg-transparent'
                )}
              >
                Todos
              </button>
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  onClick={() => onFiltersChange({ ...filters, parking: n })}
                  className={cn(
                    'w-7 h-7 rounded-full text-[10px] border transition-colors font-bold flex items-center justify-center',
                    filters.parking === n
                      ? 'bg-foreground text-background border-foreground'
                      : 'border-border hover:border-foreground text-muted-foreground hover:text-foreground bg-transparent'
                  )}
                >
                  {n}+
                </button>
              ))}
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {anyActive && (
        <>
          <div className="w-px h-4 bg-border shrink-0" />
          <button
            onClick={() => onFiltersChange(DEFAULT_FILTERS)}
            className="p-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shrink-0"
            title="Limpiar filtros"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </>
      )}

      <div className="w-px h-4 bg-border shrink-0" />
      <span className="text-xs text-muted-foreground px-2 whitespace-nowrap shrink-0">
        {resultCount} {resultCount === 1 ? 'propiedad' : 'propiedades'}
      </span>
    </div>
  );
};

export default PropertyFilters;
