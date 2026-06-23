# Avalon Sales Hub

## Project Overview
- **Name**: Avalon Sales Hub
- **Goal**: Internal sales OS for Avalon's team — leads, pipeline, clients, docs, and Google Workspace in one hub
- **Platform**: Cloudflare Pages + Hono (edge-deployed)
- **Tech Stack**: Hono · TypeScript · TailwindCSS (CDN) · Wrangler · Vite

## URLs
- **Sandbox**: https://3000-izyinhjkx67sghqv4s7fn-5185f4aa.sandbox.novita.ai
- **Auth**: PIN-based per-rep login (Tyler / Ryan / Jen)

## Features Completed

### Core Sales Views
- Today Dashboard, Pipeline (Kanban), Lead cards, Clients list
- Process, Forms, Scripts, Templates, Objections, Calculator, Academy
- Revenue / Financial Data Hub (admin-only)

### Rep System
- Color-coded rep pills on every lead card
- First-letter colored tiles (no initials avatars)
- Sidebar nav 13px font
- Per-role nav permission matrix

### User & Access Management (Admin-only)
- Users CRUD tab — edit name, role, color, PIN
- Roles & Permissions matrix — per-view toggle for all roles
- Workspace Connections grid — see all reps' Google connection status
- Login Audit tab — timestamped login history
- `avalonUsersV1` / `avalonLoginAuditV1` localStorage keys

### Google Workspace Hub (Integrations view)
- **Per-user isolation** — each rep connects their own Google account (`avalonUserGoogleV1[repId]`)
- **OAuth fixed** — nonce removed from implicit flow (no more Error 400)
- **Gmail tab**: thread list, read full threads, inline reply, compose new, trash, mark-read — all via Gmail API (real sends)
- **Calendar tab**: agenda / week / month views — ALL past+present+future events (no timeMin filter), create event, edit event (inline form with PATCH), delete event
- **Drive tab**: file browser, icon-coded file types, search, open/preview links
- **Homeworks tab**: push leads, visits, estimates to Zapier webhook
- Tab bar persists across tab switches; sign-in screen is user-branded

## Data Architecture
- **Storage**: `localStorage` exclusively (no server DB)
- **Keys**: `avalonClientsV1`, `avalonNavPermissions`, `avalonIntegrationsV1`, `avalonRepAuth`, `avalonUsersV1`, `avalonUserGoogleV1`, `avalonLoginAuditV1`
- **REPS array**: hardcoded in `reps.js`; patched in-memory by User Management on save
- **Google tokens**: `avalonUserGoogleV1` object keyed by `repId` → `{token, expiry, email, gmail, calendar, drive, connectedAt}`

## User Guide
1. Open the hub → select your rep tile → enter PIN
2. Navigate via sidebar (role-gated views auto-hide for non-admins)
3. **Integrations** → paste your Google Client ID → "Sign in with Google" → Gmail, Calendar, Drive open in-hub
4. Each rep's Google connection is private — Tyler connecting doesn't affect Ryan's or Jen's
5. **Admin → User Management** → manage users, roles, and see all workspace connection statuses

## Static Files
| File | Purpose |
|---|---|
| `app_premium.js` | SPA router, nav, settings, view dispatcher |
| `integrations.js` | Google Workspace Hub (Gmail/Calendar/Drive/Homeworks) |
| `user_management.js` | User & Access Management module |
| `reps.js` | REPS array, PIN auth, login/logout |
| `import_clients_csv.js` | CSV import for 79 client records |

## Deployment
- **Platform**: Cloudflare Pages
- **Status**: ✅ Running in sandbox
- **Build**: `npm run build` → `vite build` → `dist/`
- **Dev**: `pm2 start ecosystem.config.cjs` (wrangler pages dev on port 3000)
- **Last Updated**: 2026-06-23
