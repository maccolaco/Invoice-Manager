# Invoice Management Application

## Overview

A desktop-native invoice management application built with React, Express, and TypeScript. The application enables users to upload PDF invoices (both text-based and scanned), automatically extract invoice data, track payables and receivables, manage payment status, and receive reminders for upcoming and overdue invoices. The system supports offline-first functionality with local user authentication and persistent data storage.

## User Preferences

Preferred communication style: Simple, everyday language.

## Replit Environment Setup (October 2025)

**Environment Configuration**
- Node.js 20 installed via Replit modules
- PostgreSQL database provisioned with DATABASE_URL set
- Development server runs on port 5000 (both API and frontend)
- Vite configured with `allowedHosts: true` for Replit proxy support
- Server binds to 0.0.0.0:5000 with port reuse enabled

**Deployment Configuration**
- Deployment target: autoscale (stateless web application)
- Build command: `cd InvoiceGenie && npm run build`
- Run command: `cd InvoiceGenie && npm start`
- Production server uses Node.js with bundled server code in dist/

**Database Setup**
- Drizzle ORM with PostgreSQL dialect
- Database migrations managed via `npm run db:push`
- Tables: users, invoices, line_items, reminders
- All migrations applied successfully

**File Structure**
- Project root: `/InvoiceGenie/`
- Client source: `client/src/`
- Server source: `server/`
- Shared types: `shared/`
- Build output: `dist/` (excluded from git)
- File uploads: `uploads/` (excluded from git)

## System Architecture

### Frontend Architecture

**Framework & Build System**
- React 18 with TypeScript for type-safe component development
- Vite as the build tool and dev server for fast HMR and optimized production builds
- Wouter for lightweight client-side routing (Dashboard, Invoices, Calendar, Settings, Invoice Detail)

**UI Component Strategy**
- Shadcn/ui component library with Radix UI primitives for accessible, customizable components
- Tailwind CSS for utility-first styling with custom design tokens
- New York style variant with productivity-focused design system
- Custom CSS variables for theming (light/dark mode support via ThemeProvider)
- Design inspiration from Carbon Design and Linear for professional, data-dense interfaces

**State Management**
- Zustand for authentication state management (user session, login/logout)
- TanStack Query (React Query) for server state, caching, and data synchronization
- Local component state with React hooks for UI interactions

**Key Features**
- PDF upload with drag-and-drop interface (PDFUploadZone component)
- Invoice data table with filtering, search, and sorting capabilities
- Calendar view for tracking due dates and payment schedules
- Status badge system (paid, unpaid, overdue, draft) with color-coded indicators
- Dashboard with KPI cards and financial metrics visualization (Recharts)
- Responsive design with mobile-aware sidebar (Sheet component for mobile)

### Backend Architecture

**Server Framework**
- Express.js for RESTful API endpoints
- Session-based authentication using express-session with secure HTTP-only cookies
- Bcrypt for password hashing (10 rounds)
- Multer middleware for PDF file uploads (10MB limit)

**API Structure**
- `/api/auth/*` - Authentication endpoints (register, login, logout, session check)
- `/api/invoices/*` - Invoice CRUD operations with user-scoped access
- File upload handling with temporary storage in `uploads/` directory
- Request/response logging middleware for API monitoring

**Data Layer Abstraction**
- IStorage interface defining contract for data operations
- MemStorage class providing in-memory implementation (development/testing)
- Drizzle ORM configured for PostgreSQL with schema-first approach
- Migration support via drizzle-kit

### Database Schema (PostgreSQL with Drizzle ORM)

**Tables**
1. **users** - User accounts with email/password authentication
   - UUID primary key (auto-generated)
   - Unique email constraint
   - Timestamps for account creation

2. **invoices** - Core invoice records
   - UUID primary key with user foreign key (cascade delete)
   - Invoice metadata: number, type (payable/receivable), vendor/customer
   - Financial data: subtotal, tax, total, currency (default USD)
   - Dates: issue_date, due_date
   - Status tracking: draft, unpaid, paid, overdue
   - JSON field for extracted OCR data
   - File path reference for uploaded PDF
   - Notes field for additional information

