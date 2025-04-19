// src/components/TicketDashboard.tsx
"use client";

import useSWR from "swr";
import TicketCard from "./TicketCard";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function TicketDashboard() {
  const { data: tickets, error, isLoading } = useSWR(
    "/api/tickets",
    fetcher,
    { refreshInterval: 5000 }
  );

  if (error)   return <p className="text-red-600">Failed to load tickets.</p>;
  if (isLoading) return <p>Loading tickets…</p>;
  if (!tickets || tickets.length === 0)
    return <p>No tickets have been generated yet.</p>;

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">All Tickets</h1>
      {tickets.map((ticket: any) => (
        // just hand off the ticket object directly
        <TicketCard key={ticket.id} ticket={ticket} />
      ))}
    </div>
  );
}
