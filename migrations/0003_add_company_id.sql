-- ============================================================
-- Avalon Sales Hub — Multi-tenant Foundation
-- Migration: 0003_add_company_id
--
-- Adds company_id to every tenant-scoped table.
-- Existing rows get company_id = 'avalon' (Avalon Landscape Construction).
-- New companies get their own isolated slice — zero overlap guaranteed.
-- ============================================================

-- ── COMPANIES (one row per tenant) ───────────────────────────
CREATE TABLE IF NOT EXISTS companies (
  id           TEXT PRIMARY KEY,          -- 'avalon', 'acme-lawns', etc.
  name         TEXT NOT NULL,             -- 'Avalon Landscape Construction'
  slug         TEXT NOT NULL UNIQUE,      -- URL-safe, used in login flow
  plan         TEXT NOT NULL DEFAULT 'trial',  -- 'trial','starter','pro','enterprise'
  owner_email  TEXT NOT NULL DEFAULT '',
  phone        TEXT DEFAULT '',
  website      TEXT DEFAULT '',
  logo_url     TEXT DEFAULT '',
  timezone     TEXT NOT NULL DEFAULT 'America/New_York',
  trial_ends_at TEXT DEFAULT '',
  active       INTEGER NOT NULL DEFAULT 1,
  created_at   TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at   TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Seed Avalon as company #1
INSERT OR IGNORE INTO companies (id, name, slug, plan, owner_email, website, active)
VALUES ('avalon', 'Avalon Landscape Construction', 'avalon', 'pro', 'tyler@avalon-lc.com', 'avalon-lc.com', 1);

-- ── Add company_id to reps ────────────────────────────────────
ALTER TABLE reps ADD COLUMN company_id TEXT NOT NULL DEFAULT 'avalon';
UPDATE reps SET company_id = 'avalon' WHERE company_id = '' OR company_id IS NULL;
CREATE INDEX IF NOT EXISTS idx_reps_company ON reps(company_id);

-- ── Add company_id to opportunities ──────────────────────────
ALTER TABLE opportunities ADD COLUMN company_id TEXT NOT NULL DEFAULT 'avalon';
UPDATE opportunities SET company_id = 'avalon' WHERE company_id = '' OR company_id IS NULL;
CREATE INDEX IF NOT EXISTS idx_opps_company ON opportunities(company_id);

-- ── Add company_id to notes ───────────────────────────────────
ALTER TABLE notes ADD COLUMN company_id TEXT NOT NULL DEFAULT 'avalon';
UPDATE notes SET company_id = 'avalon' WHERE company_id = '' OR company_id IS NULL;
CREATE INDEX IF NOT EXISTS idx_notes_company ON notes(company_id);

-- ── Add company_id to communications ─────────────────────────
ALTER TABLE communications ADD COLUMN company_id TEXT NOT NULL DEFAULT 'avalon';
UPDATE communications SET company_id = 'avalon' WHERE company_id = '' OR company_id IS NULL;
CREATE INDEX IF NOT EXISTS idx_comms_company ON communications(company_id);

-- ── Add company_id to files ───────────────────────────────────
ALTER TABLE files ADD COLUMN company_id TEXT NOT NULL DEFAULT 'avalon';
UPDATE files SET company_id = 'avalon' WHERE company_id = '' OR company_id IS NULL;
CREATE INDEX IF NOT EXISTS idx_files_company ON files(company_id);

-- ── Add company_id to checklist_progress ─────────────────────
ALTER TABLE checklist_progress ADD COLUMN company_id TEXT NOT NULL DEFAULT 'avalon';
UPDATE checklist_progress SET company_id = 'avalon' WHERE company_id = '' OR company_id IS NULL;
CREATE INDEX IF NOT EXISTS idx_cl_company ON checklist_progress(company_id);

-- ── Add company_id to academy_progress ───────────────────────
ALTER TABLE academy_progress ADD COLUMN company_id TEXT NOT NULL DEFAULT 'avalon';
UPDATE academy_progress SET company_id = 'avalon' WHERE company_id = '' OR company_id IS NULL;
CREATE INDEX IF NOT EXISTS idx_acad_company ON academy_progress(company_id);

-- ── Add company_id to quiz_attempts ──────────────────────────
ALTER TABLE quiz_attempts ADD COLUMN company_id TEXT NOT NULL DEFAULT 'avalon';
UPDATE quiz_attempts SET company_id = 'avalon' WHERE company_id = '' OR company_id IS NULL;
CREATE INDEX IF NOT EXISTS idx_quiz_company ON quiz_attempts(company_id);

-- ── Add company_id to badges ──────────────────────────────────
ALTER TABLE badges ADD COLUMN company_id TEXT NOT NULL DEFAULT 'avalon';
UPDATE badges SET company_id = 'avalon' WHERE company_id = '' OR company_id IS NULL;
CREATE INDEX IF NOT EXISTS idx_badges_company ON badges(company_id);

-- ── Add company_id to certifications ─────────────────────────
ALTER TABLE certifications ADD COLUMN company_id TEXT NOT NULL DEFAULT 'avalon';
UPDATE certifications SET company_id = 'avalon' WHERE company_id = '' OR company_id IS NULL;
CREATE INDEX IF NOT EXISTS idx_certs_company ON certifications(company_id);

-- ── Add company_id to clients ─────────────────────────────────
ALTER TABLE clients ADD COLUMN company_id TEXT NOT NULL DEFAULT 'avalon';
UPDATE clients SET company_id = 'avalon' WHERE company_id = '' OR company_id IS NULL;
CREATE INDEX IF NOT EXISTS idx_clients_company ON clients(company_id);

-- ── Add company_id to revenue_actuals ────────────────────────
ALTER TABLE revenue_actuals ADD COLUMN company_id TEXT NOT NULL DEFAULT 'avalon';
UPDATE revenue_actuals SET company_id = 'avalon' WHERE company_id = '' OR company_id IS NULL;
-- Drop old unique constraint and add company-scoped one
-- (SQLite doesn't support DROP CONSTRAINT — recreate the table)
CREATE TABLE IF NOT EXISTS revenue_actuals_new (
  id         TEXT PRIMARY KEY,
  company_id TEXT NOT NULL DEFAULT 'avalon',
  month      TEXT NOT NULL,
  year       INTEGER NOT NULL DEFAULT 2026,
  revenue    REAL DEFAULT 0,
  note       TEXT DEFAULT '',
  division   TEXT DEFAULT 'total',
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(company_id, month, year, division)
);
INSERT OR IGNORE INTO revenue_actuals_new
  SELECT id, company_id, month, year, revenue, note, division, updated_at
  FROM revenue_actuals;
DROP TABLE revenue_actuals;
ALTER TABLE revenue_actuals_new RENAME TO revenue_actuals;
CREATE INDEX IF NOT EXISTS idx_rev_company ON revenue_actuals(company_id);

-- ── Add company_id to settings (namespace per company) ───────
-- Settings key becomes 'company_id:key' pattern for tenant isolation
-- Session keys stay global (session_{token} → looks up rep → gets company_id from rep)
-- No schema change needed — settings uses composite key pattern

-- ── Session → company lookup helper (via rep join) ───────────
-- The session cookie resolves: token → rep_id → company_id
-- This is handled in the Hono middleware (requireAuth sets c.var.companyId)
