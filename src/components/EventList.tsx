// src/components/EventList.tsx
"use client";

import { Event } from "@prisma/client";
import { useSession } from "next-auth/react";

interface EventListProps {
  events: (Event & { tickets: { qrCodeUrl: string }[] })[];
  onDelete?: (eventId: number) => void;
}

const EventList: React.FC<EventListProps> = ({ events, onDelete }) => {
  const { data: session } = useSession();
  const isOrganizer = session?.user?.role === "organizer";

  return (
    <div className="space-y-4">
      {events.map((ev) => (
        <div key={ev.id} className="p-4 bg-white border rounded-lg shadow-md">
          <h3 className="text-xl font-semibold">{ev.name}</h3>
          <p className="text-lg text-gray-700">{ev.location}</p>
          <p className="text-lg text-gray-500">
            {new Date(ev.date).toLocaleDateString()}
          </p>

          {isOrganizer && onDelete && (
            <button
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
              onClick={() => onDelete(ev.id)}
            >
              Delete Event
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default EventList;
