import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const events = await prisma.event.findMany({
    include: { tiers: true },
  });
  return NextResponse.json(events);
}

export async function POST(request: Request) {
  try {
    const { name, date, location, tiers } = await request.json();

    if (
      !name ||
      !date ||
      !location ||
      !Array.isArray(tiers) ||
      tiers.length === 0 ||
      tiers.some((t: any) => !t.name || typeof t.price !== "number")
    ) {
      return NextResponse.json(
        { error: "Missing or invalid event fields (name, date, location, tiers)" },
        { status: 400 }
      );
    }

    const newEvent = await prisma.event.create({
      data: {
        name,
        date: new Date(date),
        location,
        tiers: {
          create: tiers.map((t: { name: string; price: number }) => ({
            name: t.name,
            price: t.price,
          })),
        },
      },
      include: { tiers: true },
    });

    return NextResponse.json(newEvent, { status: 201 });
  } catch (error: any) {
    console.error("Error creating event:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
