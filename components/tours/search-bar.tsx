import { Search } from "lucide-react";
import { getLocalizedCategories, getTranslations } from "@/lib/copy";
import type { Locale } from "@/lib/locale";

export function SearchBar({
  pathname,
  locale,
  search = "",
  category = "",
  includeCategorySelect = true
}: {
  pathname: string;
  locale: Locale;
  search?: string;
  category?: string;
  includeCategorySelect?: boolean;
}) {
  const categories = getLocalizedCategories(locale);
  const t = getTranslations(locale);

  return (
    <form
      action={pathname}
      className="surface-card grid gap-3 border border-slate-200/80 bg-white p-4 md:grid-cols-[1fr_240px_auto]"
      method="get"
    >
      <label className="relative block">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          className="input-field pl-11"
          defaultValue={search}
          name="search"
          placeholder={t.search.placeholder}
          type="text"
        />
      </label>

      {includeCategorySelect ? (
        <select className="input-field" defaultValue={category} name="category">
          <option value="">{t.search.allCategories}</option>
          {categories.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      ) : null}

      {!includeCategorySelect ? <input name="category" type="hidden" value={category} /> : null}

      <button className="primary-button whitespace-nowrap" type="submit">
        {t.search.submit}
      </button>
    </form>
  );
}
