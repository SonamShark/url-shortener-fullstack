import { useStats } from "../hooks/useStats";

const formatDate = (value) => {
  if (!value) return "—";
  const d = new Date(value);
  return Number.isNaN(d.getTime())
    ? "—"
    : d.toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      });
};

export default function Stats() {
  const { links, loading, error, refresh } = useStats();

  return (
    <section className="mx-auto w-full max-w-5xl px-4 py-10 sm:py-14">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white sm:text-3xl">
            Recent Links
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            A quick look at the latest short links and their click counts.
          </p>
        </div>
        <button
          type="button"
          onClick={refresh}
          className="rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100 hover:border-indigo-400 hover:text-indigo-200"
        >
          Refresh
        </button>
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border border-slate-800 bg-slate-900/60">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-800 text-left text-sm">
            <thead className="bg-slate-900 text-slate-400">
              <tr>
                <th className="px-4 py-3 font-medium">Short</th>
                <th className="px-4 py-3 font-medium">Original</th>
                <th className="px-4 py-3 font-medium">Total Clicks</th>
                <th className="px-4 py-3 font-medium">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {loading && (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-slate-400">
                    Loading...
                  </td>
                </tr>
              )}
              {!loading && error && (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-rose-400">
                    {error}
                  </td>
                </tr>
              )}
              {!loading && !error && links.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-slate-400">
                    No links yet. Shorten one on the home page to see it here.
                  </td>
                </tr>
              )}
              {!loading &&
                !error &&
                links.map((link) => {
                  const slug = link.slug ?? link.short_code ?? link.id;
                  const short = link.shortUrl ?? `${window.location.origin}/${slug}`;
                  return (
                    <tr key={slug} className="hover:bg-slate-900">
                      <td className="px-4 py-3">
                        <a
                          href={short}
                          target="_blank"
                          rel="noreferrer"
                          className="text-indigo-300 hover:underline"
                        >
                          /{slug}
                        </a>
                      </td>
                      <td className="max-w-[320px] truncate px-4 py-3 text-slate-300">
                        {link.originalUrl ?? link.url ?? link.long_url}
                      </td>
                      <td className="px-4 py-3 text-slate-100">
                        {link.clicks ?? link.total_clicks ?? 0}
                      </td>
                      <td className="px-4 py-3 text-slate-400">
                        {formatDate(link.createdAt ?? link.created_at)}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
