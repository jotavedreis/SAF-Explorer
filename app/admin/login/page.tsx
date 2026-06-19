import Link from "next/link";
import { LoginForm } from "./login-form";

export default function AdminLoginPage() {
  return (
    <div className="page-shell page-shell--forest">
      <div className="page-bg-glow--forest" />
      <div className="page-bg-grid page-bg-grid--forest" />

      <main className="auth-layout">
        <div className="auth-topbar">
          <Link href="/" className="back-link">
            Voltar
          </Link>
        </div>

        <LoginForm />
      </main>
    </div>
  );
}
