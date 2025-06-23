"use client";
import React, { useEffect } from "react";

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Si tu veux forcer autre chose côté client, sinon tu peux laisser vide
    document.documentElement.classList.add("dark");
  }, []);

  return <>{children}</>;
}
