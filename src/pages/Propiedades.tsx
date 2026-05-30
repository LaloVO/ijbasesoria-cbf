import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useProperties } from '@/hooks/useProperties';
import { CBFProperty, formatPrice } from '@/lib/cbf';
import { 
  BookOpen, 
  Clock, 
  MapPin, 
  Bed, 
  Bath, 
  Square, 
  ArrowRight, 
  MessageSquare, 
  ShieldCheck, 
  ChevronRight,
  TrendingUp,
  Search,
  X
} from 'lucide-react';

interface AuthorComment {
  name: string;
  avatar: string;
  role: string;
  text: string;
}

interface Article {
  type: 'article';
  id: string;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  readTime: string;
  date: string;
  author: {
    name: string;
    avatar: string;
    role: string;
  };
  content: string;
}

const authorComments: AuthorComment[] = [
  {
    name: 'Javier Jiménez',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=200&auto=format&fit=crop',
    role: 'Director de Ventas IJB',
    text: 'Esta propiedad destaca por sus acabados de alta gama y su excelente iluminación natural. El retorno de inversión proyectado en rentas es del 7.2% anual, superando el promedio de la zona.'
  },
  {
    name: 'Eduardo Valenzuela',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop',
    role: 'Director Legal IJB',
    text: 'He verificado la documentación de este predio personalmente. Cuenta con uso de suelo HM/10/20/Z (Hasta 10 niveles) totalmente en regla. Una joya para desarrolladores e inversionistas.'
  },
  {
    name: 'Sofía Castro',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop',
    role: 'Asesora Senior de Arrendamientos',
    text: 'Ideal para quienes buscan rentar con total seguridad. Esta propiedad califica al 100% para nuestra Póliza Jurídica express, lo que reduce los tiempos de entrega a solo 48 horas.'
  }
];

const blogArticles: Article[] = [
  {
    type: 'article',
    id: 'art-1',
    title: 'Guía Definitiva de la Póliza Jurídica: Cómo blindar tu patrimonio al rentar en la CDMX',
    excerpt: '¿Qué es realmente una póliza jurídica y por qué es indispensable para propietarios e inquilinos hoy en día? Te explicamos paso a paso su funcionamiento y ventajas.',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=800&auto=format&fit=crop',
    category: 'Seguridad Legal',
    readTime: '5 min de lectura',
    date: '28 de Mayo, 2026',
    author: {
      name: 'Eduardo Valenzuela',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop',
      role: 'Director Legal'
    },
    content: 'La póliza jurídica es el contrato de servicios profesionales que blinda tus rentas de principio a fin. En la CDMX, donde los juicios de arrendamiento pueden tardar meses, contar con el respaldo de IJB Asesoría te garantiza no solo la elaboración de un contrato robusto por expertos, sino la cobertura total en caso de impago o desalojo. Realizamos filtros profundos a los postulantes validando su historial penal, buró de crédito e ingresos certificados. Así, rentar se convierte en una transacción 100% digital, transparente y libre de estrés.'
  },
  {
    type: 'article',
    id: 'art-2',
    title: 'Uso de Suelo HM/10/20/Z: Qué significa para los desarrolladores en Benito Juárez',
    excerpt: 'Analizamos las implicaciones y el alto potencial de desarrollo que ofrece el uso de suelo habitacional mixto con hasta 10 niveles y 20% de área libre.',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop',
    category: 'Desarrollo Urbano',
    readTime: '7 min de lectura',
    date: '25 de Mayo, 2026',
    author: {
      name: 'Javier Jiménez',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=200&auto=format&fit=crop',
      role: 'Director de Ventas'
    },
    content: 'El uso de suelo Habitacional Mixto con factibilidad de 10 niveles y 20% de área libre (HM/10/20/Z) es uno de los coeficientes de edificación más buscados en la CDMX. Específicamente en la Alcaldía Benito Juárez, esta clasificación permite el desarrollo de proyectos residenciales de alta densidad combinados con locales comerciales en planta baja. Para los desarrolladores, esto representa una optimización masiva de costos por metro cuadrado de terreno y un margen de rentabilidad de hasta el 25% superior a los lotes estándar.'
  },
  {
    type: 'article',
    id: 'art-3',
    title: 'Cómo el ecosistema PropTech (Pulppo & Tuhabi) reduce el tiempo de renta en la CDMX',
    excerpt: 'La digitalización del perfilamiento legal y la firma digital han revolucionado la velocidad de las transacciones residenciales, reduciendo fricciones.',
    image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=800&auto=format&fit=crop',
    category: 'PropTech',
    readTime: '4 min de lectura',
    date: '20 de Mayo, 2026',
    author: {
      name: 'Sofía Castro',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop',
      role: 'Especialista PropTech'
    },
    content: 'Rentar una propiedad en la CDMX solía demorar en promedio 45 días debido al papeleo, la búsqueda física de fiadores con bien raíz y las validaciones notariales manuales. Hoy, en IJB Asesoría, en alianza con plataformas líderes como pulppo® y tuhabi, hemos reducido ese periodo a menos de 10 días. Implementamos firmas digitales con validez oficial, validación biométrica de prospectos e investigaciones automatizadas en bases judiciales en tiempo real. La tecnología elimina las barreras físicas sin comprometer la seguridad jurídica.'
  }
];

