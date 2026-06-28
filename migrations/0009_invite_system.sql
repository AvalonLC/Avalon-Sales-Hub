-- Migration 0009: Team invite system
-- Adds invite_token and invite_sent_at to reps table so admins can
-- send magic-link invitations to new team members.

ALTER TABLE reps ADD COLUMN invite_token     TEXT    DEFAULT '';
ALTER TABLE reps ADD COLUMN invite_sent_at   DATETIME DEFAULT NULL;
ALTER TABLE reps ADD COLUMN invite_accepted  INTEGER DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_reps_invite_token ON reps(invite_token) WHERE invite_token != '';
