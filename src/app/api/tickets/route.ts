// src/app/api/tickets/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import QRCode from "qrcode";
import { sendTicketEmail } from "@/lib/mailer";

export async function GET() {
  const tickets = await prisma.ticket.findMany({
    include: {
      event: { select: { name: true } },
      tier:  { select: { id: true, name: true, price: true } },
    },
    orderBy: { id: "desc" },
  });

  // Flatten so every ticket has eventName at the top level
  const flattened = tickets.map(t => ({
    id:         t.id,
    ticketCode: t.ticketCode,
    fullName:   t.fullName,
    email:      t.email,
    qrCodeUrl:  t.qrCodeUrl,
    checkedIn:  t.checkedIn,
    pricePaid:  t.pricePaid,
    tier:       t.tier ? { name: t.tier.name, price: t.tier.price } : undefined,
    eventName:  t.event.name,
  }));

  return NextResponse.json(flattened);
}

export async function POST(request: Request) {
  try {
    const { eventId, email, firstName, lastName, tierId } = await request.json();
    if (!eventId || !email || !firstName || !lastName) {
      return NextResponse.json(
        { error: "Missing required ticket information" },
        { status: 400 }
      );
    }

    const fullName = `${firstName} ${lastName}`.trim();

    // Compute pricePaid if a tier is selected
    let pricePaid = 0;
    if (tierId) {
      const tier = await prisma.ticketTier.findUnique({ where: { id: tierId } });
      if (tier) pricePaid = tier.price;
    }

    // 1) Create placeholder ticket
    const ticket = await prisma.ticket.create({
      data: {
        eventId,
        email,
        fullName,
        tierId: tierId || null,
        pricePaid,
        qrCodeUrl: "",
        checkedIn: false,
      },
    });

    // 2) Generate and store the QR code
    const qrCodeUrl = await QRCode.toDataURL(ticket.ticketCode);
    await prisma.ticket.update({
      where: { id: ticket.id },
      data: { qrCodeUrl },
    });

    // 3) Re‐fetch the fully populated ticket
    const updatedTicket = await prisma.ticket.findUnique({
      where: { id: ticket.id },
      include: {
        event: { select: { name: true } },
        tier:  { select: { id: true, name: true, price: true } },
      },
    });

    // 4) Send confirmation email
    const eventName = updatedTicket?.event.name ?? "Unknown Event";
    try {
      await sendTicketEmail({
        toEmail: email,
        fullName,
        eventName,
        ticketCode: ticket.ticketCode,
        qrCodeUrl,
      });
      console.log("Ticket email sent to:", email);
    } catch (e) {
      console.error("Error sending ticket email:", e);
    }

    return NextResponse.json({ ticket: updatedTicket }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating ticket:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create ticket" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const { ticketId } = await request.json();
    if (!ticketId) {
      return NextResponse.json({ error: "Missing ticketId" }, { status: 400 });
    }
    await prisma.ticket.update({
      where: { id: ticketId },
      data: { checkedIn: true },
    });
    return NextResponse.json({ message: "Ticket checked in successfully" });
  } catch (error: any) {
    console.error("Error checking in ticket:", error);
    return NextResponse.json(
      { error: error.message || "Failed to check in ticket" },
      { status: 500 }
    );
  }
}
