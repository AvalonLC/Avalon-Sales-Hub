#!/usr/bin/env python3
"""
Fix app_premium.js:
1. Remove 2nd and 3rd duplicate revenueAdmin blocks
2. Restore importJson and resetAll that got truncated
3. Fix canViewTab to also check DEFAULT_NAV_PERMS for new views
   (so Tyler's cached localStorage perms don't block revenueAdmin)
"""

APP_PATH = '/home/user/webapp/public/static/app_premium.js'

with open(APP_PATH, 'r') as f:
    content = f.read()

# ── Step 1: Find the line where the first revenueAdmin block ends ──────────────
# The first block ends at: window.revenueAdmin = revenueAdmin;
# Then the file has a broken "show('today'); }catch..." — that's the corruption.

BLOCK_MARKER = '\n// ── Monthly Revenue Admin (Phase 2B) ─────────────────────────────────────────\n'
REVENUE_END_MARKER = 'window.revenueAdmin = revenueAdmin;\n'

# Find position of first occurrence of the Revenue Admin block
first_block_start = content.find(BLOCK_MARKER)
print(f'First revenue block starts at char: {first_block_start}')

# Find position of first occurrence of REVENUE_END_MARKER after first_block_start
first_block_end = content.find(REVENUE_END_MARKER, first_block_start) + len(REVENUE_END_MARKER)
print(f'First revenue block ends at char: {first_block_end}')

# Everything after first_block_end up to the real end of the file is corrupted
# The clean part before the first block ends at the broken importJson line
# We need to restore:
#   importJson - full version
#   resetAll - full version
#   buildSearchIndex, searchIndex, event listeners, show('today')
# Then append the clean revenue block (first occurrence)

# Split: clean prefix (before broken importJson) + first revenue block + clean suffix
# Locate the broken importJson line
BROKEN_IMPORT = "function importJson(){ const file=document.getElementById('importFile').files[0]; if(!file) return showToast('Choose a JSON file first'); const reader=new FileReader(); reader.onload=()=>{ try{ state={...DEFAULT_STATE,...JSON.parse(reader.result)}; saveState(); showToast('Imported'); \n"

CLEAN_IMPORT_THROUGH_END = '''function importJson(){ const file=document.getElementById('importFile').files[0]; if(!file) return showToast('Choose a JSON file first'); const reader=new FileReader(); reader.onload=()=>{ try{ state={...DEFAULT_STATE,...JSON.parse(reader.result)}; saveState(); showToast('Imported'); show('today'); }catch(e){ showToast('Import failed'); } }; reader.readAsText(file); }
function resetAll(){ if(!confirm('Reset all local Sales Hub data and checklist progress?')) return; localStorage.clear(); state=structuredClone(DEFAULT_STATE); saveState(); showToast('Reset complete'); show('today'); }

function buildSearchIndex(){
  const items=[];
  data.stages.forEach(s=>items.push({type:'Stage',title:`${s.id}. ${s.title}`,text:[s.purpose,s.owner,s.artifact,s.gate,...(s.actions||[]),...(s.redFlags||[]),...(s.questions||[])].join(' '),action:()=>show('process',s.id)}));
  data.forms.forEach(f=>items.push({type:'Form',title:f.title,text:[...(f.fields||[]).map(x=>x.label)].join(' '),action:()=>show('forms',f.id)}));
  data.scripts.forEach(s=>items.push({type:s.category,title:s.title,text:s.body,action:()=>show('scripts')}));
  data.templates.forEach(t=>items.push({type:`Template: ${t.category}`,title:t.title,text:[t.subject,t.body].join(' '),action:()=>show('templates')}));
  data.objections.forEach(o=>items.push({type:'Objection',title:o.title,text:[o.meaning,o.say,...o.response].join(' '),action:()=>show('objections')}));
  data.modules.forEach(m=>items.push({type:'Training',title:m.title,text:[m.objective,...(m.lessons||[]),...(m.quiz||[]),...(m.keyPoints||[])].join(' '),action:()=>show('academy')}));
  data.checklists.forEach(c=>items.push({type:'Checklist',title:c.title,text:c.items.join(' '),action:()=>show('forms')}));
  (data.salesProcess?.steps||[]).forEach(s=>items.push({type:'6-Step Process',title:`Step ${s.num}: ${s.title}`,text:[s.tagline,s.description,...(s.tappo||[]).map(t=>t.description||''),...(s.nlpTips||[]),...(s.cbrQuestions||[])].join(' '),action:()=>show('process')}));
  return items;
}
const searchIndex = buildSearchIndex();
searchInput.addEventListener('input',()=>{
  const q=searchInput.value.trim().toLowerCase();
  if(q.length<2){ searchResults.hidden=true; return; }
  const results=searchIndex.filter(item=>`${item.title} ${item.text} ${item.type}`.toLowerCase().includes(q)).slice(0,10);
  searchResults.innerHTML = results.length ? results.map((r,i)=>`<button class="result" data-i="${i}"><div class="result-type">${escapeHtml(r.type)}</div><div class="result-title">${escapeHtml(r.title)}</div><div class="result-text">${escapeHtml(r.text.slice(0,160))}...</div></button>`).join('') : '<div class="result-text" style="padding:12px;">No results found.</div>';
  searchResults.hidden=false;
  [...searchResults.querySelectorAll('.result')].forEach((btn, i) => {
    btn.addEventListener('click', () => {
      searchResults.hidden = true;
      searchInput.value = '';
      searchIndex[Number(btn.dataset.i)].action();
    });
  });
});
document.addEventListener('click', e => {
  if (!e.target.closest('.search-wrap')) searchResults.hidden = true;
});

menuBtn.addEventListener('click', () => sidebar.classList.toggle('open'));
document.addEventListener('click', e => {
  if (!sidebar.contains(e.target) && !menuBtn.contains(e.target)) sidebar.classList.remove('open');
});

'''

