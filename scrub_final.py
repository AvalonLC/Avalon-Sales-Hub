import re, os

# Final pass - remaining rogue colors
REPLACEMENTS = [
    # Purple variants → terracotta accent or pine
    ('#a78bfa', '#4D8A86'),   # lavender purple → teal
    ('#8b5cf6', '#4D8A86'),   # violet → teal
    ('#a855f7', '#B8744F'),   # purple → accent terracotta
    ('#6d28d9', '#204A43'),   # deep purple → pine
    ('#8e24aa', '#B8744F'),   # magenta purple → accent
    ('#ec4899', '#B8744F'),   # hot pink → accent
    ('#f472b6', '#C97B6A'),   # pink → light terracotta
    # Orange → warm amber (close to palette)
    ('#f97316', '#8B6914'),   # orange → warm amber
    ('#fb923c', '#C97B6A'),   # light orange → light terracotta  
    ('#f5511d', '#8B3A2A'),   # red-orange → dark terracotta
    # Old dark backgrounds in report printout
    ('#0e3044', '#1F2A2B'),   # dark navy → ink
    ('#1e4d6b', '#204A43'),   # dark blue → pine
    ('#0c2a1a', '#1F2A2B'),   # very dark green → ink
    ('#0a1a0a', '#1F2A2B'),   # very dark green → ink
    ('#1c1412', '#1F2A2B'),   # very dark warm → ink
    ('#1c1a0a', '#1F2A2B'),   # very dark warm → ink
    ('#2a0a0a', '#1F2A2B'),   # very dark red → ink
    ('#450a0a', '#5C2318'),   # dark error → dark terracotta
    ('#064e3b', '#1B3F38'),   # dark green → sidebar pine
    ('#065f46', '#204A43'),   # dark green → pine
    ('#14532d', '#2D7A55'),   # dark success → forest green
    ('#6ee7b7', '#B8DEC9'),   # mint → pale green
    ('#d1fae5', '#EAF1EE'),   # pale mint → pale pine
    ('#059669', '#2D7A55'),   # emerald → forest green
    ('#00c853', '#2D7A55'),   # bright green → forest green
    ('#33b679', '#2D7A55'),   # google calendar green → forest green
    ('#0b8043', '#2D7A55'),   # dark google green → forest green
    ('#0f9d58', '#2D7A55'),   # google green → forest green
    ('#d60000', '#8B3A2A'),   # google red → dark terracotta
    ('#e67c73', '#C97B6A'),   # google calendar pink → light terra
    ('#f6c026', '#8B6914'),   # google yellow → amber
    ('#039be5', '#4D8A86'),   # google cyan → teal
    ('#616161', '#6F7E6A'),   # google grey → muted
    ('#3d5068', '#4A5947'),   # dark slate → dark muted
    ('#b45309', '#7A5C10'),   # amber-700 → warm amber
    ('#3f51b5', '#204A43'),   # indigo → pine
    ('#1e40af', '#204A43'),   # blue-800 → pine
    # rgba variants for above
    ('rgba(249,115,22,.08)', 'rgba(139,105,20,.08)'),
    ('rgba(249,115,22,.1)', 'rgba(139,105,20,.10)'),
    ('rgba(249,115,22,.10)', 'rgba(139,105,20,.10)'),
    ('rgba(249,115,22,.3)', 'rgba(139,105,20,.3)'),
    ('rgba(249,115,22,.30)', 'rgba(139,105,20,.30)'),
]

def scrub_file(path, replacements):
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    count = 0
    for old, new in replacements:
        pattern = re.compile(re.escape(old), re.IGNORECASE)
        hits = len(pattern.findall(content))
        if hits:
            content = pattern.sub(new, content)
            count += hits
            print(f"  {hits:3d}x  {old} → {new}")
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"  TOTAL: {count} in {os.path.basename(path)}")
    return count

files = [
    '/home/user/webapp/public/static/app_premium.js',
    '/home/user/webapp/public/static/integrations.js',
    '/home/user/webapp/public/static/reps.js',
    '/home/user/webapp/public/static/user_management.js',
    '/home/user/webapp/public/static/premium.css',
    '/home/user/webapp/public/static/styles.css',
]

total = 0
for f in files:
    print(f"\n=== {f} ===")
    total += scrub_file(f, REPLACEMENTS)
print(f"\n=== FINAL PASS TOTAL: {total} ===")
