// src/components/TicketCard.tsx
"use client";

import QRCodeGenerator from "./QRCodeGenerator";

interface TicketCardProps {
  ticket: {
    id: number;
    ticketCode: string;
    fullName: string;
    email: string;
    qrCodeUrl: string;
    checkedIn: boolean;
    eventName?: string;
    pricePaid?: number;
    tier?: { name: string; price: number };
  };
}

export default function TicketCard({ ticket }: TicketCardProps) {
  return (
    <div className="border p-4 rounded my-2 bg-white">
      <h2 className="text-2xl font-bold mb-2">
        {ticket.eventName ?? "Unknown Event"}
      </h2>
      {ticket.tier && (
        <p>
          Tier: <strong>{ticket.tier.name}</strong> (${ticket.tier.price})
        </p>
      )}
      <h3 className="text-xl font-semibold">
        Ticket Code: {ticket.ticketCode}
      </h3>
      <p>Name: {ticket.fullName}</p>
      <p>Email: {ticket.email}</p>
      {ticket.pricePaid != null && <p>Paid: ${ticket.pricePaid}</p>}
      <p>Status: {ticket.checkedIn ? "Checked In" : "Not Checked In"}</p>
      <QRCodeGenerator ticketId={ticket.id} />
    </div>
  );
}
