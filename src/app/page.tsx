// src/app/page.tsx
"use client";

import { useState, useEffect } from "react";
import LandingPage from "@/components/LandingPage";  // <— your existing LandingPage
import { useRouter } from "next/navigation";

export default function PageWrapper() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <h1 className="text-black text-5xl font-bold">Event Ticketing System</h1>
      </div>
    );
  }

  // after splash, render your LandingPage
  return <LandingPage />;
}
