"use client"; // Ensure this is a client component

import { useState, useEffect } from "react";
import QRCode from "qrcode";

export default function QRCodeGenerator({ ticketId }: { ticketId: number }) {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);
    QRCode.toDataURL(ticketId.toString())
      .then((url: string) => { // Explicitly type the parameter as string
        setQrCodeUrl(url);
        setLoading(false);
      })
      .catch((err: any) => { // Optionally type the error parameter as any (or more specific if desired)
        console.error("Error generating QR code:", err);
        setLoading(false);
      });
  }, [ticketId]);

  if (loading) {
    return <p>Generating QR code...</p>;
  }

  return <img src={qrCodeUrl} alt={`QR Code for Ticket ${ticketId}`} />;
}
