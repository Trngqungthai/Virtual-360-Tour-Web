import { notFound } from "next/navigation";
import { updateTourAction } from "@/app/admin/actions";
import { TourForm } from "@/components/admin/tour-form";
import { getAdminText } from "@/lib/admin-text";
import { getLocale } from "@/lib/locale-server";
import { getTourById } from "@/lib/tours";

function resolveError(error: string | undefined, locale: "en" | "vi") {
  const t = getAdminText(locale);

  if (error === "missing-fields") {
    return t.editTour.missing;
  }

  if (error === "thumbnail-required") {
    return t.editTour.thumbnailRequired;
  }

  return "";
}

export default async function EditTourPage({
  params,
  searchParams
}: {
  params: Promise<{ id: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const locale = await getLocale();
  const t = getAdminText(locale);
  const { id } = await params;
  const tour = await getTourById(id);

  if (!tour) {
    notFound();
  }

  const resolvedSearchParams = (await searchParams) ?? {};
  const errorMessage = resolveError(
    typeof resolvedSearchParams.error === "string" ? resolvedSearchParams.error : undefined,
    locale
  );

  return (
    <section className="surface-card border border-slate-200/80 bg-white p-6 sm:p-8">
      <div className="mb-8">
        <p className="section-kicker">{t.editTour.kicker}</p>
        <h2 className="mt-4 text-3xl font-semibold text-slate-950">{tour.title}</h2>
        <p className="mt-3 text-sm leading-7 text-slate-600">
          {t.editTour.description}
        </p>
      </div>

      <TourForm
        action={updateTourAction.bind(null, tour.id)}
        errorMessage={errorMessage}
        locale={locale}
        pendingLabel={locale === "vi" ? "Đang cập nhật..." : "Updating tour..."}
        submitLabel={locale === "vi" ? "Cập nhật tour" : "Update tour"}
        tour={tour}
      />
    </section>
  );
}
