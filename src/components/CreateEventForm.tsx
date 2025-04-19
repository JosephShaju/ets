"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

interface Tier {
  name: string;
  price: string;
}

export default function CreateEventForm() {
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [tiers, setTiers] = useState<Tier[]>([{ name: '', price: '' }]);
  const router = useRouter();
  const { data: session, status } = useSession();

  const addTier = () => setTiers(t => [...t, { name: '', price: '' }]);
  const removeTier = (i: number) => setTiers(t => t.filter((_, idx) => idx !== i));
  const updateTier = (i: number, field: keyof Tier, val: string) =>
    setTiers(t => t.map((tier, idx) => idx === i ? { ...tier, [field]: val } : tier));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !date || !location) {
      alert('Fill all event details');
      return;
    }
    if (tiers.some(t => !t.name || !t.price || isNaN(Number(t.price)))) {
      alert('Each tier needs a name and numeric price');
      return;
    }

    const payload = {
      name,
      date,
      location,
      tiers: tiers.map(t => ({ name: t.name, price: parseFloat(t.price) })),
    };

    const res = await fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json();
      alert(err.error || 'Failed to create event');
      return;
    }

    // after creation, redirect based on logged‑in user’s role
    if (status === 'authenticated' && session?.user?.role) {
      const role = session.user.role;
      if (role === 'organizer') router.push('/organizer');
      else if (role === 'staff') router.push('/staff');
      else if (role === 'attendee') router.push('/attendee');
      else router.push('/');
    } else {
      router.push('/');
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-semibold text-center mb-6">
        Create New Event
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Event Name</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full mt-1 px-3 py-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block font-medium">Date & Time</label>
          <input
            type="datetime-local"
            value={date}
            onChange={e => setDate(e.target.value)}
            className="w-full mt-1 px-3 py-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block font-medium">Location</label>
          <input
            type="text"
            value={location}
            onChange={e => setLocation(e.target.value)}
            className="w-full mt-1 px-3 py-2 border rounded"
            required
          />
        </div>
        <div>
          <h3 className="text-xl font-medium mb-2">Ticket Tiers</h3>
          {tiers.map((tier, idx) => (
            <div key={idx} className="flex items-center space-x-2 mb-2">
              <input
                type="text"
                value={tier.name}
                onChange={e => updateTier(idx, 'name', e.target.value)}
                className="flex-1 px-3 py-2 border rounded"
                placeholder="Tier name"
                required
              />
              <input
                type="number"
                step="0.01"
                min="0"
                value={tier.price}
                onChange={e => updateTier(idx, 'price', e.target.value)}
                className="w-24 px-3 py-2 border rounded"
                placeholder="Price"
                required
              />
              {tiers.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeTier(idx)}
                  className="text-red-500 hover:text-red-700"
                >
                  &times;
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addTier}
            className="mt-1 text-blue-600 hover:underline"
          >
            + Add another tier
          </button>
        </div>
        <button
          type="submit"
          className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Create Event
        </button>
      </form>
    </div>
  );
}
