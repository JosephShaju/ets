// src/app/attendee/page.tsx
"use client";

import { useState, useEffect } from 'react';
import EventList from '@/components/EventList';
import { Event } from '@prisma/client';
import Link from 'next/link';

const AttendeeDashboard = () => {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    async function fetchEvents() {
      const res = await fetch('/api/events');
      const data = await res.json();
      setEvents(data);
    }
    fetchEvents();
  }, []);

  return (
    <div className="space-y-8 p-6 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold text-center">Attendee Dashboard</h1>

      <div className="flex justify-center space-x-6 mt-6">
        <Link
          href="/tickets/create"
          className="px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
        >
          Buy Tickets
        </Link>
      </div>

      <h2 className="text-2xl font-semibold text-center mb-4">Available Events</h2>
      {/* still no onDelete here */}
      <EventList events={events} />
    </div>
  );
};

export default AttendeeDashboard;
