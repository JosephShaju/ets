// src/components/CreateTicketForm.tsx
"use client";

import { useState, useEffect } from "react";
import TicketCard from "./TicketCard";

export default function CreateTicketForm() {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [tierId, setTierId] = useState<number | null>(null);

  const [events, setEvents] = useState<any[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);

  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch events once
  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await fetch("/api/events");
        if (!res.ok) throw new Error("Failed to fetch events");
        setEvents(await res.json());
      } catch (err: any) {
        setError(err.message);
      }
    }
    fetchEvents();
  }, []);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEventId || !email.trim() || !firstName.trim() || !lastName.trim()) {
      alert("Please enter email, names and select an event");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: selectedEventId,
          email,
          firstName,
          lastName,
          tierId,
        }),
      });
      const payload = await res.json();
      if (!res.ok) throw new Error(payload.error);

      // Flatten eventName & tier onto the ticket object
      const t = payload.ticket;
      const enriched = {
        ...t,
        eventName: t.event.name,
        tier: t.tier,
        pricePaid: t.pricePaid,
      };

      setTickets((prev) => [...prev, enriched]);
      setEmail("");
      setFirstName("");
      setLastName("");
      setTierId(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-3xl font-semibold text-center mb-6">Purchase Ticket</h2>

      <div className="mb-4">
        <label className="block mb-2">Select Event</label>
        <select
          className="w-full px-4 py-2 border rounded"
          value={selectedEventId ?? ""}
          onChange={(e) => setSelectedEventId(Number(e.target.value))}
        >
          <option value="" disabled>-- pick an event --</option>
          {events.map((ev) => (
            <option key={ev.id} value={ev.id}>{ev.name}</option>
          ))}
        </select>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 border rounded"
          required
        />
        <input
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className="w-full px-4 py-2 border rounded"
          required
        />
        <input
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          className="w-full px-4 py-2 border rounded"
          required
        />

        {selectedEventId && (
          <div>
            <label className="block mb-2">Select Tier (optional)</label>
            <select
              className="w-full px-4 py-2 border rounded"
              value={tierId ?? ""}
              onChange={(e) => setTierId(Number(e.target.value))}
            >
              <option value="">-- no tier --</option>
              {events
                .find((ev) => ev.id === selectedEventId)
                ?.tiers.map((t: any) => (
                  <option key={t.id} value={t.id}>
                    {t.name} (${t.price})
                  </option>
                ))}
            </select>
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !selectedEventId}
          className="w-full px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {loading ? "Processing..." : "Buy Ticket"}
        </button>
      </form>

      {error && <p className="text-red-600 mt-4">{error}</p>}

      <div className="mt-6 space-y-4">
        {tickets.map((ticket) => (
          <TicketCard key={ticket.id} ticket={ticket} />
        ))}
      </div>
    </div>
  );
}
