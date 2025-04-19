// src/app/organizer/page.tsx
"use client";

import { useState, useEffect } from 'react';
import EventList from '@/components/EventList';
import { Event } from '@prisma/client';
import Link from 'next/link';

const OrganizerDashboard = () => {
  const [events, setEvents] = useState<(Event & { tickets: { qrCodeUrl: string }[] })[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      const res = await fetch('/api/events');
      const data = await res.json();
      setEvents(data);
    };
    fetchEvents();
  }, []);

  const handleDeleteEvent = async (eventId: number) => {
    const response = await fetch(`/api/events/${eventId}`, {
      method: 'DELETE',
    });
    if (response.ok) {
      setEvents(events.filter((event) => event.id !== eventId));
    }
  };

  return (
    <div className="space-y-8 p-6 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold text-center">Organizer Dashboard</h1>

      <div className="flex justify-center space-x-6 mt-6">
        <Link
          href="/events/create"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Create New Event
        </Link>
        <Link
          href="/tickets/create"
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          Buy Tickets
        </Link>
        <Link
          href="/tickets/checkin"
          className="px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
        >
          Scan & Check‑In
        </Link>
        {/* New link to real‑time dashboard for check‑in statuses */}
        <Link
          href="/tickets/dashboard"
          className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          Real‑Time Check‑In Dashboard
        </Link>
      </div>

      <h2 className="text-2xl font-semibold text-center mb-4">Upcoming Events</h2>
      <EventList events={events} onDelete={handleDeleteEvent} />
    </div>
  );
};

export default OrganizerDashboard;
