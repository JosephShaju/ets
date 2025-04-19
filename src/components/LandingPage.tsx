// src/components/LandingPage.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const [role, setRole] = useState<"" | "attendee" | "staff" | "organizer">("");
  const router = useRouter();

  const handleContinue = () => {
    if (role === "attendee") {
      router.push("/attendee");
    } else {
      router.push(`/login?role=${role}`);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg fade-in">
      <h1 className="text-3xl font-semibold text-center mb-6">
        Select Your Role
      </h1>

      <select
        className="w-full px-4 py-2 border rounded mb-4"
        value={role}
        onChange={(e) => setRole(e.target.value as any)}
      >
        <option value="">— Choose role —</option>
        <option value="attendee">Attendee</option>
        <option value="staff">Staff</option>
        <option value="organizer">Organizer</option>
      </select>

      <button
        onClick={handleContinue}
        disabled={!role}
        className="w-full bg-blue-600 text-white py-2 rounded disabled:opacity-50"
      >
        Continue
      </button>
    </div>
  );
}
