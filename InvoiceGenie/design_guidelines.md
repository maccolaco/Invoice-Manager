# Invoice Management Application - Design Guidelines

## Design Approach: Productivity-First Design System

**Selected Approach:** Design System-Based (Carbon Design + Linear inspiration)
**Rationale:** Invoice management is a utility-focused, data-heavy productivity tool requiring clarity, efficiency, and professional aesthetics. Drawing from Linear's clean typography and Carbon's structured layouts for enterprise data applications.

---

## Core Design Principles

1. **Data Clarity First** - Information hierarchy prioritizes quick scanning and decision-making
2. **Professional Trust** - Clean, confident design that conveys reliability for financial data
3. **Efficient Workflows** - Minimal clicks, clear actions, predictable patterns
4. **Contextual Density** - Dense where needed (tables), spacious where helpful (forms, dashboards)

---

## Color Palette

### Light Mode
- **Primary:** 220 85% 35% (deep blue - trust, professionalism)
- **Background:** 0 0% 100% (pure white)
- **Surface:** 220 20% 98% (subtle off-white for cards)
- **Border:** 220 15% 90% (soft dividers)
- **Text Primary:** 220 15% 15% (near black)
- **Text Secondary:** 220 10% 45% (muted gray)

### Dark Mode
- **Primary:** 220 90% 65% (brighter blue for contrast)
- **Background:** 220 15% 10% (deep charcoal)
- **Surface:** 220 12% 14% (elevated cards)
- **Border:** 220 10% 22% (subtle dividers)
- **Text Primary:** 220 10% 95% (near white)
- **Text Secondary:** 220 8% 65% (muted light gray)

### Status Colors
- **Paid:** 142 76% 36% (green)
- **Unpaid:** 38 92% 50% (amber)
- **Overdue:** 0 84% 60% (red)
- **Draft:** 220 15% 55% (neutral gray)

---

## Typography

**Font Stack:** Inter (via Google Fonts CDN)

- **Headings:** 
  - H1: font-semibold text-3xl tracking-tight
  - H2: font-semibold text-2xl
  - H3: font-medium text-xl
  - H4: font-medium text-lg

- **Body:**
  - Base: text-sm (14px) for dense data tables
  - Large: text-base (16px) for forms, descriptions
  - Small: text-xs (12px) for metadata, captions

- **Data/Numbers:** font-mono for invoice numbers, amounts (tabular alignment)

---

## Layout System

**Spacing Units:** Tailwind units of 2, 4, 6, 8, 12, 16, 20
- Tight spacing: gap-2, p-2 (table cells, compact lists)
- Standard: gap-4, p-4, m-4 (cards, general layout)
- Generous: p-8, gap-8 (page sections, modal spacing)

**Grid System:**
- Dashboard: 3-column on desktop (lg:grid-cols-3), stack on mobile
- Invoice table: Full-width with sticky header
- Forms: 2-column on desktop (lg:grid-cols-2), stack on mobile

**Container Strategy:**
- Main content: max-w-7xl mx-auto px-4
- Modals/dialogs: max-w-2xl
- Forms: max-w-3xl

---

## Component Library

### Navigation
- **Sidebar:** Fixed left navigation (w-64), collapsible on mobile
- **Sections:** Dashboard, Invoices, Calendar, Reports, Settings
- **Active state:** bg-primary/10 with left border accent

### Data Tables
- **Header:** Sticky, bg-surface, font-medium, text-xs uppercase tracking-wide
- **Rows:** Hover state with subtle bg-surface, clickable to detail view
- **Cells:** py-3 px-4, text-sm, border-b
- **Actions:** Icon buttons (edit, delete) revealed on row hover

### Cards
- **Container:** bg-surface rounded-lg border shadow-sm p-6
- **KPI Cards:** Grid layout with icon, value (text-3xl font-bold), label (text-sm text-muted)
- **Invoice Card:** Preview with status badge, key fields, action buttons

### Forms
- **Inputs:** border rounded-md px-3 py-2, focus:ring-2 ring-primary/30
- **Labels:** font-medium text-sm mb-1.5
- **Upload Zone:** Dashed border, centered icon and text, drag-drop active state
- **Validation:** Red text-xs below field, red border on error

### Buttons
- **Primary:** bg-primary text-white px-4 py-2 rounded-md font-medium
- **Secondary:** border border-border text-primary bg-transparent
- **Ghost:** text-primary hover:bg-surface (for table actions)
- **Icon Only:** p-2 rounded-md (edit, delete, calendar actions)

### Status Badges
- **Pill shape:** px-2.5 py-0.5 rounded-full text-xs font-medium
- **Colors:** Match status colors with 10% opacity background

### Modals/Dialogs
- **Overlay:** bg-black/50 backdrop-blur-sm
- **Panel:** bg-background rounded-lg shadow-xl max-w-2xl
- **Header:** border-b p-6, title + close button
- **Content:** p-6, scrollable if needed
- **Footer:** border-t p-4, action buttons right-aligned

### Calendar Integration
- **Month View:** Grid with date cells, invoice dots as colored indicators
- **Event Cards:** Mini cards with invoice number, vendor, amount
- **Today Highlight:** Ring or subtle background

### Dashboard Layout
- **Top Row:** 4 KPI cards (grid-cols-1 md:grid-cols-2 lg:grid-cols-4)
- **Middle:** Line chart for monthly trends (h-64 to h-80)
- **Bottom:** Recent invoices table preview (5-10 rows)

---

## Images & Visual Assets

**Icons:** Heroicons (via CDN) - outline style for navigation, solid for status indicators

**No Hero Image** - This is a productivity tool, not a marketing page. Launch directly into the dashboard/login.

**PDF Previews:** Embedded in detail view with scrollable container, border, shadow

**Empty States:** Centered icon + heading + description for empty tables/calendars

---

## Animation Guidelines

**Minimal & Purposeful:**
- Page transitions: Simple fade-in (150ms)
- Modal entrance: Scale from 95% to 100% + fade (200ms)
- Table row hover: Instant background change (no transition)
- Notifications: Slide from top-right (300ms)

**No scroll animations, parallax, or decorative effects** - maintain focus on data and functionality.

---

## Accessibility & Dark Mode

- Maintain WCAG AA contrast ratios in both modes
- All interactive elements have visible focus states (ring-2 ring-primary/50)
- Form inputs maintain background visibility in dark mode
- Status colors tested for color-blind accessibility