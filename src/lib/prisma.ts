// src/lib/prisma.ts
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs"; // Use bcryptjs consistently

const prisma = new PrismaClient();

// Function to create an organizer if one doesn't already exist
export const createOrganizer = async () => {
  // Check if an organizer already exists
  const existingOrganizer = await prisma.user.findFirst({
    where: { role: 'organizer' },
  });

  if (existingOrganizer) {
    console.log("Organizer already exists");
    return;
  }

  // Hash the default password for the organizer
  const hashedPassword = await bcrypt.hash("organizer123", 10);

  // Create a new organizer
  await prisma.user.create({
    data: {
      username: "Organizer",
      password: hashedPassword,
      role: "organizer",
    },
  });

  console.log("Organizer created successfully");
};

export default prisma;
