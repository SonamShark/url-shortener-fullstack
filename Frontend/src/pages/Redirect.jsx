import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { resolveSlug } from "../services/api";

export default function Redirect() {
  const { slug } = useParams();
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const data = await resolveSlug(slug);
        const target = data?.originalUrl ?? data?.url ?? data?.long_url;
        if (!target) throw new Error("No destination URL returned.");
        if (!cancelled) {
          setStatus("redirecting");
          window.location.replace(target);
        }
      } catch (err) {
        if (!cancelled) {
          setStatus("error");
          setMessage(err.message);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  return (
    <section className="mx-auto flex w-full max-w-xl flex-1 flex-col items-center justify-center px-4 py-16 text-center">
      {status !== "error" ? (
        <>
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-slate-700 border-t-indigo-400" />
          <p className="mt-4 text-slate-300">
            Looking up <code className="text-indigo-300">/{slug}</code>...
          </p>
        </>
      ) : (
        <>
          <h1 className="text-2xl font-semibold text-white">Link not found</h1>
          <p className="mt-2 text-slate-400">{message}</p>
          <Link
            to="/"
            className="mt-6 rounded-md bg-indigo-500 px-4 py-2 font-medium text-white hover:bg-indigo-400"
          >
            Back home
          </Link>
        </>
      )}
    </section>
  );
}
