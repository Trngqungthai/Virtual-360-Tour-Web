import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="surface-card max-w-xl p-8 text-center">
        <p className="section-kicker">Page Not Found</p>
        <h1 className="mt-4 text-3xl font-semibold text-slate-950">
          The tour you are looking for is no longer available.
        </h1>
        <p className="mt-4 text-sm leading-7 text-slate-600">
          Try browsing the featured tours or return to the homepage to explore the
          main industries we support.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link className="primary-button" href="/">
            Back to homepage
          </Link>
          <Link className="secondary-button" href="/tours">
            View all tours
          </Link>
        </div>
      </div>
    </main>
  );
}
