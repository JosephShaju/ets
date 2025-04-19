// src/components/EventsSection.tsx
import { Event } from "@prisma/client";
import EventCard from "./EventCard";

// This is a server-side function to fetch events
async function getEvents(): Promise<Event[]> {
  const res = await fetch("http://localhost:3000/api/events", {
    cache: "no-store", // Disable caching to ensure fresh data on every request
  });

  if (!res.ok) throw new Error("Failed to fetch events");
  return await res.json();
}

// Server-side component to render events
export default async function EventsSection() {
  const events = await getEvents(); // Fetch the events here (only on the server)

  return (
    <div>
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
}
