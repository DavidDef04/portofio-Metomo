"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username: username.trim(), password }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Identifiants incorrects");
      }

      router.push("/dashboard");
    } catch (err) {
      setError(err.message || "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-void px-4">
      <form
        onSubmit={handleSubmit}
        className="surface-card p-8 w-full max-w-md space-y-4"
      >
        <h2 className="font-display text-2xl text-bone text-center mb-2">
          CMS Portfolio
        </h2>
        <p className="text-mist text-sm text-center mb-6">
          Gestion des projets et certifications
        </p>

        <input
          type="text"
          placeholder="Identifiant"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="w-full px-4 py-3 bg-elevated border border-border text-bone text-sm focus:outline-none focus:border-champagne/50"
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full px-4 py-3 bg-elevated border border-border text-bone text-sm focus:outline-none focus:border-champagne/50"
        />

        <button
          type="submit"
          disabled={loading}
          className="btn-premium btn-premium--primary w-full disabled:opacity-50"
        >
          {loading ? "Connexion…" : "Se connecter"}
        </button>

        {error && <p className="text-ember text-sm text-center">{error}</p>}
      </form>
    </div>
  );
}
