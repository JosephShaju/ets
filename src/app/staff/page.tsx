// src/app/staff/page.tsx
"use client";
import { useState, useEffect } from 'react';
import EventList from '@/components/EventList';
import { Event } from '@prisma/client';
import Link from 'next/link';

const StaffDashboard = () => {
  const [events, setEvents] = useState<(Event & { tickets: { qrCodeUrl: string }[] })[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      const res = await fetch('/api/events');
      const data = await res.json();
      setEvents(data);
    };

    fetchEvents();
  }, []);

  return (
    <div className="space-y-8 p-6 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold text-center">Staff Dashboard</h1>

      <div className="flex justify-center space-x-6 mt-6">
        <Link href="/tickets/checkin" className="px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700">Check-In Tickets</Link>
        <Link href="/tickets/dashboard" className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Real‑Time Check‑In Dashboard</Link>
      </div>
      <h2 className="text-2xl font-semibold text-center mb-4">Upcoming Events</h2>
      <EventList events={events} onDelete={() => {}} /> {/* No delete option */}
    </div>
  );
};

export default StaffDashboard;
