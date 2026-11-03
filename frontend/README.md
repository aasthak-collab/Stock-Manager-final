# Om Sai Enterprises: Stock Management System

A full-stack web app for managing construction material stock, purchases, sales, payments and worker attendance. Built for Om Sai Enterprises. Works on laptop, tablet and phone, in English and Hindi.

## Features

### Stock
- Live stock view with search
- Add or deduct stock manually, with a full transaction history
- Minimum stock level per item, with low-stock alerts
- 57 preloaded items (pipes, angles, flats, bars, sheets), each size or variant tracked separately
- Searchable item dropdown in Purchases and Sales

### Purchases
- Multiple items in a single purchase entry
- Supplier and invoice number recorded
- Stock and ledger update automatically
- Upload the supplier bill (image or PDF); photos are compressed automatically, 2 MB max

### Sales
- Records buyer, quantity, rate and total
- Blocks a sale if stock is insufficient
- Stock and ledger update automatically
- Upload the sale bill (image or PDF)

### Payment Ledger
- All credits and debits in one place with running balance
- Sales, purchases and salaries post to the ledger automatically
- Manual entries supported

### Attendance and Salary
- Daily register: Present, Half day, Absent, with an optional note
- Monthly salary calculated from attendance and daily rate
- Salary payout posts to the ledger

### Analysis
- Monthly and yearly sales charts
- Downloadable PDF report

### Suppliers
- Supplier directory with contact details, order history and total spend

### Security and Administration
- Email and password login (JWT, bcrypt-hashed passwords)
- Google sign-in with an account picker
- Admin and staff roles; Audit Log and Settings are admin-only
- Admin limit configurable through the `MAX_ADMINS` environment variable
- Audit log of every change, with who made it
- User management and password change in Settings
- One-click JSON data backup

### Interface
- English / Hindi toggle
- Responsive layout (sidebar on desktop, drawer on phone)
- Light theme with Om Sai branding

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js (App Router), React, TypeScript, Tailwind CSS v4 |
| UI libraries | Recharts, Lucide icons, jsPDF, html2canvas, i18next |
| Auth | JWT + bcryptjs, NextAuth.js (Google OAuth) |
| Backend | Node.js, Express, TypeScript |
| ORM | Prisma 5 |
| Database | PostgreSQL (Supabase) |
| Hosting | Vercel (frontend), Render (backend), UptimeRobot (keep-alive) |

## Project Structure

```
Stock manager/
  frontend/
    app/               pages: stock, purchases, sales, ledger,
                       attendance, analysis, suppliers, audit, settings, login
    app/components/    Sidebar, Topbar, ItemSelect, BillUpload, AuthGuard, RoleGuard
    app/locales/       en.json, hi.json
    libraries/axios.ts API client
  backend/
    prisma/schema.prisma
    src/
      index.ts         server entry
      routes/          stock, purchases, sales, ledger, attendance,
                       auth, suppliers, settings, audit, dashboard
      seed.ts          preloads the stock items
```

## Local Setup

### Prerequisites
- Node.js 18+
- A Supabase project (PostgreSQL)
- A Google OAuth client (only needed for Google sign-in)

### Backend
```bash
cd backend
npm install
```
Create `backend/.env`:
```env
DATABASE_URL="postgresql://..."
JWT_SECRET=your_long_random_secret
MAX_ADMINS=3
FRONTEND_URL=http://localhost:3000
```
Then:
```bash
npx prisma db push
npx prisma generate
npx ts-node src/seed.ts     # loads the stock items
npm run dev                 # http://localhost:5000
```

### Frontend
```bash
cd frontend
npm install
```
Create `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_long_random_secret
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
ALLOWED_EMAILS=you@gmail.com
```
Then:
```bash
npm run dev                 # http://localhost:3000
```

### First admin account
```powershell
Invoke-WebRequest -Uri "http://localhost:5000/api/auth/register" -Method POST -ContentType "application/json" -Body '{"name":"Admin","email":"admin@example.com","password":"ChangeMe123","role":"admin"}'
```
Registration is open only until `MAX_ADMINS` admins exist. After that, only a logged-in admin can add users.

## Deployment

| Service | Settings |
|---|---|
| Render (backend) | Root Directory `backend`; Build `npm install && npx prisma generate && npm run build`; Start `npm start` |
| Vercel (frontend) | Root Directory `frontend` |
| UptimeRobot | Ping `https://<render-url>/health` every 5 minutes (keeps Render awake and Supabase from pausing) |

Set the environment variables above in each dashboard. After changing an environment variable, redeploy. `NEXT_PUBLIC_*` values are baked in at build time.

Pushing to `main` redeploys both automatically.

## Security Notes
- Never commit `.env` or `.env.local`
- Use strong values for `JWT_SECRET` and `NEXTAUTH_SECRET`
- Keep `FRONTEND_URL` on Render equal to the Vercel URL
- Download backups regularly from Settings

## Known Limitations
- Bills are stored in the database (2 MB max each); the free Supabase plan has 500 MB total
- The free Render server sleeps when idle (the UptimeRobot ping prevents this)
- Hindi translation covers navigation and top buttons; page-level labels are still English

## Roadmap
- Full Hindi translation of every page
- Link Google sign-in to backend roles
- Move bills to dedicated file storage if volume grows

## License
Private project built for Om Sai Enterprises.