import { Button } from "@/components/ui/Button";
import {
  getStoreMapEmbedUrl,
  storeLocation,
} from "@/lib/store-location";

function LocationDetail({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <dt className="text-xs font-semibold tracking-[0.12em] text-[var(--brand-cyan)] uppercase">
        {label}
      </dt>
      <dd className="mt-1.5 text-sm leading-relaxed text-white md:text-base">
        {value}
      </dd>
    </div>
  );
}

export function StoreLocationSection() {
  const mapEmbedUrl = getStoreMapEmbedUrl();

  return (
    <section
      aria-labelledby="store-location-heading"
      className="mt-8 rounded-2xl border border-white/[0.08] glass-card p-6 md:p-8"
    >
      <h2
        id="store-location-heading"
        className="text-lg font-semibold text-white md:text-xl"
      >
        {storeLocation.sectionTitle}
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-[var(--muted)] md:text-base">
        {storeLocation.description}
      </p>

      <dl className="mt-6 grid gap-5 sm:grid-cols-2 md:grid-cols-3">
        <LocationDetail label="Dirección" value={storeLocation.address} />
        <LocationDetail label="País" value={storeLocation.country} />
        <LocationDetail
          label="Horario de atención"
          value={storeLocation.businessHours}
        />
      </dl>

      <div className="mt-8 overflow-hidden rounded-2xl border border-white/[0.08]">
        <iframe
          title="Ubicación del local Techstylebv en Google Maps"
          src={mapEmbedUrl}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
          className="block h-[320px] w-full border-0 sm:h-[400px] md:h-[480px]"
        />
      </div>

      <div className="mt-6 flex justify-center sm:justify-start">
        <Button
          href={storeLocation.directionsUrl}
          variant="primary"
          size="md"
          className="w-full sm:w-auto"
        >
          Cómo llegar
        </Button>
      </div>
    </section>
  );
}
