import { useSiteUser } from '@/hooks/useSiteUser';
import { buildWhatsAppUrl, normalizeWhatsAppNumber } from '@/lib/cbf';

const WhatsAppButton = () => {
  const { user } = useSiteUser();
  const number = normalizeWhatsAppNumber(user?.telefono_usuario);

  if (!number) return null;

  return (
    <a
      href={buildWhatsAppUrl(user?.telefono_usuario)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl transition-transform duration-300 hover:scale-110 active:scale-95"
    >
      <svg viewBox="0 0 24 24" className="h-7 w-7 fill-current" aria-hidden="true">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
        <path d="M12.004 2C6.486 2 2 6.486 2 12.004c0 1.763.46 3.482 1.334 4.998L2 22l5.12-1.343A9.956 9.956 0 0012.004 22C17.52 22 22 17.516 22 12.004S17.52 2 12.004 2zm0 18.18a8.13 8.13 0 01-4.145-1.135l-.298-.177-3.038.797.811-2.963-.194-.305a8.13 8.13 0 01-1.32-4.393 8.194 8.194 0 018.184-8.184 8.194 8.194 0 018.176 8.184 8.194 8.194 0 01-8.176 8.176z"/>
      </svg>
    </a>
  );
};

export default WhatsAppButton;
