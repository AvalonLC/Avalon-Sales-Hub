#!/usr/bin/env python3
"""
Fix: Revenue Editor changes now live-update Manager Tools + Owner Dashboard.

Strategy:
  1. Add getResolvedFY() to app_premium.js — merges localStorage actuals
     into a deep copy of fy2026, recalculates annual.actualRevenue /
     remaining / ytd. Returns the resolved fy object.
  2. Replace `const fy = data.fy2026` in manager() with getResolvedFY()
  3. In reps.js Owner Dashboard, replace `const fy = ...fy2026` with
     window.getResolvedFY()
"""

# ──────────────────────────────────────────────────────────────────────────────
# 1. app_premium.js — add getResolvedFY() right after saveRevenueActuals
# ──────────────────────────────────────────────────────────────────────────────
APP_PATH = '/home/user/webapp/public/static/app_premium.js'

with open(APP_PATH, 'r') as f:
    app_js = f.read()

GET_RESOLVED_FY = '''
/**
 * getResolvedFY() — returns a deep copy of AVALON_DATA.fy2026 with
 * localStorage-saved actuals merged in. Also recalculates:
 *   - each month's .actual and .variance
 *   - annual.actualRevenue, annual.remaining, annual.ytdVariance
 * Call this instead of data.fy2026 anywhere you display live revenue figures.
 */
function getResolvedFY() {
  const raw = window.AVALON_DATA.fy2026;
  // Deep-clone so we never mutate the source
  const fy = JSON.parse(JSON.stringify(raw));
  const saved = loadRevenueActuals();

  // Patch monthly actuals
  fy.monthlyBudget = fy.monthlyBudget.map(m => {
    const savedVal = saved[m.month];
    const actual = savedVal !== undefined ? savedVal : m.actual;
    const variance = actual != null ? actual - m.budgeted : null;
    return { ...m, actual, variance };
  });

  // Recompute annual YTD figures
  const completedMonths = fy.monthlyBudget.filter(m => m.actual != null);
  const ytdActual   = completedMonths.reduce((s, m) => s + m.actual, 0);
  const ytdBudgeted = completedMonths.reduce((s, m) => s + m.budgeted, 0);

  fy.annual = { ...fy.annual };
  fy.annual.actualRevenue = ytdActual;
  fy.annual.remaining     = fy.annual.budgetedRevenue - ytdActual;
  fy.annual.ytdVariance   = ytdActual - ytdBudgeted;

  // Recompute avgNeededPerMonth based on updated remaining
  const monthsLeft = fy.annual.monthsLeft || 7;
  fy.annual.avgNeededPerMonth = monthsLeft > 0 ? Math.round(fy.annual.remaining / monthsLeft) : 0;

  return fy;
}
window.getResolvedFY = getResolvedFY;
'''

ANCHOR = 'function saveRevenueActuals(actuals) {\n  localStorage.setItem(REV_ACTUALS_KEY, JSON.stringify(actuals));\n}'

if 'function getResolvedFY()' not in app_js:
    if ANCHOR in app_js:
        app_js = app_js.replace(ANCHOR, ANCHOR + '\n' + GET_RESOLVED_FY)
        print('✅ app_premium.js — getResolvedFY() added')
    else:
        print('❌ Could not find anchor for getResolvedFY()')
else:
    print('⚠️  getResolvedFY() already present')

# ── Patch manager() to use getResolvedFY() ────────────────────────────────────
OLD_MANAGER_FY = '''function manager(){
  const fy = data.fy2026;
  const annual = fy.annual;'''

NEW_MANAGER_FY = '''function manager(){
  const fy = getResolvedFY();
  const annual = fy.annual;'''

if 'const fy = getResolvedFY()' not in app_js:
    if OLD_MANAGER_FY in app_js:
        app_js = app_js.replace(OLD_MANAGER_FY, NEW_MANAGER_FY)
        print('✅ app_premium.js — manager() now uses getResolvedFY()')
    else:
        print('❌ Could not find manager() fy line')
else:
    print('⚠️  manager() already uses getResolvedFY()')

# ── Also patch revenueAdmin() internal fy read to use getResolvedFY() ─────────
OLD_REV_FY = '''function revenueAdmin() {
  const fy = window.AVALON_DATA.fy2026;
  const savedActuals = loadRevenueActuals();
  // Merge saved actuals with data.js actuals (saved wins)
  const months = (fy.monthlyBudget || []).map((m, idx) => {
    const saved = savedActuals[m.month];
    const actual = saved !== undefined ? saved : m.actual;
    const variance = actual != null ? actual - m.budgeted : null;
    return { ...m, actual, variance, idx };
  });'''

