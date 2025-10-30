# Sanki Yedim - "As If I Have Eaten"

## Overview

Sanki Yedim is a savings tracking web application inspired by the Turkish "As If I Have Eaten" Mosque story. The app helps users log purchases they chose not to make and track those decisions as savings. After adding entries, users can initiate transfers to move their virtual savings into real accounts. The application emphasizes a warm, encouraging user experience that celebrates small financial victories while maintaining clarity for tracking.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React with TypeScript using Vite as the build tool and dev server

**Routing**: Wouter for client-side routing with distinct public and app sections:
- Public routes: Landing page (`/`) and About page (`/about`)
- Protected app routes: Dashboard (`/dashboard`), Entries (`/entries`), Transfers (`/transfers`), Settings (`/settings`)

**UI Component Library**: Radix UI primitives with shadcn/ui styling system
- Design system based on "New York" variant with custom Tailwind configuration
- Color scheme uses HSL-based CSS variables for theming
- Typography: Merriweather (serif) for headlines, Inter (sans-serif) for UI and data
- Spacing system based on Tailwind's default scale

**State Management**:
- TanStack React Query for server state, data fetching, and cache management
- React Hook Form with Zod resolvers for form state and validation
- Local component state with React hooks

**Key UI Patterns**:
- Responsive design with mobile-first approach
- Card-based layouts for dashboard KPIs and data display
- Modal dialogs for transfer checklists and confirmations
- Toast notifications for user feedback
- Collapsible sections for detailed information

### Backend Architecture

**Runtime**: Node.js with Express.js server

**API Pattern**: RESTful JSON API with conventional HTTP methods
- `GET /api/entries` - List entries with optional filters
- `POST /api/entries` - Create new entry
- `GET /api/transfers` - List transfers
- `POST /api/transfers` - Create transfer from entries
- `POST /api/transfers/:id/complete` - Mark manual transfer complete
- `GET /api/preferences` - Get user preferences
- `PATCH /api/preferences` - Update preferences

**Middleware Stack**:
- Express JSON body parser with raw body capture for webhooks
- Custom request logging for API routes
- Rate limiting (60 requests per minute for write operations)
- Mock authentication (currently demo user only - `requireAuth` middleware)

**Data Layer Pattern**: Repository pattern via `IStorage` interface
- `DatabaseStorage` class implements all data access
- Abstracts Drizzle ORM queries behind clean interface
- Supports filtering, pagination, and relational queries

**Banking Integration Pattern**: Provider factory pattern for bank transfers
- `IBankProvider` interface defines capabilities and methods
- `ManualTransferProvider` - Default provider for manual transfers with checklist
- `PlaidSandboxProvider` - Demo provider simulating automated transfers
- `getProviderForUser()` selects provider based on user preferences
- Supports different transfer statuses: `pending_manual`, `scheduled`, `completed`, `failed`

### Data Storage

**ORM**: Drizzle ORM with type-safe schema definitions

**Database**: PostgreSQL via Neon serverless driver with WebSocket support

**Schema Design**:

**Users Table**:
- UUID primary key with auto-generation
- Email (unique), name, image fields
- Created timestamp

**Entries Table**:
- UUID primary key
- Foreign key to users (cascade delete)
- Item description, amount (decimal), category, note
- Date and creation timestamp
- Optional foreign key to transfers table

**Transfers Table**:
- UUID primary key
- Foreign key to users (cascade delete)
- Total amount (decimal)
- Method field: "manual" or "plaid_sandbox"
- Status field: "pending_manual", "scheduled", "completed", "failed"
- Created and completed timestamps

**Preferences Table**:
- UUID primary key
- Unique foreign key to users (cascade delete)
- Bank provider selection
- Account labels for manual transfers
- Plaid account IDs for automated transfers
- Monthly and yearly goal amounts (decimals)

**Migration Strategy**: Drizzle Kit for schema migrations to `./migrations` directory

### Authentication & Authorization

**Current Implementation**: Mock authentication using hardcoded demo user
- All requests authenticated as `DEMO_USER_ID`
- Email: `demo@sankiyedim.app`

**Planned Architecture** (per design doc): NextAuth.js with:
- Google OAuth provider
- Email magic link provider
- Session-based authentication

**Authorization**: User isolation via `userId` foreign keys and query filters

### Validation & Type Safety

**Schema Validation**: Zod schemas defined in shared schema file
- `entryCreateSchema` - Entry creation validation
- `transferCreateSchema` - Transfer creation validation
- `providerUpdateSchema` - Bank provider settings validation
- `preferencesUpdateSchema` - User preferences validation

**Type Generation**: Drizzle Zod integration generates TypeScript types from database schema
- `InsertUser`, `User` types for users table
- `InsertEntry`, `Entry` types for entries table
- `InsertTransfer`, `Transfer` types for transfers table
- `InsertPreference`, `Preference` types for preferences table

**Shared Types**: Common type definitions in `@shared` alias for use across client and server

## External Dependencies

### Database Service

**Neon Serverless PostgreSQL**:
- Accessed via `DATABASE_URL` environment variable
- WebSocket-based connection pooling
- Required for application startup (throws error if not provisioned)

### UI Component Libraries

**Radix UI**: Accessible, unstyled component primitives
- Dialog, Popover, Dropdown Menu, Select
- Accordion, Tabs, Collapsible
- Toast, Alert Dialog, Tooltip
- Form controls: Checkbox, Radio Group, Switch, Slider

**shadcn/ui**: Pre-styled components built on Radix UI
- Configured via `components.json`
- Custom theme based on "new-york" style
- Tailwind CSS integration with CSS variables

### Development Tools

**Vite Plugins**:
- `@vitejs/plugin-react` - React Fast Refresh
- `@replit/vite-plugin-runtime-error-modal` - Error overlay
- `@replit/vite-plugin-cartographer` - Development tooling (Replit only)
- `@replit/vite-plugin-dev-banner` - Development banner (Replit only)

**TypeScript**: Strict mode enabled with ESNext module resolution

### Utility Libraries

**date-fns**: Date manipulation and formatting
**clsx & tailwind-merge**: Conditional className composition via `cn()` utility
**class-variance-authority**: Type-safe component variant styling
**nanoid**: Unique ID generation

### Future External Services

**Plaid** (referenced but not yet implemented):
- Banking API integration for automated transfers
- Account linking and balance retrieval
- Transfer initiation (currently simulated via PlaidSandboxProvider)