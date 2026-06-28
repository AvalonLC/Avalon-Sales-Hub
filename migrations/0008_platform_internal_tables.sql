-- Migration 0008: Platform internal operations tables
-- Creates tables for Groundwork CRM's own internal sales/support/comms system
-- These are NOT tenant data — they are for the GW team itself.

-- Add notes column to companies (website already exists from earlier migration)
ALTER TABLE companies ADD COLUMN notes TEXT DEFAULT '';

-- GW Sales Leads: prospects for selling Groundwork CRM
CREATE TABLE IF NOT EXISTS gw_leads (
  id            TEXT PRIMARY KEY,
  company_name  TEXT NOT NULL DEFAULT '',
  contact_name  TEXT NOT NULL DEFAULT '',
  email         TEXT NOT NULL DEFAULT '',
  phone         TEXT NOT NULL DEFAULT '',
  stage         TEXT NOT NULL DEFAULT 'prospect',  -- prospect|qualified|demo|proposal|negotiation|closed_won|closed_lost
  priority      TEXT NOT NULL DEFAULT 'medium',    -- low|medium|high|urgent
  deal_value    REAL NOT NULL DEFAULT 0,           -- monthly recurring value
  next_action   TEXT NOT NULL DEFAULT '',
  notes         TEXT NOT NULL DEFAULT '',
  source        TEXT NOT NULL DEFAULT 'other',     -- referral|cold_outreach|inbound|demo_request|conference|other
  assigned_to   TEXT NOT NULL DEFAULT 'gw_tyler',
  created_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_gw_leads_stage ON gw_leads(stage);
CREATE INDEX IF NOT EXISTS idx_gw_leads_updated ON gw_leads(updated_at DESC);

-- GW Support Tickets: bug reports, questions, feature requests from tenants
CREATE TABLE IF NOT EXISTS gw_tickets (
  id               TEXT PRIMARY KEY,
  subject          TEXT NOT NULL DEFAULT '',
  body             TEXT NOT NULL DEFAULT '',
  company_name     TEXT NOT NULL DEFAULT '',
  company_id       TEXT NOT NULL DEFAULT '',
  submitter_email  TEXT NOT NULL DEFAULT '',
  submitter_name   TEXT NOT NULL DEFAULT '',
  status           TEXT NOT NULL DEFAULT 'open',    -- open|in_progress|waiting|resolved|closed
  priority         TEXT NOT NULL DEFAULT 'medium',  -- low|medium|high|urgent
  internal_notes   TEXT NOT NULL DEFAULT '',
  assigned_to      TEXT NOT NULL DEFAULT 'gw_tyler',
  created_at       DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at       DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_gw_tickets_status ON gw_tickets(status);
CREATE INDEX IF NOT EXISTS idx_gw_tickets_created ON gw_tickets(created_at DESC);

-- GW Announcements: release notes and platform-wide communications
CREATE TABLE IF NOT EXISTS gw_announcements (
  id           TEXT PRIMARY KEY,
  title        TEXT NOT NULL DEFAULT '',
  body         TEXT NOT NULL DEFAULT '',
  type         TEXT NOT NULL DEFAULT 'announcement', -- release|announcement|maintenance|urgent
  published    INTEGER NOT NULL DEFAULT 0,            -- 0=draft, 1=published
  audience     TEXT NOT NULL DEFAULT 'all',           -- all|paid|enterprise
  published_at DATETIME,
  created_at   DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at   DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_gw_announcements_published ON gw_announcements(published, published_at DESC);

-- Seed: insert first announcement (welcome / getting started)
INSERT OR IGNORE INTO gw_announcements (id, title, body, type, published, audience, published_at)
VALUES (
  'ann_welcome_001',
  'Welcome to Groundwork CRM',
  'Thank you for joining Groundwork CRM. This is where you will find release notes, product updates, maintenance windows, and important platform communications. Stay tuned for regular updates as we continue to improve the platform.',
  'announcement',
  1,
  'all',
  CURRENT_TIMESTAMP
);
