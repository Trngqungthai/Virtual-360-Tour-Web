import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Pagination } from "@/components/tours/pagination";
import { SearchBar } from "@/components/tours/search-bar";
import { TourCard } from "@/components/tours/tour-card";
import { Reveal } from "@/components/ui/reveal";
import { getCategoryBySlug } from "@/lib/constants";
import { getLocalizedCategories, getLocalizedCategory, getTranslations } from "@/lib/copy";
import { getLocale } from "@/lib/locale-server";
import { getAllTours } from "@/lib/tours";

const PAGE_SIZE = 6;

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) {
    return {
      title: "Category Not Found"
    };
  }

  return {
    title: `${category.label} Virtual Tours`,
    description: category.description
  };
}

export default async function CategoryPage({
  params,
  searchParams
}: {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const locale = await getLocale();
  const t = getTranslations(locale);
  const { slug } = await params;
  const category = getLocalizedCategory(slug, locale);

  if (!category) {
    notFound();
  }

  const resolvedSearchParams = (await searchParams) ?? {};
  const search = typeof resolvedSearchParams.search === "string" ? resolvedSearchParams.search : "";
  const requestedPage =
    typeof resolvedSearchParams.page === "string"
      ? Number.parseInt(resolvedSearchParams.page, 10)
      : 1;

  const allTours = await getAllTours();
  const filteredTours = allTours.filter((tour) => {
    if (tour.category !== category.value) {
      return false;
    }

    if (!search.trim()) {
      return true;
    }

    const query = search.toLowerCase();
    return [tour.title, tour.location, tour.description].some((value) =>
      value.toLowerCase().includes(query)
    );
  });

  const totalPages = Math.max(1, Math.ceil(filteredTours.length / PAGE_SIZE));
  const page = Math.min(Math.max(requestedPage || 1, 1), totalPages);
  const visibleTours = filteredTours.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const categories = getLocalizedCategories(locale);

  return (
    <div className="container-shell py-14 sm:py-16">
      <Reveal>
        <div className="surface-card overflow-hidden border border-slate-200/80 bg-white">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="p-8 sm:p-10">
              <p className="section-kicker">{category.eyebrow}</p>
              <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950">
                {category.label} {t.categoryPage.titleSuffix}
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600">
                {category.description}
              </p>
              <div className="mt-8">
                <SearchBar
                  category={category.value}
                  includeCategorySelect={false}
                  locale={locale}
                  pathname={`/categories/${category.value}`}
                  search={search}
                />
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                {categories.map((item) => (
                  <Link
                    className={`rounded-full px-4 py-2 text-sm font-semibold ${
                      item.value === category.value
                        ? "bg-brand-600 text-white"
                        : "bg-slate-100 text-slate-600 hover:text-slate-950"
                    }`}
                    href={`/categories/${item.value}`}
                    key={item.value}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
            <div className="relative min-h-[280px] lg:min-h-full">
              <Image
                alt={category.label}
                className="object-cover"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                src={category.image}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 to-transparent" />
            </div>
          </div>
        </div>
      </Reveal>

      <Reveal className="mt-10" delay={80}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="text-sm text-slate-500">
            {t.categoryPage.countLabel(filteredTours.length, category.label)}
          </p>
          <Link className="secondary-button" href="/tours">
            {t.categoryPage.viewAllCategories}
          </Link>
        </div>

        {visibleTours.length ? (
          <div className="mt-6 grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
            {visibleTours.map((tour, index) => (
              <TourCard key={tour.id} locale={locale} priority={index < 2} tour={tour} />
            ))}
          </div>
        ) : (
          <div className="surface-card mt-6 border border-dashed border-slate-300 bg-white p-10 text-center">
            <h2 className="text-2xl font-semibold text-slate-950">{t.categoryPage.emptyTitle}</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              {t.categoryPage.emptyDescription}
            </p>
          </div>
        )}

        <Pagination
          category={category.value}
          locale={locale}
          page={page}
          pathname={`/categories/${category.value}`}
          search={search}
          totalPages={totalPages}
        />
      </Reveal>
    </div>
  );
}
