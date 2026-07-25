import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, Lock, FileSearch } from "lucide-react";

export default function SmartSearchCTA() {
  return (
    <section className="py-24 px-6 md:px-12 bg-slate-50 dark:bg-slate-950 border-t border-slate-200/60 dark:border-slate-800/60 relative overflow-hidden text-left">
      {/* Halos decorativos de fondo */}
      <div className="absolute top-1/2 left-[-10%] w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[350px] h-[350px] bg-accent/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-[92%] md:w-[80%] mx-auto relative z-10">
        <div className="bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800/80 rounded-3xl p-8 sm:p-12 shadow-card grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Columna Izquierda: Mensaje Editorial Directo */}
          <div className="lg:col-span-7 space-y-6">
            <h2 className="font-sans text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white leading-tight">
              ¿Buscas o rentas propiedad en CDMX?
            </h2>

            <p className="font-sans text-slate-600 dark:text-slate-300 text-sm md:text-base font-normal leading-relaxed max-w-xl">
              Filtramos y encontramos inmuebles ajustados a tus requerimientos legales y financieros. Completa el perfilamiento en 6 pasos para recibir asesoría personalizada y póliza jurídica respaldada.
            </p>

            {/* Puntos clave */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="flex items-center gap-2.5 text-slate-700 dark:text-slate-300 text-xs font-sans font-bold">
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                <span>Investigación de buró y scoring</span>
              </div>
              <div className="flex items-center gap-2.5 text-slate-700 dark:text-slate-300 text-xs font-sans font-bold">
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                <span>Póliza Jurídica IJB garantizada</span>
              </div>
              <div className="flex items-center gap-2.5 text-slate-700 dark:text-slate-300 text-xs font-sans font-bold">
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                <span>Expediente 100% digital cifrado</span>
              </div>
              <div className="flex items-center gap-2.5 text-slate-700 dark:text-slate-300 text-xs font-sans font-bold">
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                <span>Respuesta en menos de 24 hrs</span>
              </div>
            </div>
          </div>

          {/* Columna Derecha: Tarjeta CTA Enlazada */}
          <div className="lg:col-span-5 bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col justify-between gap-6">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <FileSearch className="w-5 h-5" />
              </div>
              <h3 className="font-sans text-xl font-extrabold text-slate-900 dark:text-white">
                Iniciar Búsqueda Inteligente
              </h3>
              <p className="font-sans text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-normal">
                Define tus zonas deseadas, presupuesto y tipo de arrendamiento o adquisición en minutos.
              </p>
            </div>

            <Link
              to="/solicita-inmueble"
              className="w-full py-4 bg-primary hover:bg-primary/95 text-white font-sans text-xs uppercase tracking-widest font-extrabold rounded-full transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2 group"
            >
              <span>Búsqueda Inteligente</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}
