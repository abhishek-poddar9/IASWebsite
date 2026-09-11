# Intime Advisory Services — Office Management & CRM

A full-stack MERN office workspace designed for a CA / advisory services firm. The app combines client CRM, recurring compliance tracking and daily office operations in one role-based system.

## Premium UI edition

This build includes a complete visual redesign for **Intime Advisory Services**:

- Original IAS monogram logo and favicon
- Premium navy / teal / gold advisory-firm branding
- Animated, human-designed login experience
- Responsive admin/employee workspace
- Modern dashboard with live KPI cards, client-health visualization and workflow shortcuts
- Smooth page entrances, hover interactions, floating accents and micro-animations
- Premium tables, forms, employee cards and modal dialogs
- Mobile navigation and responsive layouts
- Reduced-motion accessibility support

Animations are implemented with CSS, so no additional animation package is required.

## Main modules

- Admin and Employee authentication
- Dashboard
- Clients & CRM
- CA service mapping
- Compliance tracker and due dates
- Task assignment and status tracking
- Client follow-ups
- Attendance
- Employee management (Admin)
- Office expenses (Admin)

### CA / advisory services supported

- Income Tax Return
- GST Registration / GST Return
- TDS Return
- ROC / MCA Filing
- Company / LLP Registration
- Tax Audit
- Accounting / Bookkeeping
- Payroll
- DSC
- PAN / TAN
- Notice Response

## Stack

**Frontend:** React, React Router, Vite, Axios, Lucide React  
**Backend:** Node.js, Express, MongoDB, Mongoose, JWT

## Run locally

### 1. Start MongoDB

Use local MongoDB or MongoDB Atlas.

### 2. Server

```bash
cd server
cp .env.example .env
npm install
npm run seed
npm run dev
```

Update `MONGO_URI` inside `.env` if needed.

### 3. Client

Open a second terminal:

```bash
cd client
cp .env.example .env
npm install
npm run dev
```

Open the URL shown by Vite, normally `http://localhost:5173`.

## Demo accounts

**Admin**  
Email: `admin@caoffice.local`  
Password: `Admin@123`

**Employee**  
Email: `amit@caoffice.local`  
Password: `Employee@123`

> Change demo credentials before real office deployment.

## Role access

### Admin / Papa

Full access to clients, compliance, tasks, follow-ups, attendance, employees and expenses.

### Employee

Limited operational access based on assigned work. Admin-only employee/expense screens remain protected.

## Brand files

- `client/src/components/BrandLogo.jsx` — reusable custom IAS logo
- `client/public/brand-mark.svg` — favicon / compact brand icon
- `client/src/styles.css` — complete premium design system and animations

## Production recommendations

Before using this with real client data, add stronger production security, backups, audit logs, document-storage controls, HTTPS, secure secrets, account recovery, validation and deployment monitoring. CA client records can contain sensitive financial information, so production access should be reviewed carefully.

## Visual reference

`DESIGN-PREVIEW.png` is included as the visual direction/reference used for the premium interface. The live React UI uses reusable components and CSS rather than embedding the screenshot as the application itself.
