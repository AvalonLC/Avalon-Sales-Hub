-- ============================================================
-- Avalon Sales Hub — D1 Database Schema
-- Migration: 0001_initial_schema
-- ============================================================

-- ── REPS (users / salespeople) ───────────────────────────────
CREATE TABLE IF NOT EXISTS reps (
  id          TEXT PRIMARY KEY,         -- 'tyler', 'ryan', 'jen'
  name        TEXT NOT NULL,
  title       TEXT,
  role        TEXT NOT NULL DEFAULT 'rep', -- 'admin','office_manager','rep'
  pin         TEXT NOT NULL,
  color       TEXT DEFAULT '#6366f1',
  base_rate   REAL,
  commission_plan TEXT DEFAULT 'standard',
  active      INTEGER NOT NULL DEFAULT 1,
  created_at  TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ── OPPORTUNITIES (pipeline leads) ───────────────────────────
CREATE TABLE IF NOT EXISTS opportunities (
  id                  TEXT PRIMARY KEY,
  rep_id              TEXT,
  client              TEXT NOT NULL DEFAULT '',
  phone               TEXT DEFAULT '',
  email               TEXT DEFAULT '',
  address             TEXT DEFAULT '',
  service_line        TEXT DEFAULT '',
  source              TEXT DEFAULT '',
  status              TEXT NOT NULL DEFAULT 'New Lead',
  job_value           REAL DEFAULT 0,
  project             TEXT DEFAULT '',
  urgency             TEXT DEFAULT '',
  decision_maker      TEXT DEFAULT '',
  budget_range        TEXT DEFAULT '',
  next_follow_up      TEXT DEFAULT '',
  pipeline_stage      TEXT DEFAULT '',
  estimate_amount     REAL DEFAULT 0,
  estimate_sent_date  TEXT DEFAULT '',
  estimate_count      INTEGER DEFAULT 0,
  work_type           TEXT DEFAULT '',
  client_type         TEXT DEFAULT '',
  prompt              TEXT DEFAULT '',
  desired_outcome     TEXT DEFAULT '',
  fit_concerns        TEXT DEFAULT '',
  commission_approved INTEGER NOT NULL DEFAULT 0,
  collected           INTEGER NOT NULL DEFAULT 0,
  sold_date           TEXT DEFAULT '',
  sold_amount         REAL DEFAULT 0,
  created_at          TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at          TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (rep_id) REFERENCES reps(id)
);

CREATE INDEX IF NOT EXISTS idx_opps_rep     ON opportunities(rep_id);
CREATE INDEX IF NOT EXISTS idx_opps_status  ON opportunities(status);
CREATE INDEX IF NOT EXISTS idx_opps_updated ON opportunities(updated_at);

-- ── NOTES ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS notes (
  id         TEXT PRIMARY KEY,
  opp_id     TEXT NOT NULL,
  rep_id     TEXT,
  body       TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (opp_id) REFERENCES opportunities(id) ON DELETE CASCADE,
  FOREIGN KEY (rep_id) REFERENCES reps(id)
);

CREATE INDEX IF NOT EXISTS idx_notes_opp ON notes(opp_id);

-- ── COMMUNICATIONS (email / SMS / call / proposal log) ───────
CREATE TABLE IF NOT EXISTS communications (
  id        TEXT PRIMARY KEY,
  opp_id    TEXT NOT NULL,
  rep_id    TEXT,
  type      TEXT NOT NULL DEFAULT 'note', -- 'email','sms','call','note','proposal'
  direction TEXT NOT NULL DEFAULT 'out',  -- 'out','in'
  subject   TEXT DEFAULT '',
  body      TEXT DEFAULT '',
  ts        TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (opp_id) REFERENCES opportunities(id) ON DELETE CASCADE,
  FOREIGN KEY (rep_id) REFERENCES reps(id)
);

CREATE INDEX IF NOT EXISTS idx_comms_opp ON communications(opp_id);
CREATE INDEX IF NOT EXISTS idx_comms_ts  ON communications(ts);

-- ── FILES (attached to opportunities) ────────────────────────
CREATE TABLE IF NOT EXISTS files (
  id         TEXT PRIMARY KEY,
  opp_id     TEXT NOT NULL,
  rep_id     TEXT,
  name       TEXT NOT NULL DEFAULT '',
  size       INTEGER DEFAULT 0,
  mime_type  TEXT DEFAULT '',
  url        TEXT DEFAULT '',           -- R2 URL when we add file storage
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (opp_id) REFERENCES opportunities(id) ON DELETE CASCADE,
  FOREIGN KEY (rep_id) REFERENCES reps(id)
);

CREATE INDEX IF NOT EXISTS idx_files_opp ON files(opp_id);

-- ── CHECKLIST PROGRESS (stage checklists per lead) ───────────
CREATE TABLE IF NOT EXISTS checklist_progress (
  id         TEXT PRIMARY KEY,          -- 'check-{checklistId}-{oppId}-{itemIndex}'
  opp_id     TEXT NOT NULL,
  checklist_id TEXT NOT NULL,
  item_index INTEGER NOT NULL,
  checked    INTEGER NOT NULL DEFAULT 0,
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(opp_id, checklist_id, item_index),
  FOREIGN KEY (opp_id) REFERENCES opportunities(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_cl_opp ON checklist_progress(opp_id);

-- ── ACADEMY PROGRESS (per-rep module completion) ─────────────
CREATE TABLE IF NOT EXISTS academy_progress (
  id          TEXT PRIMARY KEY,
  rep_id      TEXT NOT NULL,
  module_id   TEXT NOT NULL,
  section_id  TEXT,
  completed   INTEGER NOT NULL DEFAULT 0,
  score       REAL DEFAULT 0,
  updated_at  TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(rep_id, module_id, section_id),
  FOREIGN KEY (rep_id) REFERENCES reps(id)
);

CREATE INDEX IF NOT EXISTS idx_acad_rep ON academy_progress(rep_id);

-- ── QUIZ ATTEMPTS ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS quiz_attempts (
  id          TEXT PRIMARY KEY,
  rep_id      TEXT NOT NULL,
  module_id   TEXT NOT NULL,
  score       REAL NOT NULL DEFAULT 0,
  total       INTEGER NOT NULL DEFAULT 0,
  passed      INTEGER NOT NULL DEFAULT 0,
  answers     TEXT DEFAULT '[]',        -- JSON array
  attempted_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (rep_id) REFERENCES reps(id)
);

CREATE INDEX IF NOT EXISTS idx_quiz_rep    ON quiz_attempts(rep_id);
CREATE INDEX IF NOT EXISTS idx_quiz_module ON quiz_attempts(module_id);

-- ── BADGES EARNED ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS badges (
  id         TEXT PRIMARY KEY,
  rep_id     TEXT NOT NULL,
  badge_id   TEXT NOT NULL,
  earned_at  TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(rep_id, badge_id),
  FOREIGN KEY (rep_id) REFERENCES reps(id)
);

CREATE INDEX IF NOT EXISTS idx_badges_rep ON badges(rep_id);

-- ── CERTIFICATIONS ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS certifications (
  id          TEXT PRIMARY KEY,
  rep_id      TEXT NOT NULL,
  phase_id    TEXT NOT NULL,
  status      TEXT NOT NULL DEFAULT 'not_started', -- 'not_started','in_progress','pending_review','earned'
  issued_date TEXT DEFAULT '',
  updated_at  TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(rep_id, phase_id),
  FOREIGN KEY (rep_id) REFERENCES reps(id)
);

-- ── CLIENTS & PROPERTIES ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS clients (
  id         TEXT PRIMARY KEY,
  name       TEXT NOT NULL DEFAULT '',
  phone      TEXT DEFAULT '',
  email      TEXT DEFAULT '',
  address    TEXT DEFAULT '',
  type       TEXT DEFAULT 'Residential',
  notes      TEXT DEFAULT '',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ── REVENUE ACTUALS (financial dashboard) ────────────────────
CREATE TABLE IF NOT EXISTS revenue_actuals (
  id         TEXT PRIMARY KEY,
  month      TEXT NOT NULL,             -- 'Jan','Feb', etc.
  year       INTEGER NOT NULL DEFAULT 2026,
  revenue    REAL DEFAULT 0,
  note       TEXT DEFAULT '',
  division   TEXT DEFAULT 'total',      -- 'total','landscape','maintenance','snow'
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(month, year, division)
);

-- ── SETTINGS (app-level key/value store) ─────────────────────
CREATE TABLE IF NOT EXISTS settings (
  key        TEXT PRIMARY KEY,
  value      TEXT NOT NULL DEFAULT '',
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
