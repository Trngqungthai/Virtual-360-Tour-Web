import Link from "next/link";
import {
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone
} from "lucide-react";
import { getLocalizedCategories, getLocalizedNavLinks, getTranslations } from "@/lib/copy";
import type { Locale } from "@/lib/locale";
import { getSiteSettings } from "@/lib/site-settings";

export async function Footer({ locale }: { locale: Locale }) {
  const navLinks = getLocalizedNavLinks(locale);
  const localizedCategories = getLocalizedCategories(locale);
  const t = getTranslations(locale);
  const settings = await getSiteSettings();
  const socialLinks = [
    { href: settings.socialLinks.facebook, icon: Facebook, label: "Facebook" },
    { href: settings.socialLinks.instagram, icon: Instagram, label: "Instagram" },
    { href: settings.socialLinks.linkedin, icon: Linkedin, label: "LinkedIn" }
  ].filter((item) => item.href.trim());

  return (
    <footer
      className="mt-20 border-t border-white/70 bg-slate-950 text-slate-200"
      id="contact"
    >
      <div className="container-shell grid gap-10 py-14 lg:grid-cols-[1.3fr_repeat(3,1fr)]">
        <div className="space-y-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-brand-300">
              Virtual 360
            </p>
            <h2 className="mt-3 text-3xl font-semibold text-white">
              {t.footer.headline}
            </h2>
          </div>
          <p className="max-w-md text-sm leading-7 text-slate-400">
            {t.footer.description}
          </p>
          {socialLinks.length ? (
            <div className="flex gap-3">
              {socialLinks.map((item) => (
              <a
                key={item.label}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-800 text-slate-300 hover:border-brand-400 hover:text-brand-300"
                href={item.href}
                rel="noreferrer"
                target="_blank"
              >
                <item.icon className="h-5 w-5" />
              </a>
              ))}
            </div>
          ) : null}
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-300">
            {t.footer.navigation}
          </h3>
          <div className="mt-5 flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                className="text-sm text-slate-400 hover:text-white"
                href={link.href}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-300">
            {t.footer.industries}
          </h3>
          <div className="mt-5 flex flex-col gap-3">
            {localizedCategories.map((category) => (
              <Link
                key={category.value}
                className="text-sm text-slate-400 hover:text-white"
                href={`/categories/${category.value}`}
              >
                {category.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-300">
            {t.footer.contact}
          </h3>
          <div className="mt-5 space-y-4 text-sm text-slate-400">
            <a
              className="flex items-start gap-3 hover:text-white"
              href={`tel:${settings.contact.phone}`}
            >
              <Phone className="mt-0.5 h-4 w-4" />
              <span>{settings.contact.phone}</span>
            </a>
            <a
              className="flex items-start gap-3 hover:text-white"
              href={`mailto:${settings.contact.email}`}
            >
              <Mail className="mt-0.5 h-4 w-4" />
              <span>{settings.contact.email}</span>
            </a>
            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-4 w-4" />
              <span>{settings.contact.address}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-900">
        <div className="container-shell flex flex-col gap-3 py-5 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Virtual 360. {t.footer.rights}</p>
          <p>{t.footer.legal}</p>
        </div>
      </div>
    </footer>
  );
}
