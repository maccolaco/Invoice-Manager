# Invoice Management Application

## Overview

A full-stack invoice management application built with React, Express, and PostgreSQL. The application enables users to upload PDF invoices, automatically extract invoice data, track payables and receivables, manage invoice statuses, and receive reminders for upcoming/overdue payments. Designed with a productivity-first approach inspired by Linear and Carbon Design System, emphasizing clarity, efficiency, and professional aesthetics for financial data management.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Tooling**
- React 18 with TypeScript for type-safe component development
- Vite as the build tool providing fast HMR in development and optimized production builds
- Wouter for lightweight client-side routing (avoiding heavier solutions like React Router)

**UI Component System**
- Shadcn/ui component library built on Radix UI primitives for accessible, customizable components
- Tailwind CSS with custom design tokens following productivity-first design guidelines
- Custom CSS variables for theme support (light/dark mode)
- Inter font family via Google Fonts CDN for consistent typography

**State Management**
- TanStack Query (React Query) for server state management, caching, and data fetching
- Zustand for client-side authentication state
- React Hook Form with Zod resolvers for form validation

**Page Structure**
- Dashboard: KPI metrics, charts (via Recharts), recent invoices overview
- Invoices: Searchable/filterable table with PDF upload capability
- Invoice Detail: Full invoice view with editing capabilities and line items
- Calendar: Month view showing invoice due dates and payment reminders
- Settings: User preferences for currency, notifications, and reminder timing
- Login/Register: Authentication pages with form validation

### Backend Architecture

**Server Framework**
- Express.js with TypeScript for the API layer
- Session-based authentication using express-session
- Bcrypt for password hashing
- Multer for PDF file upload handling (10MB limit, uploads stored in `uploads/` directory)

**API Structure**
- RESTful endpoints under `/api` prefix
- Authentication endpoints: `/api/auth/register`, `/api/auth/login`, `/api/auth/logout`, `/api/auth/me`
- Invoice CRUD operations: GET/POST/PUT/DELETE `/api/invoices`
- Line items management nested under invoice endpoints
- Reminder management endpoints
- Authentication middleware (`requireAuth`) protecting all invoice-related routes

**Development Server**
- Vite middleware integration for development HMR
- Custom request logging middleware for API calls
- Hot module replacement with runtime error overlay (Replit plugins)
- Binds to 0.0.0.0:5000 with port reuse enabled for Replit environment

### Data Storage

**Database**
- PostgreSQL as the primary database
- Drizzle ORM for type-safe database queries and schema management
- Neon Database serverless PostgreSQL driver (@neondatabase/serverless)

**Schema Design**
- `users` table: id (UUID), email (unique), password (hashed), createdAt
- `invoices` table: id, userId (FK), invoiceNumber, type (payable/receivable), vendorCustomer, issueDate, dueDate, subtotal, tax, total, currency, status (draft/unpaid/paid/overdue), extractedJson (JSONB), filePath, notes, timestamps
- `line_items` table: id, invoiceId (FK), description, qty, unitPrice, amount
- `reminders` table: id, invoiceId (FK), remindAt (timestamp), sent (boolean)
- All foreign keys configured with cascade deletes
- UUIDs generated via PostgreSQL's `gen_random_uuid()`

**Migration Management**
- Drizzle Kit for schema migrations
- Migration files stored in `migrations/` directory
- Push schema changes via `npm run db:push`

**Storage Implementation**
- Interface-based storage abstraction (IStorage) allowing for multiple implementations
- MemStorage class providing in-memory implementation for development/testing
- Designed to easily swap to Drizzle-based PostgreSQL implementation

### Authentication & Authorization

**Authentication Strategy**
- Session-based authentication with HTTP-only cookies
- Session secret configured via environment variable (SESSION_SECRET)
- 7-day session expiration
- Secure cookies in production (httpOnly, secure flags)
- Password requirements enforced via Zod schemas

**Authorization Pattern**
- User ID stored in session after successful login
- Middleware function (`requireAuth`) validates session before accessing protected routes
- User-scoped data queries (all invoices filtered by userId)
- No external authentication providers (fully offline-capable)

### PDF Processing (Planned Feature)

**Extraction Strategy**
- Text-based PDFs: Direct extraction using pdf.js or pdfplumber
- Scanned PDFs: OCR processing using Tesseract
- Fields to extract: invoice_number, vendor_customer, issue_date, due_date, subtotal, tax, total, currency, line_items, notes
- Extracted data stored in `extractedJson` JSONB field
- Original PDF files stored in `uploads/` directory with path reference in database

### Notification System (Planned Feature)

**Reminder Configuration**
- Default reminder schedule: 7 days before, 1 day before, due date, 3 days after due
- User-configurable reminder preferences in Settings
- Status-based reminder logic (only for unpaid/overdue invoices)

**Desktop Notifications**
- Local desktop notifications for upcoming/overdue invoices
- Background process to check pending reminders
- Reminders marked as sent to prevent duplicates

## External Dependencies

**Core Libraries**
- React 18 & React DOM for UI
- Express for backend API server
- TypeScript for type safety across the stack
- Drizzle ORM with Neon Database serverless driver

**UI Component Libraries**
- Radix UI primitives (20+ components: Dialog, Dropdown, Select, Toast, Tooltip, etc.)
- Shadcn/ui component system
- Recharts for data visualization
- Lucide React for icons
- class-variance-authority for component variants
- cmdk for command palette functionality

**Form & Validation**
- React Hook Form for form state management
- Zod for schema validation
- @hookform/resolvers for React Hook Form + Zod integration

**Routing & State**
- Wouter for client-side routing
- TanStack Query for server state
- Zustand for client state

**Styling**
- Tailwind CSS with PostCSS
- tailwind-merge and clsx for conditional class merging

**Authentication & Security**
- bcrypt for password hashing
- express-session for session management
- connect-pg-simple for PostgreSQL session store (installed but not configured)

**File Handling**
- Multer for multipart/form-data file uploads

**Development Tools**
- Vite with React plugin
- tsx for TypeScript execution
- esbuild for production server bundling
- ESM module format throughout
- Replit-specific plugins: runtime error modal, cartographer, dev banner

**Build & Deployment**
- Build command: `npm run build` (Vite client build + esbuild server bundle)
- Production server: Node.js serving bundled code from `dist/`
- Development: `npm run dev` with tsx hot reload
- Database migrations: `npm run db:push`