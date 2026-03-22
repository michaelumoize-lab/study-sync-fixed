// app/(marketing)/layout.tsx
import MarketingNavbar from "@/components/Shared/MarketingNavbar";
import ScrollToTop from "@/components/Shared/ScrollToTop";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ScrollToTop />
      <MarketingNavbar />
      <main>{children}</main>
    </>
  );
}
