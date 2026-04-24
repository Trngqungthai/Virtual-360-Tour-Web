import { FormSubmitButton } from "@/components/ui/form-submit-button";
import { getAdminText } from "@/lib/admin-text";
import type { Locale } from "@/lib/locale";
import { type SiteSettings } from "@/lib/site-settings";

export function SiteSettingsForm({
  action,
  settings,
  locale,
  errorMessage
}: {
  action: (payload: FormData) => void | Promise<void>;
  settings: SiteSettings;
  locale: Locale;
  errorMessage?: string;
}) {
  const t = getAdminText(locale);

  return (
    <form action={action} className="space-y-8">
      <input name="existingBrandLogo" type="hidden" value={settings.brandLogo} />

      {errorMessage ? (
        <div className="rounded-3xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {errorMessage}
        </div>
      ) : null}

      <section className="space-y-6">
        <div>
          <p className="section-kicker">{t.settings.brand}</p>
          <h3 className="mt-4 text-2xl font-semibold text-slate-950">{t.settings.brandTitle}</h3>
        </div>

        <label className="space-y-2">
          <span className="text-sm font-semibold text-slate-800">{t.settings.brandName}</span>
          <input
            className="input-field"
            defaultValue={settings.brandName}
            name="brandName"
            required
            type="text"
          />
        </label>

        <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-800">{t.settings.brandLogoUrl}</span>
            <input
              className="input-field"
              defaultValue={settings.brandLogo}
              name="brandLogo"
              placeholder="https://example.com/logo.png"
              type="url"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-800">
              {t.settings.brandLogoUpload}
            </span>
            <input
              accept="image/*"
              className="input-field file:mr-4 file:rounded-full file:border-0 file:bg-brand-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-brand-700 hover:file:bg-brand-100"
              name="brandLogoFile"
              type="file"
            />
          </label>
        </div>

        <p className="text-sm leading-7 text-slate-500">{t.settings.brandLogoHint}</p>
      </section>

      <section className="space-y-6">
        <div>
          <p className="section-kicker">{t.settings.homepage}</p>
          <h3 className="mt-4 text-2xl font-semibold text-slate-950">{t.settings.heroTitle}</h3>
        </div>

        <label className="space-y-2">
          <span className="text-sm font-semibold text-slate-800">{t.settings.heroPreviewUrl}</span>
          <input
            className="input-field"
            defaultValue={settings.heroPreviewUrl}
            name="heroPreviewUrl"
            placeholder="https://trngqungthai.github.io/Tour_Demo_2/"
            required
            type="text"
          />
        </label>

        <div className="grid gap-6 lg:grid-cols-3">
          {settings.heroStats.map((stat, index) => (
            <div className="surface-card border border-slate-200/80 bg-slate-50 p-5" key={index}>
              <p className="text-sm font-semibold text-slate-800">
                {t.settings.stat} {index + 1}
              </p>
              <div className="mt-4 space-y-4">
                <label className="space-y-2">
                  <span className="text-sm text-slate-600">{t.settings.value}</span>
                  <input
                    className="input-field"
                    defaultValue={stat.value}
                    name={`heroStats.${index}.value`}
                    required
                    type="text"
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-sm text-slate-600">{t.settings.labelEn}</span>
                  <input
                    className="input-field"
                    defaultValue={stat.labelEn}
                    name={`heroStats.${index}.labelEn`}
                    required
                    type="text"
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-sm text-slate-600">{t.settings.labelVi}</span>
                  <input
                    className="input-field"
                    defaultValue={stat.labelVi}
                    name={`heroStats.${index}.labelVi`}
                    required
                    type="text"
                  />
                </label>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-6">
          <div>
            <p className="section-kicker">{t.settings.contact}</p>
            <h3 className="mt-4 text-2xl font-semibold text-slate-950">{t.settings.contactTitle}</h3>
          </div>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-800">{t.settings.phone}</span>
            <input
              className="input-field"
              defaultValue={settings.contact.phone}
              name="contact.phone"
              required
              type="text"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-800">{t.settings.zalo}</span>
            <input
              className="input-field"
              defaultValue={settings.contact.zalo}
              name="contact.zalo"
              required
              type="text"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-800">{t.settings.email}</span>
            <input
              className="input-field"
              defaultValue={settings.contact.email}
              name="contact.email"
              required
              type="email"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-800">{t.settings.address}</span>
            <textarea
              className="textarea-field !min-h-[120px]"
              defaultValue={settings.contact.address}
              name="contact.address"
              required
            />
          </label>
        </div>

        <div className="space-y-6">
          <div>
            <p className="section-kicker">{t.settings.social}</p>
            <h3 className="mt-4 text-2xl font-semibold text-slate-950">{t.settings.socialTitle}</h3>
          </div>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-800">{t.settings.facebook}</span>
            <input
              className="input-field"
              defaultValue={settings.socialLinks.facebook}
              name="social.facebook"
              placeholder="https://facebook.com/your-page"
              type="url"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-800">{t.settings.instagram}</span>
            <input
              className="input-field"
              defaultValue={settings.socialLinks.instagram}
              name="social.instagram"
              placeholder="https://instagram.com/your-handle"
              type="url"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-800">{t.settings.linkedin}</span>
            <input
              className="input-field"
              defaultValue={settings.socialLinks.linkedin}
              name="social.linkedin"
              placeholder="https://linkedin.com/company/your-brand"
              type="url"
            />
          </label>
        </div>
      </section>

      <FormSubmitButton
        className="primary-button"
        label={t.settings.save}
        pendingLabel={t.settings.saving}
      />
    </form>
  );
}
