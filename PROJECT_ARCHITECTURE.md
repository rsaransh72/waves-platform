# Waves Platform Architecture

## Overview
Waves Platform is an Enterprise Resource Planning (ERP) and SaaS ecosystem designed for diverse industries, offering specialized suites for hospitals, schools, and pharmacies, alongside a marketplace and a centralized administrative control panel.

The application uses a modern React stack, featuring Server-Side Rendering (SSR) via Next.js and real-time backend capabilities using Supabase.

## Tech Stack
- **Framework**: Next.js 16 (App Router)
- **Library**: React 19
- **Styling**: Tailwind CSS v4, Custom UI components (clsx, tailwind-merge)
- **State Management**: Zustand
- **Icons**: Lucide React
- **Backend/Database**: Supabase (PostgreSQL, Realtime, Auth, Storage)

## Application Structure

### 1. Web & Application Routes (`src/app/`)
The application is structured into multiple product suites and functional domains using the Next.js App Router:
- **Admin Portal (`/admin`)**: A centralized dashboard for platform administration, featuring real-time data sync, feature flags, and CMS management.
- **Product Suites**:
  - `hospital-erp/`: Specialized ERP for healthcare institutions.
  - `school-erp/`: Comprehensive management suite for educational institutions.
  - `pharmacy-pos/`: Point of Sale and inventory system for pharmacies.
  - `erp/`: Generic enterprise resource planning solutions.
- **Commercial Pages**:
  - `book-demo/`: Lead generation and scheduling.
  - `contact/`, `pricing/`, `products/`, `services/`, `suites/`, `marketplace/`: Marketing and informational pages.
- **Authentication**: `login/`, `signin/`, `signup/`.
- **API**: Internal API routes under `api/`.

### 2. UI Components (`src/components/`)
Reusable components driving the platform's user interface. Notable components include:
- **Client & Server Navbars**: `Navbar.tsx`, `ClientNavbar.tsx`.
- **Interactive Demos**: `HospitalConsoleDemo.tsx`, `PharmacyDashboardDemo.tsx`, `SchoolConsoleDemo.tsx`, `ErpConsoleDemo.tsx`.
- **Domain-Specific Helpers**: `HospitalProblemsSolver.tsx`, `PharmacyProblemsSolver.tsx`, `SchoolProblemsSolver.tsx`.
- **Forms**: `BookDemoForm.tsx`.

### 3. State & Utilities (`src/store/` & `src/lib/`)
- **Store**: Uses Zustand (`adminStore.ts`) for managing client-side global state, particularly for the admin interface.
- **Lib**: Contains data constants (`appsData.ts`) and Supabase client initializers (`supabase.ts`, `supabase-browser.ts`).

## Database Architecture (Supabase / PostgreSQL)

The platform relies on a normalized PostgreSQL schema with several distinct domains, managed via migrations (`supabase/` directory). Real-time functionality is enabled via Supabase Realtime subscriptions.

### Core Tables:
- **`organizations`**: Stores tenant data for schools, hospitals, pharmacies, etc. Fields include slug, type, contact info, and status.
- **`organization_members`**: Manages user associations to organizations and their Role-Based Access Control (RBAC) (roles: owner, admin, doctor, teacher, pharmacist, staff).
- **`leads`**: Captures demo requests and inquiries from the website.

### Content Management System (CMS) Tables:
- **`products` & `services`**: Stores detailed data for product offerings, features, pricing, SEO metadata, and visibility states (draft/published).
- **`pages` & `menus`**: Manages dynamic page content blocks and navigation structures.

### Realtime & Administration Tables:
- **`feature_flags`**: Toggles features on/off dynamically.
- **`audit_logs`**: Tracks administrative and system actions for accountability (powered by PostgreSQL triggers).

### Realtime Pub/Sub:
Supabase Realtime is explicitly enabled on the following tables to provide live updates to the UI (specifically the admin portal):
- `products`, `suites`, `audit_logs`, `organizations`, `leads`, `feature_flags`.

## Security & Access Control
- **Row Level Security (RLS)**: Enforced across tables (`organizations`, `leads`, `feature_flags`, etc.) to ensure tenant data isolation and secure access.
- **Public Policies**: Explicit policies exist allowing anonymous users to submit data to the `leads` table. Admin panels bypass specific restrictions when authenticated.
