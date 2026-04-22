import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <section className="mx-auto flex w-full max-w-xl flex-1 flex-col items-center justify-center px-4 py-16 text-center">
      <h1 className="text-4xl font-bold text-white">404</h1>
      <p className="mt-2 text-slate-400">This page does not exist.</p>
      <Link
        to="/"
        className="mt-6 rounded-md bg-indigo-500 px-4 py-2 font-medium text-white hover:bg-indigo-400"
      >
        Go home
      </Link>
    </section>
  );
}
