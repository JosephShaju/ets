"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import CreateTicketForm from '@/components/CreateTicketForm'; // Import the CreateTicketForm component

async function getEvents() {
  const res = await fetch('/api/events');
  if (!res.ok) {
    throw new Error('Failed to load events');
  }
  return res.json();
}

export default function CreateTicketPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const eventList = await getEvents();
        setEvents(eventList);
      } catch (error) {
        console.error('Error loading events:', error);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="space-y-8 p-6 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold text-center">Generate Tickets</h1>
      <nav className="flex justify-center space-x-6 mt-6">
        <Link
          href="/events/create"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Create New Event
        </Link>
        <Link
          href="/tickets/checkin"
          className="px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition"
        >
          Check-In Tickets
        </Link>
      </nav>

      {/* Event Selection Section */}
      <section>
        <h2 className="text-2xl font-semibold text-center mb-4">Select an Event to Generate Tickets</h2>
        <div className="space-y-4">
          {events.length === 0 ? (
            <p>No events available. Please create an event first.</p>
          ) : (
            events.map((event) => (
              <div
                key={event.id}
                className="p-4 bg-white border rounded-lg shadow-md cursor-pointer hover:bg-gray-100 transition"
                onClick={() => setSelectedEventId(event.id)}
              >
                <h3 className="text-xl font-semibold">{event.name}</h3>
                <p>{event.location}</p>
                <p>{event.date}</p>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Show ticket generation form if an event is selected */}
      {selectedEventId && (
        <div className="mt-8">
          <h2 className="text-xl text-center font-semibold">Generate Ticket for Event ID: {selectedEventId}</h2>
          <CreateTicketForm/>
        </div>
      )}
    </div>
  );
}
