# Waves Platform - Backend Execution Plan

This document tracks the strict "Pro Level" execution of the backend architecture for the Waves Platform ecosystem.

## Phase 1: Authentication & Tenant Isolation
- [ ] **Task 1.1**: Install `@supabase/ssr` and configure the secure Supabase client utilities (server, browser, middleware).
- [ ] **Task 1.2**: Implement `src/middleware.ts` to strictly protect all `/dashboard/*` routes and handle session refresh.
- [ ] **Task 1.3**: Wire up the UI for `src/app/signup/page.tsx` and `src/app/login/page.tsx` to handle real Supabase Auth flows (Email/Password).
- [ ] **Task 1.4**: Configure Multi-Tenant RLS (Row Level Security) context so users can only access their specific organization's data.
- **Status:** `PENDING`

## Phase 2: Database Schema (The Foundation)
- [ ] **Task 2.1**: Define the `organizations` table (tenant tracking).
- [ ] **Task 2.2**: Define the `profiles` table (users tied to auth.users and organizations).
- [ ] **Task 2.3**: Define the core app data tables (e.g., `students`, `patients`, `inventory`).
- [ ] **Task 2.4**: Write the secure RLS (Row Level Security) SQL policies for all tables.
- **Status:** `PENDING`

## Phase 3: The Unified Dashboard Layout
- [ ] **Task 3.1**: Build `src/app/dashboard/layout.tsx` featuring a premium, Zoho-style internal app shell (Sidebar, Top header, User Dropdown).
- [ ] **Task 3.2**: Create the dynamic routing structure for `/dashboard/school`, `/dashboard/health`, `/dashboard/pharmacy`.
- [ ] **Task 3.3**: Implement data fetching to display the logged-in user's profile and organization name in the UI.
- **Status:** `PENDING`
