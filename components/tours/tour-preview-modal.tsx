"use client";

import { PlayCircle, X } from "lucide-react";
import { useEffect, useState } from "react";
import { getTranslations } from "@/lib/copy";
import type { Locale } from "@/lib/locale";

export function TourPreviewModal({
  title,
  location,
  embedUrl,
  locale,
  buttonLabel = "Preview"
}: {
  title: string;
  location: string;
  embedUrl: string;
  locale: Locale;
  buttonLabel?: string;
}) {
  const [open, setOpen] = useState(false);
  const t = getTranslations(locale);

  useEffect(() => {
    if (!open) {
      return;
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [open]);

  return (
    <>
      <button
        className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:border-brand-200 hover:text-brand-700"
        onClick={() => setOpen(true)}
        type="button"
      >
        <PlayCircle className="h-4 w-4" />
        {buttonLabel}
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 px-4 py-8 backdrop-blur-md">
          <div className="surface-card w-full max-w-5xl overflow-hidden bg-white p-4 sm:p-6">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-600">
                  {t.modal.livePreview}
                </p>
                <h3 className="mt-2 text-2xl font-semibold text-slate-950">{title}</h3>
                <p className="mt-1 text-sm text-slate-500">{location}</p>
              </div>
              <button
                aria-label={t.modal.closePreview}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-900"
                onClick={() => setOpen(false)}
                type="button"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="overflow-hidden rounded-[24px] border border-slate-200">
              <iframe
                allowFullScreen
                className="aspect-video w-full"
                src={embedUrl}
                title={`${title} ${t.modal.previewTitle}`}
              />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
