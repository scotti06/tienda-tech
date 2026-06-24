/** Datos del local físico — editar horarios y textos desde acá. */
export const storeLocation = {
  sectionTitle: "Nuestra Ubicación",
  description:
    "Visitá nuestro local y conocé todos nuestros productos Apple y accesorios.",
  address: "Av. Mattaldi 880, B1661 Bella Vista, Provincia de Buenos Aires.",
  country: "Argentina",
  /** Horario de atención visible en la página de contacto. */
  businessHours: "Lunes a viernes: 10:00 a 19:00 · Sábados: 10:00 a 14:00",
  mapQuery: "Av. Mattaldi 880, Bella Vista, Buenos Aires, Argentina",
  directionsUrl:
    "https://www.google.com/maps/search/?api=1&query=Av.+Mattaldi+880,+Bella+Vista,+Buenos+Aires,+Argentina",
} as const;

export function getStoreMapEmbedUrl(query = storeLocation.mapQuery): string {
  const params = new URLSearchParams({
    q: query,
    hl: "es",
    z: "16",
    output: "embed",
  });

  return `https://maps.google.com/maps?${params.toString()}`;
}
