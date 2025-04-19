import prisma from "../src/lib/prisma";


async function checkOrganizer() {
  try {
    const organizer = await prisma.user.findFirst({
      where: { role: "organizer" },
    });

    if (organizer) {
      console.log("Organizer found:", organizer);
    } else {
      console.log("No organizer found.");
    }
  } catch (error) {
    console.error("Error checking organizer:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkOrganizer();