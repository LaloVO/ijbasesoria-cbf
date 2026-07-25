import React, { useState, useEffect, useRef } from "react";
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
  Image as ImageIcon,
  Home,
  DollarSign,
  MapPin,
  FileText,
  Upload,
  X,
  Check,
  CheckCircle,
  Layers,
  BedDouble,
  Bath,
  Car,
  Maximize,
  Building2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useSiteUser } from "@/hooks/useSiteUser";
import {
  uploadSellerFile,
  submitSellerInquiry,
  insertSellerImages,
  insertSellerDocuments,
  insertSellerAmenidades,
  fetchEstados,
  fetchCiudadesByEstado,
  fetchAmenidades,
  geocodeAddress,
} from "@/lib/sellerInquiry";

// ─── Constants ─────────────────────────────────────────────────────────────

const STORAGE_KEY = "cbf-seller-funnel-draft-raquel";

const TIPOS_PROPIEDAD = [
  { id: 1, label: "Casa" },
  { id: 2, label: "Departamento" },
  { id: 3, label: "Terreno" },
  { id: 4, label: "Oficina" },
  { id: 5, label: "Local Comercial" },
  { id: 6, label: "Bodega" },
  { id: 7, label: "Loft" },
  { id: 8, label: "Lote" },
  { id: 9, label: "Nave Industrial" },
];

const TIPOS_ACCION = [
  { id: 1, label: "Venta" },
  { id: 2, label: "Renta" },
  { id: 3, label: "Traspaso" },
  { id: 4, label: "Pre-Venta" },
  { id: 5, label: "Aportación" },
  { id: 6, label: "Remate" },
  { id: 7, label: "Permuta" },
];

const TIPOS_RESIDENCIALES = new Set([1, 2, 7]); // Casa, Departamento, Loft
const TIPOS_COMERCIALES = new Set([4, 5]); // Oficina, Local Comercial
const TIPOS_INDUSTRIALES = new Set([6, 9]); // Bodega, Nave Industrial

const IDS_AMENIDADES_RESIDENCIALES = new Set([
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17,
  21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34,
  101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117,
]);
const IDS_AMENIDADES_COMERCIALES = new Set([
  18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 114, 115, 116, 117,
]);
const IDS_AMENIDADES_INDUSTRIALES = new Set([
  21, 22, 23, 24, 35, 36, 37, 38, 39, 114,
]);

const REQUIRED_DOCS = [
  { id: "escritura", label: "Escritura pública" },
  { id: "cedula_catastral", label: "Cédula catastral" },
  { id: "planos", label: "Planos" },
  { id: "usos_suelo", label: "Permiso de usos de suelo" },
  { id: "libertad_gravamen", label: "Certificado de Libertad de Gravamen" },
  { id: "carta_adeudo", label: "Carta adeudo" },
  { id: "identificacion", label: "Identificación oficial del vendedor" },
  { id: "comprobante_domicilio", label: "Comprobante de domicilio" },
  { id: "liberacion_credito", label: "Carta liberación de crédito" },
  { id: "predial", label: "Constancia predial" },
  { id: "avaluo", label: "Avalúo catastral" },
  { id: "antiguedad", label: "Constancia de Antigüedad" },
];

const INHERITANCE_DOCS = [
  { id: "testamento", label: "Testamento" },
  { id: "declaracion_herederos", label: "Declaración de herederos" },
  { id: "cert_defuncion", label: "Certificado de defunción" },
  { id: "acta_aceptacion", label: "Acta de aceptación de herencia" },
];

export const STEPS = [
  { id: 1, title: "Contacto", icon: User },
  { id: 2, title: "Imágenes", icon: ImageIcon },
  { id: 3, title: "Características", icon: Home },
  { id: 4, title: "Descripciones", icon: FileText },
  { id: 5, title: "Documentos", icon: Layers },
];

// ─── Zod schema ─────────────────────────────────────────────────────────────

const fullSchema = z.object({
  nombre_completo: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  email: z.string().email("Ingresa un email válido"),
  telefono: z.string().min(10, "El teléfono debe tener al menos 10 dígitos"),
  id_tipo_accion: z.number({ required_error: "Selecciona el tipo de operación" }).min(1, "Selecciona el tipo de operación"),
  id_tipo_propiedad: z.number({ required_error: "Selecciona el tipo de propiedad" }).min(1),
  precio_propiedad: z.number({ required_error: "Ingresa el precio" }).positive(),
  id_estado: z.number({ required_error: "Selecciona el estado" }).min(1),
  id_ciudad: z.number({ required_error: "Selecciona la ciudad" }).min(1),
  direccion: z.string().min(5, "Ingresa la dirección completa"),
  titulo_propiedad: z.string().optional(),
  colonia: z.string().optional(),
  codigo_postal: z.string().optional(),
  area_propiedad: z.number().positive().optional(),
  area_construida: z.number().positive().optional(),
  habitaciones_propiedad: z.number().int().min(0).optional(),
  banios_propiedad: z.number().min(0).optional(),
  estacionamientos_propiedad: z.number().int().min(0).optional(),
  numero_plantas: z.number().int().min(0).optional(),
  referencias: z.string().optional(),
  descripcion_propiedad: z.string().min(30, "Describe la propiedad con al menos 30 caracteres"),
  descripcion_estado_propiedad: z.string().optional(),
  descripcion_inversion_propiedad: z.string().optional(),
  documentos_urls: z.record(z.string()).optional(),
});

type FormData = z.infer<typeof fullSchema>;

interface PropertyImage {
  id: string;
  file: File;
  previewUrl: string;
}

interface FormularioProps {
  currentStep?: number;
  onStepChange?: (step: number) => void;
}

// ─── Component ──────────────────────────────────────────────────────────────

