import { Link, NavLink, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth.js";
import { APP_NAME, USER_ROLES } from "../../utils/constants.js";

const linkClass = ({ isActive }) =>
  isActive
    ? "text-neutral-950 font-medium"
    : "text-muted hover:text-neutral-950 transition-colors";

export default function Navbar() {
  const { user, isAuthenticated, logout, loading } = useAuth();
  const navigate = useNavigate();

  const isDeveloper =
    user?.role === USER_ROLES.DEVELOPER || user?.role === USER_ROLES.ADMIN;
  const isAdmin = user?.role === USER_ROLES.ADMIN;

  async function handleLogout() {
    await logout();
    navigate("/");
  }

  return (
    <header className="border-b border-border">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Link to="/" className="text-lg font-semibold tracking-tight no-underline">
          {APP_NAME}
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          <NavLink to="/extensions" className={linkClass}>
            Extensions
          </NavLink>

          {loading ? null : isAuthenticated ? (
            <>
              {isDeveloper && (
                <NavLink to="/developer" className={linkClass}>
                  Developer
                </NavLink>
              )}
              {isAdmin && (
                <NavLink to="/admin" className={linkClass}>
                  Admin
                </NavLink>
              )}
              <span className="text-muted">{user.username}</span>
              <button
                type="button"
                onClick={handleLogout}
                className="text-muted transition-colors hover:text-neutral-950"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={linkClass}>
                Log in
              </NavLink>
              <Link
                to="/signup"
                className="rounded-lg bg-neutral-950 px-4 py-2 text-sm font-medium text-white no-underline hover:bg-neutral-800"
              >
                Sign up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
