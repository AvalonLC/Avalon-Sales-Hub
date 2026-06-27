-- ============================================================
-- Avalon Sales Hub — Seed Data
-- Migration: 0002_seed_data
-- ============================================================

-- ── Reps ─────────────────────────────────────────────────────
INSERT OR IGNORE INTO reps (id, name, title, role, pin, color, commission_plan) VALUES
  ('tyler', 'Tyler', 'Owner / Sales Manager',                         'admin',          '1111', '#00d4ff', 'admin'),
  ('ryan',  'Ryan',  'Client Relations & Enhancement Sales Associate', 'rep',            '2222', '#4ade80', 'ryan'),
  ('jen',   'Jen',   'Office Manager — Sales Operations',             'office_manager', '3333', '#f59e0b', 'standard');

-- ── Sample Opportunities ─────────────────────────────────────
INSERT OR IGNORE INTO opportunities (id, rep_id, client, phone, email, address, service_line, source, status, job_value, next_follow_up, work_type, client_type, created_at, updated_at) VALUES
  ('opp_demo_1', 'ryan',  'John Smith',        '7037132327', 'tyler@avalon-lc.com', '4175 Bell Ridge Ct',                 'Maintenance – Recurring Contract', 'Existing Client', 'Lead Intake / Rapport', 4000,  '2026-06-24', 'maintenance', 'Residential', datetime('now'), datetime('now')),
  ('opp_demo_2', 'ryan',  'Johnson Associates', '7035948858', '',                   '4619 Old Dominion Drive, Arlington, VA', 'Maintenance – Recurring Contract', 'Website',         'Lead Intake / Rapport', 4000,  '',            'maintenance', 'Commercial',   datetime('now'), datetime('now')),
  ('opp_demo_3', 'tyler', 'Sarah Mitchell',    '7031234567', 'sarah@example.com',  '892 Maple Grove Lane',               'Landscape Installation',          'Referral',        'Site Visit / Estimate', 18500, '2026-07-01', 'landscape',   'Residential', datetime('now'), datetime('now')),
  ('opp_demo_4', 'ryan',  'Riverside HOA',     '7039876543', 'hoa@riverside.com',  '100 Riverside Blvd',                 'Snow Removal Contract',           'Cold Outreach',   'Proposal Sent',         22000, '2026-06-30', 'snow',        'Commercial',   datetime('now'), datetime('now'));

-- ── Settings ─────────────────────────────────────────────────
INSERT OR IGNORE INTO settings (key, value) VALUES
  ('company_name',    'Avalon Landscape Construction'),
  ('company_website', 'avalon-lc.com'),
  ('app_version',     '1.0.0');
