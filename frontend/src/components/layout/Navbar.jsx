import { Link, NavLink } from "react-router-dom";
import { APP_NAME } from "../../utils/constants.js";

const linkClass = ({ isActive }) =>
  isActive
    ? "text-neutral-950 font-medium"
    : "text-muted hover:text-neutral-950 transition-colors";

export default function Navbar() {
  return (
    <header className="border-b border-border">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Link to="/" className="text-lg font-semibold tracking-tight no-underline">
          {APP_NAME}
        </Link>
        <nav className="flex items-center gap-8 text-sm">
          <NavLink to="/extensions" className={linkClass}>
            Extensions
          </NavLink>
          <NavLink to="/login" className={linkClass}>
            Log in
          </NavLink>
          <Link
            to="/signup"
            className="rounded-lg bg-neutral-950 px-4 py-2 text-sm font-medium text-white no-underline hover:bg-neutral-800"
          >
            Sign up
          </Link>
        </nav>
      </div>
    </header>
  );
}
