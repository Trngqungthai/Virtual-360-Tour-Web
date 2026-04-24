import Link from "next/link";
import { redirect } from "next/navigation";
import { ShieldCheck, Sparkles } from "lucide-react";
import { loginAction } from "@/app/admin/actions";
import { FormSubmitButton } from "@/components/ui/form-submit-button";
import { getAdminText } from "@/lib/admin-text";
import { isAdminAuthenticated } from "@/lib/auth";
import { getLocale } from "@/lib/locale-server";

function resolveMessage(error: string | undefined, status: string | undefined, locale: "en" | "vi") {
  const t = getAdminText(locale);

  if (error === "invalid") {
    return t.login.invalid;
  }

  if (status === "logged-out") {
    return t.login.loggedOut;
  }

  return "";
}

export default async function AdminLoginPage({
  searchParams
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const locale = await getLocale();
  const t = getAdminText(locale);
  if (await isAdminAuthenticated()) {
    redirect("/admin/dashboard");
  }

  const resolvedSearchParams = (await searchParams) ?? {};
  const message = resolveMessage(
    typeof resolvedSearchParams.error === "string" ? resolvedSearchParams.error : undefined,
    typeof resolvedSearchParams.status === "string" ? resolvedSearchParams.status : undefined,
    locale
  );

  return (
    <main className="container-shell flex min-h-screen items-center py-12">
      <div className="grid w-full gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="surface-card overflow-hidden border border-white/70 bg-slate-950 p-8 text-white sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-brand-300">
            {t.login.access}
          </p>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight">
            {t.login.title}
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-8 text-slate-300">
            {t.login.description}
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {[
              { title: t.login.cardOne, description: t.login.cardOneDescription, icon: ShieldCheck },
              { title: t.login.cardTwo, description: t.login.cardTwoDescription, icon: Sparkles }
            ].map((item) => (
              <div className="rounded-[24px] border border-white/10 bg-white/5 p-5" key={item.title}>
                <item.icon className="h-6 w-6 text-brand-300" />
                <h2 className="mt-4 text-lg font-semibold">{item.title}</h2>
                <p className="mt-2 text-sm leading-7 text-slate-300">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="surface-card border border-slate-200/80 bg-white p-8 sm:p-10">
          <div className="mb-8">
            <p className="section-kicker">{t.login.secureLogin}</p>
            <h2 className="mt-4 text-3xl font-semibold text-slate-950">{t.login.welcome}</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              {t.login.signinDescription}
            </p>
          </div>

          {message ? (
            <div className="mb-6 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
              {message}
            </div>
          ) : null}

          <form action={loginAction} autoComplete="off" className="space-y-5">
            <label className="block space-y-2">
              <span className="text-sm font-semibold text-slate-800">{t.login.email}</span>
              <input
                autoComplete="off"
                className="input-field"
                name="email"
                required
                spellCheck={false}
                type="email"
              />
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-semibold text-slate-800">{t.login.password}</span>
              <input
                autoComplete="off"
                className="input-field"
                name="password"
                required
                type="password"
              />
            </label>

            <FormSubmitButton
              className="primary-button w-full justify-center"
              label={t.login.signIn}
              pendingLabel={t.login.signingIn}
            />
          </form>

          <div className="mt-8 text-sm text-slate-500">
            {t.login.publicSite}{" "}
            <Link className="font-semibold text-brand-700 hover:text-brand-800" href="/">
              {t.login.viewWebsite}
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
