import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { buildHref } from "@/lib/constants";
import { getTranslations } from "@/lib/copy";
import type { Locale } from "@/lib/locale";

function createPaginationItems(currentPage: number, totalPages: number) {
  const pages = new Set<number>([1, totalPages, currentPage - 1, currentPage, currentPage + 1]);
  return Array.from(pages).filter((page) => page >= 1 && page <= totalPages).sort((a, b) => a - b);
}

export function Pagination({
  pathname,
  page,
  totalPages,
  locale,
  search,
  category
}: {
  pathname: string;
  page: number;
  totalPages: number;
  locale: Locale;
  search?: string;
  category?: string;
}) {
  if (totalPages <= 1) {
    return null;
  }

  const items = createPaginationItems(page, totalPages);
  const t = getTranslations(locale);

  return (
    <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
      <Link
        aria-disabled={page <= 1}
        className={`secondary-button !px-4 !py-2.5 ${page <= 1 ? "pointer-events-none opacity-50" : ""}`}
        href={buildHref(pathname, { search, category, page: page - 1 })}
      >
        <ChevronLeft className="h-4 w-4" />
        {t.pagination.previous}
      </Link>

      {items.map((item, index) => {
        const previous = items[index - 1];
        const showEllipsis = previous && item - previous > 1;

        return (
          <span className="flex items-center gap-3" key={item}>
            {showEllipsis ? <span className="text-slate-400">…</span> : null}
            <Link
              className={`inline-flex h-11 min-w-11 items-center justify-center rounded-full border px-4 text-sm font-semibold ${
                item === page
                  ? "border-brand-600 bg-brand-600 text-white shadow-lg shadow-brand-600/20"
                  : "border-slate-200 bg-white text-slate-700 hover:border-brand-200 hover:text-brand-700"
              }`}
              href={buildHref(pathname, { search, category, page: item })}
            >
              {item}
            </Link>
          </span>
        );
      })}

      <Link
        aria-disabled={page >= totalPages}
        className={`secondary-button !px-4 !py-2.5 ${page >= totalPages ? "pointer-events-none opacity-50" : ""}`}
        href={buildHref(pathname, { search, category, page: page + 1 })}
      >
        {t.pagination.next}
        <ChevronRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
