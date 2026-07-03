import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Button } from "@/components/ui/Button";
import { SimilarProductsCarousel } from "@/components/catalog/SimilarProductsCarousel";
import { ProductDetailContent } from "@/components/catalog/product-page/ProductDetailContent";
import { ProductGallery } from "@/components/catalog/product-page/ProductGallery";
import { VariantImageProvider } from "@/components/catalog/product-page/VariantImageContext";
import {
  ProductPaymentNote,
} from "@/components/catalog/product-page/ProductTrustBar";
import {
  ProductPurchasePanel,
  ProductStickyBar,
} from "@/components/catalog/product-page/ProductPurchasePanel";
import {
  getStockMessage,
  ProductStockBadge,
} from "@/components/catalog/product-page/ProductStockBadge";
import { formatPrice } from "@/lib/data";
import { TextScramble } from "@/components/ui/text-scramble";
import { getCategoryById } from "@/lib/catalog";
import type { StoreProduct } from "@/lib/store/types";
import { getProducts, getProductImages } from "@/lib/products";
import { getSimilarProducts } from "@/lib/home";
import { isSiliconeCaseProduct } from "@/lib/store/silicone-case-product";
import { isFundasProduct } from "@/lib/store/fundas-product";
import {
  getActiveProductModels,
  getActiveProductModelsWithVariants,
} from "@/lib/store/product-models";
import { getActiveProductVariants } from "@/lib/store/product-variants";

type ProductPageViewProps = {
  product: StoreProduct;
};

export async function ProductPageView({ product }: ProductPageViewProps) {
  const category = getCategoryById(product.categoryId);
  const similarProducts = getSimilarProducts(product, await getProducts());
  const images = getProductImages(product);
  const siliconeCase = isSiliconeCaseProduct(product);
  const fundasProduct = isFundasProduct(product);

  const iphoneModels = fundasProduct
    ? siliconeCase
      ? await getActiveProductModelsWithVariants(product.id).catch(() => [])
      : await getActiveProductModels(product.id).catch(() => [])
    : [];

  const colorVariants =
    siliconeCase && !fundasProduct
      ? await getActiveProductVariants(product.id).catch(() => [])
      : [];

  const hasPerModelColors = siliconeCase && fundasProduct;
  const hasColorVariants = hasPerModelColors
    ? iphoneModels.some((model) => (model.variants?.length ?? 0) > 0)
    : colorVariants.length > 0;
  const hasDiscount =
    product.originalPrice && product.originalPrice > product.price;

  return (
    <main className="pb-28 md:pb-20">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Breadcrumbs
          items={[
            { label: "Inicio", href: "/" },
            ...(category
              ? [{ label: category.name, href: category.path }]
              : []),
            { label: product.name },
          ]}
        />

        <VariantImageProvider>
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-12 xl:gap-16">
            <ProductGallery
              name={product.name}
              images={images}
              accent={product.accent}
              imageFrame={product.imageFrame}
              imageFrameFill={product.imageFrameFill ?? 0.85}
            />

            <div className="flex flex-col lg:pt-2">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-[11px] font-semibold tracking-[0.24em] text-[var(--brand-cyan)] uppercase">
                {product.category}
              </p>
              {product.brand && (
                <span className="rounded-full border border-white/[0.08] px-2.5 py-1 text-[10px] font-medium text-[var(--muted)]">
                  {product.brand}
                </span>
              )}
              {product.sku && (
                <span className="text-[10px] text-[var(--muted)]">
                  SKU: {product.sku}
                </span>
              )}
            </div>

            <h1 className="mt-4 text-3xl font-bold tracking-tight text-white md:text-[2.35rem] md:leading-tight">
              {product.name}
            </h1>

            {product.badge && (
              <p className="mt-3 inline-flex w-fit rounded-full bg-[var(--brand-purple)]/20 px-3 py-1 text-xs font-semibold text-[var(--brand-purple-soft)]">
                {product.badge}
              </p>
            )}

            <div className="mt-5">
              <ProductStockBadge stock={product.stock ?? 0} />
              <p className="mt-2 text-sm text-[var(--muted)]">
                {getStockMessage(product.stock ?? 0)}
              </p>
            </div>

            <div className="mt-8 space-y-2">
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <p className="text-3xl font-bold tracking-tight text-white md:text-4xl">
                  <TextScramble
                    variant="price"
                    text={formatPrice(product.price)}
                  />
                </p>
                {hasDiscount && (
                  <p className="text-lg text-[var(--muted)]">
                    <TextScramble
                      variant="price"
                      text={formatPrice(product.originalPrice!)}
                      className="line-through decoration-[var(--muted)]"
                    />
                  </p>
                )}
              </div>
            </div>

            <div className="mt-6">
              <ProductPurchasePanel
                product={product}
                colorVariants={colorVariants}
                iphoneModels={iphoneModels}
                colorsPerModel={hasPerModelColors}
              />
            </div>

            <div className="mt-4">
              <ProductPaymentNote price={product.price} />
            </div>
            </div>
          </div>
        </VariantImageProvider>

        <ProductDetailContent product={product} />

        {category && (
          <Button
            href={category.path}
            variant="inline-link"
            className="mt-10 text-sm font-medium hover:text-white"
          >
            ← Volver a {category.name}
          </Button>
        )}

        <SimilarProductsCarousel
          product={product}
          similarProducts={similarProducts}
        />
      </div>

      <ProductStickyBar
        product={product}
        hasColorVariants={hasColorVariants}
      />
    </main>
  );
}
