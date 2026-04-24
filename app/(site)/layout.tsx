import { Footer } from "@/components/site/footer";
import { Header } from "@/components/site/header";
import { getLocale } from "@/lib/locale-server";

export default async function SiteLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();

  return (
    <div className="relative min-h-screen">
      <Header locale={locale} />
      <main>{children}</main>
      <Footer locale={locale} />
    </div>
  );
}
