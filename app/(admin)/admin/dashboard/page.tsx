import Image from "next/image";
import Link from "next/link";
import { deleteTourAction } from "@/app/admin/actions";
import { getAdminText } from "@/lib/admin-text";
import { getCategoryLabel } from "@/lib/constants";
import { getLocale } from "@/lib/locale-server";
import { getAllTours } from "@/lib/tours";

function resolveBanner(status: string | undefined, error: string | undefined, locale: "en" | "vi") {
  const t = getAdminText(locale);

  if (status === "created") {
    return t.dashboard.created;
  }

  if (status === "updated") {
    return t.dashboard.updated;
  }

  if (status === "deleted") {
    return t.dashboard.deleted;
  }

  if (error === "not-found") {
    return t.dashboard.notFound;
  }

  return "";
}

export default async function DashboardPage({
  searchParams
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const locale = await getLocale();
  const t = getAdminText(locale);
  const resolvedSearchParams = (await searchParams) ?? {};
  const query = typeof resolvedSearchParams.search === "string" ? resolvedSearchParams.search : "";
  const message = resolveBanner(
    typeof resolvedSearchParams.status === "string" ? resolvedSearchParams.status : undefined,
    typeof resolvedSearchParams.error === "string" ? resolvedSearchParams.error : undefined,
    locale
  );

  const tours = await getAllTours();
  const filteredTours = tours.filter((tour) => {
    if (!query.trim()) {
      return true;
    }

    const keyword = query.toLowerCase();
    return [tour.title, tour.location, tour.category].some((value) =>
      value.toLowerCase().includes(keyword)
    );
  });

  const uniqueCategories = new Set(tours.map((tour) => tour.category)).size;

  return (
    <div className="space-y-8">
      {message ? (
        <div className="rounded-3xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {message}
        </div>
      ) : null}

      <section className="grid gap-5 lg:grid-cols-3">
        {[
          { label: t.dashboard.totalTours, value: tours.length.toString() },
          { label: t.dashboard.liveCategories, value: uniqueCategories.toString() },
          {
            label: t.dashboard.newestUpdate,
            value: tours[0]
              ? new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(
                  new Date(tours[0].createdAt)
                )
              : t.dashboard.noData
          }
        ].map((item) => (
          <div className="surface-card border border-slate-200/80 bg-white p-6" key={item.label}>
            <p className="text-sm text-slate-500">{item.label}</p>
            <p className="mt-3 text-3xl font-semibold text-slate-950">{item.value}</p>
          </div>
        ))}
      </section>

      <section className="surface-card border border-slate-200/80 bg-white p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="section-kicker">{t.dashboard.tourManagement}</p>
            <h2 className="mt-4 text-3xl font-semibold text-slate-950">{t.dashboard.allTours}</h2>
          </div>

          <form action="/admin/dashboard" className="flex w-full gap-3 lg:max-w-md" method="get">
            <input
              className="input-field"
              defaultValue={query}
              name="search"
              placeholder={t.dashboard.searchPlaceholder}
              type="text"
            />
            <button className="primary-button whitespace-nowrap" type="submit">
              {t.dashboard.search}
            </button>
          </form>
        </div>

        <div className="mt-6 overflow-x-auto rounded-[28px] border border-slate-200">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr className="text-left text-sm font-semibold text-slate-700">
                <th className="px-5 py-4">{t.dashboard.thumbnail}</th>
                <th className="px-5 py-4">{t.dashboard.title}</th>
                <th className="px-5 py-4">{t.dashboard.category}</th>
                <th className="px-5 py-4">{t.dashboard.location}</th>
                <th className="px-5 py-4">{t.dashboard.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white text-sm text-slate-600">
              {filteredTours.length ? (
                filteredTours.map((tour) => (
                  <tr key={tour.id}>
                    <td className="px-5 py-4">
                      <div className="relative h-16 w-24 overflow-hidden rounded-2xl border border-slate-200">
                        <Image
                          alt={tour.title}
                          className="object-cover"
                          fill
                          sizes="96px"
                          src={tour.thumbnail}
                        />
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div>
                        <p className="font-semibold text-slate-900">{tour.title}</p>
                        <p className="mt-1 text-xs text-slate-500">{tour.slug}</p>
                      </div>
                    </td>
                    <td className="px-5 py-4">{getCategoryLabel(tour.category)}</td>
                    <td className="px-5 py-4">{tour.location}</td>
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-3">
                        <Link
                          className="rounded-full border border-slate-200 px-4 py-2 font-semibold text-slate-700 hover:border-brand-200 hover:text-brand-700"
                          href={`/admin/dashboard/${tour.id}/edit`}
                        >
                          {t.dashboard.edit}
                        </Link>
                        <form action={deleteTourAction.bind(null, tour.id)}>
                          <button
                            className="rounded-full border border-rose-200 px-4 py-2 font-semibold text-rose-600 hover:bg-rose-50"
                            type="submit"
                          >
                            {t.dashboard.delete}
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="px-5 py-10 text-center text-slate-500" colSpan={5}>
                    {t.dashboard.noResults}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