export default function FormularioVenderPropiedad({ currentStep: externalStep, onStepChange }: FormularioProps) {
  const { user, site } = useSiteUser();
  const mapboxToken = (site?.platform_config?.mapbox_token ?? "").trim();

  const [internalStep, setInternalStep] = useState(1);
  const currentStep = externalStep ?? internalStep;
  const setCurrentStep = (step: number | ((s: number) => number)) => {
    const nextStep = typeof step === 'function' ? step(currentStep) : step;
    setInternalStep(nextStep);
    if (onStepChange) onStepChange(nextStep);
  };
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [images, setImages] = useState<PropertyImage[]>([]);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const [estados, setEstados] = useState<{ id_estado: number; nombre_estado: string }[]>([]);
  const [ciudades, setCiudades] = useState<{ id_ciudad: number; nombre_ciudad: string }[]>([]);
  const [loadingCiudades, setLoadingCiudades] = useState(false);

  const [esHerencia, setEsHerencia] = useState(false);
  const [documentosUrls, setDocumentosUrls] = useState<Record<string, string>>({});
  const [uploadingDocs, setUploadingDocs] = useState<Record<string, boolean>>({});
  const [amenidades, setAmenidades] = useState<{ id_amenidad: number; nombre_amenidad: string }[]>([]);
  const [selectedAmenidades, setSelectedAmenidades] = useState<number[]>([]);

  const form = useForm<FormData>({
    resolver: zodResolver(fullSchema),
    mode: "onChange",
    defaultValues: {
      nombre_completo: "",
      email: "",
      telefono: "",
      titulo_propiedad: "",
      direccion: "",
      colonia: "",
      codigo_postal: "",
      referencias: "",
      descripcion_propiedad: "",
      descripcion_estado_propiedad: "",
      descripcion_inversion_propiedad: "",
      documentos_urls: {},
    },
  });

  const { register, formState: { errors }, setValue, watch, trigger } = form;

  // Draft persistence
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        Object.entries(parsed).forEach(([key, val]) => {
          setValue(key as keyof FormData, val as any);
        });
      }
    } catch {
      /* ignore */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const watchedValues = watch();
  useEffect(() => {
    try {
      const { documentos_urls, ...rest } = watchedValues;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(rest));
    } catch {
      /* ignore */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(watchedValues)]);

  useEffect(() => {
    fetchEstados().then(setEstados);
  }, []);

  useEffect(() => {
    fetchAmenidades().then(setAmenidades);
  }, []);

  const watchedEstado = watch("id_estado");
  useEffect(() => {
    if (!watchedEstado) return;
    setLoadingCiudades(true);
    setValue("id_ciudad", 0 as any);
    fetchCiudadesByEstado(watchedEstado)
      .then(setCiudades)
      .finally(() => setLoadingCiudades(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchedEstado]);

  // ─── Step navigation ───────────────────────────────────────────────────

  const validateCurrentStep = async (): Promise<boolean> => {
    if (currentStep === 1) return trigger(["nombre_completo", "email", "telefono"]);
    if (currentStep === 2) {
      const validOperacion = await trigger(["id_tipo_accion"]);
      if (!validOperacion) return false;
      if (images.length === 0) {
        toast.error("Agrega al menos una foto de la propiedad");
        return false;
      }
      return true;
    }
    if (currentStep === 3)
      return trigger(["id_tipo_propiedad", "precio_propiedad", "id_estado", "id_ciudad", "direccion"]);
    if (currentStep === 4) return trigger(["descripcion_propiedad"]);
    return true;
  };

  const handleNext = async () => {
    const valid = await validateCurrentStep();
    if (!valid) {
      toast.error("Por favor completa los campos obligatorios del paso actual.");
      return;
    }
    setCurrentStep((s) => Math.min(s + 1, 5));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBack = () => {
    setCurrentStep((s) => Math.max(s - 1, 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ─── Image handlers ────────────────────────────────────────────────────

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const newImages: PropertyImage[] = files.map((file) => ({
      id: `${Date.now()}_${Math.random()}`,
      file,
      previewUrl: URL.createObjectURL(file),
    }));
    setImages((prev) => [...prev, ...newImages]);
    if (imageInputRef.current) imageInputRef.current.value = "";
  };

  const handleRemoveImage = (id: string) => {
    setImages((prev) => {
      const img = prev.find((i) => i.id === id);
      if (img) URL.revokeObjectURL(img.previewUrl);
      return prev.filter((i) => i.id !== id);
    });
  };

  // ─── Document upload ───────────────────────────────────────────────────

  const handleDocUpload = async (e: React.ChangeEvent<HTMLInputElement>, docId: string) => {
    const file = e.target.files?.[0];
    if (!file || !user?.id) return;
    setUploadingDocs((prev) => ({ ...prev, [docId]: true }));
    try {
      const url = await uploadSellerFile(file, user.id, "seller-inquiry-docs");
      setDocumentosUrls((prev) => {
        const updated = { ...prev, [docId]: url };
        setValue("documentos_urls", updated);
        return updated;
      });
      toast.success("Documento subido correctamente.");
    } catch (err: any) {
      toast.error(err.message || "Error al subir el documento");
    } finally {
      setUploadingDocs((prev) => ({ ...prev, [docId]: false }));
    }
  };

  const handleRemoveDoc = (docId: string) => {
    setDocumentosUrls((prev) => {
      const copy = { ...prev };
      delete copy[docId];
      setValue("documentos_urls", copy);
      return copy;
    });
  };

  // ─── Final submit ──────────────────────────────────────────────────────

  const handleFormSubmit = async (data: FormData) => {
    if (!user?.id) {
      toast.error("No se pudo identificar a la asesora. Recarga la página.");
      return;
    }
    if (images.length === 0) {
      toast.error("Agrega al menos una foto de la propiedad");
      setCurrentStep(2);
      return;
    }

    setIsSubmitting(true);
    try {
      const estadoNombre = estados.find((e) => e.id_estado === data.id_estado)?.nombre_estado ?? "";
      const ciudadNombre = ciudades.find((c) => c.id_ciudad === data.id_ciudad)?.nombre_ciudad ?? "";

      const coords = mapboxToken
        ? await geocodeAddress(data.direccion, ciudadNombre, estadoNombre, mapboxToken)
        : null;

      const uploadedImages: { image_url: string; nombre_imagen: string; orden: number }[] = [];
      for (let i = 0; i < images.length; i++) {
        const url = await uploadSellerFile(images[i].file, user.id, "seller-inquiry-images");
        uploadedImages.push({ image_url: url, nombre_imagen: images[i].file.name, orden: i });
      }

      const allDocs = [...REQUIRED_DOCS, ...(esHerencia ? INHERITANCE_DOCS : [])];
      const uploadedDocs = allDocs
        .filter((d) => data.documentos_urls?.[d.id])
        .map((d) => ({
          nombre_documento: d.label,
          file_url: data.documentos_urls![d.id],
          required: false,
        }));

      const inquiry = await submitSellerInquiry({
        advisor_user_id: user.id,
        nombre_completo: data.nombre_completo,
        email: data.email,
        telefono: data.telefono,
        id_tipo_accion: data.id_tipo_accion,
        titulo_propiedad: data.titulo_propiedad || undefined,
        id_tipo_propiedad: data.id_tipo_propiedad,
        precio_propiedad: data.precio_propiedad,
        id_estado: data.id_estado,
        id_ciudad: data.id_ciudad,
        estado_nombre: estadoNombre,
        ciudad_nombre: ciudadNombre,
        codigo_postal: data.codigo_postal || undefined,
        colonia: data.colonia || undefined,
        direccion: data.direccion,
        referencias: data.referencias || undefined,
        latitud: coords?.lat ?? null,
        longitud: coords?.lng ?? null,
        area_propiedad: data.area_propiedad,
        area_construida: data.area_construida,
        habitaciones_propiedad: data.habitaciones_propiedad,
        banios_propiedad: data.banios_propiedad,
        estacionamientos_propiedad: data.estacionamientos_propiedad,
        numero_plantas: data.numero_plantas,
        descripcion_propiedad: data.descripcion_propiedad,
        descripcion_estado_propiedad: data.descripcion_estado_propiedad || undefined,
        descripcion_inversion_propiedad: data.descripcion_inversion_propiedad || undefined,
        es_herencia: esHerencia,
      });

      await Promise.all([
        insertSellerImages(inquiry.id, uploadedImages),
        insertSellerDocuments(inquiry.id, uploadedDocs),
        insertSellerAmenidades(inquiry.id, selectedAmenidades),
      ]);

      localStorage.removeItem(STORAGE_KEY);
      setSubmitted(true);
      setTimeout(() => {
        window.location.href = "/";
      }, 3000);
    } catch (err: any) {
      toast.error(err.message || "Ocurrió un error. Intenta nuevamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ─── Success screen ────────────────────────────────────────────────────

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-6 text-center">
        <div className="w-16 h-16 rounded-full bg-[#B76E4D]/10 border border-[#B76E4D]/25 flex items-center justify-center">
          <CheckCircle className="w-7 h-7 text-[#B76E4D]" />
        </div>
        <h2 className="font-serif text-3xl text-[#2E251E] font-medium">Solicitud enviada</h2>
        <p className="font-sans text-sm text-[#6E6259] max-w-md leading-relaxed">
          Recibimos los datos de tu propiedad. Raquel Meléndrez revisará tu expediente y se pondrá
          en contacto contigo muy pronto para presentarte una estrategia de venta personalizada.
        </p>
        <p className="text-[10px] uppercase tracking-widest text-[#6E6259]/50 font-sans">Redirigiendo al inicio…</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <form onSubmit={form.handleSubmit(handleFormSubmit)}>
        <div className="bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800/80 rounded-3xl p-6 md:p-10 shadow-card min-h-[460px] relative transition-all duration-300 text-left">
          {/* PASO 1: Contacto */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="text-left mb-8 space-y-1">
                <h2 className="font-sans text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">Tus Datos de Contacto</h2>
                <p className="font-sans text-sm text-slate-500 dark:text-slate-400">
                  ¿Cómo podemos localizarte para estructurar la venta o renta de tu propiedad?
                </p>
              </div>

              <div className="space-y-5 max-w-lg">
                <div className="space-y-2">
                  <Label className="font-sans text-xs uppercase tracking-wider font-extrabold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <User className="w-4 h-4 text-primary" />
                    Nombre Completo *
                  </Label>
                  <Input
                    placeholder="Ej: María Fernández"
                    {...register("nombre_completo")}
                    className={`rounded-xl bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus:border-primary font-sans text-sm ${
                      errors.nombre_completo ? "border-red-500" : ""
                    }`}
                  />
                  {errors.nombre_completo && (
                    <p className="text-xs text-red-500 font-sans">{errors.nombre_completo.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="font-sans text-xs uppercase tracking-wider font-extrabold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-primary" />
                    Correo Electrónico *
                  </Label>
                  <Input
                    type="email"
                    placeholder="ejemplo@correo.com"
                    {...register("email")}
                    className={`rounded-xl bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus:border-primary font-sans text-sm ${
                      errors.email ? "border-red-500" : ""
                    }`}
                  />
                  {errors.email && <p className="text-xs text-red-500 font-sans">{errors.email.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label className="font-sans text-xs uppercase tracking-wider font-extrabold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <Phone className="w-4 h-4 text-primary" />
                    Teléfono Móvil *
                  </Label>
                  <Input
                    type="tel"
                    placeholder="5512345678"
                    {...register("telefono")}
                    className={`rounded-xl bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus:border-primary font-sans text-sm ${
                      errors.telefono ? "border-red-500" : ""
                    }`}
                  />
                  {errors.telefono && <p className="text-xs text-red-500 font-sans">{errors.telefono.message}</p>}
                </div>
              </div>
            </div>
          )}

          {/* PASO 2: Operación y Fotos */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="text-left mb-8 space-y-1">
                <h2 className="font-sans text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">Operación y Fotografías</h2>
                <p className="font-sans text-sm text-slate-500 dark:text-slate-400">
                  Selecciona la modalidad de tu inmueble e integra las imágenes para su expediente.
                </p>
              </div>

              <div className="space-y-6 max-w-2xl">
                <div className="space-y-2">
                  <Label className="font-sans text-xs uppercase tracking-wider font-extrabold text-slate-700 dark:text-slate-300">Tipo de operación *</Label>
                  <Select
                    onValueChange={(val) => setValue("id_tipo_accion", Number(val), { shouldValidate: true })}
                    value={watch("id_tipo_accion") ? String(watch("id_tipo_accion")) : ""}
                  >
                    <SelectTrigger className="rounded-xl bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 font-sans text-sm">
                      <SelectValue placeholder="Selecciona el tipo de operación" />
                    </SelectTrigger>
                    <SelectContent>
                      {TIPOS_ACCION.map((a) => (
                        <SelectItem key={a.id} value={String(a.id)}>
                          {a.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.id_tipo_accion && (
                    <p className="text-xs text-red-500 font-sans">{errors.id_tipo_accion.message}</p>
                  )}
                </div>
                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleImageSelect}
                />
                <button
                  type="button"
                  onClick={() => imageInputRef.current?.click()}
                  className="w-full border-2 border-dashed border-slate-300 dark:border-slate-800 rounded-2xl p-8 flex flex-col items-center gap-3 hover:border-primary/60 hover:bg-primary/5 transition-all text-center"
                >
                  <Upload className="w-8 h-8 text-primary/80" />
                  <span className="text-sm text-slate-800 dark:text-slate-200 font-sans font-bold">
                    Seleccionar fotografías del inmueble
                  </span>
                  <span className="text-xs text-slate-400 font-sans">PNG, JPG, WEBP — múltiples imágenes permitidas</span>
                </button>

                {images.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {images.map((img, idx) => (
                      <div key={img.id} className="relative group aspect-square overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800">
                        <img src={img.previewUrl} alt={`Foto ${idx + 1}`} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(img.id)}
                            className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-white"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        {idx === 0 && (
                          <span className="absolute top-2 left-2 bg-[#B76E4D] text-white text-[9px] font-sans font-bold px-2 py-0.5 uppercase tracking-wide">
                            Principal
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* PASO 3: Características */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="text-center mb-8">
                <h2 className="font-serif text-3xl text-[#2E251E] font-medium">Características de la Propiedad</h2>
                <p className="font-sans text-sm text-[#6E6259] mt-2">
                  Datos clave para preparar la valuación de tu inmueble.
                </p>
              </div>

              <div className="space-y-5 max-w-2xl mx-auto">
                <div className="space-y-2">
                  <Label className="font-sans text-sm font-medium text-[#2E251E]">Título de la propiedad (opcional)</Label>
                  <Input
                    {...register("titulo_propiedad")}
                    placeholder="Ej. Casa en fraccionamiento privado"
                    className="rounded-full bg-white/50 border-[#6E6259]/20 focus:bg-white/95 focus:border-[#B76E4D]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="font-sans text-sm font-medium text-[#2E251E]">Tipo de propiedad *</Label>
                    <Select
                      onValueChange={(val) => setValue("id_tipo_propiedad", Number(val), { shouldValidate: true })}
                      value={watch("id_tipo_propiedad") ? String(watch("id_tipo_propiedad")) : ""}
                    >
                      <SelectTrigger className="rounded-full bg-white/50 border-[#6E6259]/20">
                        <SelectValue placeholder="Selecciona tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        {TIPOS_PROPIEDAD.map((t) => (
                          <SelectItem key={t.id} value={String(t.id)}>
                            {t.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.id_tipo_propiedad && (
                      <p className="text-xs text-red-500 font-sans">{errors.id_tipo_propiedad.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="font-sans text-sm font-medium text-[#2E251E] flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-[#B76E4D]" />
                      Precio (MXN) *
                    </Label>
                    <Input
                      type="number"
                      placeholder="3500000"
                      onChange={(e) => setValue("precio_propiedad", parseFloat(e.target.value) || 0, { shouldValidate: true })}
                      className="rounded-full bg-white/50 border-[#6E6259]/20 focus:bg-white/95 focus:border-[#B76E4D]"
                    />
                    {errors.precio_propiedad && (
                      <p className="text-xs text-red-500 font-sans">{errors.precio_propiedad.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="font-sans text-sm font-medium text-[#2E251E]">Estado *</Label>
                    <Select
                      onValueChange={(val) => setValue("id_estado", Number(val), { shouldValidate: true })}
                      value={watch("id_estado") ? String(watch("id_estado")) : ""}
                    >
                      <SelectTrigger className="rounded-full bg-white/50 border-[#6E6259]/20">
                        <SelectValue placeholder="Selecciona estado" />
                      </SelectTrigger>
                      <SelectContent>
                        {estados.map((e) => (
                          <SelectItem key={e.id_estado} value={String(e.id_estado)}>
                            {e.nombre_estado}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.id_estado && <p className="text-xs text-red-500 font-sans">{errors.id_estado.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label className="font-sans text-sm font-medium text-[#2E251E]">Ciudad *</Label>
                    <Select
                      disabled={!watch("id_estado") || loadingCiudades}
                      onValueChange={(val) => setValue("id_ciudad", Number(val), { shouldValidate: true })}
                      value={watch("id_ciudad") ? String(watch("id_ciudad")) : ""}
                    >
                      <SelectTrigger className="rounded-full bg-white/50 border-[#6E6259]/20">
                        <SelectValue
                          placeholder={loadingCiudades ? "Cargando…" : !watch("id_estado") ? "Primero elige estado" : "Selecciona ciudad"}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {ciudades.map((c) => (
                          <SelectItem key={c.id_ciudad} value={String(c.id_ciudad)}>
                            {c.nombre_ciudad}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.id_ciudad && <p className="text-xs text-red-500 font-sans">{errors.id_ciudad.message}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="font-sans text-sm font-medium text-[#2E251E] flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#B76E4D]" />
                    Dirección completa *
                  </Label>
                  <Input
                    {...register("direccion")}
                    placeholder="Calle, número, fraccionamiento"
                    className="rounded-full bg-white/50 border-[#6E6259]/20 focus:bg-white/95 focus:border-[#B76E4D]"
                  />
                  {errors.direccion && <p className="text-xs text-red-500 font-sans">{errors.direccion.message}</p>}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label className="font-sans text-xs font-medium text-[#6E6259]">Colonia</Label>
                    <Input {...register("colonia")} placeholder="Colonia" className="rounded-full bg-white/50 border-[#6E6259]/20" />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-sans text-xs font-medium text-[#6E6259]">Código postal</Label>
                    <Input {...register("codigo_postal")} placeholder="25000" className="rounded-full bg-white/50 border-[#6E6259]/20" />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-sans text-xs font-medium text-[#6E6259] flex items-center gap-1.5">
                      <Maximize className="w-3.5 h-3.5 text-[#B76E4D]" />
                      Área terreno (m²)
                    </Label>
                    <Input
                      type="number"
                      placeholder="200"
                      onChange={(e) => setValue("area_propiedad", parseFloat(e.target.value) || undefined)}
                      className="rounded-full bg-white/50 border-[#6E6259]/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-sans text-xs font-medium text-[#6E6259] flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-[#B76E4D]" />
                      Área construida (m²)
                    </Label>
                    <Input
                      type="number"
                      placeholder="150"
                      onChange={(e) => setValue("area_construida", parseFloat(e.target.value) || undefined)}
                      className="rounded-full bg-white/50 border-[#6E6259]/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-sans text-xs font-medium text-[#6E6259] flex items-center gap-1.5">
                      <BedDouble className="w-3.5 h-3.5 text-[#B76E4D]" />
                      Habitaciones
                    </Label>
                    <Input
                      type="number"
                      placeholder="3"
                      onChange={(e) => setValue("habitaciones_propiedad", parseInt(e.target.value) || undefined)}
                      className="rounded-full bg-white/50 border-[#6E6259]/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-sans text-xs font-medium text-[#6E6259] flex items-center gap-1.5">
                      <Bath className="w-3.5 h-3.5 text-[#B76E4D]" />
                      Baños
                    </Label>
                    <Input
                      type="number"
                      placeholder="2"
                      onChange={(e) => setValue("banios_propiedad", parseFloat(e.target.value) || undefined)}
                      className="rounded-full bg-white/50 border-[#6E6259]/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-sans text-xs font-medium text-[#6E6259] flex items-center gap-1.5">
                      <Car className="w-3.5 h-3.5 text-[#B76E4D]" />
                      Estacionamientos
                    </Label>
                    <Input
                      type="number"
                      placeholder="2"
                      onChange={(e) => setValue("estacionamientos_propiedad", parseInt(e.target.value) || undefined)}
                      className="rounded-full bg-white/50 border-[#6E6259]/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-sans text-xs font-medium text-[#6E6259]">Plantas / Niveles</Label>
                    <Input
                      type="number"
                      placeholder="2"
                      onChange={(e) => setValue("numero_plantas", parseInt(e.target.value) || undefined)}
                      className="rounded-full bg-white/50 border-[#6E6259]/20"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="font-sans text-sm font-medium text-[#2E251E]">Referencias adicionales (opcional)</Label>
                  <Textarea
                    {...register("referencias")}
                    placeholder="Referencias de ubicación, características especiales, etc."
                    rows={2}
                    className="bg-white/50 border-[#6E6259]/20 focus:bg-white/95 focus:border-[#B76E4D] rounded-2xl"
                  />
                </div>
              </div>
            </div>
          )}

          {/* PASO 4: Descripciones */}
          {currentStep === 4 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="text-center mb-8">
                <h2 className="font-serif text-3xl text-[#2E251E] font-medium">Descripción de la Propiedad</h2>
                <p className="font-sans text-sm text-[#6E6259] mt-2">
                  Cuéntanos sobre el inmueble para preparar el material de venta.
                </p>
              </div>

              <div className="space-y-5 max-w-2xl mx-auto">
                <div className="space-y-2">
                  <Label className="font-sans text-sm font-medium text-[#2E251E]">Descripción general *</Label>
                  <Textarea
                    {...register("descripcion_propiedad")}
                    placeholder="Describe las características principales de tu propiedad, qué la hace especial, ventajas del entorno, etc."
                    rows={4}
                    className={`bg-white/50 border-[#6E6259]/20 focus:bg-white/95 focus:border-[#B76E4D] rounded-2xl ${
                      errors.descripcion_propiedad ? "border-red-500" : ""
                    }`}
                  />
                  {errors.descripcion_propiedad && (
                    <p className="text-xs text-red-500 font-sans">{errors.descripcion_propiedad.message}</p>
                  )}
                </div>
                <div className="space-y-2 bg-[#FAF7F2]/60 border border-[#6E6259]/10 rounded-2xl p-5">
                  <Label className="font-sans text-sm font-medium text-[#2E251E]">
                    Estado / condición del inmueble (opcional)
                  </Label>
                  <Textarea
                    {...register("descripcion_estado_propiedad")}
                    placeholder="Estado de conservación, remodelaciones recientes, instalaciones, acabados…"
                    rows={3}
                    className="bg-white/70 border-[#6E6259]/20 focus:bg-white/95 focus:border-[#B76E4D] rounded-2xl"
                  />
                </div>
                <div className="space-y-2 bg-[#FAF7F2]/60 border border-[#B76E4D]/20 rounded-2xl p-5">
                  <Label className="font-sans text-sm font-medium text-[#2E251E]">
                    Potencial de inversión (opcional)
                  </Label>
                  <Textarea
                    {...register("descripcion_inversion_propiedad")}
                    placeholder="¿Podría rentarse? ¿Subdivisión posible? ¿Plusvalía de la zona?"
                    rows={3}
                    className="bg-white/70 border-[#6E6259]/20 focus:bg-white/95 focus:border-[#B76E4D] rounded-2xl"
                  />
                </div>
              </div>
            </div>
          )}

          {/* PASO 5: Documentos + Amenidades */}
          {currentStep === 5 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="text-center mb-8">
                <h2 className="font-serif text-3xl text-[#2E251E] font-medium">Expediente y Amenidades</h2>
                <p className="font-sans text-sm text-[#6E6259] mt-2">
                  Completa tu expediente cargando la documentación que tienes disponible.
                </p>
              </div>

              <div className="space-y-6 max-w-2xl mx-auto">
                {/* Herencia toggle */}
                <div className="bg-white rounded-2xl p-5 border border-[#6E6259]/15 shadow-card flex items-center justify-between gap-4">
                  <div>
                    <p className="font-sans font-semibold text-sm text-[#2E251E]">
                      ¿La propiedad es parte de una herencia?
                    </p>
                    <p className="text-xs text-[#6E6259] mt-0.5">
                      Se registrará como propiedad en proceso de herencia.
                    </p>
                  </div>
                  <Switch checked={esHerencia} onCheckedChange={setEsHerencia} className="data-[state=checked]:bg-primary" />
                </div>

                {/* Documents */}
                <div className="bg-[#FAF7F2]/60 border border-[#6E6259]/10 rounded-2xl p-5 md:p-6 space-y-3">
                  <h3 className="font-sans text-base font-semibold text-[#2E251E] flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary" />
                    Documentos a Disposición
                  </h3>
                  <div className="space-y-3">
                    {[...REQUIRED_DOCS, ...(esHerencia ? INHERITANCE_DOCS : [])].map((doc) => {
                      const uploaded = !!documentosUrls[doc.id];
                      const uploading = !!uploadingDocs[doc.id];
                      return (
                        <div
                          key={doc.id}
                          className="bg-white rounded-2xl p-4 border border-[#6E6259]/15 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-card hover:border-primary/30 transition-all duration-300"
                        >
                          <div className="flex items-center gap-3">
                            {uploading ? (
                              <Loader2 className="w-5 h-5 text-primary animate-spin shrink-0" />
                            ) : uploaded ? (
                              <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />
                            ) : (
                              <div className="w-5 h-5 rounded-full border-2 border-[#6E6259]/30 shrink-0" />
                            )}
                            <p className="font-sans font-medium text-sm text-[#2E251E]">{doc.label}</p>
                          </div>
                          <div className="shrink-0 flex items-center gap-3">
                            {uploaded && (
                              <button
                                type="button"
                                onClick={() => handleRemoveDoc(doc.id)}
                                className="text-[#6E6259]/50 hover:text-red-500 transition-colors"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            )}
                            <label className="cursor-pointer">
                              <input
                                type="file"
                                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                className="hidden"
                                onChange={(e) => handleDocUpload(e, doc.id)}
                                disabled={uploading}
                              />
                              <span
                                className={`inline-flex items-center gap-1 rounded-full font-sans text-xs px-3 py-1.5 border transition-colors ${
                                  uploading
                                    ? "border-[#6E6259]/20 text-[#6E6259]/40 cursor-wait"
                                    : uploaded
                                    ? "border-green-600 text-green-700 bg-green-50/50"
                                    : "border-[#6E6259]/20 text-[#6E6259] hover:border-[#B76E4D] hover:text-[#B76E4D]"
                                }`}
                              >
                                {uploading ? (
                                  <>
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" /> Subiendo
                                  </>
                                ) : uploaded ? (
                                  "Reemplazar"
                                ) : (
                                  <>
                                    <Upload className="w-3.5 h-3.5" /> Adjuntar
                                  </>
                                )}
                              </span>
                            </label>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Amenidades — filtradas por tipo de propiedad */}
                {(() => {
                  const tipoId = watch("id_tipo_propiedad");
                  let ids: Set<number> | null = null;
                  if (TIPOS_RESIDENCIALES.has(tipoId)) ids = IDS_AMENIDADES_RESIDENCIALES;
                  else if (TIPOS_COMERCIALES.has(tipoId)) ids = IDS_AMENIDADES_COMERCIALES;
                  else if (TIPOS_INDUSTRIALES.has(tipoId)) ids = IDS_AMENIDADES_INDUSTRIALES;
                  const lista = ids ? amenidades.filter((a) => ids!.has(a.id_amenidad)) : [];
                  if (!lista.length) return null;
                  return (
                    <div className="bg-white rounded-2xl p-5 md:p-6 border border-[#6E6259]/15 shadow-card space-y-3">
                      <h3 className="font-sans text-base font-semibold text-[#2E251E]">Amenidades</h3>
                      <p className="text-xs text-[#6E6259]">Selecciona las que apliquen a tu propiedad.</p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
                        {lista.map((am) => {
                          const selected = selectedAmenidades.includes(am.id_amenidad);
                          return (
                            <button
                              key={am.id_amenidad}
                              type="button"
                              onClick={() =>
                                setSelectedAmenidades((prev) =>
                                  selected ? prev.filter((id) => id !== am.id_amenidad) : [...prev, am.id_amenidad]
                                )
                              }
                              className={`text-left text-[10px] font-sans font-bold uppercase tracking-wider px-3 py-2 border transition-all ${
                                selected
                                  ? "border-[#B76E4D] bg-[#B76E4D]/5 text-[#B76E4D]"
                                  : "border-[#E9DDCF] text-[#6E6259] hover:border-[#B76E4D] hover:text-[#B76E4D]"
                              }`}
                            >
                              {selected ? "✓ " : "+ "}
                              {am.nombre_amenidad}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          )}
        </div>

        {/* Botones de Navegación */}
        <div className="flex justify-between items-center mt-8 gap-4 px-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 1 || isSubmitting}
            className="rounded-full px-6 border-slate-300 dark:border-slate-800 font-sans text-xs uppercase tracking-widest font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Anterior
          </Button>

          {currentStep < STEPS.length ? (
            <Button
              type="button"
              onClick={handleNext}
              disabled={isSubmitting}
              className="rounded-full px-8 bg-primary hover:bg-primary/90 font-sans text-xs uppercase tracking-widest font-extrabold text-white shadow-md hover:scale-105 transition-all duration-300"
            >
              Siguiente
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              type="submit"
              disabled={isSubmitting}
              className="rounded-full px-8 bg-primary hover:bg-primary/90 font-sans text-xs uppercase tracking-widest font-extrabold text-white shadow-md hover:scale-[1.03] transition-all duration-300"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin text-white" />
                  Enviando…
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
      </form>
    </div>
  );
}
