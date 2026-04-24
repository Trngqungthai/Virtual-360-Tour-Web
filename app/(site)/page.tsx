import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  Headphones,
  Share2,
  SlidersHorizontal,
  Sparkles
} from "lucide-react";
import { TourCard } from "@/components/tours/tour-card";
import { Reveal } from "@/components/ui/reveal";
import { siteConfig } from "@/lib/constants";
import {
  getLocalizedCategories,
  getLocalizedWhyChooseUs,
  getTranslations
} from "@/lib/copy";
import { getLocale } from "@/lib/locale-server";
import { getLocalizedHeroStats, getSiteSettings } from "@/lib/site-settings";
import { getAllTours, getFeaturedTours } from "@/lib/tours";

const whyChooseUsIcons = [
  Sparkles,
  SlidersHorizontal,
  Share2,
  BarChart3,
  Headphones
];

export default async function HomePage() {
  const locale = await getLocale();
  const t = getTranslations(locale);
  const categories = getLocalizedCategories(locale);
  const whyChooseUs = getLocalizedWhyChooseUs(locale);
  const settings = await getSiteSettings();
  const heroStats = getLocalizedHeroStats(settings, locale);
  const [allTours, featuredTours] = await Promise.all([getAllTours(), getFeaturedTours(4)]);

  const countsByCategory = allTours.reduce<Record<string, number>>((accumulator, tour) => {
    accumulator[tour.category] = (accumulator[tour.category] ?? 0) + 1;
    return accumulator;
  }, {});

  return (
    <>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            alt={
              locale === "vi"
                ? "Khu nghỉ dưỡng sang trọng được dùng làm ảnh nền cho tour 360"
                : "Luxury resort featured in a virtual 360 tour"
            }
            className="object-cover"
            fill
            priority
            sizes="100vw"
            src="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=2000&q=80"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(2,6,23,0.88)_0%,rgba(2,6,23,0.72)_40%,rgba(2,6,23,0.34)_100%)]" />
        </div>

        <div className="container-shell relative grid gap-10 py-16 sm:py-24 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-28">
          <Reveal className="max-w-3xl">
            <span className="inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-white/90 backdrop-blur-sm">
              {t.home.heroBadge}
            </span>
            <h1 className="mt-6 text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
              {t.home.heroTitle}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-200">
              {t.home.heroDescription}
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link className="primary-button" href="/tours">
                {t.home.viewTours}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                className="secondary-button border-white/40 bg-white/10 text-white hover:bg-white hover:text-slate-950"
                href="/#contact"
              >
                {t.home.consultation}
              </Link>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {heroStats.map((item) => (
                <div
                  className="rounded-[24px] border border-white/15 bg-white/10 p-4 backdrop-blur-sm"
                  key={item.label}
                >
                  <p className="text-2xl font-semibold text-white">{item.value}</p>
                  <p className="mt-1 text-sm text-slate-300">{item.label}</p>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal className="lg:pl-8" delay={120}>
            <div className="surface-card overflow-hidden border border-white/20 bg-white/10 p-4 text-white backdrop-blur-md">
              <div className="flex items-center justify-between gap-4 px-2 pb-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.28em] text-brand-200">
                    {t.home.livePreview}
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold">{t.home.previewTitle}</h2>
                </div>
                <div className="hidden rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-slate-100 sm:flex">
                  {t.home.arVr}
                </div>
              </div>

              <div className="overflow-hidden rounded-[28px] border border-white/15 bg-slate-950/40 shadow-soft">
                <iframe
                  allowFullScreen
                  className="aspect-video w-full"
                  key={settings.heroPreviewUrl}
                  src={settings.heroPreviewUrl}
                  title="Featured 360 resort preview"
                />
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {t.home.previewBullets.map((item) => (
                  <div
                    className="rounded-[24px] border border-white/15 bg-white/10 px-4 py-3 text-sm text-slate-100"
                    key={item}
                  >
                    <BadgeCheck className="mb-2 h-4 w-4 text-brand-200" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="container-shell py-16 sm:py-20" id="industries">
        <Reveal>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="section-kicker">{t.home.industriesKicker}</p>
              <h2 className="section-title mt-4">{t.home.industriesTitle}</h2>
            </div>
            <p className="max-w-2xl text-sm leading-7 text-slate-600">
              {t.home.industriesDescription}
            </p>
          </div>
        </Reveal>

        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-5">
          {categories.map((category, index) => (
            <Reveal className="h-full" delay={index * 80} key={category.value}>
              <Link
                className="surface-card group flex h-full flex-col overflow-hidden border border-slate-200/80 bg-white transition hover:-translate-y-1"
                href={`/categories/${category.value}`}
              >
                <div className="relative aspect-[5/4] overflow-hidden">
                  <Image
                    alt={category.label}
                    className="object-cover transition duration-700 group-hover:scale-105"
                    fill
                    sizes="(max-width: 1280px) 50vw, 20vw"
                    src={category.image}
                  />
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <span className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-600">
                    {category.eyebrow}
                  </span>
                  <h3 className="mt-3 text-xl font-semibold text-slate-950">{category.label}</h3>
                  <p className="mt-3 flex-1 text-sm leading-7 text-slate-600">
                    {category.description}
                  </p>
                  <div className="mt-5 flex items-center justify-between text-sm font-semibold text-brand-700">
                    <span>
                      {countsByCategory[category.value] ?? 0} {t.home.categoryCountLabel}
                    </span>
                    <span className="inline-flex items-center gap-2">
                      {t.home.explore}
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="container-shell py-6 sm:py-10" id="featured">
        <Reveal>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="section-kicker">{t.home.featuredKicker}</p>
              <h2 className="section-title mt-4">{t.home.featuredTitle}</h2>
            </div>
            <Link className="secondary-button" href="/tours">
              {t.home.browseAllTours}
            </Link>
          </div>
        </Reveal>

        <div className="mt-10 grid gap-6 lg:grid-cols-2 xl:grid-cols-4">
          {featuredTours.map((tour, index) => (
            <Reveal delay={index * 90} key={tour.id}>
              <TourCard locale={locale} priority={index < 2} tour={tour} />
            </Reveal>
          ))}
        </div>
      </section>

      <section className="container-shell py-16 sm:py-20">
        <Reveal>
          <div className="surface-card border border-blue-100/80 bg-gradient-to-br from-white to-blue-50 p-8 sm:p-10">
            <div className="text-center">
              <p className="section-kicker">{t.home.whyChooseUsKicker}</p>
              <h2 className="section-title mt-4">{t.home.whyChooseUsTitle}</h2>
            </div>

            <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-5">
              {whyChooseUs.map((item, index) => {
                const Icon = whyChooseUsIcons[index];

                return (
                  <div
                    className="rounded-[24px] border border-white/80 bg-white/80 p-5 text-center shadow-[0_18px_60px_-42px_rgba(15,23,42,0.5)]"
                    key={item.title}
                  >
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="mt-5 text-lg font-semibold text-slate-950">{item.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-slate-600">{item.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </Reveal>
      </section>

      <section className="container-shell pb-4 sm:pb-10">
        <Reveal>
          <div className="overflow-hidden rounded-[36px] bg-slate-950 px-6 py-10 text-white shadow-soft sm:px-10">
            <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
              <div>
                <p className="section-kicker !text-brand-300">{t.home.ctaKicker}</p>
                <h2 className="mt-4 text-3xl font-semibold sm:text-4xl">{t.home.ctaTitle}</h2>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">
                  {t.home.ctaDescription}
                </p>
              </div>
              <div className="flex flex-wrap gap-3 lg:justify-end">
                <a className="primary-button" href={`mailto:${settings.contact.email}`}>
                  {t.home.contactNow}
                </a>
                <Link
                  className="secondary-button border-white/20 bg-white/5 text-white hover:bg-white hover:text-slate-950"
                  href="/tours"
                >
                  {t.home.viewPortfolio}
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
