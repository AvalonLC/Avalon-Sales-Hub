-- ============================================================
-- Groundwork CRM — Migration 0004
-- PIN hashing, password reset tokens, super-admin flag
-- ============================================================

-- Add pin_hash column (PBKDF2-SHA256 via Web Crypto API)
-- Format: "pbkdf2:sha256:iterations:salt_hex:hash_hex"
-- pin column kept for backward-compat during rollout, will be cleared after migration
ALTER TABLE reps ADD COLUMN pin_hash TEXT DEFAULT '';

-- Reset token: hex string, expires after 1 hour
ALTER TABLE reps ADD COLUMN reset_token      TEXT DEFAULT '';
ALTER TABLE reps ADD COLUMN reset_token_exp  TEXT DEFAULT '';

-- Email for password reset delivery
ALTER TABLE reps ADD COLUMN email TEXT DEFAULT '';

-- Super-admin flag: cross-company platform administrator (Groundwork staff only)
ALTER TABLE reps ADD COLUMN is_super_admin INTEGER NOT NULL DEFAULT 0;

-- Company: trial_ends_at already exists; add rep_count cache column for dashboard
-- (computed at query time so no column needed)

-- Index for reset token lookup
CREATE INDEX IF NOT EXISTS idx_reps_reset_token ON reps(reset_token) WHERE reset_token != '';
