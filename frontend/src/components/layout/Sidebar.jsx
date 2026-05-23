import { NavLink } from "react-router-dom";
import useAuth from "../../hooks/useAuth.js";
import { USER_ROLES } from "../../utils/constants.js";

const linkClass = ({ isActive }) =>
  `block rounded-lg px-3 py-2 text-sm transition-colors ${
    isActive ? "bg-surface font-medium text-neutral-950" : "text-muted hover:text-neutral-950"
  }`;

export default function Sidebar() {
  const { user } = useAuth();
  const isDeveloper = user?.role === USER_ROLES.DEVELOPER || user?.role === USER_ROLES.ADMIN;
  const isAdmin = user?.role === USER_ROLES.ADMIN;

  return (
    <aside className="w-48 shrink-0">
      <nav className="space-y-1">
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
      </nav>
    </aside>
  );
}
