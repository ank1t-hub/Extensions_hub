import SignupForm from "../components/auth/SignupForm.jsx";

export default function SignupPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Sign up</h1>
        <p className="text-sm text-muted">Create an account to browse and download extensions.</p>
      </div>
      <SignupForm />
    </div>
  );
}
