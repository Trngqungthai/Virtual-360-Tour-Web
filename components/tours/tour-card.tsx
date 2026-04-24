import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, MapPin } from "lucide-react";
import { getLocalizedCategoryLabel, getTranslations } from "@/lib/copy";
import type { Locale } from "@/lib/locale";
import { type Tour } from "@/lib/tours";
import { TourPreviewModal } from "@/components/tours/tour-preview-modal";

export function TourCard({
  tour,
  locale,
  priority = false
}: {
  tour: Tour;
  locale: Locale;
  priority?: boolean;
}) {
  const t = getTranslations(locale);

  return (
    <article className="surface-card group overflow-hidden border border-slate-200/80 bg-white transition hover:-translate-y-1">
      <div className="relative aspect-video overflow-hidden bg-slate-100">
        <Image
          alt={tour.title}
          className="object-contain p-3 transition duration-700 group-hover:scale-[1.02]"
          fill
          priority={priority}
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          src={tour.thumbnail}
        />
        <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-brand-700 shadow-lg">
          {getLocalizedCategoryLabel(tour.category, locale)}
        </div>
      </div>

      <div className="space-y-4 p-5">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <MapPin className="h-4 w-4" />
          <span>{tour.location}</span>
        </div>
        <div>
          <h3 className="text-xl font-semibold text-slate-950">{tour.title}</h3>
          <p className="line-clamp-2 mt-2 text-sm leading-7 text-slate-600">
            {tour.description}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link className="primary-button !px-4 !py-2.5" href={`/tours/${tour.slug}`}>
            {t.tourCard.viewTour}
            <ArrowUpRight className="h-4 w-4" />
          </Link>
          <TourPreviewModal
            buttonLabel={t.tourCard.quickPreview}
            embedUrl={tour.embedUrl}
            locale={locale}
            location={tour.location}
            title={tour.title}
          />
        </div>
      </div>
    </article>
  );
}
