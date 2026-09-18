import React, { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  User,
  Mail,
  Phone,
  Home,
  BedDouble,
  Bath,
  Car,
  Maximize,
  MapPin,
  Heart,
  DollarSign,
  CreditCard,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Briefcase,
  Palmtree,
  MoreHorizontal,
  FileText,
  Upload,
  X,
  Check,
  Calendar,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { submitLead, fetchBusySlots } from "@/lib/cbf";

const SUPABASE_URL = (import.meta.env.VITE_SUPABASE_URL as string) || "https://nxouqoyppkiqrhfzovny.supabase.co";
const SUPABASE_ANON_KEY = (import.meta.env.VITE_SUPABASE_ANON_KEY as string) || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im54b3Vxb3lwcGtpcXJoZnpvdm55Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg3MDQxODMsImV4cCI6MjA5NDI4MDE4M30.zDlAxuD-YISh93Y4CWTWuJJP9HAWlPru32MbAfc3dtA";

async function uploadFileToSupabase(file: File, email: string, docId: string): Promise<string> {
  const emailSanitized = email.toLowerCase().replace(/[^a-z0-9]/g, "_");
  const sanitizedFileName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, "_")}`;
  const path = `leads/${emailSanitized}/${docId}/${sanitizedFileName}`;

  const uploadUrl = `${SUPABASE_URL}/storage/v1/object/documentos-leads/${path}`;

  const res = await fetch(uploadUrl, {
    method: "POST",
    headers: {
      "apikey": SUPABASE_ANON_KEY,
      "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
      "Content-Type": file.type,
      "x-upsert": "true",
    },
    body: file,
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error("Supabase Storage error details:", errText);
    throw new Error(`Error en el almacenamiento de base de datos: ${res.statusText}`);
  }

  return `${SUPABASE_URL}/storage/v1/object/public/documentos-leads/${path}`;
}

const STEPS = [
  { id: 1, title: "Información", description: "Tus datos básicos", icon: User },
  { id: 2, title: "Características", description: "Preferencias del inmueble", icon: Home },
  { id: 3, title: "Ubicación", description: "Estilo de vida y zonas", icon: MapPin },
  { id: 4, title: "Presupuesto", description: "Financiamiento", icon: DollarSign },
  { id: 5, title: "Uso", description: "Destino del inmueble", icon: Heart },
  { id: 6, title: "Expediente", description: "Documentos listos", icon: FileText },
];

const ESTADOS_MEXICO = [
  "Aguascalientes", "Baja California", "Baja California Sur", "Campeche",
  "Chiapas", "Chihuahua", "Ciudad de México", "Coahuila de Zaragoza", "Colima",
  "Durango", "Guanajuato", "Guerrero", "Hidalgo", "Jalisco", "México",
  "Michoacán de Ocampo", "Morelos", "Nayarit", "Nuevo León", "Oaxaca", "Puebla",
  "Querétaro", "Quintana Roo", "San Luis Potosí", "Sinaloa", "Sonora",
  "Tabasco", "Tamaulipas", "Tlaxcala", "Veracruz de Ignacio de la Llave", "Yucatán", "Zacatecas"
];

const METODOS_PAGO = [
  { id: "contado", label: "Contado", description: "Pago único en efectivo o transferencia" },
  { id: "credito_hipotecario", label: "Crédito Hipotecario", description: "Financiamiento bancario" },
  { id: "financiamiento_directo", label: "Financiamiento Directo", description: "Con el desarrollador o vendedor" },
  { id: "otro", label: "Otro", description: "Otra forma de pago" }
];

const OPCIONES_USO = [
  { id: "vivienda_propia", label: "Vivienda Propia", description: "Para vivir en familia", icon: Home },
  { id: "inversion", label: "Inversión", description: "Para arrendar o revender", icon: TrendingUp },
  { id: "negocio", label: "Negocio", description: "Para actividad comercial", icon: Briefcase },
  { id: "vacacional", label: "Vacacional", description: "Casa de descanso o fin de semana", icon: Palmtree },
  { id: "otro", label: "Otro", description: "Otro uso específico", icon: MoreHorizontal }
];

const TIPOS_DOCUMENTOS = [
  { id: "identificacion", label: "Identificación Oficial (INE)", requerido: false },
  { id: "comprobante_ingresos", label: "Comprobante de Ingresos", requerido: false },
  { id: "estados_cuenta", label: "Estados de Cuenta (últimos 3 meses)", requerido: false },
  { id: "comprobante_domicilio", label: "Comprobante de Domicilio", requerido: false },
  { id: "carta_recomendacion", label: "Carta de Recomendación Bancaria", requerido: false },
  { id: "otros", label: "Otros Documentos", requerido: false }
];

// Esquemas de validación parciales por paso
const step1Schema = z.object({
  nombreCompleto: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  email: z.string().email("Ingresa un email válido"),
  telefono: z.string().min(10, "El teléfono debe tener al menos 10 dígitos")
});

const step2Schema = z.object({
  tipoOperacion: z.enum(["compra", "renta"], { required_error: "Selecciona el tipo de operación" }),
  tipoPropiedad: z.string().min(1, "Selecciona el tipo de propiedad"),
  numHabitaciones: z.string().optional(),
  numBanos: z.string().optional(),
  numEstacionamientos: z.string().optional(),
  metrosCuadradosMin: z.string().optional(),
  metrosCuadradosMax: z.string().optional()
});

const step3Schema = z.object({
  estadosDeseados: z.array(z.string()).min(1, "Selecciona al menos un estado de interés"),
  ciudadesDeseadas: z.array(z.string()).optional(),
  zonasEspecificas: z.string().optional(),
  estiloVidaDescripcion: z.string().min(100, "Describe tu estilo de vida con al menos 100 caracteres para perfilar tu recomendación")
});

const step4Schema = z.object({
  presupuestoMin: z.string().min(1, "Ingresa el presupuesto mínimo"),
  presupuestoMax: z.string().min(1, "Ingresa el presupuesto máximo"),
  metodoPago: z.array(z.string()).min(1, "Selecciona al menos un método de pago"),
  tienePrecalificacionCrediticia: z.boolean().optional(),
  institucionCrediticia: z.string().optional()
});

const step5Schema = z.object({
  usoDestino: z.enum(["vivienda_propia", "inversion", "negocio", "vacacional", "otro"], { required_error: "Selecciona el uso principal" }),
  detallesUso: z.string().optional()
});

const step6Schema = z.object({
  documentosDisponibles: z.array(z.string()).optional()
});

// Esquema completo final
const fullSchema = z.object({
  nombreCompleto: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  email: z.string().email("Ingresa un email válido"),
  telefono: z.string().min(10, "El teléfono debe tener al menos 10 dígitos"),
  tipoOperacion: z.enum(["compra", "renta"]),
  tipoPropiedad: z.string().min(1, "Selecciona el tipo de propiedad"),
  numHabitaciones: z.string().optional(),
  numBanos: z.string().optional(),
  numEstacionamientos: z.string().optional(),
  metrosCuadradosMin: z.string().optional(),
  metrosCuadradosMax: z.string().optional(),
  estadosDeseados: z.array(z.string()).min(1, "Selecciona al menos un estado de interés"),
  ciudadesDeseadas: z.array(z.string()).optional(),
  zonasEspecificas: z.string().optional(),
  estiloVidaDescripcion: z.string().min(100, "La descripción del estilo de vida debe tener al menos 100 caracteres"),
  presupuestoMin: z.string().min(1, "Ingresa el presupuesto mínimo"),
  presupuestoMax: z.string().min(1, "Ingresa el presupuesto máximo"),
  metodoPago: z.array(z.string()).min(1, "Selecciona al menos un método de pago"),
  tienePrecalificacionCrediticia: z.boolean().optional(),
  institucionCrediticia: z.string().optional(),
  usoDestino: z.enum(["vivienda_propia", "inversion", "negocio", "vacacional", "otro"]),
  detallesUso: z.string().optional(),
  documentosDisponibles: z.array(z.string()).optional(),
  documentos_urls: z.record(z.string()).optional()
});

type FormData = z.infer<typeof fullSchema>;

const STORAGE_KEY = "cbf-lead-funnel-draft";

interface FormularioMultiStepProps {
  onSubmitComplete?: () => void;
  onStepChange?: (step: number) => void;
}

const AVAILABLE_HOURS = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"];

function isTimeSlotBusy(dateStr: string, hourStr: string, busySlots: Array<{ start: string; end: string }>): boolean {
  const [hours, minutes] = hourStr.split(":").map(Number);
  const slotStart = new Date(dateStr);
  // Reset time part of dateStr
  slotStart.setHours(hours, minutes, 0, 0);
  const slotEnd = new Date(slotStart.getTime() + 60 * 60 * 1000); // 1 hour

  return busySlots.some((slot) => {
    const busyStart = new Date(slot.start);
    const busyEnd = new Date(slot.end);
    return slotStart < busyEnd && slotEnd > busyStart;
  });
}

export default function FormularioMultiStep({ onSubmitComplete, onStepChange }: FormularioMultiStepProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [documentosUrls, setDocumentosUrls] = useState<Record<string, string>>({});
  const [uploadingDocs, setUploadingDocs] = useState<Record<string, boolean>>({});

  const [citaVirtualSolicitada, setCitaVirtualSolicitada] = useState(false);
  const [citaVirtualFecha, setCitaVirtualFecha] = useState("");
  const [citaVirtualHora, setCitaVirtualHora] = useState("");
  const [busySlots, setBusySlots] = useState<Array<{ start: string; end: string }>>([]);
  const [isLoadingBusySlots, setIsLoadingBusySlots] = useState(false);

  useEffect(() => {
    onStepChange?.(currentStep);
  }, [currentStep, onStepChange]);

  const form = useForm<FormData>({
    resolver: zodResolver(fullSchema),
    mode: "onChange",
    defaultValues: {
      tipoOperacion: "compra",
      tipoPropiedad: "",
      estadosDeseados: [],
      ciudadesDeseadas: [],
      metodoPago: [],
      tienePrecalificacionCrediticia: false,
      usoDestino: "vivienda_propia",
      documentosDisponibles: []
    }
  });

  const { register, formState: { errors }, setValue, watch, trigger, getValues } = form;

  // Persistencia de borrador
  useEffect(() => {
    const subscription = form.watch((data) => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      } catch (err) {
        console.error("Error guardando borrador:", err);
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

  // Cargar borrador al montar
  useEffect(() => {
    try {
      const savedData = localStorage.getItem(STORAGE_KEY);
      if (savedData) {
        const parsed = JSON.parse(savedData);
        Object.keys(parsed).forEach((key) => {
          if (parsed[key] !== undefined && parsed[key] !== "") {
            setValue(key as any, parsed[key]);
          }
        });
      }
    } catch (err) {
      console.error("Error cargando borrador:", err);
    }
  }, [setValue]);

  // Cargar horarios ocupados al entrar al paso 6
  useEffect(() => {
    if (currentStep === 6) {
      setIsLoadingBusySlots(true);
      fetchBusySlots()
        .then((slots) => {
          setBusySlots(slots);
        })
        .catch((err) => {
          console.error("Error al cargar horarios ocupados:", err);
          toast.error("No se pudo conectar al calendario del asesor. Mostrando todos los horarios disponibles.");
        })
        .finally(() => {
          setIsLoadingBusySlots(false);
        });
    }
  }, [currentStep]);

  const validateStep = async (step: number): Promise<boolean> => {
    let fields: (keyof FormData)[] = [];
    switch (step) {
      case 1:
        fields = ["nombreCompleto", "email", "telefono"];
        break;
      case 2:
        fields = ["tipoOperacion", "tipoPropiedad", "numHabitaciones", "numBanos", "numEstacionamientos", "metrosCuadradosMin", "metrosCuadradosMax"];
        break;
      case 3:
        fields = ["estadosDeseados", "ciudadesDeseadas", "zonasEspecificas", "estiloVidaDescripcion"];
        break;
      case 4:
        fields = ["presupuestoMin", "presupuestoMax", "metodoPago", "tienePrecalificacionCrediticia", "institucionCrediticia"];
        break;
      case 5:
        fields = ["usoDestino", "detallesUso"];
        break;
      case 6:
        fields = ["documentosDisponibles"];
        break;
      default:
        return false;
    }
    return await trigger(fields as any);
  };

  const handleNext = async () => {
    const isValid = await validateStep(currentStep);
    if (!isValid) {
      toast.error("Por favor completa los campos obligatorios del paso actual.");
      return;
    }

    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps([...completedSteps, currentStep]);
    }

    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleFormSubmit = async () => {
    const isValid = await validateStep(6);
    if (!isValid) {
      toast.error("Por favor revisa la información de expediente antes de enviar.");
      return;
    }

    if (citaVirtualSolicitada && (!citaVirtualFecha || !citaVirtualHora)) {
      toast.error("Por favor selecciona la fecha y hora de tu cita virtual.");
      return;
    }

    setIsSubmitting(true);
    const data = getValues();

    try {
      const payload = {
        nombre_completo: data.nombreCompleto,
        email: data.email,
        telefono: data.telefono,
        tipo_operacion: data.tipoOperacion,
        tipo_propiedad: data.tipoPropiedad,
        num_habitaciones: data.numHabitaciones || undefined,
        num_banos: data.numBanos || undefined,
        num_estacionamientos: data.numEstacionamientos || undefined,
        metros_cuadrados_min: data.metrosCuadradosMin || undefined,
        metros_cuadrados_max: data.metrosCuadradosMax || undefined,
        estados_deseados: data.estadosDeseados,
        ciudades_deseadas: data.ciudadesDeseadas,
        zonas_especificas: data.zonasEspecificas,
        estilo_vida_descripcion: data.estiloVidaDescripcion,
        presupuesto_min: data.presupuestoMin,
        presupuesto_max: data.presupuestoMax,
        metodo_pago: data.metodoPago,
        tiene_precalificacion_crediticia: data.tienePrecalificacionCrediticia,
        institucion_crediticia: data.institucionCrediticia,
        uso_destino: data.usoDestino,
        detalles_uso: data.detallesUso,
        documentos_disponibles: data.documentosDisponibles,
        documentos_urls: data.documentos_urls || {},
        cita_virtual_solicitada: citaVirtualSolicitada,
        cita_virtual_fecha_hora: citaVirtualSolicitada && citaVirtualFecha && citaVirtualHora
          ? (() => {
              const [hours, minutes] = citaVirtualHora.split(":").map(Number);
              const d = new Date(citaVirtualFecha);
              // Set local hours and minutes in the client context
              d.setHours(hours, minutes, 0, 0);
              return d.toISOString();
            })()
          : undefined,
      };

      await submitLead(payload);
      localStorage.removeItem(STORAGE_KEY);
      toast.success("¡Embudo completado exitosamente! Tu solicitud está siendo procesada.");

      setTimeout(() => {
        if (onSubmitComplete) {
          onSubmitComplete();
        } else {
          window.location.href = "/";
        }
      }, 2000);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Ocurrió un error al registrar tu solicitud. Por favor intenta de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Formateador de moneda en pesos
  const formatCurrency = (val: string) => {
    const numeric = val.replace(/\D/g, "");
    return numeric ? new Intl.NumberFormat("es-MX").format(Number(numeric)) : "";
  };

  // Gestión de listas e inputs dinámicos en Paso 3
  const [estadoSelect, setEstadoSelect] = useState("");
  const [ciudadInput, setCiudadInput] = useState("");
  const estadosDeseados = watch("estadosDeseados") || [];
  const ciudadesDeseadas = watch("ciudadesDeseadas") || [];

  const handleAddEstado = () => {
    if (estadoSelect && !estadosDeseados.includes(estadoSelect)) {
      setValue("estadosDeseados", [...estadosDeseados, estadoSelect]);
      setEstadoSelect("");
    }
  };

  const handleRemoveEstado = (est: string) => {
    setValue("estadosDeseados", estadosDeseados.filter((e) => e !== est));
  };

  const handleAddCiudad = () => {
    if (ciudadInput && !ciudadesDeseadas.includes(ciudadInput)) {
      setValue("ciudadesDeseadas", [...ciudadesDeseadas, ciudadInput]);
      setCiudadInput("");
    }
  };

  const handleRemoveCiudad = (ciud: string) => {
    setValue("ciudadesDeseadas", ciudadesDeseadas.filter((c) => c !== ciud));
  };

  // Gestión de Checkbox Paso 4
  const metodoPago = watch("metodoPago") || [];
  const handleToggleMetodoPago = (id: string) => {
    if (metodoPago.includes(id)) {
      setValue("metodoPago", metodoPago.filter((m) => m !== id));
    } else {
      setValue("metodoPago", [...metodoPago, id]);
    }
  };

  // Carga de archivos real en Paso 6 con inyección directa a la base de datos (Supabase Storage)
  const [activeUploadId, setActiveUploadId] = useState<string | null>(null);
  const documentosDisponibles = watch("documentosDisponibles") || [];

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeUploadId) return;

    // Validar tipo (PDF, JPG, PNG)
    const TIPOS_PERMITIDOS = ["application/pdf", "image/jpeg", "image/png", "image/jpg"];
    if (!TIPOS_PERMITIDOS.includes(file.type)) {
      toast.error("Formato no válido. Solo se admiten PDF, JPG y PNG.");
      return;
    }

    // Se ha quitado la restricción de tamaño por completo por petición del usuario

    const email = getValues("email");
    if (!email) {
      toast.error("Por favor ingresa tu correo electrónico en el paso 1 antes de adjuntar archivos.");
      return;
    }

    setUploadingDocs((prev) => ({ ...prev, [activeUploadId]: true }));
    const toastId = toast.loading(`Subiendo "${file.name}" directamente a la base de datos...`);

    try {
      const publicUrl = await uploadFileToSupabase(file, email, activeUploadId);

      // Carga exitosa: Añadir a documentosDisponibles
      if (!documentosDisponibles.includes(activeUploadId)) {
        setValue("documentosDisponibles", [...documentosDisponibles, activeUploadId], { shouldValidate: true });
      }

      setDocumentosUrls((prev) => {
        const updated = { ...prev, [activeUploadId]: publicUrl };
        setValue("documentos_urls", updated);
        return updated;
      });
      toast.success(`Archivo "${file.name}" cargado exitosamente directamente en la base de datos.`, { id: toastId });
    } catch (err: any) {
      console.error(err);
      toast.error(`Error al subir el archivo: ${err.message || "Error desconocido"}`, { id: toastId });
    } finally {
      setUploadingDocs((prev) => ({ ...prev, [activeUploadId]: false }));
      // Limpiar input de archivo
      e.target.value = "";
    }
  };

  const handleAttachClick = (id: string) => {
    setActiveUploadId(id);
    setTimeout(() => {
      document.getElementById("funnel-file-input")?.click();
    }, 50);
  };

  const handleRemoveDoc = (id: string) => {
    setValue("documentosDisponibles", documentosDisponibles.filter((d) => d !== id), { shouldValidate: true });
    setDocumentosUrls((prev) => {
      const copy = { ...prev };
      delete copy[id];
      setValue("documentos_urls", copy);
      return copy;
    });
    toast.success("Documento removido del expediente.");
  };

  return (
    <div className="w-full">
      <div className="relative min-h-[460px] rounded-3xl border border-slate-200/70 bg-white p-6 text-left shadow-card transition-all duration-300 dark:border-slate-800/80 dark:bg-slate-900 md:p-10">
        
        {/* PASO 1: Información Personal */}
        {currentStep === 1 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="text-left mb-8">
              <h2 className="font-sans text-3xl text-slate-900 dark:text-white font-medium">Información Personal</h2>
              <p className="font-sans text-sm text-slate-500 dark:text-slate-400 mt-2">
                Comparte tus datos básicos para poder asignarte un asesor boutique y contactarte.
              </p>
            </div>

            <div className="space-y-5 max-w-lg">
              <div className="space-y-2">
                <Label htmlFor="nombreCompleto" className="font-sans text-sm font-medium text-slate-900 dark:text-white flex items-center gap-2">
                  <User className="w-4 h-4 text-primary" />
                  Nombre Completo *
                </Label>
                <Input
                  id="nombreCompleto"
                  placeholder="Ej: Eduardo Valenzuela"
                  {...register("nombreCompleto")}
                  className={`rounded-xl bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800/20 focus:bg-white dark:focus:bg-slate-900 focus:border-primary focus:ring-0 ${
                    errors.nombreCompleto ? "border-red-500" : ""
                  }`}
                />
                {errors.nombreCompleto && (
                  <p className="text-xs text-red-500 font-sans">{errors.nombreCompleto.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="font-sans text-sm font-medium text-slate-900 dark:text-white flex items-center gap-2">
                  <Mail className="w-4 h-4 text-primary" />
                  Correo Electrónico *
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="ejemplo@correo.com"
                  {...register("email")}
                  className={`rounded-xl bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800/20 focus:bg-white dark:focus:bg-slate-900 focus:border-primary focus:ring-0 ${
                    errors.email ? "border-red-500" : ""
                  }`}
                />
                {errors.email && (
                  <p className="text-xs text-red-500 font-sans">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="telefono" className="font-sans text-sm font-medium text-slate-900 dark:text-white flex items-center gap-2">
                  <Phone className="w-4 h-4 text-primary" />
                  Teléfono Móvil *
                </Label>
                <Input
                  id="telefono"
                  type="tel"
                  placeholder="5512345678"
                  {...register("telefono")}
                  className={`rounded-xl bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800/20 focus:bg-white dark:focus:bg-slate-900 focus:border-primary focus:ring-0 ${
                    errors.telefono ? "border-red-500" : ""
                  }`}
                />
                {errors.telefono && (
                  <p className="text-xs text-red-500 font-sans">{errors.telefono.message}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* PASO 2: Características del Inmueble */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="text-left mb-8">
              <h2 className="font-sans text-3xl text-slate-900 dark:text-white font-medium">Características del Inmueble</h2>
              <p className="font-sans text-sm text-slate-500 dark:text-slate-400 mt-2">
                Define el tipo de propiedad que imaginas para tu próximo paso.
              </p>
            </div>

            <div className="space-y-6 max-w-2xl">
              {/* Tipo de Operación */}
              <div className="space-y-3">
                <Label className="font-sans text-sm font-medium text-slate-900 dark:text-white flex items-center gap-2">
                  <Home className="w-4 h-4 text-primary" />
                  ¿Cuál es tu intención principal? *
                </Label>
                <RadioGroup
                  value={watch("tipoOperacion")}
                  onValueChange={(val) => setValue("tipoOperacion", val as any)}
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2 flex-1">
                    <RadioGroupItem value="compra" id="compra" className="sr-only" />
                    <Label
                      htmlFor="compra"
                      className={`flex-1 cursor-pointer border rounded-2xl p-4 flex flex-col justify-between h-20 transition-all duration-300
                        ${watch("tipoOperacion") === "compra" 
                          ? "bg-white border-primary shadow-card scale-[1.02]"
                          : "bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800/10 hover:bg-slate-100 dark:hover:bg-slate-800"
                        }
                      `}
                    >
                      <span className="font-sans font-semibold text-sm text-slate-900 dark:text-white">Comprar</span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">Adquirir propiedad en patrimonio</span>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 flex-1">
                    <RadioGroupItem value="renta" id="renta" className="sr-only" />
                    <Label
                      htmlFor="renta"
                      className={`flex-1 cursor-pointer border rounded-2xl p-4 flex flex-col justify-between h-20 transition-all duration-300
                        ${watch("tipoOperacion") === "renta" 
                          ? "bg-white border-primary shadow-card scale-[1.02]"
                          : "bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800/10 hover:bg-slate-100 dark:hover:bg-slate-800"
                        }
                      `}
                    >
                      <span className="font-sans font-semibold text-sm text-slate-900 dark:text-white">Rentar</span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">Arrendamiento de residencia exclusiva</span>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Tipo de Propiedad */}
              <div className="space-y-2">
                <Label htmlFor="tipoPropiedad" className="font-sans text-sm font-medium text-slate-900 dark:text-white">
                  Tipo de Propiedad *
                </Label>
                <Select
                  onValueChange={(val) => setValue("tipoPropiedad", val)}
                  value={watch("tipoPropiedad")}
                >
                  <SelectTrigger className={`rounded-xl bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800/20 focus:bg-white dark:focus:bg-slate-900 focus:ring-0 ${
                    errors.tipoPropiedad ? "border-red-500" : ""
                  }`}>
                    <SelectValue placeholder="Selecciona el tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="casa">Casa</SelectItem>
                    <SelectItem value="departamento">Departamento</SelectItem>
                    <SelectItem value="terreno">Terreno</SelectItem>
                    <SelectItem value="oficina">Oficina</SelectItem>
                    <SelectItem value="local">Local Comercial</SelectItem>
                    <SelectItem value="bodega">Bodega</SelectItem>
                    <SelectItem value="loft">Loft</SelectItem>
                    <SelectItem value="lote">Lote Residencial</SelectItem>
                  </SelectContent>
                </Select>
                {errors.tipoPropiedad && (
                  <p className="text-xs text-red-500 font-sans">{errors.tipoPropiedad.message}</p>
                )}
              </div>

              {/* Cuartos, Baños y Estacionamientos */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="font-sans text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <BedDouble className="w-3.5 h-3.5 text-primary" />
                    Habitaciones
                  </Label>
                  <Select
                    onValueChange={(val) => setValue("numHabitaciones", val)}
                    value={watch("numHabitaciones")}
                  >
                    <SelectTrigger className="rounded-xl bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800/20">
                      <SelectValue placeholder="Cualquiera" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1</SelectItem>
                      <SelectItem value="2">2</SelectItem>
                      <SelectItem value="3">3</SelectItem>
                      <SelectItem value="4">4</SelectItem>
                      <SelectItem value="5">5+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="font-sans text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <Bath className="w-3.5 h-3.5 text-primary" />
                    Baños
                  </Label>
                  <Select
                    onValueChange={(val) => setValue("numBanos", val)}
                    value={watch("numBanos")}
                  >
                    <SelectTrigger className="rounded-xl bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800/20">
                      <SelectValue placeholder="Cualquiera" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1</SelectItem>
                      <SelectItem value="1.5">1.5</SelectItem>
                      <SelectItem value="2">2</SelectItem>
                      <SelectItem value="2.5">2.5</SelectItem>
                      <SelectItem value="3">3</SelectItem>
                      <SelectItem value="3.5">3.5</SelectItem>
                      <SelectItem value="4">4+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="font-sans text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <Car className="w-3.5 h-3.5 text-primary" />
                    Estacionamientos
                  </Label>
                  <Select
                    onValueChange={(val) => setValue("numEstacionamientos", val)}
                    value={watch("numEstacionamientos")}
                  >
                    <SelectTrigger className="rounded-xl bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800/20">
                      <SelectValue placeholder="Cualquiera" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">0</SelectItem>
                      <SelectItem value="1">1</SelectItem>
                      <SelectItem value="2">2</SelectItem>
                      <SelectItem value="3">3</SelectItem>
                      <SelectItem value="4">4+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Rango de m2 */}
              <div className="space-y-2">
                <Label className="font-sans text-sm font-medium text-slate-900 dark:text-white flex items-center gap-2">
                  <Maximize className="w-4 h-4 text-primary" />
                  Rango de Área (Metros Cuadrados)
                </Label>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    type="number"
                    placeholder="Mínimo (m²)"
                    {...register("metrosCuadradosMin")}
                    className="rounded-xl bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800/20 focus:bg-white dark:focus:bg-slate-900 focus:border-primary focus:ring-0"
                  />
                  <Input
                    type="number"
                    placeholder="Máximo (m²)"
                    {...register("metrosCuadradosMax")}
                    className="rounded-xl bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800/20 focus:bg-white dark:focus:bg-slate-900 focus:border-primary focus:ring-0"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PASO 3: Ubicación y Estilo de Vida */}
        {currentStep === 3 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="text-left mb-6">
              <h2 className="font-sans text-3xl text-slate-900 dark:text-white font-medium">Ubicación y Estilo de Vida</h2>
              <p className="font-sans text-sm text-slate-500 dark:text-slate-400 mt-2">
                Define las regiones geográficas y detalla cómo transcurre tu día a día para perfilar tu hogar ideal.
              </p>
            </div>

            <div className="space-y-6 max-w-2xl">
              {/* Estados de Interés */}
              <div className="space-y-3">
                <Label className="font-sans text-sm font-medium text-slate-900 dark:text-white flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  Estados de Interés *
                </Label>
                <div className="flex gap-2">
                  <select
                    value={estadoSelect}
                    onChange={(e) => setEstadoSelect(e.target.value)}
                    className="flex-1 h-10 rounded-xl border border-slate-200 dark:border-slate-800/20 bg-slate-50 dark:bg-slate-950 px-4 py-2 text-sm font-sans focus:bg-white dark:focus:bg-slate-900 focus:border-primary"
                  >
                    <option value="">Selecciona un estado de México</option>
                    {ESTADOS_MEXICO.filter((e) => !estadosDeseados.includes(e)).map((estado) => (
                      <option key={estado} value={estado}>{estado}</option>
                    ))}
                  </select>
                  <Button
                    type="button"
                    onClick={handleAddEstado}
                    disabled={!estadoSelect}
                    className="rounded-full bg-primary hover:bg-primary/90"
                  >
                    Agregar
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 min-h-[30px]">
                  {estadosDeseados.map((estado: string) => (
                    <Badge key={estado} variant="secondary" className="rounded-full px-3 py-1 font-sans bg-white border border-slate-200 dark:border-slate-800/25 text-slate-900 dark:text-white flex items-center gap-1.5">
                      {estado}
                      <button
                        type="button"
                        onClick={() => handleRemoveEstado(estado)}
                        className="hover:text-red-500 font-semibold focus:outline-none"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
                {errors.estadosDeseados && (
                  <p className="text-xs text-red-500 font-sans">{errors.estadosDeseados.message}</p>
                )}
              </div>

              {/* Ciudades Deseadas */}
              <div className="space-y-3">
                <Label className="font-sans text-sm font-medium text-slate-900 dark:text-white">Ciudades o Municipios Específicos</Label>
                <div className="flex gap-2">
                  <Input
                    value={ciudadInput}
                    onChange={(e) => setCiudadInput(e.target.value)}
                    placeholder="Ej: Zapopan, San Pedro, Polanco, etc."
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddCiudad();
                      }
                    }}
                    className="rounded-xl bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800/20 focus:bg-white dark:focus:bg-slate-900 focus:border-primary"
                  />
                  <Button
                    type="button"
                    onClick={handleAddCiudad}
                    disabled={!ciudadInput}
                    className="rounded-full bg-primary hover:bg-primary/90"
                  >
                    Agregar
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 min-h-[30px]">
                  {ciudadesDeseadas.map((ciudad: string) => (
                    <Badge key={ciudad} variant="secondary" className="rounded-full px-3 py-1 font-sans bg-white border border-slate-200 dark:border-slate-800/25 text-slate-900 dark:text-white flex items-center gap-1.5">
                      {ciudad}
                      <button
                        type="button"
                        onClick={() => handleRemoveCiudad(ciudad)}
                        className="hover:text-red-500 font-semibold focus:outline-none"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Zonas Específicas */}
              <div className="space-y-2">
                <Label htmlFor="zonasEspecificas" className="font-sans text-sm font-medium text-slate-900 dark:text-white">
                  Zonas, Colonias o Puntos de Referencia
                </Label>
                <Input
                  id="zonasEspecificas"
                  placeholder="Ej: Cerca de Av. Patria o corporativos financieros"
                  {...register("zonasEspecificas")}
                  className="rounded-xl bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800/20 focus:bg-white dark:focus:bg-slate-900 focus:border-primary"
                />
              </div>

              {/* Estilo de Vida (CRÍTICO) */}
              <div className="space-y-3 bg-slate-50 dark:bg-slate-950/60 border border-primary/25 rounded-2xl p-5 md:p-6 shadow-card">
                <Label htmlFor="estiloVidaDescripcion" className="font-sans text-slate-900 dark:text-white font-medium text-base flex items-center gap-2">
                  <Heart className="w-5 h-5 text-red-500 fill-red-500/20" />
                  Describe tu Estilo de Vida y Necesidades Diarias *
                </Label>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Esta descripción es **crucial** para perfilar tu hogar mediante nuestro motor avanzado. 
                  Menciona los miembros de la familia, rutinas de trabajo (home office), escuelas cercanas, mascotas, hobbies y facilidades que requieres.
                </p>
                <Textarea
                  id="estiloVidaDescripcion"
                  rows={6}
                  placeholder="Ej: Somos una pareja de profesionales que trabaja desde casa y tenemos 2 mascotas (perros grandes). Requerimos oficina independiente, un jardín privado, y excelente cobertura de internet. Nos gusta salir a correr al parque los fines de semana..."
                  {...register("estiloVidaDescripcion")}
                  className={`bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800/20 focus:bg-white dark:focus:bg-slate-900 focus:border-primary focus:ring-0 rounded-2xl ${
                    errors.estiloVidaDescripcion ? "border-red-500" : ""
                  }`}
                />
                <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                  <span>Mínimo requerido: 100 caracteres.</span>
                  <span className={`font-semibold ${
                    (watch("estiloVidaDescripcion") || "").length >= 100 ? "text-green-600" : "text-amber-600"
                  }`}>
                    {(watch("estiloVidaDescripcion") || "").length} caracteres ingresados
                  </span>
                </div>
                {errors.estiloVidaDescripcion && (
                  <p className="text-xs text-red-500 font-sans mt-1">{errors.estiloVidaDescripcion.message}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* PASO 4: Presupuesto y Financiamiento */}
        {currentStep === 4 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="text-left mb-8">
              <h2 className="font-sans text-3xl text-slate-900 dark:text-white font-medium">Presupuesto y Financiamiento</h2>
              <p className="font-sans text-sm text-slate-500 dark:text-slate-400 mt-2">
                Delimita tu rango de presupuesto viable y las opciones de financiamiento disponibles.
              </p>
            </div>

            <div className="space-y-6 max-w-2xl">
              {/* Rango de Presupuesto */}
              <div className="bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/10 rounded-2xl p-5 md:p-6 shadow-card space-y-4">
                <Label className="font-sans text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-primary" />
                  Rango de Presupuesto (Pesos Mexicanos MXN) *
                </Label>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="presupuestoMin" className="font-sans text-xs text-slate-500 dark:text-slate-400">Presupuesto Mínimo</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400 text-sm">$</span>
                      <Input
                        id="presupuestoMin"
                        type="text"
                        placeholder="1,500,000"
                        {...register("presupuestoMin")}
                        onChange={(e) => setValue("presupuestoMin", formatCurrency(e.target.value))}
                        className={`rounded-xl pl-7 bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800/20 focus:bg-white dark:focus:bg-slate-900 focus:border-primary focus:ring-0 ${
                          errors.presupuestoMin ? "border-red-500" : ""
                        }`}
                      />
                    </div>
                    {errors.presupuestoMin && (
                      <p className="text-xs text-red-500 font-sans">{errors.presupuestoMin.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="presupuestoMax" className="font-sans text-xs text-slate-500 dark:text-slate-400">Presupuesto Máximo</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400 text-sm">$</span>
                      <Input
                        id="presupuestoMax"
                        type="text"
                        placeholder="5,000,000"
                        {...register("presupuestoMax")}
                        onChange={(e) => setValue("presupuestoMax", formatCurrency(e.target.value))}
                        className={`rounded-xl pl-7 bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800/20 focus:bg-white dark:focus:bg-slate-900 focus:border-primary focus:ring-0 ${
                          errors.presupuestoMax ? "border-red-500" : ""
                        }`}
                      />
                    </div>
                    {errors.presupuestoMax && (
                      <p className="text-xs text-red-500 font-sans">{errors.presupuestoMax.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Métodos de Pago */}
              <div className="space-y-3">
                <Label className="font-sans text-sm font-medium text-slate-900 dark:text-white flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-primary" />
                  Métodos de Pago Preferidos *
                </Label>
                <div className="space-y-3">
                  {METODOS_PAGO.map((metodo) => (
                    <div
                      key={metodo.id}
                      className="flex items-start space-x-3 p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/10 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-300 cursor-pointer shadow-card"
                      onClick={() => handleToggleMetodoPago(metodo.id)}
                    >
                      <Checkbox
                        id={metodo.id}
                        checked={metodoPago.includes(metodo.id)}
                        onCheckedChange={() => handleToggleMetodoPago(metodo.id)}
                        className="mt-0.5 border-primary/40 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                      />
                      <div className="flex-1">
                        <Label htmlFor={metodo.id} className="font-sans font-medium text-sm text-slate-900 dark:text-white cursor-pointer">
                          {metodo.label}
                        </Label>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{metodo.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
                {errors.metodoPago && (
                  <p className="text-xs text-red-500 font-sans mt-1">{errors.metodoPago.message}</p>
                )}
              </div>

              {/* Precalificación Crediticia */}
              <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/10 rounded-2xl p-5 shadow-card space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="tienePrecalificacion" className="font-sans font-medium text-slate-900 dark:text-white">
                      ¿Cuentas con una Precalificación Crediticia?
                    </Label>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Tener un crédito pre-aprobado incrementa sustancialmente el interés y seriedad comercial.
                    </p>
                  </div>
                  <Switch
                    id="tienePrecalificacion"
                    checked={watch("tienePrecalificacionCrediticia")}
                    onCheckedChange={(val) => setValue("tienePrecalificacionCrediticia", val)}
                    className="data-[state=checked]:bg-primary"
                  />
                </div>

                {watch("tienePrecalificacionCrediticia") && (
                  <div className="space-y-2 animate-slideDown">
                    <Label htmlFor="institucionCrediticia" className="font-sans text-xs text-slate-500 dark:text-slate-400">
                      Institución Crediticia o Banco
                    </Label>
                    <Input
                      id="institucionCrediticia"
                      placeholder="Ej: BBVA, Banorte, Infonavit, etc."
                      {...register("institucionCrediticia")}
                      className="rounded-xl bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800/20 focus:bg-white dark:focus:bg-slate-900 focus:border-primary"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* PASO 5: Uso y Destino */}
        {currentStep === 5 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="text-left mb-8">
              <h2 className="font-sans text-3xl text-slate-900 dark:text-white font-medium">Uso del Inmueble</h2>
              <p className="font-sans text-sm text-slate-500 dark:text-slate-400 mt-2">
                Cuéntanos cuál será el fin comercial o habitacional de la propiedad.
              </p>
            </div>

            <div className="space-y-6 max-w-2xl">
              <div className="space-y-3">
                <Label className="font-sans text-sm font-medium text-slate-900 dark:text-white">¿Cuál será el uso de destino principal? *</Label>
                <RadioGroup
                  value={watch("usoDestino")}
                  onValueChange={(val) => setValue("usoDestino", val as any)}
                  className="space-y-3"
                >
                  {OPCIONES_USO.map((opc) => {
                    const Icon = opc.icon;
                    return (
                      <div
                        key={opc.id}
                        className="flex items-start"
                        onClick={() => setValue("usoDestino", opc.id as any)}
                      >
                        <RadioGroupItem value={opc.id} id={opc.id} className="sr-only" />
                        <Label
                          htmlFor={opc.id}
                          className={`flex-1 cursor-pointer border rounded-2xl p-4 flex gap-4 items-center transition-all duration-300 shadow-card
                            ${watch("usoDestino") === opc.id
                              ? "bg-white border-primary scale-[1.01]"
                              : "bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800/10 hover:bg-slate-100 dark:hover:bg-slate-800"
                            }
                          `}
                        >
                          <div className="bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800/10 text-primary">
                            <Icon className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="font-sans font-semibold text-sm text-slate-900 dark:text-white">{opc.label}</span>
                            <span className="block text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{opc.description}</span>
                          </div>
                        </Label>
                      </div>
                    );
                  })}
                </RadioGroup>
                {errors.usoDestino && (
                  <p className="text-xs text-red-500 font-sans">{errors.usoDestino.message}</p>
                )}
              </div>

              {/* Detalles del Uso */}
              <div className="space-y-2">
                <Label htmlFor="detallesUso" className="font-sans text-sm font-medium text-slate-900 dark:text-white">
                  Detalles Adicionales del Uso (opcional)
                </Label>
                <Textarea
                  id="detallesUso"
                  rows={4}
                  placeholder="Ej: Planeo habitarlo junto a mi familia, pero deseamos que tenga opción de renta parcial a estudiantes..."
                  {...register("detallesUso")}
                  className="bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800/20 focus:bg-white dark:focus:bg-slate-900 focus:border-primary focus:ring-0 rounded-2xl"
                />
              </div>
            </div>
          </div>
        )}

        {/* PASO 6: Documentos y Expediente */}
        {currentStep === 6 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="text-left mb-8">
              <h2 className="font-sans text-3xl text-slate-900 dark:text-white font-medium">Expediente de Documentos</h2>
              <p className="font-sans text-sm text-slate-500 dark:text-slate-400 mt-2">
                Completa tu perfil cargando la documentación que tienes disponible para el análisis comercial.
              </p>
            </div>

            <div className="space-y-6 max-w-2xl">
              {/* Opción de Cita Virtual */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 dark:border-slate-800/15 shadow-card hover:border-primary/30 transition-all duration-300 space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-1">
                    <h3 className="font-sans text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-primary" />
                      Prefiero primero agendar una cita virtual
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      Si aún no tienes todos tus documentos listos, puedes agendar una sesión de pre-calificación virtual de 1 hora con nuestro equipo.
                    </p>
                  </div>
                  <Switch
                    checked={citaVirtualSolicitada}
                    onCheckedChange={(checked) => {
                      setCitaVirtualSolicitada(checked);
                      if (!checked) {
                        setCitaVirtualFecha("");
                        setCitaVirtualHora("");
                      }
                    }}
                    className="data-[state=checked]:bg-primary"
                  />
                </div>

                {citaVirtualSolicitada && (
                  <div className="pt-4 border-t border-slate-200 dark:border-slate-800/10 space-y-4 animate-fadeIn">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Selector de Fecha */}
                      <div className="space-y-2">
                        <Label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Selecciona la Fecha de tu Cita</Label>
                        <input
                          type="date"
                          value={citaVirtualFecha}
                          min={new Date().toISOString().split("T")[0]}
                          onChange={(e) => {
                            setCitaVirtualFecha(e.target.value);
                            setCitaVirtualHora(""); // Reset hour when date changes
                          }}
                          className="w-full h-10 rounded-xl border border-slate-200 dark:border-slate-800/20 bg-white px-4 text-sm font-sans focus:border-primary focus:outline-none"
                        />
                      </div>

                      {/* Selector de Horario */}
                      <div className="space-y-2">
                        <Label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Selecciona la Hora (Sesión de 1 hora)</Label>
                        {citaVirtualFecha ? (
                          isLoadingBusySlots ? (
                            <div className="h-10 flex items-center justify-center text-xs text-slate-500 dark:text-slate-400/60">
                              <Loader2 className="w-4 h-4 mr-2 animate-spin text-primary" />
                              Cargando disponibilidad...
                            </div>
                          ) : (
                            <div className="grid grid-cols-3 gap-2">
                              {AVAILABLE_HOURS.map((hour) => {
                                const isBusy = isTimeSlotBusy(citaVirtualFecha, hour, busySlots);
                                const isSelected = citaVirtualHora === hour;

                                return (
                                  <button
                                    key={hour}
                                    type="button"
                                    disabled={isBusy}
                                    onClick={() => setCitaVirtualHora(hour)}
                                    className={`h-9 rounded-full text-xs font-sans font-medium border transition-all duration-300
                                      ${isBusy 
                                        ? "bg-slate-500/5 border-slate-200 dark:border-slate-800/10 text-slate-500 dark:text-slate-400/30 cursor-not-allowed line-through"
                                        : isSelected
                                          ? "bg-primary border-primary text-white shadow-md"
                                          : "bg-white border-slate-200 dark:border-slate-800/20 text-slate-500 dark:text-slate-400 hover:border-primary hover:bg-slate-50 dark:bg-slate-950"
                                      }
                                    `}
                                  >
                                    {hour}
                                  </button>
                                );
                              })}
                            </div>
                          )
                        ) : (
                          <div className="h-10 flex items-center justify-center border border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-500 dark:text-slate-400/60 bg-transparent">
                            Por favor primero selecciona una fecha
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/10 rounded-2xl p-5 md:p-6 shadow-card space-y-4">
                <h3 className="font-sans text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  Documentos a Disposición
                </h3>

                {/* Input de archivo invisible compartido */}
                <input
                  type="file"
                  id="funnel-file-input"
                  className="hidden"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                />

                <div className="space-y-3">
                  {TIPOS_DOCUMENTOS.map((doc) => {
                    const isUploaded = documentosDisponibles.includes(doc.id);

                    return (
                      <div
                        key={doc.id}
                        className="bg-white rounded-2xl p-4 border border-slate-200 dark:border-slate-800/15 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-card hover:border-primary/30 transition-all duration-300"
                      >
                        <div className="flex items-center gap-3">
                          {uploadingDocs[doc.id] ? (
                            <Loader2 className="w-5 h-5 text-primary animate-spin shrink-0" />
                          ) : isUploaded ? (
                            <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />
                          ) : (
                            <div className={`w-5 h-5 rounded-full border-2 shrink-0 ${doc.requerido ? "border-red-400" : "border-slate-200 dark:border-slate-800/30"}`} />
                          )}
                          <div>
                            <p className="font-sans font-medium text-sm text-slate-900 dark:text-white">
                              {doc.label}
                              {doc.requerido && <span className="text-red-500 ml-1">*</span>}
                            </p>
                            {uploadingDocs[doc.id] ? (
                              <span className="text-[10px] text-primary font-sans font-medium animate-pulse">Subiendo a base de datos...</span>
                            ) : isUploaded ? (
                              <span className="text-[10px] text-green-600 font-sans font-medium">Documento listo en expediente</span>
                            ) : null}
                          </div>
                        </div>

                        <div className="shrink-0 flex items-center gap-3">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => isUploaded ? handleRemoveDoc(doc.id) : handleAttachClick(doc.id)}
                            disabled={isSubmitting || uploadingDocs[doc.id]}
                            className={`rounded-full font-sans text-xs border-slate-200 dark:border-slate-800/20 hover:bg-slate-50 dark:bg-slate-950 hover:text-primary ${
                              isUploaded ? "border-green-600 text-green-700 bg-green-50/50 hover:bg-green-50" : ""
                            }`}
                          >
                            {uploadingDocs[doc.id] ? (
                              <>
                                <Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" />
                                Subiendo...
                              </>
                            ) : isUploaded ? (
                              <>
                                <X className="w-3.5 h-3.5 mr-1" />
                                Quitar
                              </>
                            ) : (
                              <>
                                <Upload className="w-3.5 h-3.5 mr-1" />
                                Adjuntar
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Nota de Alerta */}
              <div className="bg-slate-50 dark:bg-slate-950 border border-primary/20 rounded-2xl p-5 flex gap-3 shadow-card">
                <AlertCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  <p className="font-sans font-semibold text-slate-900 dark:text-white mb-1">Políticas de Privacidad e Integridad:</p>
                  <p>
                    Toda la información adjuntada será transferida de manera cifrada directamente a la base de datos de tu asesor inmobiliario. No se divulga con ninguna plataforma externa de terceros.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Botones de Navegación del Formulario */}
      <div className="flex justify-between items-center mt-8 gap-4 px-2">
        <Button
          type="button"
          variant="outline"
          onClick={handleBack}
          disabled={currentStep === 1 || isSubmitting}
          className="rounded-full px-6 border-slate-200 dark:border-slate-800/20 font-sans text-sm text-slate-500 dark:text-slate-400"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Anterior
        </Button>

        {currentStep < STEPS.length ? (
          <Button
            type="button"
            onClick={handleNext}
            disabled={isSubmitting}
            className="rounded-full px-8 bg-primary hover:bg-primary/90 font-sans text-sm text-white shadow-md hover:scale-105 transition-all duration-300"
          >
            Siguiente
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        ) : (
          <Button
            type="button"
            onClick={handleFormSubmit}
            disabled={isSubmitting}
            className="rounded-full px-8 bg-primary hover:bg-primary/90 font-sans text-sm text-white shadow-md hover:scale-[1.03] transition-all duration-300"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin text-white" />
                Enviando Expediente...
              </>
            ) : (
              <>
                <Check className="w-4 h-4 mr-2" />
                Enviar Solicitud
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
