// src/pages/tickets/create.tsx
import CreateTicketForm from "@/components/CreateTicketForm"; // Import the ticket form

export default function GenerateTicketsPage() {
  return (
    <div>
      <h1>Generate Tickets</h1>
      {/* No need to pass a static eventId */}
      <CreateTicketForm />
    </div>
  );
}

