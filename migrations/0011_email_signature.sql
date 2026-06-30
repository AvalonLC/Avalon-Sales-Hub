-- ============================================================
-- Groundwork CRM — Migration 0011
-- Email Signature
--
-- Adds an email_signature column to reps so each user can
-- store their Gmail / email signature HTML, either synced
-- automatically from the Gmail Settings API (sendAs endpoint)
-- or entered manually as a fallback.
--
-- The column stores raw HTML (as Gmail returns it). It is
-- injected into every Compose window inside Groundwork.
-- ============================================================

ALTER TABLE reps ADD COLUMN email_signature TEXT NOT NULL DEFAULT '';
