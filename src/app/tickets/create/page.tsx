// src/pages/tickets/create.tsx
import CreateTicketForm from "@/components/CreateTicketForm"; // Import the ticket form

export default function GenerateTicketsPage() {
  return (
    <div>
      {/* No need to pass a static eventId */}
      <CreateTicketForm />
    </div>
  );
}

