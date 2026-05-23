"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CmsDashboard from "../components/cms/CmsDashboard";

export default function DashboardPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => {
        if (!d.authenticated) router.replace("/login");
        else setReady(true);
      })
      .catch(() => router.replace("/login"));
  }, [router]);

  if (!ready) {
    return (
      <div className="min-h-screen bg-void flex items-center justify-center text-mist">
        Chargement…
      </div>
    );
  }

  return <CmsDashboard />;
}
