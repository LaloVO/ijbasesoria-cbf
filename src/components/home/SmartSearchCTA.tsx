import { Link } from "react-router-dom";
import { ArrowRight, Heart, Shield } from "lucide-react";

export default function SmartSearchCTA() {
  return (
    <section className="py-24 bg-[#FAF7F2] border-t border-[#6E6259]/10 relative overflow-hidden">
      {/* Background Decorative Blobs */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 rounded-full bg-[#B76E4D]/5 blur-3xl" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 rounded-full bg-[#6E6259]/5 blur-3xl" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Columna Texto: Editorial Revista Lujo */}
          <div className="lg:col-span-6 space-y-6">
            
            <h2 className="font-serif text-3xl md:text-5xl text-[#2E251E] font-medium tracking-tight leading-tight">
              Encuentra la residencia ideal según tu estilo de vida
            </h2>
            
            <p className="font-sans text-sm md:text-base text-[#6E6259]/90 leading-relaxed">
              Dejar de buscar propiedades en listas rígidas. A través de nuestro embudo calificado de 6 pasos, define tus necesidades reales, tu presupuesto viable, tus métodos de financiamiento y documentación. 
            </p>
            
            <p className="font-sans text-xs md:text-sm text-[#6E6259]/70 leading-relaxed">
              Nuestro motor avanzado analiza tu rutina diaria para conectar tu perfil con residencias que realmente potencien tu bienestar.
            </p>

            <div className="grid grid-cols-2 gap-6 pt-4 border-t border-[#6E6259]/15">
              <div className="flex gap-2">
                <Heart className="w-5 h-5 text-[#B76E4D] shrink-0" />
                <div>
                  <h4 className="font-sans font-bold text-xs text-[#2E251E]">Búsqueda por Rutina</h4>
                  <p className="text-[10px] text-[#6E6259] mt-0.5">Analizamos tus necesidades familiares e internet.</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Shield className="w-5 h-5 text-[#B76E4D] shrink-0" />
                <div>
                  <h4 className="font-sans font-bold text-xs text-[#2E251E]">Expediente Seguro</h4>
                  <p className="text-[10px] text-[#6E6259] mt-0.5">Tus documentos protegidos por cifrado central.</p>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <Link
                to="/solicita-inmueble"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#B76E4D] hover:bg-[#9a5435] text-white rounded-full font-sans font-medium text-sm transition-all duration-300 shadow-elegant hover:scale-105"
              >
                Comenzar Búsqueda Inteligente
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Columna Imagen: Luxury Floating Card Mockup */}
          <div className="lg:col-span-6 relative flex items-center justify-center">
            
            {/* Imagen Principal */}
            <div className="aspect-[4/3] w-full max-w-lg rounded-3xl overflow-hidden shadow-elegant border border-white/40 relative">
              <img
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop"
                alt="Luxury Estate Lifestyle"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            </div>

            {/* Tarjeta Glassmorphic Flotante (Mockup del Funnel) */}
            <div className="absolute -bottom-6 left-6 md:-left-6 max-w-xs bg-white/40 backdrop-blur-lg border border-white/50 rounded-2xl p-5 shadow-elegant animate-float">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-[#B76E4D] flex items-center justify-center font-serif text-sm text-white font-medium">
                  IA
                </div>
                <div>
                  <h5 className="font-sans font-bold text-xs text-[#2E251E]">Perfil de Estilo de Vida</h5>
                  <span className="text-[9px] text-[#6E6259] block">Evaluando requerimientos...</span>
                </div>
              </div>

              <p className="font-sans text-[11px] text-[#2E251E] italic leading-relaxed bg-white/50 p-2.5 rounded-xl border border-white/20">
                &ldquo;Familia con 2 hijos pequeños y mascota. Requiere oficina para home office con internet de alta velocidad, jardín privado amplio, y escuelas bilingües a menos de 15 minutos de distancia.&rdquo;
              </p>

              <div className="flex items-center justify-between mt-3 text-[10px] font-sans font-semibold text-green-700">
                <span>✓ Rango de Presupuesto: Apto</span>
                <span>Match: 96%</span>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
