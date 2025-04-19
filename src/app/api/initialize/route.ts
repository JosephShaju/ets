import { createOrganizer } from '@/lib/prisma';

// Call this function on app start
createOrganizer().catch((err) => console.error("Error creating organizer:", err));