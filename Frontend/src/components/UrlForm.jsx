import { useState } from "react";

const SLUG_PATTERN = /^[a-z0-9][a-z0-9-_]{1,30}[a-z0-9]$/i;

export default function UrlForm({ onSubmit, loading }) {
  const [url, setUrl] = useState("");
  const [customSlug, setCustomSlug] = useState("");
  const [localError, setLocalError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedUrl = url.trim();
    const trimmedSlug = customSlug.trim();

    if (!trimmedUrl) {
      setLocalError("Please paste a URL first.");
      return;
    }
    try {
      new URL(trimmedUrl);
    } catch {
      setLocalError("That does not look like a valid URL.");
      return;
    }
    if (trimmedSlug && !SLUG_PATTERN.test(trimmedSlug)) {
      setLocalError(
        "Custom slug must be 3-32 chars, letters/digits/-/_, starting and ending with a letter or digit."
      );
      return;
    }

    setLocalError(null);
    onSubmit(trimmedUrl, trimmedSlug || undefined);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="url"
          inputMode="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://your-really-long-link.example.com/path"
          className="flex-1 rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100 placeholder-slate-500 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/30"
          disabled={loading}
          aria-label="Long URL"
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-indigo-500 px-5 py-3 font-medium text-white transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Shortening..." : "Shorten"}
        </button>
      </div>

      <div className="mt-3 flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900/50 px-3 py-2">
        <span className="text-sm text-slate-500">/</span>
        <input
          type="text"
          value={customSlug}
          onChange={(e) => setCustomSlug(e.target.value)}
          placeholder="custom slug (optional, e.g. ethereum)"
          className="flex-1 bg-transparent text-sm text-slate-100 placeholder-slate-500 outline-none"
          disabled={loading}
          aria-label="Custom slug (optional)"
          autoComplete="off"
          maxLength={32}
        />
      </div>
      <p className="mt-2 text-xs text-slate-500">
        Leave the slug blank and we'll auto-generate a memorable one from the URL.
      </p>

      {localError && (
        <p className="mt-2 text-sm text-rose-400">{localError}</p>
      )}
    </form>
  );
}
