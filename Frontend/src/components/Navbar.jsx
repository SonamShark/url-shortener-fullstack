import { NavLink } from "react-router-dom";

const linkClass = ({ isActive }) =>
  [
    "px-3 py-2 rounded-md text-sm font-medium transition-colors",
    isActive
      ? "bg-indigo-500/20 text-indigo-300"
      : "text-slate-300 hover:text-white hover:bg-slate-800",
  ].join(" ");

export default function Navbar() {
  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur sticky top-0 z-10">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 h-14 flex items-center justify-between">
        <NavLink to="/" className="flex items-center gap-2 font-semibold">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-indigo-500 text-white text-sm">
            sh
          </span>
          <span className="text-white">Shorty</span>
        </NavLink>
        <nav className="flex items-center gap-1">
          <NavLink to="/" end className={linkClass}>
            Home
          </NavLink>
          <NavLink to="/stats" className={linkClass}>
            Stats
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
