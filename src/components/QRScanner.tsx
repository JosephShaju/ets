// src/components/QrScanner.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";
import { NotFoundException } from "@zxing/library";
import { useRouter } from "next/navigation";

export default function QrScanner() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string|null>(null);
  const [scanned, setScanned] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const codeReader = new BrowserMultiFormatReader();

    BrowserMultiFormatReader
      .listVideoInputDevices()
      .then((devices) => {
        if (!devices.length) throw new Error("No camera found");
        return devices[0].deviceId;
      })
      .then((deviceId) => {
        codeReader.decodeFromVideoDevice(
          deviceId,
          videoRef.current!,
          (result, err) => {
            if (result && !scanned) {
              setScanned(true);

              // stop camera tracks
              if (videoRef.current?.srcObject) {
                (videoRef.current.srcObject as MediaStream)
                  .getTracks()
                  .forEach((t) => t.stop());
              }

              const ticketCode = result.getText();
              fetch("/api/tickets/checkin", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ticketCode }),
              })
                .then(async (res) => {
                  if (!res.ok) {
                    const { error } = await res.json();
                    throw new Error(error || "Check‑in failed");
                  }
                  alert("✅ Ticket checked in!");
                  router.refresh();
                })
                .catch((e: any) => setError(e.message));
            }
            // ignore “no QR code yet” errors
            if (err && !(err instanceof NotFoundException)) {
              console.error(err);
            }
          }
        );
      })
      .catch((e: any) => {
        console.error(e);
        setError("Camera error: " + e.message);
      });

    return () => {
      // cleanup: stop camera if still running
      if (videoRef.current?.srcObject) {
        (videoRef.current.srcObject as MediaStream)
          .getTracks()
          .forEach((t) => t.stop());
      }
    };
  }, [scanned, router]);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Scan QR Code to Check‑In</h2>
      {error && <p className="text-red-600">{error}</p>}
      <video
        ref={videoRef}
        className="w-full max-w-md mx-auto border rounded"
        muted
        autoPlay
        playsInline
      />
      {scanned && <p className="text-center text-green-600">Processing…</p>}
    </div>
  );
}
