import { settings } from "@/data/settings";
import { cn } from "@/lib/utils";

/**
 * "Cómo llegar": abre la ruta hasta el colegio en Google Maps, Waze o Uber. Usa el texto de búsqueda del mapa
 * (Datos del colegio → Ubicación), así que si cambia la dirección se actualizan solos.
 */
export default function Directions({ className }: { className?: string }) {
  const q = settings.location.mapQuery || [settings.location.address, settings.location.district, settings.location.province].filter(Boolean).join(", ");
  if (!q) return null;
  const e = encodeURIComponent(q);
  const items = [
    { label: "Google Maps", icon: "📍", href: `https://www.google.com/maps/dir/?api=1&destination=${e}&travelmode=driving` },
    { label: "Waze", icon: "🚗", href: `https://waze.com/ul?q=${e}&navigate=yes` },
    { label: "Uber", icon: "🚕", href: `https://m.uber.com/ul/?action=setPickup&pickup=my_location&dropoff[formatted_address]=${e}&dropoff[nickname]=${encodeURIComponent(settings.shortName)}` },
  ];
  return (
    <div className={cn("flex flex-wrap items-center gap-3", className)}>
      <span className="text-sm font-semibold text-niebla">Cómo llegar:</span>
      {items.map((item) => (
        <a
          key={item.label}
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          data-spark
          className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-noche/25 bg-white px-5 text-[15px] font-semibold text-noche transition-colors hover:border-noche hover:bg-noche hover:text-white"
        >
          <span aria-hidden="true">{item.icon}</span>
          {item.label}
        </a>
      ))}
    </div>
  );
}
