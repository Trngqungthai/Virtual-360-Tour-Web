import { AdminShell } from "@/components/admin/admin-shell";
import { requireAdminSession } from "@/lib/auth";
import { getLocale } from "@/lib/locale-server";

export default async function DashboardLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  await requireAdminSession();
  const locale = await getLocale();

  return <AdminShell locale={locale}>{children}</AdminShell>;
}
