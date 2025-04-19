/*
  Warnings:

  - Added the required column `pricePaid` to the `Ticket` table without a default value. This is not possible if the table is not empty.
  - Made the column `ticketCode` on table `Ticket` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Ticket" ADD COLUMN     "pricePaid" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "tierId" INTEGER,
ALTER COLUMN "ticketCode" SET NOT NULL;

-- CreateTable
CREATE TABLE "TicketTier" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "eventId" INTEGER NOT NULL,

    CONSTRAINT "TicketTier_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TicketTier" ADD CONSTRAINT "TicketTier_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_tierId_fkey" FOREIGN KEY ("tierId") REFERENCES "TicketTier"("id") ON DELETE SET NULL ON UPDATE CASCADE;
