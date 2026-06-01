import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { usePosts } from '@/hooks/usePosts';
import { useProperties } from '@/hooks/useProperties';
import { useSiteUser } from '@/hooks/useSiteUser';
import { CBFProperty, CBFPost, formatPrice } from '@/lib/cbf';
import {
  BookOpen,
  Clock,
  MapPin,
  Bed,
  Bath,
  Square,
  MessageSquare,
  Search,
  X,
  PenLine,
} from 'lucide-react';

// Helpers para limpiar el contenido del post de anotaciones inline del hub
function cleanContent(raw: string): string {
  return raw
    .replace(/📍 \[Location: .*?\]\n?/g, '')
    .replace(/!\[.*?\]\(.*?\)\n?/g, '')
    .trim();
}

function extractImage(raw: string): string | null {
  const m = raw.match(/!\[.*?\]\((.*?)\)/);
  return m ? m[1] : null;
}

function formatPostDate(iso: string): string {
  return new Date(iso).toLocaleDateString('es-MX', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

// AuthorComment: nombre + avatar del asesor real (sin rol)
interface AuthorComment {
  name: string;
  avatar: string;
  text: string;
}

// Article derivado de un CBFPost sin propiedad
interface Article {
  type: 'article';
  id: string;
  title: string;
  excerpt: string;
  image: string | null;
  date: string;
  isLong: boolean; // true = blog con modal; false = post corto inline
  author: { name: string; avatar: string };
  content: string;
}

type FeedItem =
  | (CBFProperty & { type: 'property'; authorComment?: AuthorComment })
  | Article;

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=800';

const Propiedades = () => {
  const { posts, isLoading: postsLoading } = usePosts({ limit: 100 });
  const { properties, isLoading: propsLoading } = useProperties({ limit: 100 });
  const { user } = useSiteUser();

  const [selectedFilter, setSelectedFilter] = useState<'todo' | 'propiedades' | 'articulos'>('todo');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  const authorSignature = useMemo(
    () => ({
      name: user?.nombre_usuario ?? 'Asesor',
      avatar:
        user?.imagen_perfil_usuario ??
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200',
    }),
    [user]
  );

  // Convertir posts del hub en FeedItems
  const feedItems = useMemo<FeedItem[]>(() => {
    const items: FeedItem[] = [];

    const propPosts = posts.filter((p) => p.property != null);
    const articlePosts = posts.filter((p) => p.property == null);

    const enrichedProps: (CBFProperty & { type: 'property'; authorComment?: AuthorComment })[] =
      properties.map((prop) => {
        const matchingPost = propPosts.find((p) => p.property?.id === prop.id);
        return {
          ...prop,
          type: 'property' as const,
          authorComment: matchingPost
            ? {
                ...authorSignature,
                text: cleanContent(matchingPost.content),
              }
            : undefined,
        };
      });

    const articles: Article[] = articlePosts.map((p) => ({
      type: 'article' as const,
      id: p.id,
      title: p.title,
      excerpt: cleanContent(p.content).slice(0, 180) + (p.content.length > 180 ? '…' : ''),
      image: extractImage(p.content),
      date: formatPostDate(p.created_at),
      isLong: p.post_type === 'blog',
      author: authorSignature,
      content: cleanContent(p.content),
    }));

    // Intercalar: 2 propiedades → 1 artículo → repetir
    let pi = 0;
    let ai = 0;
    while (pi < enrichedProps.length || ai < articles.length) {
      for (let k = 0; k < 2; k++) {
        if (pi < enrichedProps.length) items.push(enrichedProps[pi++]);
      }
      if (ai < articles.length) items.push(articles[ai++]);
    }

    return items;
  }, [posts, properties, authorSignature]);

  const filteredFeed = useMemo(() => {
    return feedItems.filter((item) => {
      if (selectedFilter === 'propiedades' && item.type !== 'property') return false;
      if (selectedFilter === 'articulos' && item.type !== 'article') return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        if (item.type === 'property') {
          return (
            item.nombre.toLowerCase().includes(q) ||
            (item.colonia ?? '').toLowerCase().includes(q) ||
            (item.authorComment?.text ?? '').toLowerCase().includes(q)
          );
        } else {
          return (
            item.title.toLowerCase().includes(q) ||
            item.excerpt.toLowerCase().includes(q) ||
            item.author.name.toLowerCase().includes(q)
          );
        }
      }
      return true;
    });
  }, [feedItems, selectedFilter, searchQuery]);

  const isLoading = postsLoading || propsLoading;
  const isEmpty = !isLoading && posts.length === 0 && properties.length === 0;

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
        {/* Decoración de malla */}
        <div className="absolute top-[-5%] left-[-10%] w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute top-[20%] right-[-10%] w-[350px] h-[350px] bg-accent/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="w-[92%] md:w-[80%] mx-auto space-y-12">

          {/* Cabecera editorial */}
          <div className="text-left max-w-3xl space-y-4">
            <h1 className="font-sans text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white leading-tight">
              Análisis, guías y listados curados en la CDMX.
            </h1>
            <p className="font-sans text-slate-500 dark:text-slate-400 text-sm md:text-base leading-relaxed">
              Descubre inmuebles verificados por nuestro equipo legal y comercial, entrelazados con
              artículos y análisis exclusivos para inversionistas, arrendatarios y desarrolladores.
            </p>
          </div>

          {/* Consola de filtrado */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 p-4 rounded-3xl shadow-card flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-full w-full md:w-auto">
              {(['todo', 'propiedades', 'articulos'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setSelectedFilter(f)}
                  className={`flex-1 md:flex-none px-6 py-2.5 text-xs font-sans font-bold uppercase tracking-wider rounded-full transition-all ${
                    selectedFilter === f
                      ? 'bg-primary text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  {f === 'todo' ? 'Todo' : f === 'propiedades' ? 'Inmuebles' : 'Artículos'}
                </button>
              ))}
            </div>

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

          {/* Estado de carga */}
          {isLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 h-72 animate-pulse"
                />
              ))}
            </div>
          )}

          {/* Estado vacío */}
          {isEmpty && (
            <div className="text-center py-24 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-3xl shadow-card max-w-lg mx-auto flex flex-col items-center gap-4">
              <PenLine className="w-10 h-10 text-primary/40" />
              <p className="font-sans font-extrabold text-lg text-slate-800 dark:text-white">
                Aún no hay publicaciones
              </p>
              <p className="font-sans text-xs text-slate-400 max-w-xs leading-relaxed">
                Pronto encontrarás aquí análisis, guías y propiedades seleccionadas por el asesor.
              </p>
              <Link
                to="/mapa"
                className="mt-2 px-6 py-2.5 bg-primary text-white text-xs font-sans font-bold uppercase tracking-wider rounded-full hover:bg-primary/90 transition-colors"
              >
                Ver propiedades en el mapa
              </Link>
            </div>
          )}

          {/* Grid editorial mixto */}
          {!isLoading && !isEmpty && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredFeed.map((item) => {
                if (item.type === 'property') {
                  const img =
                    item.imagenes_propiedades?.[0]?.image_url ?? FALLBACK_IMG;
                  const actionBadge = item.id_tipo_accion === 2 ? 'Renta' : 'Venta';
                  const location = [item.colonia, item.direccion].filter(Boolean).join(' • ');

                  return (
                    <div
                      key={item.id}
                      className="group bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 p-4 shadow-card hover:shadow-elegant transition-all duration-300 hover:scale-[1.01] flex flex-col justify-between"
                    >
                      <div>
                        {/* Imagen */}
                        <div className="relative aspect-[16/10] overflow-hidden rounded-2xl mb-5">
                          <img
                            src={img}
                            alt={item.nombre}
                            className="w-full h-full object-cover transition-transform duration-[1500ms] group-hover:scale-105"
                          />
                        </div>

                        {/* Datos */}
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

                        {/* Especificaciones */}
                        <div className="flex gap-4 p-3 bg-slate-50 dark:bg-slate-950 rounded-xl my-4 text-xs text-slate-500 font-sans font-medium">
                          {(item.habitaciones ?? 0) > 0 && (
                            <span className="flex items-center gap-1">
                              <Bed className="w-3.5 h-3.5 text-primary" />
                              {item.habitaciones} Rec.
                            </span>
                          )}
                          {(item.banios ?? 0) > 0 && (
                            <span className="flex items-center gap-1">
                              <Bath className="w-3.5 h-3.5 text-primary" />
                              {item.banios} Baño{item.banios !== 1 && 's'}
                            </span>
                          )}
                          {(item.area ?? 0) > 0 && (
                            <span className="flex items-center gap-1">
                              <Square className="w-3.5 h-3.5 text-primary" />
                              {item.area}m²
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Burbuja de comentario del autor */}
                      {item.authorComment && item.authorComment.text && (
                        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                          <div className="bg-primary/5 dark:bg-primary/10 border border-primary/20 p-4 rounded-2xl flex flex-col gap-2.5">
                            <p className="font-sans text-[11px] italic text-slate-600 dark:text-slate-300 leading-relaxed">
                              "{item.authorComment.text}"
                            </p>
                            <div className="flex items-center gap-2">
                              <img
                                src={item.authorComment.avatar}
                                alt={item.authorComment.name}
                                className="w-6 h-6 rounded-full object-cover border border-white/50"
                              />
                              <span className="font-sans font-extrabold text-[10px] text-slate-800 dark:text-white leading-none">
                                {item.authorComment.name}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                } else {
                  // Tarjeta de artículo / post
                  return (
                    <div
                      key={item.id}
                      className="group bg-gradient-to-br from-secondary via-slate-900 to-secondary text-white rounded-3xl border border-slate-800 p-5 shadow-card hover:shadow-elegant transition-all duration-300 flex flex-col justify-between min-h-[420px]"
                    >
                      <div>
                        {/* Fecha */}
                        <div className="flex justify-between items-center mb-5 text-[10px] font-sans font-bold uppercase tracking-wider">
                          <span className="text-accent text-[9px] uppercase tracking-[0.15em] font-extrabold">
                            {item.isLong ? 'Blog' : 'Análisis'}
                          </span>
                          <span className="text-slate-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {item.date}
                          </span>
                        </div>

                        {/* Título e extracto */}
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
                        {/* Autor */}
                        <div className="flex items-center gap-2.5">
                          <img
                            src={item.author.avatar}
                            alt={item.author.name}
                            className="w-8 h-8 rounded-full object-cover border border-slate-700"
                          />
                          <span className="font-sans font-extrabold text-xs leading-none">
                            {item.author.name}
                          </span>
                        </div>

                        {/* CTA: solo blogs largos abren el modal */}
                        {item.isLong ? (
                          <button
                            onClick={() => setSelectedArticle(item)}
                            className="w-full py-2.5 bg-white/10 hover:bg-accent text-white font-sans text-[11px] uppercase tracking-wider font-extrabold rounded-xl transition-all flex items-center justify-center gap-1.5 border border-white/10 group-hover:border-accent"
                          >
                            <BookOpen className="w-3.5 h-3.5" />
                            <span>Leer Artículo Completo</span>
                          </button>
                        ) : (
                          <p className="font-sans text-[10px] text-slate-400 leading-relaxed line-clamp-3">
                            {item.content}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                }
              })}
            </div>
          )}

          {/* Sin resultados de búsqueda */}
          {!isLoading && !isEmpty && filteredFeed.length === 0 && (
            <div className="text-center py-20 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-3xl shadow-card max-w-lg mx-auto">
              <p className="font-sans font-extrabold text-lg text-slate-800 dark:text-white">
                Sin resultados editoriales
              </p>
              <p className="font-sans text-xs text-slate-400 mt-2 max-w-xs mx-auto">
                No encontramos contenido que coincida con "{searchQuery}". Intenta ajustar la búsqueda.
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />

      {/* Modal lector de artículo completo (solo blogs) */}
      {selectedArticle && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 max-w-2xl w-full rounded-3xl overflow-hidden shadow-elegant animate-fade-in relative flex flex-col max-h-[85vh]">

            {/* Banner de imagen si existe */}
            {selectedArticle.image ? (
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
                <span className="absolute bottom-4 left-6 text-white text-[10px] uppercase tracking-[0.15em] font-extrabold">
                  Blog
                </span>
              </div>
            ) : (
              <div className="flex justify-end p-4 shrink-0">
                <button
                  onClick={() => setSelectedArticle(null)}
                  className="p-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full text-slate-600 dark:text-slate-400 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Contenido del artículo */}
            <div className="p-6 md:p-8 overflow-y-auto space-y-6 text-left">
              <h2 className="font-sans text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight">
                {selectedArticle.title}
              </h2>

              {/* Banner del autor */}
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
                    {selectedArticle.date}
                  </span>
                </div>
              </div>

              {/* Cuerpo */}
              <p className="font-sans text-slate-600 dark:text-slate-300 text-sm md:text-base leading-relaxed font-normal first-letter:text-4xl first-letter:font-extrabold first-letter:text-primary first-letter:mr-1 first-letter:float-left">
                {selectedArticle.content}
              </p>
            </div>

            {/* Pie del drawer */}
            <div className="p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 shrink-0 flex justify-end gap-3">
              <button
                onClick={() => setSelectedArticle(null)}
                className="px-5 py-2.5 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-400 text-xs font-sans font-bold uppercase tracking-wider rounded-xl transition-colors"
              >
                Cerrar
              </button>
              <a
                href={`https://wa.me/525516070024?text=Hola%20IJB%20Asesoria,%20me%20interesa%20el%20art%C3%ADculo%20%22${encodeURIComponent(selectedArticle.title)}%22`}
                target="_blank"
                rel="noreferrer"
                className="px-6 py-2.5 bg-primary hover:bg-primary/90 text-white text-xs font-sans font-bold uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center gap-1.5"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Contactar Asesor</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Propiedades;
