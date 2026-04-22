import UrlForm from "../components/UrlForm";
import ResultCard from "../components/ResultCard";
import { useShortener } from "../hooks/useShortener";

export default function Home() {
  const { shorten, result, loading, error } = useShortener();

  return (
    <section className="mx-auto w-full max-w-3xl px-4 py-12 sm:py-16">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-white sm:text-5xl">
          Shorten any link, instantly.
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-slate-400">
          Paste a long URL below and get a tidy, shareable short link powered
          by a Node, PostgreSQL and Redis backend.
        </p>
      </div>

      <div className="mt-10">
        <UrlForm onSubmit={shorten} loading={loading} />
        {error && (
          <p className="mt-3 text-sm text-rose-400" role="alert">
            {error}
          </p>
        )}
        <ResultCard result={result} />
      </div>
    </section>
  );
}
