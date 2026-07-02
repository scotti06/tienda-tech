import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FloatingActions } from "@/components/layout/FloatingActions";
import { WhatsAppAssistantProvider } from "@/components/layout/WhatsAppAssistantContext";
import { CartProvider } from "@/components/cart/CartProvider";
import { CartDrawer } from "@/components/layout/CartDrawer";
import { getAdminSession } from "@/lib/admin/session";

type StoreShellProps = {
  children: React.ReactNode;
  /** En la home el hero ya reserva espacio superior */
  withTopPadding?: boolean;
};

export async function StoreShell({
  children,
  withTopPadding = true,
}: StoreShellProps) {
  const adminSession = await getAdminSession();

  return (
    <WhatsAppAssistantProvider>
      <CartProvider>
        <Navbar isAdminAuthenticated={Boolean(adminSession)} />
        <div className={withTopPadding ? "pt-[4.75rem] sm:pt-[5.25rem]" : ""}>
          {children}
        </div>
        <Footer />
        <FloatingActions />
        <CartDrawer />
      </CartProvider>
    </WhatsAppAssistantProvider>
  );
}
