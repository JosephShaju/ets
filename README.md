# Event Ticketing System

A full-stack Next.js application for managing events and tickets, featuring role-based access (Organizer, Staff, Attendee), secure authentication with NextAuth, QR code generation, and email notifications.

---

## Prerequisites

- **Node.js** (v16 or newer)
- **npm** (v8 or newer) or **yarn**
- **PostgreSQL** (local or remote instance)
- [Optional] **SMTP credentials** (for sending ticket emails)

---

## Getting Started

1. **Clone the repository** (if you're downloading this project skip this)

   ```bash
   git clone https://github.com/JosephShaju/ets.git
   cd ets
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Configure environment variables**

   - Copy the example file:

     ```bash
     cp .env.example .env
     ```

   - Edit `.env` and set:

     ```env
     DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public
     NEXTAUTH_URL=http://localhost:3000

     # SMTP for email notifications
     SMTP_HOST=smtp.example.com
     SMTP_PORT=587
     SMTP_USER=you@example.com
     SMTP_PASS=your-email-password
     SMTP_FROM="YourApp <no-reply@yourapp.com>"
     ```

4. **Run database migrations**

   ```bash
   npx prisma migrate dev --name init
   ```

5. **(Optional) Open Prisma Studio**

   ```bash
   npx prisma studio
   ```

   Inspect or modify data visually.

6. **Start the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

   The app will be available at [http://localhost:3000](http://localhost:3000).

---

## Default Organizer Account

On startup, the application ensures a default Organizer user exists:

- **Username:** `Organizer`
- **Password:** `organizer123`

Use this account to log in as an Organizer.

---

## Staff Self‑Registration

Staff users can create their own accounts via the registration page:

1. Navigate to `/register`.
2. Fill in **Username**, **Password**, and select **Staff** as the role.
3. Submit to create your Staff account.

---

## Application Flow

1. **Splash Screen (`/`)**

   - On first visit, displays a full-screen splash with “Event Ticketing System” on a dark background.
   - After a brief delay (e.g. 3s) it transitions to the Landing Page.

2. **Landing Page / Role Selection (`/`)**

   - Choose your role: Attendee, Staff, or Organizer.

3. **Organizer**

   - Redirected to Login (`/login?role=organizer`).
   - After login, access Organizer Dashboard (`/organizer`):
     - Create new events.
     - Generate tickets for attendees.
     - Check-in attendees (scan QR codes).
     - View real‑time check‑in dashboard (`/tickets/dashboard`).

4. **Staff**

   - Redirected to Login (`/login?role=staff`).
   - After login, access Staff Dashboard (`/staff`):
     - Purchase/generate tickets.
     - Check‑in attendees.
     - View upcoming events (no delete).

5. **Attendee**
   - Redirected to Attendee Dashboard (`/attendee`):
     - Purchase tickets (enter email & name).
     - Receive ticket email with QR code & event details.

---

## License

This project is licensed under the MIT License. Feel free to fork and adapt.
