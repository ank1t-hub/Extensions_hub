import LoginForm from "../components/auth/LoginForm.jsx";

export default function LoginPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Log in</h1>
        <p className="text-sm text-muted">Access your ExtensionHub account.</p>
      </div>
      <LoginForm />
    </div>
  );
}
