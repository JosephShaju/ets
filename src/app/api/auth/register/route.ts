// src/app/api/register/route.ts
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  const { username, password, role } = await request.json();

  // Validate role
  if (!['organizer', 'staff', 'attendee'].includes(role)) {
    return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
  }

  const existingUser = await prisma.user.findUnique({ where: { username } });

  if (existingUser) {
    return NextResponse.json({ error: 'Username is already taken' }, { status: 400 });
  }

  // Hash password and create user
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      username,
      password: hashedPassword,
      role,
    },
  });

  return NextResponse.json(user, { status: 201 });
}
