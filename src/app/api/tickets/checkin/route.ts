// src/app/api/tickets/checkin/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PATCH(request: Request) {
  const { ticketCode } = await request.json();
  if (!ticketCode) {
    return NextResponse.json({ error: "Missing ticketCode" }, { status: 400 });
  }
  const ticket = await prisma.ticket.findUnique({ where: { ticketCode } });
  if (!ticket) {
    return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
  }
  await prisma.ticket.update({
    where: { ticketCode },
    data: { checkedIn: true },
  });
  return NextResponse.json({ message: "Checked in" });
}
