// src/components/PurchaseTicketForm.tsx
"use client";

import { useState, useEffect } from 'react'
import TicketCard from './TicketCard'

export default function PurchaseTicketForm({ eventId }: { eventId: number }) {
  const [tiers, setTiers] = useState<{ id:number; name:string; price:number }[]>([])
  const [tierId, setTierId] = useState<number|null>(null)
  const [email, setEmail] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [tickets, setTickets] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string|null>(null)

  useEffect(() => {
    fetch(`/api/events/${eventId}`)
      .then(r => r.json())
      .then(evt => setTiers(evt.tiers || []))
      .catch(() => setError('Could not load tiers'))
  }, [eventId])

  const handleSubmit = async e => {
    e.preventDefault()
    if (!tierId || !email || !firstName || !lastName) {
      alert('All fields required')
      return
    }
    setLoading(true)
    const res = await fetch('/api/tickets', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ eventId, tierId, email, firstName, lastName })
    })
    if (!res.ok) {
      const {error: msg} = await res.json()
      setError(msg)
    } else {
      const { ticket } = await res.json()
      setTickets(t=>[...t, ticket])
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit}>
      <select
        value={tierId||''}
        onChange={e=>setTierId(+e.target.value)}
        required
      >
        <option value="" disabled>Choose a tier</option>
        {tiers.map(t=>(
          <option key={t.id} value={t.id}>
            {t.name} — ${t.price.toFixed(2)}
          </option>
        ))}
      </select>
      {/* email, first/last name inputs… */}
      <button disabled={loading}>Buy Ticket</button>

      {error && <p className="text-red-600">{error}</p>}

      {tickets.map(t => <TicketCard key={t.id} ticket={t}/> )}
    </form>
  )
}
