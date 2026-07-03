export const SILICONE_CASE_SLUG = "funda-iphone";
export const SILICONE_CASE_NAME = "Funda de silicona para iPhone";

export function isSiliconeCaseProduct(product: {
  slug?: string;
  name?: string;
}): boolean {
  const slug = product.slug?.trim().toLowerCase();
  const name = product.name?.trim();

  return (
    slug === SILICONE_CASE_SLUG || name === SILICONE_CASE_NAME
  );
}
