import type { Metadata } from "next";
import Link from "next/link";
import { Pagination } from "@/components/tours/pagination";
import { SearchBar } from "@/components/tours/search-bar";
import { TourCard } from "@/components/tours/tour-card";
import { Reveal } from "@/components/ui/reveal";
import { buildHref } from "@/lib/constants";
import { getLocalizedCategories, getTranslations } from "@/lib/copy";
import { getLocale } from "@/lib/locale-server";
import { getAllTours } from "@/lib/tours";

export const metadata: Metadata = {
  title: "Browse 360 Tours",
  description:
    "Explore interactive 360 tours across hospitality, education, apartments, resorts, and real estate."
};

const PAGE_SIZE = 6;

function matchesSearch(value: string, search: string) {
  return value.toLowerCase().includes(search.toLowerCase());
}

export default async function ToursPage({
  searchParams
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const locale = await getLocale();
  const t = getTranslations(locale);
  const categories = getLocalizedCategories(locale);
  const resolvedSearchParams = (await searchParams) ?? {};
  const search = typeof resolvedSearchParams.search === "string" ? resolvedSearchParams.search : "";
  const category =
    typeof resolvedSearchParams.category === "string" ? resolvedSearchParams.category : "";
  const requestedPage =
    typeof resolvedSearchParams.page === "string"
      ? Number.parseInt(resolvedSearchParams.page, 10)
      : 1;

  const allTours = await getAllTours();
  const filteredTours = allTours.filter((tour) => {
    const matchesCategory = category ? tour.category === category : true;
    const query = search.trim();
    const matchesQuery = query
      ? [tour.title, tour.location, tour.description, tour.category].some((value) =>
          matchesSearch(value, query)
        )
      : true;

    return matchesCategory && matchesQuery;
  });

  const totalPages = Math.max(1, Math.ceil(filteredTours.length / PAGE_SIZE));
  const page = Math.min(Math.max(requestedPage || 1, 1), totalPages);
  const visibleTours = filteredTours.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="container-shell py-14 sm:py-16">
      <Reveal>
        <div className="surface-card overflow-hidden border border-slate-200/80 bg-white p-8 sm:p-10">
          <p className="section-kicker">{t.toursPage.kicker}</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950">
            {t.toursPage.title}
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600">
            {t.toursPage.description}
          </p>

          <div className="mt-8">
            <SearchBar category={category} locale={locale} pathname="/tours" search={search} />
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              className={`rounded-full px-4 py-2 text-sm font-semibold ${
                !category
                  ? "bg-brand-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:text-slate-950"
              }`}
              href={buildHref("/tours", { search })}
            >
              {t.toursPage.all}
            </Link>
            {categories.map((item) => (
              <Link
                className={`rounded-full px-4 py-2 text-sm font-semibold ${
                  category === item.value
                    ? "bg-brand-600 text-white"
                    : "bg-slate-100 text-slate-600 hover:text-slate-950"
                }`}
                href={buildHref("/tours", { search, category: item.value })}
                key={item.value}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </Reveal>

      <Reveal className="mt-10" delay={90}>
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm text-slate-500">
            {t.toursPage.showing(visibleTours.length, filteredTours.length)}
          </p>
        </div>

        {visibleTours.length ? (
          <div className="mt-6 grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
            {visibleTours.map((tour, index) => (
              <TourCard key={tour.id} locale={locale} priority={index < 2} tour={tour} />
            ))}
          </div>
        ) : (
          <div className="surface-card mt-6 border border-dashed border-slate-300 bg-white p-10 text-center">
            <h2 className="text-2xl font-semibold text-slate-950">{t.toursPage.noToursTitle}</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              {t.toursPage.noToursDescription}
            </p>
          </div>
        )}

        <Pagination
          category={category}
          locale={locale}
          page={page}
          pathname="/tours"
          search={search}
          totalPages={totalPages}
        />
      </Reveal>
    </div>
  );
}
