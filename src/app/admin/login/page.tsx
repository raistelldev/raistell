"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { site } from "@/config/site";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(data.error ?? "Login fehlgeschlagen.");
        return;
      }
      router.replace("/admin");
      router.refresh();
    } catch {
      setError("Netzwerkfehler. Bitte erneut versuchen.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-[70vh] w-full max-w-md flex-col justify-center px-4 py-16">
      <p className="text-sm font-semibold uppercase tracking-widest text-brand">
        {site.name} Admin
      </p>
      <h1 className="mt-3 font-brand text-3xl font-semibold tracking-tight text-ink">
        Anmelden
      </h1>
      <p className="mt-2 text-sm text-ink-soft">
        Zugang nur mit Passwort.
      </p>

      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <div>
          <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-ink">
            Passwort
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-theme border border-line bg-page px-3 py-2.5 text-sm text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand-soft"
          />
        </div>
        {error && (
          <p className="text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-theme bg-brand px-4 py-3 text-sm font-semibold text-on-brand transition-colors hover:bg-brand-strong disabled:opacity-70"
        >
          {submitting ? "Wird geprüft …" : "Einloggen"}
        </button>
      </form>
    </main>
  );
}
