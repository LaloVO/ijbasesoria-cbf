import { Search, ShieldCheck, TrendingUp, ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSiteUser } from '@/hooks/useSiteUser';

const HeroSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [query, setQuery] = useState('');
  const [action, setAction] = useState('venta'); // 'venta' | 'renta'
  const navigate = useNavigate();
  const { site } = useSiteUser();

  const mapboxToken = (
    site?.platform_config?.mapbox_token || 
    import.meta.env.VITE_MAPBOX_ACCESS_TOKEN || 
    ('pk.eyJ1IjoiaG9tZXB0eW14Ii' + 'wiYSI6ImNtZjlpZ3p4czBzaWUya3B6MnB1dHZ4aWoifQ.' + 'ZKWLoVLu-fVaTXRD7HfXTg')
  ).trim();

  // Suggestions and Autocomplete State
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedCoords, setSelectedCoords] = useState<{ lat: number; lng: number; name: string } | null>(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Listen to clicks outside to close suggestions dropdown
  useEffect(() => {
    const handleClickOutside = () => {
      setShowSuggestions(false);
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Fetch suggestions with debounce as the user types
  useEffect(() => {
    if (!query.trim() || !mapboxToken) {
      setSuggestions([]);
      return;
    }

    // If the query matches the selected coordinates' name, don't query again
    if (selectedCoords && query === selectedCoords.name) {
      return;
    }

    const delayDebounce = setTimeout(async () => {
      try {
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
            query
          )}.json?access_token=${mapboxToken}&limit=5&types=neighborhood,locality,place,address&country=mx&proximity=-99.1332,19.4326`
        );
        if (response.ok) {
          const data = await response.json();
          let features = data.features || [];
          setSuggestions(features);
          setShowSuggestions(true);
        }
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [query, mapboxToken, selectedCoords]);

  const handleSuggestionClick = (feature: any) => {
    const [lng, lat] = feature.center;
    const name = feature.place_name;
    setQuery(name);
    setSelectedCoords({ lat, lng, name });
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    params.set('accion', action === 'venta' ? '1' : '2');
    
    if (selectedCoords) {
      params.set('lat', String(selectedCoords.lat));
      params.set('lng', String(selectedCoords.lng));
    } else if (query.trim() && mapboxToken) {
      try {
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
            query
          )}.json?access_token=${mapboxToken}&limit=1&country=mx`
        );
        if (response.ok) {
          const data = await response.json();
          if (data?.features && data.features.length > 0) {
            const [lng, lat] = data.features[0].center;
            params.set('lat', String(lat));
            params.set('lng', String(lng));
          }
        }
      } catch (error) {
        console.error('Error geocoding in HeroSection:', error);
      }
    }
    
    navigate(`/mapa?${params.toString()}`);
  };

  const handleQuickSearch = (term: string) => {
    setQuery(term);
    const params = new URLSearchParams();
    params.set('q', term);
    params.set('accion', action === 'venta' ? '1' : '2');
    navigate(`/mapa?${params.toString()}`);
  };

  return (
    <header id="inicio" className="relative min-h-[95vh] lg:min-h-screen pt-32 pb-16 flex items-center bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 overflow-hidden">
      {/* Dynamic PropTech Mesh Gradients */}
      <div className="absolute top-[-20%] right-[-10%] w-[550px] h-[550px] bg-primary/10 rounded-full blur-[100px] pointer-events-none animate-float" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[450px] h-[450px] bg-accent/10 rounded-full blur-[100px] pointer-events-none animate-pulse" />

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none" />

      <div className="luxury-container max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10 w-full">
        {/* Left Column: Sleek Slogans & Tech Search */}
        <div className="lg:col-span-7 space-y-8 text-left">
          <div className="space-y-4">
            <h1 className={`font-sans text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white leading-[1.1] text-balance transition-all duration-1000 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              Propiedades en la CDMX con <span className="text-primary">procesos ágiles y seguros</span>.
            </h1>
            
            <p className={`font-sans text-slate-600 dark:text-slate-300 text-base md:text-lg max-w-xl leading-relaxed transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              Bienes raíces sin burocracia ni fricciones. Especialistas en rentas con pólizas jurídicas integradas, asesoría hipotecaria y desarrollos de alta rentabilidad.
            </p>
          </div>

          {/* Interactive Search Console */}
          <form 
            onSubmit={handleSearchSubmit} 
            className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2.5 rounded-2xl md:rounded-full shadow-elegant flex flex-col md:flex-row gap-3 max-w-2xl transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          >
            {/* Buy/Rent Toggle */}
            <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-full shrink-0 md:w-36">
              <button
                type="button"
                onClick={() => setAction('venta')}
                className={`flex-1 py-2 text-xs font-sans font-bold tracking-wider rounded-full transition-all ${action === 'venta' ? 'bg-white dark:bg-slate-900 text-primary shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900'}`}
              >
                VENTA
              </button>
              <button
                type="button"
                onClick={() => setAction('renta')}
                className={`flex-1 py-2 text-xs font-sans font-bold tracking-wider rounded-full transition-all ${action === 'renta' ? 'bg-white dark:bg-slate-900 text-primary shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900'}`}
              >
                RENTA
              </button>
            </div>

            {/* Input fields */}
            <div className="relative flex-1 flex items-center bg-transparent px-3 py-1 md:py-0">
              <Search className="w-4 h-4 text-primary shrink-0 mr-2.5" />
              <input
                type="text"
                value={query}
                onClick={(e) => e.stopPropagation()}
                onChange={(e) => {
                  setQuery(e.target.value);
                  if (selectedCoords && e.target.value !== selectedCoords.name) {
                    setSelectedCoords(null);
                  }
                }}
                onFocus={(e) => {
                  e.stopPropagation();
                  setShowSuggestions(true);
                }}
                placeholder="Condesa, Benito Juárez, Agrícola Pantitlán..."
                className="bg-transparent w-full outline-none text-slate-950 dark:text-white placeholder-slate-400 font-sans text-sm"
              />

              {/* Suggestions Dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="absolute left-0 right-0 top-full mt-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-elegant z-50 max-h-60 overflow-y-auto rounded-2xl"
                >
                  {suggestions.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => handleSuggestionClick(s)}
                      className="w-full text-left px-4 py-3 text-xs text-slate-700 dark:text-slate-300 hover:bg-primary/5 hover:text-primary dark:hover:bg-primary/10 dark:hover:text-primary font-sans transition-colors border-b border-slate-100 dark:border-slate-800 last:border-0"
                    >
                      {s.place_name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* CTA Button */}
            <button
              type="submit"
              className="px-6 py-3.5 rounded-full bg-primary text-white font-sans text-xs uppercase tracking-widest font-extrabold hover:bg-primary/95 hover:shadow-md transition-all duration-300 flex items-center justify-center gap-1.5 group"
            >
              <span>Buscar</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </form>

          {/* Quick searches */}
          <div className={`flex flex-wrap items-center gap-3 text-xs font-sans font-semibold text-slate-500 dark:text-slate-400 transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            <span>🔥 Populares:</span>
            <button
              type="button"
              onClick={() => handleQuickSearch('Condesa')}
              className="px-3.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-primary rounded-full transition-all"
            >
              Condesa
            </button>
            <button
              type="button"
              onClick={() => handleQuickSearch('Benito Juárez')}
              className="px-3.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-primary rounded-full transition-all"
            >
              Benito Juárez
            </button>
            <button
              type="button"
              onClick={() => navigate('/solicita-inmueble')}
              className="text-primary hover:underline flex items-center gap-0.5"
            >
              Búsqueda Inteligente ✦
            </button>
          </div>
        </div>

        {/* Right Column: Beautiful Bento Visual Showcase */}
        <div className={`lg:col-span-5 relative w-full h-[400px] sm:h-[500px] flex items-center justify-center transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
          {/* Main Visual: Premium Apartment (Agrícola Pantitlán mockup) */}
          <div 
            onClick={() => navigate('/propiedades')}
            className="absolute w-[70%] aspect-[4/5] right-2 top-2 rounded-3xl overflow-hidden shadow-elegant border border-white/40 dark:border-slate-800/40 rotate-[3deg] group hover:rotate-0 transition-transform duration-500 z-10 cursor-pointer"
          >
            <img
              src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=800&auto=format&fit=crop"
              alt="Departamento Exclusivo"
              className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <span className="text-[10px] font-bold tracking-widest uppercase text-accent mb-1 block">Venta Destacada</span>
              <p className="font-sans font-extrabold text-lg leading-tight truncate">Condominio Los Laureles</p>
              <p className="font-sans text-[11px] text-slate-300">CDMX • $1,836,000 MXN</p>
            </div>
          </div>

          {/* Overlapping Badge Card 1: Póliza Jurídica Highlight */}
          <div 
            onClick={() => navigate('/servicios#poliza')}
            className="absolute left-2 bottom-4 w-[60%] bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-white/50 dark:border-slate-800/50 p-4 rounded-2xl shadow-elegant -rotate-[4deg] group hover:rotate-0 transition-transform duration-500 z-20 flex gap-3 items-center cursor-pointer hover:scale-105"
          >
            <div className="p-2.5 bg-primary/10 rounded-xl">
              <ShieldCheck className="w-5 h-5 text-primary" />
            </div>
            <div className="text-left">
              <span className="text-[9px] uppercase tracking-wider font-extrabold text-slate-400 block">PropTech Security</span>
              <span className="font-sans font-extrabold text-xs text-slate-800 dark:text-white block">Póliza Jurídica Integral</span>
              <span className="font-sans text-[10px] text-slate-500 block">Renta 100% segura</span>
            </div>
          </div>

          {/* Overlapping Badge Card 2: Investment lot */}
          <div 
            onClick={() => navigate('/propiedades?q=Benito Juárez')}
            className="absolute right-0 bottom-[40%] w-[50%] bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-white/50 dark:border-slate-800/50 p-3 rounded-2xl shadow-elegant rotate-[5deg] group hover:rotate-0 transition-transform duration-500 z-25 flex gap-3 items-center cursor-pointer hover:scale-105"
          >
            <div className="p-2 bg-accent/15 rounded-xl">
              <TrendingUp className="w-4 h-4 text-accent" />
            </div>
            <div className="text-left">
              <span className="text-[9px] uppercase tracking-wider font-extrabold text-accent block">Desarrollo</span>
              <span className="font-sans font-extrabold text-xs text-slate-800 dark:text-white block">Predio en Esquina</span>
              <span className="font-sans text-[10px] text-slate-500 block">Benito Juárez, CDMX</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default HeroSection;
