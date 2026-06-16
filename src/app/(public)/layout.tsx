import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MobileNav from "@/components/layout/MobileNav";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      {/* Spacer to push content below the fixed header */}
      <div className="flex-1 flex flex-col min-h-screen">
        <main className="flex-1 pb-16 lg:pb-0">{children}</main>
      </div>
      <Footer />
      <MobileNav />
    </>
  );
}
