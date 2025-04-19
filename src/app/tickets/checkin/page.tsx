import QRScanner from '@/components/QRScanner';

export default function TicketCheckInPage() {
  return (
    <div>
      <h1>Scan Ticket QR Code to Check-In</h1>
      <QRScanner />
    </div>
  );
}