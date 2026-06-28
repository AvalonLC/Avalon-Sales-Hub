"""
Sprint 7 Color Scrub — maps every off-palette color to GW design tokens.

PALETTE (from brand board):
  Evergreen Slate  #204A43   → var(--gw-pine)
  Dark Text        #1F2A2B   → var(--gw-ink)
  Secondary        #6F7E6A   → var(--gw-muted)
  Accent (terra)   #B8744F   → var(--gw-accent)
  UI Accent (teal) #4D8A86   → var(--gw-ui-accent)
  Light Surface    #F6F4EE   → var(--gw-bg)
  Soft Neutral     #DDD5C8   → var(--gw-line)

Internal derived tokens:
  #1B3F38  deep pine sidebar    (keep as-is — sidebar only)
  #EDEAE0  warm cream bg        (keep)
  #FDFCF9  surface              (keep)
  #183830  pine-deep            (keep)
  #255A4E  pine-light           (keep)
  
Functional semantic colors (keep — semantic meaning):
  success green:  use #2D7A55 (dark forest green — on-palette)
  error red:      use #8B3A2A (dark terracotta variant)
  warning amber:  use #8B6914 (dark warm gold)

Off-palette → replacement mapping for JS INLINE STYLES:
  #00d4ff / #22d3ee / #60a5fa / #00a7e1 / #0077b6 → #4D8A86 (ui-accent teal)
  #6366f1 / #4f46e5 / #312e81 / #1e1b4b / #5B21B6  → #204A43 (pine — replace purples)
  #9333ea / #7c3aed                                   → #B8744F (accent — replace vivid purples)
  #10b981 / #34d399 / #4ade80 / #22c55e / #16a34a / #15803d / #166534 → #2D7A55 (forest green)
  #ef4444 / #dc2626 / #b91c1c / #f87171 / #991b1b  → #8B3A2A (dark terracotta red)
  #f59e0b / #d97706 / #ca8a04 / #fbbf24 / #f87171  → #8B6914 (warm amber)
  #94a3b8 / #64748b / #475569 / #334155 / #1e293b  → #6F7E6A (gw-muted)
  #e2e8f0 / #cbd5e1 / #f1f5f9 / #f8fafc / #f0f9ff  → #EDEAE0 (warm cream surface)
  #1a1a1a / #111827 / #374151 / #4b5563            → #1F2A2B (gw-ink)
  #fecaca / #FDA29B                                  → #F5D5C8 (accent-soft tint)
  #FEF3F2 / #FFF8E8 / #F9FCFE / #F9FDFF           → #FDFCF9 (warm surface)
  #1e293b / #0f172a / #1a2d44 / #0d1829 / #0e1826 → #1F2A2B (gw-ink)
  #152F26 / #1E4638 / #3D6B59 / #255A47           → #204A43 (pine)
  #3D8B6A                                            → #2D7A55 (forest green)
"""

import re
import os

