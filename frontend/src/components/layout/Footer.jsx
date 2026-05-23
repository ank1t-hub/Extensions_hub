import { APP_NAME } from "../../utils/constants.js";

export default function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-6xl px-6 py-8 text-sm text-muted">
        © {new Date().getFullYear()} {APP_NAME}. Minimal extension marketplace.
      </div>
    </footer>
  );
}
