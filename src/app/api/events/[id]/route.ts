// src/app/api/events/[id]/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  // Must await params before using it
  const { id } = await params;
  const eventId = parseInt(id, 10);
  if (isNaN(eventId)) {
    return NextResponse.json(
      { error: 'Invalid event ID' },
      { status: 400 }
    );
  }

  try {
    // 1) Delete all tickets for this event
    await prisma.ticket.deleteMany({
      where: { eventId },
    });

    // 2) Delete all tiers for this event
    await prisma.ticketTier.deleteMany({
      where: { eventId },
    });

    // 3) Now delete the event
    const deletedEvent = await prisma.event.delete({
      where: { id: eventId },
    });

    return NextResponse.json(deletedEvent);
  } catch (error: any) {
    console.error('Error deleting event:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete event' },
      { status: 500 }
    );
  }
}