# ── Replacement table (exact hex → replacement) ──────────────────────────────
# Ordered longest-first to avoid partial matches
REPLACEMENTS = [
    # Old blue/cyan → UI Accent teal
    ('#00d4ff22', 'rgba(77,138,134,.13)'),
    ('#6366f122', 'rgba(32,74,67,.13)'),
    ('#6366f160', 'rgba(32,74,67,.38)'),
    ('#6366f150', 'rgba(32,74,67,.31)'),
    ('#6366f140', 'rgba(32,74,67,.25)'),
    ('#6366f110', 'rgba(32,74,67,.06)'),
    ('#94a3b840', 'rgba(111,126,106,.25)'),
    ('#f59e0b40', 'rgba(139,105,20,.25)'),
    ('#f59e0b30', 'rgba(139,105,20,.19)'),
    ('#f59e0b25', 'rgba(139,105,20,.15)'),
    ('#f59e0b15', 'rgba(139,105,20,.09)'),
    ('#f59e0b12', 'rgba(139,105,20,.07)'),
    ('#10b98140', 'rgba(45,122,85,.25)'),
    ('#10b98130', 'rgba(45,122,85,.19)'),
    ('#10b98128', 'rgba(45,122,85,.16)'),
    ('#10b98115', 'rgba(45,122,85,.09)'),
    ('#10b98112', 'rgba(45,122,85,.07)'),
    ('#4f46e540', 'rgba(32,74,67,.25)'),
    ('#4f46e550', 'rgba(32,74,67,.31)'),
    ('#4f46e510', 'rgba(32,74,67,.06)'),
    ('#4D8A8618', 'rgba(77,138,134,.09)'),  # already correct but normalise
    # Hex alpha variants
    ('#00a7e1', '#4D8A86'),
    ('#0077b6', '#204A43'),
    ('#22d3ee', '#4D8A86'),
    ('#00d4ff', '#4D8A86'),
    ('#22c55e', '#2D7A55'),
    ('#60a5fa', '#4D8A86'),
    ('#3b82f6', '#4D8A86'),
    ('#2563eb', '#204A43'),
    ('#1d4ed8', '#204A43'),
    ('#6366f1', '#204A43'),
    ('#4f46e5', '#204A43'),
    ('#312e81', '#204A43'),
    ('#1e1b4b', '#1F2A2B'),
    ('#1a1f3a', '#1F2A2B'),
    ('#9333ea', '#B8744F'),
    ('#7c3aed', '#B8744F'),
    ('#5B21B6', '#204A43'),
    ('#10b981', '#2D7A55'),
    ('#34d399', '#2D7A55'),
    ('#4ade80', '#2D7A55'),
    ('#16a34a', '#2D7A55'),
    ('#15803d', '#2D7A55'),
    ('#166534', '#2D7A55'),
    ('#3D8B6A', '#2D7A55'),
    ('#3D6B59', '#2D7A55'),
    ('#ef4444', '#8B3A2A'),
    ('#dc2626', '#8B3A2A'),
    ('#b91c1c', '#8B3A2A'),
    ('#f87171', '#C97B6A'),
    ('#991b1b', '#7A2E20'),
    ('#7f1d1d', '#5C2318'),
    ('#be123c', '#8B3A2A'),
    ('#f59e0b', '#8B6914'),
    ('#d97706', '#7A5C10'),
    ('#ca8a04', '#7A5C10'),
    ('#fbbf24', '#8B6914'),
    ('#a66b00', '#7A5C10'),  # already gw-muted-ish
    ('#fde68a', '#F5E8C0'),
    ('#fffbeb', '#FAF6E8'),
    ('#fefce8', '#FAF6E8'),
    ('#FDA29B', '#F5D5C8'),
    ('#fecaca', '#F5D5C8'),
    ('#FFF8E8', '#FAF6E8'),
    ('#FEF3F2', '#FDFCF9'),
    ('#FEF3C7', '#FAF6E8'),
    ('#F9FDFF', '#FDFCF9'),
    ('#F9FCFE', '#FDFCF9'),
    ('#FEE2E2', '#FAE8E4'),
    ('#fee2e2', '#FAE8E4'),
    ('#fef2f2', '#FAE8E4'),
    ('#FEF2F2', '#FAE8E4'),
    ('#FFF7ED', '#FAF6E8'),
    ('#94a3b8', '#6F7E6A'),
    ('#64748b', '#6F7E6A'),
    ('#475569', '#5C6B58'),
    ('#334155', '#4A5947'),
    ('#1e293b', '#1F2A2B'),
    ('#0f172a', '#1F2A2B'),
    ('#1a2d44', '#1F2A2B'),
    ('#0d1829', '#1F2A2B'),
    ('#0e1826', '#1F2A2B'),
    ('#1a2a3f', '#1F2A2B'),
    ('#1e2d45', '#1F2A2B'),
    ('#0c1a2e', '#1F2A2B'),
    ('#090f1c', '#1F2A2B'),
    ('#070b12', '#1F2A2B'),
    ('#17212B', '#1F2A2B'),
    ('#1a1a1a', '#1F2A2B'),
    ('#111827', '#1F2A2B'),
    ('#374151', '#2D3E3F'),
    ('#4b5563', '#4A5947'),
    ('#923b77', '#B8744F'),  # any vivid purple → accent
    ('#e2e8f0', '#E8E4D9'),
    ('#cbd5e1', '#D6D1C4'),
    ('#f1f5f9', '#EDEAE0'),
    ('#f8fafc', '#FDFCF9'),
    ('#f0f9ff', '#FDFCF9'),
    ('#f0fdf4', '#EAF1EE'),
    ('#dcfce7', '#D4EDE1'),
    ('#bbf7d0', '#B8DEC9'),
    ('#fdf4ff', '#FAF6E8'),
    ('#ede9fe', '#E8E4D9'),
    ('#fff1f2', '#FAE8E4'),
    ('#DBEAFE', '#E5F0EF'),
    ('#E0E7FF', '#E5F0EF'),
    ('#E0F2FE', '#E5F0EF'),
    ('#CCFBF1', '#D4EDE1'),
    ('#EDE9FE', '#E8E4D9'),
    ('#DCFCE7', '#D4EDE1'),
    ('#F0FDF4', '#EAF1EE'),
    ('#FFF7ED', '#FAF6E8'),
    ('#FFF1F2', '#FAE8E4'),
    ('#1D4ED8', '#204A43'),
    ('#4338CA', '#204A43'),
    ('#0369A1', '#4D8A86'),
    ('#92400E', '#7A5C10'),
    ('#15803D', '#2D7A55'),
    ('#C2410C', '#8B3A2A'),
    ('#0F766E', '#4D8A86'),
    ('#166534', '#2D7A55'),
    ('#991B1B', '#7A2E20'),
    ('#5B21B6', '#204A43'),
    ('#0F766E', '#4D8A86'),
    ('#152F26', '#204A43'),
    ('#1E4638', '#1B3F38'),
    ('#3D6B59', '#2D7A55'),
    ('#255A47', '#204A43'),
    ('#207A4F', '#2D7A55'),
    ('#245E85', '#4D8A86'),
    ('#64B5E8', '#4D8A86'),
    ('#617383', '#6F7E6A'),
    ('#D9E6EF', '#E5F0EF'),
    ('#EAF6FD', '#E5F0EF'),
    ('#F6FAFD', '#FDFCF9'),
    ('#c7d2fe', '#D6D1C4'),
    ('#a5b4fc', '#B8C8C7'),
    ('#4f46e5', '#204A43'),
    ('#f8fafc', '#FDFCF9'),
    ('#fafafa', '#FDFCF9'),
    ('#ffffff03', 'rgba(253,252,249,.01)'),
    ('#ffffff08', 'rgba(253,252,249,.03)'),
    ('#f59e0b', '#8B6914'),
    ('#10B981', '#2D7A55'),
    ('#6366F1', '#204A43'),
    ('#EF4444', '#8B3A2A'),
    ('#c2410c', '#8B3A2A'),
    ('#86efac', '#B8DEC9'),
    ('#bbf7d0', '#B8DEC9'),
    ('#3b82f6', '#4D8A86'),
    ('#93c5fd', '#B8C8C7'),
    ('#bfdbfe', '#D6D1C4'),
    ('#dbeafe', '#E5F0EF'),
    ('#38bdf8', '#4D8A86'),
    ('#7dd3fc', '#4D8A86'),
    ('#0ea5e9', '#4D8A86'),
    ('#0284c7', '#4D8A86'),
    ('#0369a1', '#4D8A86'),
    ('#7f1d1d', '#5C2318'),
    ('#fecaca', '#F5D5C8'),
    ('#FCA5A5', '#F5D5C8'),
    ('#fca5a5', '#F5D5C8'),
    ('#B42318', '#8B3A2A'),  # error red → dark terracotta
    ('#A66B00', '#7A5C10'),  # warning → warm amber
]

def scrub_file(path, replacements):
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    original = content
    count = 0
    for old, new in replacements:
        # Case-insensitive hex match
        pattern = re.compile(re.escape(old), re.IGNORECASE)
        matches = len(pattern.findall(content))
        if matches:
            content = pattern.sub(new, content)
            count += matches
            print(f"  {matches:3d}x  {old} → {new}")
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"  TOTAL: {count} replacements in {os.path.basename(path)}")
    return count

files = [
    '/home/user/webapp/public/static/app_premium.js',
    '/home/user/webapp/public/static/integrations.js',
    '/home/user/webapp/public/static/reps.js',
    '/home/user/webapp/public/static/user_management.js',
]

total = 0
for f in files:
    print(f"\n=== {f} ===")
    total += scrub_file(f, REPLACEMENTS)

print(f"\n=== GRAND TOTAL: {total} replacements ===")
