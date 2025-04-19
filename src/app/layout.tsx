// src/app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// Import your Providers wrapper (which itself uses SessionProvider)
import { Providers } from "./providers";

// Import the createOrganizer function from your prisma module
import { createOrganizer } from "@/lib/prisma";

// Run initialization code on the server at startup.
createOrganizer().catch((err) =>
  console.error("Failed to create organizer on startup:", err)
);

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Paper Management System",
  description: "A full-stack Next.js application for managing papers",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-neutral-50`}
      >
        {/* Wrap your app in Providers (SessionProvider, etc.) */}
        <Providers>
          <main className="container mx-auto p-6">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
