import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, MapPin } from "lucide-react";
import { notFound } from "next/navigation";
import { TourCard } from "@/components/tours/tour-card";
import { TourDetailAnalytics } from "@/components/tours/tour-detail-analytics";
import { Reveal } from "@/components/ui/reveal";
import { getTranslations, getLocalizedCategoryLabel } from "@/lib/copy";
import { getLocale } from "@/lib/locale-server";
import { getAllTours, getTourBySlug } from "@/lib/tours";

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tour = await getTourBySlug(slug);

  if (!tour) {
    return {
      title: "Tour Not Found"
    };
  }

  return {
    title: tour.title,
    description: tour.description
  };
}

export default async function TourDetailPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const locale = await getLocale();
  const t = getTranslations(locale);
  const { slug } = await params;
  const tour = await getTourBySlug(slug);

  if (!tour) {
    notFound();
  }

  const relatedTours = (await getAllTours())
    .filter((item) => item.id !== tour.id && item.category === tour.category)
    .slice(0, 3);

  return (
    <div className="container-shell py-14 sm:py-16">
      <Reveal>
        <Link className="secondary-button" href="/tours">
          <ArrowLeft className="h-4 w-4" />
          {t.tourDetail.backToTours}
        </Link>
      </Reveal>

      <section className="mt-6 grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <Reveal>
          <div className="surface-card overflow-hidden border border-slate-200/80 bg-white">
            <div className="relative aspect-video overflow-hidden bg-slate-100">
              <Image
                alt={tour.title}
                className="object-contain p-4"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                src={tour.thumbnail}
              />
              <div className="absolute left-6 top-6 rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-brand-700">
                {getLocalizedCategoryLabel(tour.category, locale)}
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={90}>
          <div className="surface-card h-full border border-slate-200/80 bg-white p-8 sm:p-10">
            <p className="section-kicker">{t.tourDetail.kicker}</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950">
              {tour.title}
            </h1>
            <div className="mt-5 flex items-center gap-2 text-sm text-slate-500">
              <MapPin className="h-4 w-4" />
              <span>{tour.location}</span>
            </div>
            <p className="mt-6 text-sm leading-8 text-slate-600">{tour.description}</p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {tour.projectDetails.map((item) => (
                <div
                  className="rounded-[24px] border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-700"
                  key={item}
                >
                  {item}
                </div>
              ))}
            </div>

            <TourDetailAnalytics
              exploreLabel={t.home.explore}
              panoramaLabel={t.tourDetail.openEmbed}
              tour={{
                id: tour.id,
                slug: tour.slug,
                title: tour.title,
                embedUrl: tour.embedUrl,
                projectUrl: tour.projectUrl
              }}
            />
          </div>
        </Reveal>
      </section>

      <section className="mt-10">
        <Reveal>
          <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
            <div className="surface-card border border-slate-200/80 bg-white p-4 sm:p-6">
              <div className="mb-4">
                <p className="section-kicker">{t.tourDetail.embeddedViewer}</p>
                <h2 className="mt-4 text-3xl font-semibold text-slate-950">
                  {tour.title}
                </h2>
              </div>
              <div className="overflow-hidden rounded-[28px] border border-slate-200">
                <iframe
                  allowFullScreen
                  className="aspect-video w-full"
                  src={tour.embedUrl}
                  title={`${tour.title} ${t.tourDetail.previewFrameTitle}`}
                />
              </div>
            </div>

            <div className="surface-card border border-slate-200/80 bg-white p-4 sm:p-6">
              <div className="mb-4">
                <p className="section-kicker">{t.tourDetail.locationMap}</p>
                <h2 className="mt-4 text-3xl font-semibold text-slate-950">
                  {t.tourDetail.locationMapTitle}
                </h2>
              </div>
              <div className="overflow-hidden rounded-[28px] border border-slate-200">
                <iframe
                  allowFullScreen
                  className="aspect-video w-full"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  src={tour.mapEmbedUrl}
                  title={`${tour.title} Google Maps`}
                />
              </div>
              <p className="mt-4 text-sm leading-7 text-slate-500">{tour.location}</p>
            </div>
          </div>
        </Reveal>
      </section>

      {tour.gallery?.length ? (
        <section className="mt-10">
          <Reveal>
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="section-kicker">{t.tourDetail.gallery}</p>
                <h2 className="section-title mt-4">{t.tourDetail.galleryTitle}</h2>
              </div>
            </div>
            <div className="mt-6 grid gap-6 md:grid-cols-3">
              {tour.gallery.slice(0, 3).map((image, index) => (
                <div
                  className="surface-card overflow-hidden border border-slate-200/80 bg-white"
                  key={image}
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      alt={`${tour.title} gallery image ${index + 1}`}
                      className="object-cover"
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      src={image}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </section>
      ) : null}

      <section className="mt-10">
        <Reveal>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="section-kicker">{t.tourDetail.relatedTours}</p>
              <h2 className="section-title mt-4">{t.tourDetail.relatedTitle}</h2>
            </div>
            <Link className="secondary-button" href={`/categories/${tour.category}`}>
              {t.tourDetail.viewCategory}
            </Link>
          </div>
          <div className="mt-6 grid gap-6 lg:grid-cols-3">
            {relatedTours.map((item) => (
              <TourCard key={item.id} locale={locale} tour={item} />
            ))}
          </div>
        </Reveal>
      </section>
    </div>
  );
}
