// src/components/EventCard.tsx
import React from 'react';

export default function EventCard({ event, onDelete }: { event: any, onDelete: (id: number) => void }) {
  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/events/${event.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete event');
      }

      // Notify the parent component that an event has been deleted
      onDelete(event.id); // Remove the event from the list in the parent component
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('Failed to delete event');
    }
  };

  return (
    <div className="event-card">
      <h3>{event.name}</h3>
      <p>{event.description}</p>
      <button onClick={handleDelete} className="bg-red-500 text-white px-4 py-2 rounded">
        Delete Event
      </button>
    </div>
  );
}
