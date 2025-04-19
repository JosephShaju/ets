// src/app/events/list/page.tsx
import { useEffect, useState } from 'react';
import EventCard from '@/components/EventCard';

export default function EventListPage() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    async function fetchEvents() {
      const response = await fetch('/api/events');
      const data = await response.json();
      setEvents(data);
    }
    fetchEvents();
  }, []);

  return (
    <div>
      <h1>Event List</h1>
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
}
