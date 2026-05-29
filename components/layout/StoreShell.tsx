import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FloatingActions } from "@/components/layout/FloatingActions";

type StoreShellProps = {
  children: React.ReactNode;
  /** En la home el hero ya reserva espacio superior */
  withTopPadding?: boolean;
};

export function StoreShell({
  children,
  withTopPadding = true,
}: StoreShellProps) {
  return (
    <>
      <Navbar />
      <div className={withTopPadding ? "pt-[4.75rem] sm:pt-[5.25rem]" : ""}>
        {children}
      </div>
      <Footer />
      <FloatingActions />
    </>
  );
}