# ── Step 2: Check what's in the file before the first revenue block ────────────
prefix = content[:first_block_start]
print(f'Prefix ends at: {len(prefix)} chars')
print(f'Last 200 chars of prefix: {repr(prefix[-200:])}')

# Check if importJson is broken (truncated) in prefix
if BROKEN_IMPORT in prefix:
    # Replace truncated importJson with the full restored version + suffix
    clean_prefix = prefix.replace(BROKEN_IMPORT, CLEAN_IMPORT_THROUGH_END)
    print('✅ Restored broken importJson/resetAll/searchIndex/event-listeners')
elif 'function importJson' in prefix and 'function resetAll' in prefix and 'buildSearchIndex' in prefix:
    clean_prefix = prefix
    print('✅ importJson/resetAll/buildSearchIndex already intact in prefix')
else:
    clean_prefix = prefix
    print('⚠️  Could not find broken importJson pattern — using prefix as-is')

# ── Step 3: Extract the clean revenue admin block (first occurrence) ───────────
revenue_block = content[first_block_start:first_block_end]
print(f'Revenue block length: {len(revenue_block)} chars')
print(f'Revenue block starts: {repr(revenue_block[:80])}')
print(f'Revenue block ends:   {repr(revenue_block[-80:])}')

# ── Step 4: Assemble clean file ────────────────────────────────────────────────
# clean_prefix already has: all functions + importJson + resetAll + searchIndex + event listeners
# Then we append the revenue block, then show('today')

# Make sure clean_prefix doesn't already end with show('today')
if clean_prefix.rstrip().endswith("show('today');"):
    clean_file = clean_prefix.rstrip() + '\n' + revenue_block.lstrip('\n') + '\nshow(\'today\');\n'
else:
    clean_file = clean_prefix + revenue_block + '\nshow(\'today\');\n'

# ── Step 5: Verify no more duplicate blocks ────────────────────────────────────
count = clean_file.count('function revenueAdmin()')
print(f'revenueAdmin() count after fix: {count}')
if count != 1:
    print('❌ Still has duplicates — manual check needed')
else:
    print('✅ Exactly 1 revenueAdmin() — clean!')

# ── Step 6: Fix canViewTab to fall back to DEFAULT_NAV_PERMS for unknown views ─
# This ensures if Tyler's localStorage is from before revenueAdmin was added,
# admin still gets access.
OLD_CAN_VIEW = '''function canViewTab(viewName) {
  const rep = window.getCurrentRep ? window.getCurrentRep() : null;
  if (!rep) return false;
  const perms = loadNavPerms();
  const allowed = perms[rep.role] || DEFAULT_NAV_PERMS[rep.role] || [];
  return allowed.includes(viewName);
}'''

NEW_CAN_VIEW = '''function canViewTab(viewName) {
  const rep = window.getCurrentRep ? window.getCurrentRep() : null;
  if (!rep) return false;
  // Admin always has full access (bypass localStorage perms for admin role)
  if (rep.role === 'admin') return true;
  const perms = loadNavPerms();
  // If this viewName is new and not in saved perms, fall back to DEFAULT_NAV_PERMS
  const savedAllowed = perms[rep.role] || [];
  const defaultAllowed = DEFAULT_NAV_PERMS[rep.role] || [];
  // A view is allowed if either saved perms include it, OR
  // saved perms don't have it listed at all (new view — use default)
  if (savedAllowed.includes(viewName)) return true;
  if (!savedAllowed.includes(viewName) && defaultAllowed.includes(viewName)) return true;
  return false;
}'''

if OLD_CAN_VIEW in clean_file:
    clean_file = clean_file.replace(OLD_CAN_VIEW, NEW_CAN_VIEW)
    print('✅ canViewTab() — admin always gets full access, new views fall back to defaults')
elif 'rep.role === \'admin\') return true' in clean_file:
    print('✅ canViewTab() — admin bypass already present')
else:
    print('⚠️  Could not find canViewTab to patch')

# ── Step 7: Write the fixed file ───────────────────────────────────────────────
with open(APP_PATH, 'w') as f:
    f.write(clean_file)

total_lines = clean_file.count('\n')
print(f'✅ File written — {total_lines} lines')
print('\n🎉 Fix complete. Run: npm run build && pm2 restart all')
print('\nIMPORTANT: Tell Tyler to refresh the page (Ctrl+Shift+R / hard reload)')
print('The "admin always gets full access" fix means no more localStorage perm cache issues.')
