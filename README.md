# Overview

This is a bilingual (Vietnamese/English) recruiting website with an admin dashboard for content management. The application enables companies to showcase job opportunities and manage recruitment content through a secure admin interface. The public-facing landing page displays hero content, job listings, and company information, while the admin panel allows authenticated users to manage hero sections and job postings.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

**Framework & Routing**: React SPA using Vite as the build tool and Wouter for client-side routing. The application follows a component-based architecture with clear separation between public landing pages and protected admin pages.

**UI Component System**: Built on shadcn/ui (Radix UI primitives) with Tailwind CSS for styling. Uses the "new-york" style variant with custom theme variables for consistent design across light/dark modes. Component library includes extensive form controls, dialogs, navigation elements, and data display components.

**State Management**: 
- TanStack Query (React Query) for server state and caching
- React Context API for global state (authentication, language preferences)
- Session-based authentication state synchronized with backend

**Internationalization**: Custom i18n implementation using React Context. Language preference persists in localStorage. All content (hero sections, job listings) stored bilingually in database with language-specific fields (e.g., `titleVi`, `titleEn`).

**Design System**: Material Design-inspired admin interface with reference-based landing page design. Uses Inter/Poppins typography, consistent spacing scale (Tailwind's 4/8/12/16px units), and component-level animations via Framer Motion.

## Backend Architecture

**Server Framework**: Express.js with TypeScript running on Node.js. Development uses tsx for hot reloading, production uses esbuild for bundling.

**Session Management**: Express-session middleware with secure HTTP-only cookies. Session configured for 24-hour expiration with environment-specific security settings (secure cookies in production).

**Authentication Strategy**: Credential-based authentication using bcrypt for password hashing. No OAuth/third-party providers. Admin users authenticate via email/password, session persists userId. `requireAuth` middleware protects admin routes.

**API Design**: RESTful endpoints organized by resource:
- `/api/auth/*` - Authentication (login, logout, session verification)
- `/api/hero` - Hero section CRUD (upsert pattern for single hero)
- `/api/jobs/*` - Job listing CRUD operations

**Data Layer**: Repository pattern via `DatabaseStorage` class implementing `IStorage` interface. Abstracts database operations from route handlers. Uses Drizzle ORM for type-safe database queries.

## Database Architecture

**ORM & Schema**: Drizzle ORM with PostgreSQL dialect. Schema defined in `shared/schema.ts` using Drizzle's table builders and Zod for validation.

**Tables**:
- `admin_users`: Authentication (id, email, hashed password, name)
- `heroes`: Bilingual hero content (titles, subtitles, CTA text, background media URLs in both languages)
- `jobs`: Bilingual job postings (title, department, location, salary, requirements, description in both languages; active status, application links)

**Migration Strategy**: Drizzle Kit for schema migrations with output to `./migrations` directory. Manual schema changes followed by `db:push` for development.

**Data Validation**: Zod schemas generated from Drizzle tables via `createInsertSchema`. Validates request payloads before database operations.

## Build & Deployment

**Build Process**: Custom build script (`script/build.ts`) that:
1. Builds client SPA with Vite (outputs to `dist/public`)
2. Bundles server with esbuild (outputs to `dist/index.cjs`)
3. Bundles specific dependencies (allowlist) to reduce file I/O for faster cold starts
4. Externalizes remaining dependencies

**Development**: Vite dev server in middleware mode for HMR. Server and client run as single process. Custom error overlay and Replit-specific plugins for development experience.

**Static File Serving**: Express serves compiled Vite output from `dist/public`. All non-API routes fall through to `index.html` for client-side routing.

# External Dependencies

## Database
- **PostgreSQL**: Primary data store, connection via `DATABASE_URL` environment variable
- **Drizzle ORM**: Type-safe database queries and schema management
- **pg**: Node.js PostgreSQL client (connection pooling via `pg.Pool`)

## Authentication & Security
- **bcryptjs**: Password hashing (10 rounds)
- **express-session**: Server-side session management
- **connect-pg-simple**: PostgreSQL-backed session store (optional, currently using in-memory)

## UI & Styling
- **Radix UI**: Unstyled accessible component primitives (20+ components)
- **Tailwind CSS**: Utility-first CSS framework with custom theme
- **Framer Motion**: Animation library for landing page interactions
- **Lucide React**: Icon library

## Development Tools
- **Vite**: Frontend build tool and dev server
- **esbuild**: Server bundler for production
- **tsx**: TypeScript execution for development
- **TypeScript**: Type safety across full stack

## Form Handling
- **React Hook Form**: Form state management
- **@hookform/resolvers**: Zod resolver integration
- **Zod**: Runtime type validation and schema definition

## Date Handling
- **date-fns**: Date formatting and manipulation utilities

## Notable Architectural Decisions

**Why single database table for hero**: Application assumes single hero section per site. Upsert pattern simplifies management—no need to handle multiple hero records or selection logic.

**Why session-based auth over JWT**: Simpler revocation, smaller payload size, leverages Express-session ecosystem. Session stored server-side with secure cookies for session ID.

**Why Drizzle over Prisma**: Lighter weight, generates SQL closer to raw queries, better TypeScript inference for complex queries, fewer runtime dependencies.

**Why custom i18n over library**: Simple bilingual requirement doesn't justify i18next overhead. Custom Context solution provides exactly needed functionality with minimal complexity.

**Why React Query**: Declarative data fetching, automatic background refetching, built-in loading/error states, optimistic updates. Reduces boilerplate compared to manual fetch management.

**Why monorepo structure with shared types**: Ensures type safety between client and server. Shared schema definitions prevent API contract mismatches. Single source of truth for data models.