// High quality mock properties if the DB fetches empty
const mockPropertiesFallback: CBFProperty[] = [
  {
    id: 101,
    nombre: 'Condominio Los Laureles - Agrícola Pantitlán',
    precio: 1836000,
    tipo: 'departamento',
    colonia: 'Agrícola Pantitlán',
    direccion: 'Calle 5, Agrícola Pantitlán, CDMX',
    habitaciones: 2,
    banios: 1,
    area: 51,
    id_tipo_accion: 1,
    imagenes_propiedades: [{ id: 1, image_url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=800&auto=format&fit=crop' }]
  },
  {
    id: 102,
    nombre: 'Residencial Terra Verde - Tarango',
    precio: 3100000,
    tipo: 'departamento',
    colonia: 'Tarango',
    direccion: 'Tarango, Álvaro Obregón, CDMX',
    habitaciones: 2,
    banios: 2,
    area: 77,
    id_tipo_accion: 1,
    imagenes_propiedades: [{ id: 2, image_url: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=800&auto=format&fit=crop' }]
  },
  {
    id: 103,
    nombre: 'Predio Comercial en Esquina - Benito Juárez',
    precio: 72074000,
    tipo: 'terreno',
    colonia: 'Benito Juárez',
    direccion: 'Benito Juárez, CDMX',
    habitaciones: 0,
    banios: 0,
    area: 925,
    id_tipo_accion: 1,
    imagenes_propiedades: [{ id: 3, image_url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop' }]
  },
  {
    id: 104,
    nombre: 'Departamento Contemporáneo Premium - Hipódromo Condesa',
    precio: 5450000,
    tipo: 'departamento',
    colonia: 'Hipódromo Condesa',
    direccion: 'Nuevo León, Hipódromo Condesa, CDMX',
    habitaciones: 3,
    banios: 2,
    area: 110,
    id_tipo_accion: 2,
    imagenes_propiedades: [{ id: 4, image_url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=800&auto=format&fit=crop' }]
  }
];

type FeedItem = (CBFProperty & { type: 'property'; authorComment?: AuthorComment }) | (Article & { type: 'article' });

const Propiedades = () => {
  const { properties: apiProperties, isLoading } = useProperties({ limit: 100 });
  const [selectedFilter, setSelectedFilter] = useState<'todo' | 'propiedades' | 'articulos'>('todo');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  // Fallback to mock if API returns nothing
  const properties = useMemo(() => {
    return apiProperties.length > 0 ? apiProperties : mockPropertiesFallback;
  }, [apiProperties]);

  // Construct Editorial Feed
  const feedItems = useMemo(() => {
    const items: FeedItem[] = [];
    
    const enrichedProps = properties.map((prop, idx) => ({
      ...prop,
      type: 'property' as const,
      authorComment: idx < authorComments.length ? authorComments[idx] : undefined
    }));

    let propIndex = 0;
    let artIndex = 0;

    while (propIndex < enrichedProps.length || artIndex < blogArticles.length) {
      // Add up to 2 properties
      for (let k = 0; k < 2; k++) {
        if (propIndex < enrichedProps.length) {
          items.push(enrichedProps[propIndex++]);
        }
      }
      // Add 1 article
      if (artIndex < blogArticles.length) {
        items.push({ ...blogArticles[artIndex++], type: 'article' as const });
      }
    }

    return items;
  }, [properties]);

  // Filters logic
  const filteredFeed = useMemo(() => {
    return feedItems.filter((item) => {
      // Filter tabs
      if (selectedFilter === 'propiedades' && item.type !== 'property') return false;
      if (selectedFilter === 'articulos' && item.type !== 'article') return false;

      // Text search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (item.type === 'property') {
          const nameMatch = item.nombre.toLowerCase().includes(query);
          const colMatch = (item.colonia ?? '').toLowerCase().includes(query);
          const commentMatch = item.authorComment?.text.toLowerCase().includes(query) ?? false;
          return nameMatch || colMatch || commentMatch;
        } else {
          const titleMatch = item.title.toLowerCase().includes(query);
          const excMatch = item.excerpt.toLowerCase().includes(query);
          const authorMatch = item.author.name.toLowerCase().includes(query);
          return titleMatch || excMatch || authorMatch;
        }
      }

      return true;
    });
  }, [feedItems, selectedFilter, searchQuery]);

  return (
    <>
      <Helmet>
        <title>Catálogo Editorial | IJB Asesoría</title>
        <meta
          name="description"
          content="Explora nuestra selección curada de propiedades residenciales e inversiones en CDMX, fusionada con análisis legal, pólizas jurídicas y artículos de valor."
        />
      </Helmet>

      <Navbar />

      <main className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-28 pb-20">
        {/* Dynamic mesh decoration */}
        <div className="absolute top-[-5%] left-[-10%] w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute top-[20%] right-[-10%] w-[350px] h-[350px] bg-accent/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="w-[92%] md:w-[80%] mx-auto space-y-12">
          
          {/* Editorial Header */}
          <div className="text-left max-w-3xl space-y-4">
            <h1 className="font-sans text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white leading-tight">
              Análisis, guías y listados curados en la CDMX.
            </h1>
            <p className="font-sans text-slate-500 dark:text-slate-400 text-sm md:text-base leading-relaxed">
              Descubre inmuebles verificados por nuestro equipo legal y comercial, entrelazados con artículos y análisis exclusivos para inversionistas, arrendatarios y desarrolladores.
            </p>
          </div>

          {/* Filtering Console */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 p-4 rounded-3xl shadow-card flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Filter Tabs */}
            <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-full w-full md:w-auto">
              <button
                onClick={() => setSelectedFilter('todo')}
                className={`flex-1 md:flex-none px-6 py-2.5 text-xs font-sans font-bold uppercase tracking-wider rounded-full transition-all ${
                  selectedFilter === 'todo' ? 'bg-primary text-white shadow-sm' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                Todo
              </button>
              <button
                onClick={() => setSelectedFilter('propiedades')}
                className={`flex-1 md:flex-none px-6 py-2.5 text-xs font-sans font-bold uppercase tracking-wider rounded-full transition-all ${
                  selectedFilter === 'propiedades' ? 'bg-primary text-white shadow-sm' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                Inmuebles
              </button>
              <button
                onClick={() => setSelectedFilter('articulos')}
                className={`flex-1 md:flex-none px-6 py-2.5 text-xs font-sans font-bold uppercase tracking-wider rounded-full transition-all ${
                  selectedFilter === 'articulos' ? 'bg-primary text-white shadow-sm' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                Artículos
              </button>
            </div>

            {/* Keyword Search Input */}
            <div className="relative w-full md:w-72 flex items-center bg-slate-100 dark:bg-slate-800 rounded-full px-4 py-2 border border-transparent focus-within:border-primary/40 focus-within:bg-white dark:focus-within:bg-slate-900 transition-all">
              <Search className="w-4 h-4 text-slate-400 shrink-0 mr-2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por zona, autor..."
                className="bg-transparent w-full outline-none text-slate-950 dark:text-white placeholder-slate-400 font-sans text-xs"
              />
            </div>
          </div>

          {/* Editorial Mixed Catalog Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredFeed.map((item) => {
              if (item.type === 'property') {
                const img = item.imagenes_propiedades?.[0]?.image_url ?? 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=800';
                const actionBadge = item.id_tipo_accion === 2 ? 'Renta' : 'Venta';
                const location = [item.colonia, item.direccion].filter(Boolean).join(' • ');

                return (
                  <div key={item.id} className="group bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 p-4 shadow-card hover:shadow-elegant transition-all duration-300 hover:scale-[1.01] flex flex-col justify-between">
                    <div>
                      {/* Image Block */}
                      <div className="relative aspect-[16/10] overflow-hidden rounded-2xl mb-5">
                        <img 
                          src={img} 
                          alt={item.nombre} 
                          className="w-full h-full object-cover transition-transform duration-[1500ms] group-hover:scale-105" 
                        />
                      </div>

                      {/* Header details */}
                      <div className="px-1 space-y-2">
                        <div className="text-[10px] font-sans font-bold uppercase tracking-widest text-primary">
                          {actionBadge}
                        </div>
                        <div className="flex justify-between items-start gap-4">
                          <h3 className="font-sans text-lg font-extrabold text-slate-900 dark:text-white group-hover:text-primary transition-colors leading-snug line-clamp-2">
                            {item.nombre}
                          </h3>
                          <span className="font-sans font-extrabold text-lg text-primary whitespace-nowrap">
                            {formatPrice(item.precio)}
                          </span>
                        </div>
                        <p className="font-sans text-xs text-slate-500 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                          <span className="truncate">{location || 'CDMX, MX'}</span>
                        </p>
                      </div>

                      {/* Tech Specifications */}
                      <div className="flex gap-4 p-3 bg-slate-50 dark:bg-slate-950 rounded-xl my-4 text-xs text-slate-500 font-sans font-medium">
                        {item.habitaciones > 0 && (
                          <span className="flex items-center gap-1">
                            <Bed className="w-3.5 h-3.5 text-primary" />
                            {item.habitaciones} Rec.
                          </span>
                        )}
                        {item.banios > 0 && (
                          <span className="flex items-center gap-1">
                            <Bath className="w-3.5 h-3.5 text-primary" />
                            {item.banios} Baño{item.banios !== 1 && 's'}
                          </span>
                        )}
                        {item.area > 0 && (
                          <span className="flex items-center gap-1">
                            <Square className="w-3.5 h-3.5 text-primary" />
                            {item.area}m²
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Author Review Speech Bubble (Premium Hybrid Element) */}
                    {item.authorComment && (
                      <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                        <div className="bg-primary/5 dark:bg-primary/10 border border-primary/20 p-4 rounded-2xl relative flex flex-col gap-2.5">
                          <p className="font-sans text-[11px] italic text-slate-600 dark:text-slate-300 leading-relaxed">
                            "{item.authorComment.text}"
                          </p>
                          <div className="flex items-center gap-2">
                            <img 
                              src={item.authorComment.avatar} 
                              alt={item.authorComment.name} 
                              className="w-6 h-6 rounded-full object-cover border border-white/50" 
                            />
                            <div>
                              <span className="font-sans font-extrabold text-[10px] text-slate-800 dark:text-white block leading-none">
                                {item.authorComment.name}
                              </span>
                              <span className="font-sans text-[8px] text-slate-400 block mt-0.5 leading-none">
                                {item.authorComment.role}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              } else {
                // Article Card Rendering
                return (
                  <div key={item.id} className="group bg-gradient-to-br from-secondary via-slate-900 to-secondary text-white rounded-3xl border border-slate-800 p-5 shadow-card hover:shadow-elegant transition-all duration-300 flex flex-col justify-between min-h-[420px]">
                    <div>
                      {/* Category & Read Time header */}
                      <div className="flex justify-between items-center mb-5 text-[10px] font-sans font-bold uppercase tracking-wider">
                        <span className="text-accent text-[9px] uppercase tracking-[0.15em] font-extrabold">
                          {item.category}
                        </span>
                        <span className="text-slate-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {item.readTime}
                        </span>
                      </div>

                      {/* Title & Excerpt */}
                      <div className="space-y-3">
                        <h3 className="font-sans text-xl font-extrabold group-hover:text-accent transition-colors leading-snug">
                          {item.title}
                        </h3>
                        <p className="font-sans text-xs text-slate-300 leading-relaxed">
                          {item.excerpt}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4 mt-6 pt-4 border-t border-slate-800">
                      {/* Author Info */}
                      <div className="flex items-center gap-2.5">
                        <img 
                          src={item.author.avatar} 
                          alt={item.author.name} 
                          className="w-8 h-8 rounded-full object-cover border border-slate-700" 
                        />
                        <div className="text-left">
                          <span className="font-sans font-extrabold text-xs block leading-none">
                            {item.author.name}
                          </span>
                          <span className="font-sans text-[9px] text-slate-400 block mt-1 leading-none">
                            {item.author.role} • {item.date}
                          </span>
                        </div>
                      </div>

                      {/* Read CTA Trigger Modal */}
                      <button
                        onClick={() => setSelectedArticle(item)}
                        className="w-full py-2.5 bg-white/10 hover:bg-accent text-white font-sans text-[11px] uppercase tracking-wider font-extrabold rounded-xl transition-all flex items-center justify-center gap-1.5 border border-white/10 group-hover:border-accent"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>Leer Artículo Completo</span>
                      </button>
                    </div>
                  </div>
                );
              }
            })}
          </div>

          {/* Empty Search State */}
          {!isLoading && filteredFeed.length === 0 && (
            <div className="text-center py-20 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-3xl shadow-card max-w-lg mx-auto">
              <p className="font-sans font-extrabold text-lg text-slate-800 dark:text-white">
                Sin resultados editoriales
              </p>
              <p className="font-sans text-xs text-slate-400 mt-2 max-w-xs mx-auto">
                No encontramos propiedades o artículos que coincidan con "{searchQuery}". Intenta ajustar la búsqueda.
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />

      {/* Editorial Article Modal Drawer (Premium Reader view) */}
      {selectedArticle && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 max-w-2xl w-full rounded-3xl overflow-hidden shadow-elegant animate-fade-in relative flex flex-col max-h-[85vh]">
            
            {/* Header image banner */}
            <div className="relative h-48 sm:h-56 shrink-0">
              <img 
                src={selectedArticle.image} 
                alt={selectedArticle.title} 
                className="w-full h-full object-cover" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
              <button 
                onClick={() => setSelectedArticle(null)}
                className="absolute top-4 right-4 p-2 bg-black/40 hover:bg-black/60 rounded-full text-white backdrop-blur-sm transition-colors border border-white/10"
              >
                <X className="w-4 h-4" />
              </button>
              
              {/* Category chip */}
              <span className="absolute bottom-4 left-6 text-white text-[10px] uppercase tracking-[0.15em] font-extrabold">
                {selectedArticle.category}
              </span>
            </div>

            {/* Article Content Area */}
            <div className="p-6 md:p-8 overflow-y-auto space-y-6 text-left">
              <h2 className="font-sans text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight">
                {selectedArticle.title}
              </h2>

              {/* Author Banner */}
              <div className="flex items-center gap-3 py-3 border-y border-slate-100 dark:border-slate-800">
                <img 
                  src={selectedArticle.author.avatar} 
                  alt={selectedArticle.author.name} 
                  className="w-9 h-9 rounded-full object-cover" 
                />
                <div>
                  <span className="font-sans font-extrabold text-sm text-slate-800 dark:text-white block leading-none">
                    {selectedArticle.author.name}
                  </span>
                  <span className="font-sans text-[10px] text-slate-400 block mt-1 leading-none">
                    {selectedArticle.author.role} • {selectedArticle.date} • {selectedArticle.readTime}
                  </span>
                </div>
              </div>

              {/* Body Content */}
              <p className="font-sans text-slate-600 dark:text-slate-300 text-sm md:text-base leading-relaxed font-normal first-letter:text-4xl first-letter:font-extrabold first-letter:text-primary first-letter:mr-1 first-letter:float-left">
                {selectedArticle.content}
              </p>
              
              <p className="font-sans text-slate-500 dark:text-slate-400 text-xs sm:text-sm leading-relaxed">
                Este análisis forma parte de las guías de capacitación del equipo de **IJB Asesoría** en alianza con la infraestructura legal de *tuhabi* y *pulppo®* para democratizar las transacciones libres de fricción. Si deseas recibir asesoría personalizada sobre este tema, puedes ponerte en contacto con el autor haciendo clic abajo.
              </p>
            </div>

            {/* Drawer Footer Call To Action */}
            <div className="p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 shrink-0 flex justify-end gap-3">
              <button 
                onClick={() => setSelectedArticle(null)}
                className="px-5 py-2.5 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-400 text-xs font-sans font-bold uppercase tracking-wider rounded-xl transition-colors"
              >
                Cerrar Reader
              </button>
              <a 
                href={`https://wa.me/525516070024?text=Hola%20IJB%20Asesoria,%20me%20gustaria%20platicar%20con%20el%20autor%20sobre%20su%20articulo%20"${encodeURIComponent(selectedArticle.title)}"`}
                target="_blank"
                rel="noreferrer"
                className="px-6 py-2.5 bg-primary hover:bg-primary/90 text-white text-xs font-sans font-bold uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center gap-1.5"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Contactar Autor</span>
              </a>
            </div>

          </div>
        </div>
      )}
    </>
  );
};

export default Propiedades;
