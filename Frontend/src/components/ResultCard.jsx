import { useClipboard } from "../hooks/useClipboard";

export default function ResultCard({ result }) {
  const { copied, copy } = useClipboard();

  if (!result) return null;

  const shortUrl =
    result.shortUrl ??
    result.short_url ??
    (result.slug
      ? `${window.location.origin}/${result.slug}`
      : "");

  return (
    <div className="mt-6 rounded-xl border border-slate-800 bg-slate-900/60 p-4 sm:p-5">
      <p className="text-sm text-slate-400">Your short link is ready</p>
      <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <a
          href={shortUrl}
          target="_blank"
          rel="noreferrer"
          className="truncate text-indigo-300 hover:text-indigo-200 hover:underline"
        >
          {shortUrl}
        </a>
        <button
          type="button"
          onClick={() => copy(shortUrl)}
          className="self-start rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-sm font-medium text-slate-100 hover:border-indigo-400 hover:text-indigo-200 sm:self-auto"
        >
          {copied ? "Copied!" : "Copy to clipboard"}
        </button>
      </div>
    </div>
  );
}
