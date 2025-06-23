"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:4000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 401) throw new Error("Identifiants incorrects");
        if (res.status === 500) throw new Error("Erreur serveur, réessayez plus tard");
        throw new Error(data.message || "Une erreur est survenue");
      };

      // Succès : stocker token / flag puis rediriger
      localStorage.setItem("isLoggedIn", "true");
      window.location.href = "/dashboard"; // redirection après login

    } catch (err) {
      setError(err.message || "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-pink-500 via-purple-600 to-blue-700 px-4 z-10">
      <motion.form
        onSubmit={handleSubmit}
        className="bg-black bg-opacity-70 p-8 rounded-lg shadow-lg max-w-md w-ful z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold text-white mb-6 text-center">Connexion</h2>

        <input
          type="text"
          placeholder="Nom d'utilisateur"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="w-full mb-4 px-4 py-3 rounded bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-400 z-10"
        />

        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full mb-6 px-4 py-3 rounded bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 z-10 focus:ring-pink-400"
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white font-semibold transition-transform transform hover:scale-105 disabled:opacity-50 z-10`}
        >
          {loading ? <Spinner/> : "Se connecter"}
        </button>

        {error && (
          <p className="mt-4 text-center text-red-400 font-semibold">{error}</p>
        )}
      </motion.form>
    </div>
  );
}
