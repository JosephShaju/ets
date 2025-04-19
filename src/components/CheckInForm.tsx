// src/components/CheckInForm.tsx
import { useState } from "react";

export default function CheckInForm() {
  const [qrCode, setQrCode] = useState("");
  const [status, setStatus] = useState("");

  const handleCheckIn = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch("/api/tickets/checkin", {
      method: "POST",
      body: JSON.stringify({ qrCode }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (response.ok) {
      setStatus("Check-in successful!");
    } else {
      setStatus("Error: " + data.error);
    }
  };

  return (
    <div>
      <form onSubmit={handleCheckIn}>
        <input
          type="text"
          placeholder="Enter QR Code"
          value={qrCode}
          onChange={(e) => setQrCode(e.target.value)}
        />
        <button type="submit">Check-In</button>
      </form>
      {status && <p>{status}</p>}
    </div>
  );
}