3. **line_items** - Invoice line item details
   - UUID primary key with invoice foreign key (cascade delete)
   - Description, quantity, unit price, calculated amount

4. **reminders** - Scheduled reminder system
   - UUID primary key with invoice foreign key (cascade delete)
   - remind_at timestamp for notification scheduling
   - sent boolean flag to track delivery status

**Data Validation**
- Zod schemas generated from Drizzle tables for runtime validation
- Type-safe insert/update schemas exported from shared schema

### Authentication & Authorization

**Strategy**
- Session-based authentication (no JWT, works offline)
- Server-side session storage with configurable store (connect-pg-simple for PostgreSQL)
- 7-day session expiry with HTTP-only, secure cookies in production
- requireAuth middleware for protecting API routes
- User-scoped data access (all queries filtered by userId)

**Security Measures**
- Password hashing with bcrypt (salt rounds: 10)
- CSRF protection via same-site cookie policy
- Input validation with Zod schemas
- SQL injection prevention via Drizzle ORM parameterized queries

### File Processing Architecture

**PDF Upload Flow**
1. Client uploads PDF via multipart/form-data (Multer middleware)
2. Server stores file temporarily in uploads/ directory
3. File path saved to invoice record for retrieval
4. Planned: OCR extraction for scanned invoices (Tesseract integration)
5. Planned: Text extraction for digital PDFs (pdf.js/pdfplumber)
6. Extracted data stored in extractedJson field for review/editing

### Development & Build Configuration

**TypeScript Configuration**
- Strict mode enabled for type safety
- Path aliases: `@/` for client, `@shared/` for shared types
- ESNext module system with bundler resolution
- Incremental builds with tsbuildinfo caching

**Build Process**
- Development: tsx for server, Vite dev server for client
- Production: esbuild bundles server to dist/, Vite builds client to dist/public
- Single-command deployment with static file serving

**Development Tools**
- Replit-specific plugins: cartographer, dev banner, runtime error overlay
- Hot module replacement for instant updates
- PostCSS with Tailwind and autoprefixer

## External Dependencies

### Core Framework Dependencies
- **@neondatabase/serverless** - Serverless Postgres driver for Neon database
- **drizzle-orm** - Type-safe SQL ORM with PostgreSQL dialect
- **express** - Web server framework
- **express-session** - Session middleware with cookie-based persistence
- **connect-pg-simple** - PostgreSQL session store

### Frontend Libraries
- **React** - UI framework
- **@tanstack/react-query** - Server state management and data fetching
- **wouter** - Lightweight routing library
- **zustand** - Lightweight state management for auth

### UI Component Dependencies
- **@radix-ui/react-\*** - Accessible unstyled component primitives (25+ components)
- **tailwindcss** - Utility-first CSS framework
- **class-variance-authority** - CVA for variant-based component styling
- **cmdk** - Command palette component
- **recharts** - Chart library for data visualization
- **lucide-react** - Icon library
- **react-day-picker** - Calendar/date picker

### Security & Validation
- **bcrypt** - Password hashing
- **zod** - Runtime type validation
- **drizzle-zod** - Zod schema generation from Drizzle tables

### File Processing
- **multer** - Multipart form data handling for file uploads
- **@types/multer** - TypeScript definitions

### Build Tools
- **vite** - Build tool and dev server
- **esbuild** - JavaScript bundler for server code
- **tsx** - TypeScript executor for development
- **@vitejs/plugin-react** - React support for Vite
- **postcss** - CSS transformation
- **autoprefixer** - CSS vendor prefixing

### Database & Migration Tools
- **drizzle-kit** - Database migration management
- **pg** (implied via @neondatabase/serverless) - PostgreSQL client

### Fonts
- **Google Fonts (Inter)** - Primary typography via CDN link in index.html