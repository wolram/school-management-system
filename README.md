# School Management System — Full-day schedule and contract management for educational institutions

A full-stack web application for automating and optimizing the administration of student contracts, financial calculations, operational reports, and communications in schools offering full-day programs.

## Features

- User authentication with JWT and role-based access control (Admin, Manager, Operator)
- Academic structure management (Segments, Grades, Classes)
- Student registration with weekly contract matrix (Mon-Fri schedules, contracted services)
- Financial calculations including overtime, budgets, and discount simulations
- Pricing management with effective date ranges
- Data export to PDF, Excel, and Word
- Complete audit logging with IP/User-Agent tracking
- Email notification queue

## Tech Stack

### Backend
- Node.js + Express + TypeScript
- PostgreSQL + Prisma ORM
- JWT authentication + bcryptjs
- Zod validation
- ExcelJS, PDFKit, Docx for exports

### Frontend
- Next.js 14 + React 18 + TypeScript
- Tailwind CSS
- React Query for state management
- React Hook Form
- Recharts for dashboards

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 14+

### Installation

```bash
git clone https://github.com/wolram/school-management-system.git
cd school-management-system

# Backend
cd backend
npm install
cp .env.example .env
# Edit .env with your PostgreSQL credentials

# Database setup
npx prisma migrate dev --name init
npx prisma generate
npx prisma db seed  # Optional: seed initial data

# Frontend
cd ../frontend
npm install
```

### Running

```bash
# From root (runs both concurrently)
npm run dev

# Or separately:
cd backend && npm run dev   # http://localhost:5000
cd frontend && npm run dev  # http://localhost:3000
```

## Project Structure

```
school-management-system/
├── backend/              (Node.js + Express + TypeScript)
│   ├── src/
│   │   ├── config/       # Database, JWT, Email config
│   │   ├── middleware/    # Auth, Audit, Validation
│   │   ├── routes/       # API endpoints
│   │   ├── controllers/  # Request handlers
│   │   ├── services/     # Business logic
│   │   ├── types/        # TypeScript interfaces
│   │   └── utils/        # Helpers & validation
│   └── prisma/           # Database schema & migrations
│
├── frontend/             (Next.js 14 + React 18 + TypeScript)
│   ├── app/              # Pages & layouts
│   ├── components/       # React components
│   ├── lib/              # Utilities & API client
│   └── types/            # TypeScript types
│
├── docker-compose.yml    # Docker setup
└── nginx/                # Nginx configuration
```

## License

MIT
