"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, LayoutDashboard, PlusCircle, Settings } from "lucide-react";
import { getAdminText } from "@/lib/admin-text";
import type { Locale } from "@/lib/locale";

export function AdminNav({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const t = getAdminText(locale);

  const links = [
    {
      href: "/admin/dashboard",
      label: t.layout.dashboardTab,
      icon: LayoutDashboard
    },
    {
      href: "/admin/dashboard/new",
      label: t.layout.addTourTab,
      icon: PlusCircle
    },
    {
      href: "/admin/analytics",
      label: t.layout.analyticsTab,
      icon: BarChart3
    },
    {
      href: "/admin/settings",
      label: t.layout.settingsTab,
      icon: Settings
    }
  ];

  return (
    <nav className="flex flex-wrap items-center gap-3">
      {links.map((link) => {
        const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
        const Icon = link.icon;

        return (
          <Link
            className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold ${
              active
                ? "border-brand-600 bg-brand-600 text-white shadow-lg shadow-brand-600/20"
                : "border-slate-200 bg-white text-slate-700 hover:border-brand-200 hover:text-brand-700"
            }`}
            href={link.href}
            key={link.href}
          >
            <Icon className="h-4 w-4" />
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
