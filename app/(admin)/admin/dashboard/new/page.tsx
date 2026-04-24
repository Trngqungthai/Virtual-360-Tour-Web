import { createTourAction } from "@/app/admin/actions";
import { TourForm } from "@/components/admin/tour-form";
import { getAdminText } from "@/lib/admin-text";
import { getLocale } from "@/lib/locale-server";

function resolveError(error: string | undefined, locale: "en" | "vi") {
  const t = getAdminText(locale);

  if (error === "missing-fields") {
    return t.newTour.missing;
  }

  if (error === "thumbnail-required") {
    return t.newTour.thumbnailRequired;
  }

  return "";
}

export default async function NewTourPage({
  searchParams
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const locale = await getLocale();
  const t = getAdminText(locale);
  const resolvedSearchParams = (await searchParams) ?? {};
  const errorMessage = resolveError(
    typeof resolvedSearchParams.error === "string" ? resolvedSearchParams.error : undefined,
    locale
  );

  return (
    <section className="surface-card border border-slate-200/80 bg-white p-6 sm:p-8">
      <div className="mb-8">
        <p className="section-kicker">{t.newTour.kicker}</p>
        <h2 className="mt-4 text-3xl font-semibold text-slate-950">{t.newTour.title}</h2>
        <p className="mt-3 text-sm leading-7 text-slate-600">
          {t.newTour.description}
        </p>
      </div>

      <TourForm
        action={createTourAction}
        errorMessage={errorMessage}
        locale={locale}
        pendingLabel={locale === "vi" ? "Đang lưu tour..." : "Saving tour..."}
        submitLabel={locale === "vi" ? "Lưu tour" : "Save tour"}
      />
    </section>
  );
}
