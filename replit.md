# AI Employee Background Checker

## Overview

This is a SaaS web application for AI-powered employee background verification. The platform allows HR professionals to upload employee information (single or bulk), automatically trigger background checks, and view detailed reports with risk assessments. Built with Next.js 14, it features a modern dashboard interface for managing employees, jobs, and reports with role-based access control.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: Next.js 14 with App Router and React 18
- **Styling**: Tailwind CSS with dark theme by default
- **UI Components**: shadcn/ui library with Radix UI primitives
- **State Management**: TanStack Query (React Query) for server state
- **Form Handling**: React Hook Form with Zod validation
- **Client-side Routing**: Next.js App Router with nested layouts

### Backend Architecture
- **Server Framework**: Express.js with custom API routes
- **Database Integration**: Drizzle ORM configured for PostgreSQL
- **In-memory Storage**: MemStorage class for development/demo purposes
- **Authentication**: Simple session-based auth with cookie storage
- **API Structure**: RESTful endpoints under `/api/*` namespace

### Data Layer
- **Database**: PostgreSQL (configured via Drizzle)
- **Schema Design**: 
  - Users table with role-based access (admin/hr_user)
  - Employees table with personal information
  - Background jobs table tracking processing status and results
- **ORM**: Drizzle ORM with TypeScript support and migrations

### Authentication & Authorization
- **Authentication Method**: Email/password with session cookies
- **Session Management**: HTTP-only cookies with configurable expiration
- **Role System**: Admin and HR user roles with different permissions
- **Route Protection**: Middleware-based auth checks for API routes

### Key Design Patterns
- **Monorepo Structure**: Shared schemas and types between client/server
- **Component Composition**: shadcn/ui pattern with customizable variants
- **Server-side Rendering**: Next.js App Router with server components
- **Progressive Enhancement**: Client-side interactivity layered over server rendering
- **Type Safety**: End-to-end TypeScript with Zod schema validation

## External Dependencies

### Core Frameworks
- **Next.js**: Web framework with App Router
- **React**: UI library with hooks and context
- **Express**: Backend server framework
- **Vite**: Build tool for development

### Database & ORM
- **Drizzle ORM**: Type-safe database toolkit
- **@neondatabase/serverless**: PostgreSQL client for Neon
- **Drizzle Kit**: Migration and introspection tools

### UI & Styling
- **Tailwind CSS**: Utility-first CSS framework
- **Radix UI**: Headless UI component primitives
- **shadcn/ui**: Pre-built component library
- **Lucide React**: Icon library

### Form & Validation
- **React Hook Form**: Form state management
- **Zod**: Schema validation library
- **@hookform/resolvers**: Zod resolver for forms

### State Management
- **TanStack Query**: Server state management
- **React Context**: Client-side state for auth

### Development Tools
- **TypeScript**: Static type checking
- **ESLint**: Code linting
- **PostCSS**: CSS processing with Autoprefixer

### Utility Libraries
- **date-fns**: Date manipulation and formatting
- **clsx & tailwind-merge**: Conditional CSS class handling
- **jsPDF**: Client-side PDF generation for reports