NEW_REV_FY = '''function revenueAdmin() {
  const fy = getResolvedFY();
  // months already have saved actuals merged by getResolvedFY()
  const months = (fy.monthlyBudget || []).map((m, idx) => ({ ...m, idx }));'''

if OLD_REV_FY in app_js:
    app_js = app_js.replace(OLD_REV_FY, NEW_REV_FY)
    print('✅ app_premium.js — revenueAdmin() uses getResolvedFY()')
else:
    print('⚠️  revenueAdmin() fy block not matched — may already be updated')

with open(APP_PATH, 'w') as f:
    f.write(app_js)
print('✅ app_premium.js saved')

# ──────────────────────────────────────────────────────────────────────────────
# 2. reps.js — Owner Dashboard uses getResolvedFY()
# ──────────────────────────────────────────────────────────────────────────────
REPS_PATH = '/home/user/webapp/public/static/reps.js'

with open(REPS_PATH, 'r') as f:
    reps_js = f.read()

OLD_REPS_FY = '''  const fy       = (window.AVALON_DATA || {}).fy2026 || {};
  const annual   = fy.annual || {};'''

NEW_REPS_FY = '''  const fy       = (typeof getResolvedFY === 'function') ? getResolvedFY() : ((window.AVALON_DATA || {}).fy2026 || {});
  const annual   = fy.annual || {};'''

if 'getResolvedFY' not in reps_js:
    if OLD_REPS_FY in reps_js:
        reps_js = reps_js.replace(OLD_REPS_FY, NEW_REPS_FY)
        print('✅ reps.js — Owner Dashboard uses getResolvedFY()')
    else:
        print('❌ Could not find reps.js fy line — searching for nearby text...')
        # Try to find it
        idx = reps_js.find('fy2026 || {}')
        print(f'   Found fy2026 at index {idx}:')
        print(repr(reps_js[max(0,idx-80):idx+80]))
else:
    print('⚠️  reps.js already uses getResolvedFY()')

# Also fix monthly budget section in Owner Dashboard to use resolved months
OLD_MONTHS = '''  const months = (fy.monthlyBudget || []);
  const completedMonths = months.filter(m => m.actual != null);
  const ytdBudgeted = completedMonths.reduce((a,m) => a + m.budgeted, 0);
  const ytdVariance = (annual.actualRevenue || 0) - ytdBudgeted;'''

NEW_MONTHS = '''  const months = (fy.monthlyBudget || []);
  const completedMonths = months.filter(m => m.actual != null);
  const ytdBudgeted = completedMonths.reduce((a,m) => a + m.budgeted, 0);
  const ytdVariance = (annual.actualRevenue || 0) - ytdBudgeted;
  // ytdVariance and actualRevenue are already resolved by getResolvedFY()'''

if OLD_MONTHS in reps_js:
    reps_js = reps_js.replace(OLD_MONTHS, NEW_MONTHS)
    print('✅ reps.js — monthly budget section comment added (data already resolved)')

with open(REPS_PATH, 'w') as f:
    f.write(reps_js)
print('✅ reps.js saved')

# ── Verify ────────────────────────────────────────────────────────────────────
import subprocess
result = subprocess.run(['node', '-e', '''
const fs = require('fs');
const app = fs.readFileSync('/home/user/webapp/public/static/app_premium.js','utf8');
const reps = fs.readFileSync('/home/user/webapp/public/static/reps.js','utf8');
const checks = [
  ['getResolvedFY defined', app.includes('function getResolvedFY()')],
  ['getResolvedFY exported', app.includes('window.getResolvedFY = getResolvedFY')],
  ['manager uses getResolvedFY', app.includes('const fy = getResolvedFY()')],
  ['reps.js uses getResolvedFY', reps.includes('getResolvedFY')],
];
let ok = true;
checks.forEach(([name, val]) => { console.log((val ? "✅" : "❌"), name); if(!val) ok=false; });
console.log(ok ? "\\n✅ All good!" : "\\n❌ Issues found");
'''], capture_output=True, text=True)
print(result.stdout)
if result.stderr:
    print('STDERR:', result.stderr[:200])

print('\n🎉 Done — run: npm run build && pm2 restart all')
