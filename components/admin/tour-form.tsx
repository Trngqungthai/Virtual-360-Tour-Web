import Link from "next/link";
import { getAdminText } from "@/lib/admin-text";
import { categories } from "@/lib/constants";
import type { Locale } from "@/lib/locale";
import { type Tour } from "@/lib/tours";
import { FormSubmitButton } from "@/components/ui/form-submit-button";

export function TourForm({
  action,
  submitLabel,
  pendingLabel,
  locale,
  tour,
  errorMessage
}: {
  action: (payload: FormData) => void | Promise<void>;
  submitLabel: string;
  pendingLabel: string;
  locale: Locale;
  tour?: Tour;
  errorMessage?: string;
}) {
  const t = getAdminText(locale);

  return (
    <form action={action} className="space-y-8">
      <input name="existingThumbnail" type="hidden" value={tour?.thumbnail ?? ""} />

      {errorMessage ? (
        <div className="rounded-3xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {errorMessage}
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm font-semibold text-slate-800">{t.tourForm.title}</span>
          <input
            className="input-field"
            defaultValue={tour?.title}
            name="title"
            placeholder="Azure Bay Hotel"
            required
            type="text"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-semibold text-slate-800">{t.tourForm.category}</span>
          <select
            className="input-field"
            defaultValue={tour?.category ?? categories[0].value}
            name="category"
          >
            {categories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-2">
          <span className="text-sm font-semibold text-slate-800">{t.tourForm.location}</span>
          <input
            className="input-field"
            defaultValue={tour?.location}
            name="location"
            placeholder="Ho Chi Minh City, Vietnam"
            required
            type="text"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-semibold text-slate-800">{t.tourForm.embedLink}</span>
          <input
            className="input-field"
            defaultValue={tour?.embedUrl}
            name="embedUrl"
            placeholder="/viewer.html?scene=hotel-suite"
            required
            type="text"
          />
        </label>

        <label className="space-y-2 lg:col-span-2">
          <span className="text-sm font-semibold text-slate-800">{t.tourForm.projectUrl}</span>
          <input
            className="input-field"
            defaultValue={tour?.projectUrl}
            name="projectUrl"
            placeholder="https://example.com/tour-homepage"
            type="url"
          />
          <p className="text-sm leading-6 text-slate-500">{t.tourForm.projectUrlHint}</p>
        </label>

        <label className="space-y-2 lg:col-span-2">
          <span className="text-sm font-semibold text-slate-800">{t.tourForm.mapEmbedLink}</span>
          <input
            className="input-field"
            defaultValue={tour?.mapEmbedUrl}
            name="mapEmbedUrl"
            placeholder="https://www.google.com/maps?q=Ho+Chi+Minh+City&output=embed"
            type="text"
          />
          <p className="text-sm leading-6 text-slate-500">
            {t.tourForm.mapHint}
          </p>
        </label>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-800">{t.tourForm.thumbnailUrl}</span>
            <input
              className="input-field"
              defaultValue={tour?.thumbnail}
              name="thumbnail"
              placeholder="https://images.unsplash.com/..."
              type="url"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-800">{t.tourForm.thumbnailUpload}</span>
            <input
              accept="image/*"
              className="input-field file:mr-4 file:rounded-full file:border-0 file:bg-brand-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-brand-700 hover:file:bg-brand-100"
              name="thumbnailFile"
              type="file"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-800">{t.tourForm.description}</span>
            <textarea
              className="textarea-field"
              defaultValue={tour?.description}
              name="description"
              placeholder="Describe the story, audience, and value of this virtual tour."
              required
            />
          </label>

          <div className="grid gap-6 lg:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-semibold text-slate-800">
                {t.tourForm.projectDetailOne}
              </span>
              <textarea
                className="textarea-field !min-h-[120px]"
                defaultValue={tour?.projectDetails?.[0]}
                name="projectDetailOne"
                placeholder="Thông tin nổi bật của dự án hoặc tour."
                required
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-semibold text-slate-800">
                {t.tourForm.projectDetailTwo}
              </span>
              <textarea
                className="textarea-field !min-h-[120px]"
                defaultValue={tour?.projectDetails?.[1]}
                name="projectDetailTwo"
                placeholder="Mô tả thêm về điểm mạnh, bối cảnh hoặc trải nghiệm."
                required
              />
            </label>
          </div>
        </div>

        <div className="surface-card overflow-hidden border border-slate-200/80 bg-slate-50 p-4">
          <p className="text-sm font-semibold text-slate-800">{t.tourForm.preview}</p>
          <div className="mt-4 overflow-hidden rounded-[24px] border border-slate-200 bg-white">
            {tour?.thumbnail ? (
              <img
                alt={tour.title}
                className="aspect-video w-full bg-slate-100 object-contain p-3"
                src={tour.thumbnail}
              />
            ) : (
              <div className="flex aspect-video items-center justify-center bg-slate-100 text-sm text-slate-500">
                {t.tourForm.previewEmpty}
              </div>
            )}
          </div>
          <p className="mt-4 text-sm leading-7 text-slate-500">
            {t.tourForm.previewHint}
            <span className="font-medium text-slate-700"> /viewer.html?scene=resort-lagoon</span>
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <FormSubmitButton
          className="primary-button"
          label={submitLabel}
          pendingLabel={pendingLabel}
        />
        <Link className="secondary-button" href="/admin/dashboard">
          {t.tourForm.cancel}
        </Link>
      </div>
    </form>
  );
}
