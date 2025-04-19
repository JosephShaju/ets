// src/components/CreateTicketForm.tsx
"use client";

import { useState, useEffect } from "react";
import TicketCard from "./TicketCard";

interface Tier {
  id: number;
  name: string;
  price: number;
}

interface Event {
  id: number;
  name: string;
  tiers: Tier[];
}

export default function CreateTicketForm() {
  // Attendee info
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  // Event & Tier selection
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<number | "">("");
  const [selectedTierId, setSelectedTierId] = useState<number | "">("");

  // Ticket list & UI state
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch events (including their tiers) once on mount
  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await fetch("/api/events");
        if (!res.ok) throw new Error("Failed to fetch events");
        const data: Event[] = await res.json();
        setEvents(data);
      } catch (err: any) {
        setError(err.message);
      }
    }
    fetchEvents();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // require everything
    if (
      !selectedEventId ||
      !selectedTierId ||
      !email.trim() ||
      !firstName.trim() ||
      !lastName.trim()
    ) {
      alert("Please fill in all fields, including Tier");
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
          tierId: selectedTierId,
          email,
          firstName,
          lastName,
        }),
      });

      const payload = await res.json();
      if (!res.ok) throw new Error(payload.error);

      // flatten for display
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
      setSelectedTierId("");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-3xl font-semibold text-center mb-6">
        Purchase Ticket
      </h2>

      {/* Event selector */}
      <div className="mb-4">
        <label className="block mb-2 font-medium">Select Event</label>
        <select
          className="w-full px-4 py-2 border rounded"
          value={selectedEventId}
          onChange={(e) => {
            setSelectedEventId(Number(e.target.value));
            setSelectedTierId(""); // reset tier when event changes
          }}
          required
        >
          <option value="" disabled>
            -- pick an event --
          </option>
          {events.map((ev) => (
            <option key={ev.id} value={ev.id}>
              {ev.name}
            </option>
          ))}
        </select>
      </div>

      {/* Tier selector (required) */}
      {selectedEventId && (
        <div className="mb-6">
          <label className="block mb-2 font-medium">Select Tier</label>
          <select
            className="w-full px-4 py-2 border rounded"
            value={selectedTierId}
            onChange={(e) => setSelectedTierId(Number(e.target.value))}
            required
          >
            <option value="" disabled>
              -- select a tier --
            </option>
            {events
              .find((ev) => ev.id === selectedEventId)
              ?.tiers.map((tier) => (
                <option key={tier.id} value={tier.id}>
                  {tier.name} (${tier.price})
                </option>
              ))}
          </select>
        </div>
      )}

      {/* Attendee info */}
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

        <button
          type="submit"
          disabled={loading}
          className="w-full px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {loading ? "Processing..." : "Buy Ticket"}
        </button>
      </form>

      {/* Error message */}
      {error && <p className="text-red-600 mt-4">{error}</p>}

      {/* Render tickets */}
      <div className="mt-6 space-y-4">
        {tickets.map((ticket) => (
          <TicketCard key={ticket.id} ticket={ticket} />
        ))}
      </div>
    </div>
  );
}
