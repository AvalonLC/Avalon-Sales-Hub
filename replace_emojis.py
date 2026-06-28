#!/usr/bin/env python3
"""
Groundwork Emoji → gwIcon SVG Replacement Script
Replaces all emoji characters across JS/TSX source files with gwIcon() calls
or plain text, per the iconography spec.
"""

import re

# ── Replacement map ───────────────────────────────────────────────────────────
# Key   = exact emoji string in source
# Value = replacement string
#   gwIcon() calls are used for functional UI icons
#   Empty string = remove
#   Plain text   = replace with text label

REPLACEMENTS = {
    # ── Communication ─────────────────────────
    '💬': "gwIcon('message',16)",
    '✉️': "gwIcon('email',16)",
    '✉':  "gwIcon('email',16)",
    '📞': "gwIcon('call',16)",
    '📋': "gwIcon('checklist',16)",
    '📄': "gwIcon('document',16)",
    '📝': "gwIcon('note',16)",
    '📎': "gwIcon('attachment',16)",
    '📁': "gwIcon('folder',16)",
    '📂': "gwIcon('folder',16)",
    '📅': "gwIcon('calendar',16)",
    '📊': "gwIcon('reports',16)",
    '📈': "gwIcon('trending_up',16)",
    '📉': "gwIcon('trending_down',16)",
    '📑': "gwIcon('document',16)",
    '📕': "gwIcon('book',16)",
    '📍': "gwIcon('pin',16)",

    # ── People ────────────────────────────────
    '👤': "gwIcon('user',16)",
    '👥': "gwIcon('users',16)",

    # ── Status / Alerts ───────────────────────
    '⚠️': "gwIcon('warning',16)",
    '⚠':  "gwIcon('warning',16)",
    '✅': "gwIcon('success',16)",
    '⚡': "gwIcon('streak',16)",
    '🚩': "gwIcon('flag',16)",
    '🔒': "gwIcon('lock',16)",
    '🔍': "gwIcon('search',16)",

    # ── Academy / Achievement ─────────────────
    '🏆': "gwIcon('trophy',16)",
    '🏅': "gwIcon('badge',16)",
    '🥇': "gwIcon('level',16)",
    '🥈': "gwIcon('level',16)",
    '🥉': "gwIcon('level',16)",
    '⭐': "gwIcon('star',16)",
    '🌟': "gwIcon('star',16)",
    '🔥': "gwIcon('streak',16)",
    '🎓': "gwIcon('academy',16)",
    '🧠': "gwIcon('ai-spark',16)",
    '🎯': "gwIcon('target',16)",
    '🛡':  "gwIcon('shield',16)",
    '🛡️': "gwIcon('shield',16)",

    # ── Actions / Tools ───────────────────────
    '🔄': "gwIcon('sync',16)",
    '🛠':  "gwIcon('settings',16)",
    '⚙':  "gwIcon('settings',16)",
    '⚙️': "gwIcon('settings',16)",
    '📦': "gwIcon('package',16)",
    '🧮': "gwIcon('calculator',16)",

    # ── Misc pictographs ──────────────────────
    '💰': "gwIcon('revenue',16)",
    '🤝': "gwIcon('handshake',16)",
    '🖼':  "gwIcon('image',16)",
    '🖼️': "gwIcon('image',16)",
    '🎬': "gwIcon('movie',16)",
    '🏗️': "gwIcon('construction',16)",
    '🤔': "gwIcon('thinking',16)",
    '💥': "gwIcon('alert',16)",
    '🗑':  "gwIcon('trash',16)",
    '✏️': "gwIcon('pencil',16)",
    '✈️': "gwIcon('plane',16)",
    '🏢': "gwIcon('building',16)",

    # ── Status dots (used inline in CSS/text) ─
    '●': '',   # remove — replaced by CSS/chip
    '○': '',   # remove — replaced by CSS/chip
}

# ── Context-aware replacements ────────────────────────────────────────────────
# These patterns appear inside template literals or JS objects and need
# the full inline SVG rendered (not a gwIcon() call reference), so we
# produce the actual SVG string for inline HTML contexts.

def svg_inline(name, size=16, color='currentColor'):
    """Returns an inline SVG string for HTML embedding."""
    icons = {
        'email':       f'<svg width="{size}" height="{size}" viewBox="0 0 24 24" fill="none" stroke="{color}" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>',
        'message':     f'<svg width="{size}" height="{size}" viewBox="0 0 24 24" fill="none" stroke="{color}" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
        'call':        f'<svg width="{size}" height="{size}" viewBox="0 0 24 24" fill="none" stroke="{color}" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.38 2 2 0 0 1 3.58 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.96a16 16 0 0 0 6.13 6.13l.86-.86a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>',
        'checklist':   f'<svg width="{size}" height="{size}" viewBox="0 0 24 24" fill="none" stroke="{color}" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><line x1="10" y1="6" x2="21" y2="6"/><line x1="10" y1="12" x2="21" y2="12"/><line x1="10" y1="18" x2="21" y2="18"/><polyline points="3 6 4 7 6 5"/><polyline points="3 12 4 13 6 11"/><polyline points="3 18 4 19 6 17"/></svg>',
        'document':    f'<svg width="{size}" height="{size}" viewBox="0 0 24 24" fill="none" stroke="{color}" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>',
        'note':        f'<svg width="{size}" height="{size}" viewBox="0 0 24 24" fill="none" stroke="{color}" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>',
        'attachment':  f'<svg width="{size}" height="{size}" viewBox="0 0 24 24" fill="none" stroke="{color}" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>',
        'folder':      f'<svg width="{size}" height="{size}" viewBox="0 0 24 24" fill="none" stroke="{color}" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>',
        'image':       f'<svg width="{size}" height="{size}" viewBox="0 0 24 24" fill="none" stroke="{color}" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>',
        'reports':     f'<svg width="{size}" height="{size}" viewBox="0 0 24 24" fill="none" stroke="{color}" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>',
        'calendar':    f'<svg width="{size}" height="{size}" viewBox="0 0 24 24" fill="none" stroke="{color}" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
        'pin':         f'<svg width="{size}" height="{size}" viewBox="0 0 24 24" fill="none" stroke="{color}" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>',
        'warning':     f'<svg width="{size}" height="{size}" viewBox="0 0 24 24" fill="none" stroke="{color}" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
        'success':     f'<svg width="{size}" height="{size}" viewBox="0 0 24 24" fill="none" stroke="{color}" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
        'flag':        f'<svg width="{size}" height="{size}" viewBox="0 0 24 24" fill="none" stroke="{color}" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>',
        'lock':        f'<svg width="{size}" height="{size}" viewBox="0 0 24 24" fill="none" stroke="{color}" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>',
        'search':      f'<svg width="{size}" height="{size}" viewBox="0 0 24 24" fill="none" stroke="{color}" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
        'sync':        f'<svg width="{size}" height="{size}" viewBox="0 0 24 24" fill="none" stroke="{color}" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>',
        'settings':    f'<svg width="{size}" height="{size}" viewBox="0 0 24 24" fill="none" stroke="{color}" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',
        'revenue':     f'<svg width="{size}" height="{size}" viewBox="0 0 24 24" fill="none" stroke="{color}" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>',
        'handshake':   f'<svg width="{size}" height="{size}" viewBox="0 0 24 24" fill="none" stroke="{color}" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 7.65l.97.98L12 21l7.45-7.79.97-.98a5.4 5.4 0 0 0 0-7.65z"/></svg>',
        'shield':      f'<svg width="{size}" height="{size}" viewBox="0 0 24 24" fill="none" stroke="{color}" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
        'target':      f'<svg width="{size}" height="{size}" viewBox="0 0 24 24" fill="none" stroke="{color}" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>',
        'star':        f'<svg width="{size}" height="{size}" viewBox="0 0 24 24" fill="none" stroke="{color}" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
        'streak':      f'<svg width="{size}" height="{size}" viewBox="0 0 24 24" fill="none" stroke="{color}" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>',
        'academy':     f'<svg width="{size}" height="{size}" viewBox="0 0 24 24" fill="none" stroke="{color}" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>',
        'ai-spark':    f'<svg width="{size}" height="{size}" viewBox="0 0 24 24" fill="none" stroke="{color}" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v1m0 16v1M4.22 4.22l.71.71m12.73 12.73.71.71M3 12H2m20 0h-1M4.22 19.78l.71-.71M18.36 5.64l.71-.71"/><circle cx="12" cy="12" r="4"/></svg>',
        'calculator':  f'<svg width="{size}" height="{size}" viewBox="0 0 24 24" fill="none" stroke="{color}" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/><rect x="8" y="10" width="2" height="2" rx="0.5"/><rect x="11" y="10" width="2" height="2" rx="0.5"/><rect x="14" y="10" width="2" height="2" rx="0.5"/><rect x="8" y="14" width="2" height="2" rx="0.5"/><rect x="11" y="14" width="2" height="2" rx="0.5"/><rect x="14" y="14" width="4" height="2" rx="0.5"/></svg>',
        'package':     f'<svg width="{size}" height="{size}" viewBox="0 0 24 24" fill="none" stroke="{color}" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>',
        'building':    f'<svg width="{size}" height="{size}" viewBox="0 0 24 24" fill="none" stroke="{color}" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><line x1="9" y1="22" x2="9" y2="12"/><line x1="15" y1="22" x2="15" y2="12"/><rect x="9" y="6" width="6" height="4"/><rect x="9" y="12" width="6" height="6"/></svg>',
        'trash':       f'<svg width="{size}" height="{size}" viewBox="0 0 24 24" fill="none" stroke="{color}" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>',
        'pencil':      f'<svg width="{size}" height="{size}" viewBox="0 0 24 24" fill="none" stroke="{color}" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>',
        'thinking':    f'<svg width="{size}" height="{size}" viewBox="0 0 24 24" fill="none" stroke="{color}" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
        'movie':       f'<svg width="{size}" height="{size}" viewBox="0 0 24 24" fill="none" stroke="{color}" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="2" y1="7" x2="7" y2="7"/><line x1="2" y1="17" x2="7" y2="17"/><line x1="17" y1="17" x2="22" y2="17"/><line x1="17" y1="7" x2="22" y2="7"/></svg>',
        'construction':f'<svg width="{size}" height="{size}" viewBox="0 0 24 24" fill="none" stroke="{color}" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"/><path d="M12 12h.01"/><path d="M17 12h.01"/><path d="M7 12h.01"/></svg>',
        'plane':       f'<svg width="{size}" height="{size}" viewBox="0 0 24 24" fill="none" stroke="{color}" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>',
        'alert':       f'<svg width="{size}" height="{size}" viewBox="0 0 24 24" fill="none" stroke="{color}" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
        'badge':       f'<svg width="{size}" height="{size}" viewBox="0 0 24 24" fill="none" stroke="{color}" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 3.9 2.4-7.4L2 9.4h7.6z"/></svg>',
        'trophy':      f'<svg width="{size}" height="{size}" viewBox="0 0 24 24" fill="none" stroke="{color}" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2z"/></svg>',
        'level':       f'<svg width="{size}" height="{size}" viewBox="0 0 24 24" fill="none" stroke="{color}" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="16" width="4" height="5" rx="1"/><rect x="10" y="11" width="4" height="10" rx="1"/><rect x="17" y="6" width="4" height="15" rx="1"/></svg>',
        'book':        f'<svg width="{size}" height="{size}" viewBox="0 0 24 24" fill="none" stroke="{color}" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>',
    }
    return icons.get(name, f'<svg width="{size}" height="{size}" viewBox="0 0 24 24" fill="none" stroke="{color}" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/></svg>')


# ── File-specific replacement rules ──────────────────────────────────────────

def replace_app_premium(content):
    """app_premium.js specific replacements."""

    # TYPE_ICON map for activity timeline — these appear in template literals as HTML
    content = content.replace(
        "const TYPE_ICON = { sms:'💬', email:'✉️', call:'📞', note:'📋', proposal:'📄' };",
        "const TYPE_ICON = { sms: gwIcon('message',14,'#4D8A86'), email: gwIcon('email',14,'#113931'), call: gwIcon('call',14,'#2D7A55'), note: gwIcon('checklist',14,'#8B6914'), proposal: gwIcon('document',14,'#4D8A86') };"
    )

    # AI coach template icons (object with icon property used inline)
    content = content.replace("icon:'✉️',  color:'#1A4740'", "icon: gwIcon('email',18,'#fff'), color:'#1A4740'")
    content = content.replace("icon:'🔄',  color:'#4D8A86'", "icon: gwIcon('sync',18,'#fff'),  color:'#4D8A86'")
    content = content.replace("icon:'📋',  color:'#2D7A55'", "icon: gwIcon('checklist',18,'#fff'), color:'#2D7A55'")
    content = content.replace("icon:'🛡️',  color:'#8B6914'", "icon: gwIcon('shield',18,'#fff'), color:'#8B6914'")
    content = content.replace("icon:'🎯',  color:'#B8744F'", "icon: gwIcon('target',18,'#fff'), color:'#B8744F'")
    content = content.replace("icon:'📍',  color:'#B8744F'", "icon: gwIcon('pin',18,'#fff'),    color:'#B8744F'")
    content = content.replace("icon:'🤝',  color:'#8B3A2A'", "icon: gwIcon('handshake',18,'#fff'), color:'#8B3A2A'")
    content = content.replace("icon:'⭐',  color:'#8B6914'", "icon: gwIcon('star',18,'#fff'),  color:'#8B6914'")
    content = content.replace("icon:'✦',   color:'#6F7E6A'", "icon: gwIcon('ai-spark',18,'#fff'), color:'#6F7E6A'")

    # file type icon function — ext2icon returning emojis
    content = content.replace(
        "const icon = isImg ? '🖼' : isPdf ? '📄' : ext==='docx'||ext==='doc' ? '📝' : '📎';",
        "const icon = isImg ? gwIcon('image',14,'#4D8A86') : isPdf ? gwIcon('document',14,'#8B3A2A') : ext==='docx'||ext==='doc' ? gwIcon('note',14,'#113931') : gwIcon('attachment',14,'#6F7E6A');"
    )
    # Second file type icon (comms board attachment chips)
    content = content.replace(
        "const icon = isImg ? '🖼' : isPdf ? '📄' : ext==='docx'||ext==='doc' ? '📝' : '📎'",
        "const icon = isImg ? gwIcon('image',14,'#4D8A86') : isPdf ? gwIcon('document',14,'#8B3A2A') : ext==='docx'||ext==='doc' ? gwIcon('note',14,'#113931') : gwIcon('attachment',14,'#6F7E6A')"
    )

    # ext2icon function in files section (multi-line format)
    content = content.replace(
        "    if(['jpg','jpeg','png','gif','webp'].includes(e)) return '🖼';\n    if(e==='pdf') return '📄';\n    if(['doc','docx'].includes(e)) return '📝';\n    if(['xls','xlsx'].includes(e)) return '📊';\n    return '📎';",
        "    if(['jpg','jpeg','png','gif','webp'].includes(e)) return gwIcon('image',16,'#4D8A86');\n    if(e==='pdf') return gwIcon('document',16,'#8B3A2A');\n    if(['doc','docx'].includes(e)) return gwIcon('note',16,'#113931');\n    if(['xls','xlsx'].includes(e)) return gwIcon('spreadsheet',16,'#2D7A55');\n    return gwIcon('attachment',16,'#6F7E6A');"
    )
    # Inline attach chip (isImg?'🖼':'📎')
    content = content.replace(
        "(isImg?'🖼':'📎')",
        "(isImg ? gwIcon('image',14,'#4D8A86') : gwIcon('attachment',14,'#6F7E6A'))"
    )

    # Empty-state icons in comms board
    content = content.replace(
        "'<div class=\"comm-empty-icon\">💬</div>'",
        "'<div class=\"comm-empty-icon\">' + gwIcon('message',40,'#C8D8D3') + '</div>'"
    )
    content = content.replace(
        "<div class=\"comm-empty-icon\">📁</div>",
        "<div class=\"comm-empty-icon\">' + gwIcon('folder',40,'#C8D8D3') + '</div>"
    )

    # Gmail sent badge
    content = content.replace(
        "'<span class=\"comm-gmail-badge\">✅ Sent via Gmail</span>'",
        "'<span class=\"comm-gmail-badge\">' + gwIcon('success',12,'#2D7A55') + ' Sent via Gmail</span>'"
    )
    content = content.replace(
        "'>📋 Logged locally</span>'",
        "'>' + gwIcon('checklist',12,'#6F7E6A') + ' Logged locally</span>'"
    )

    # showToast calls with emoji
    content = content.replace("showToast(`⚠️ Cloud sync failed for", "showToast(`Cloud sync failed for")
    content = content.replace("showToast('⚠️ Google not connected", "showToast('Google not connected")
    content = content.replace("showToast('Email sent via Gmail ✅", "showToast('Email sent via Gmail \u2014")

    # ✦ AI Coach / Draft buttons (functional, replace with icon+text)
    content = content.replace(
        "✦ AI Coach</button>",
        "' + gwIcon('ai-spark',14,'currentColor') + ' AI Coach</button>"
    )
    content = content.replace(
        "✦ AI Draft from Fields</button>",
        "' + gwIcon('ai-spark',14,'currentColor') + ' AI Draft</button>"
    )
    content = content.replace(
        "✦ AI Coach for this stage</button>",
        "' + gwIcon('ai-spark',14,'currentColor') + ' AI Coach</button>"
    )
    content = content.replace(
        "✦ Personalize + Copy</button>",
        "' + gwIcon('ai-spark',14,'currentColor') + ' Personalize + Copy</button>"
    )
    content = content.replace(
        "✦ AI Refine</button>",
        "' + gwIcon('ai-spark',14,'currentColor') + ' AI Refine</button>"
    )
    content = content.replace(
        "✦ AI Refine Reply</button>",
        "' + gwIcon('ai-spark',14,'currentColor') + ' AI Refine Reply</button>"
    )
    content = content.replace(
        "\n      ✦ Generate Email / Reply\n    </button>",
        "\n      ' + gwIcon('ai-spark',16,'currentColor') + ' Generate\n    </button>"
    )

    # ★ Favorites star
    content = content.replace(">★ Favorites</button>", "> Favorites</button>")
    content = content.replace("${isFav?'★':'☆'}", "${isFav ? gwIcon('star',14,'#8B6914') : gwIcon('star',14,'#C8C3B6')}")

    # ▾ disclosure arrow
    content = content.replace("More ▾</button>", "More</button>")
    content = content.replace("How to respond ▾</summary>", "How to respond</summary>")

    # ✓ Sold badge — keep as text check mark (not emoji)
    content = content.replace("'>✓ Sold</span>", ">Sold</span>")
    content = content.replace("'>✓ Sold</span>", ">Sold</span>")

    # ⚠ Unassigned badge (plain text is fine, already styled)
    content = content.replace(">⚠ Unassigned</span>", ">Unassigned</span>")

    return content


def replace_reps(content):
    """reps.js specific replacements."""
    content = content.replace(">⚠️ Unassigned</span>", ">Unassigned</span>")
    content = content.replace(">⚠ Unassigned</span>", ">Unassigned</span>")
    content = content.replace("⭐", "")
    content = content.replace("💥", "")
    content = content.replace("⚙", "")
    content = content.replace("○", "")
    content = content.replace("⚠️", "!")
    return content


def replace_integrations(content):
    """integrations.js specific replacements."""
    # File type icons in Drive panel
    content = content.replace("return '🖼️'", "return gwIcon('image',16,'#4D8A86')")
    content = content.replace("return '📊'", "return gwIcon('spreadsheet',16,'#2D7A55')")
    content = content.replace("return '📝'", "return gwIcon('note',16,'#113931')")
    content = content.replace("return '📄'", "return gwIcon('document',16,'#8B3A2A')")
    content = content.replace("return '📋'", "return gwIcon('checklist',16,'#4D8A86')")
    content = content.replace("return '📑'", "return gwIcon('document',16,'#6F7E6A')")
    content = content.replace("return '📕'", "return gwIcon('book',16,'#8B3A2A')")
    content = content.replace("return '📎'", "return gwIcon('attachment',16,'#6F7E6A')")
    content = content.replace("return '📁'", "return gwIcon('folder',16,'#8B6914')")

    # Homeworks import emoji
    content = content.replace("'✏️'", "gwIcon('pencil',16,'currentColor')")
    content = content.replace("'🗑'",  "gwIcon('trash',16,'currentColor')")
    content = content.replace("'✈️'", "gwIcon('plane',16,'currentColor')")
    content = content.replace("'📅'", "gwIcon('calendar',16,'currentColor')")
    content = content.replace("'📍'", "gwIcon('pin',16,'currentColor')")
    content = content.replace("'📊'", "gwIcon('reports',16,'currentColor')")
    content = content.replace("'📄'", "gwIcon('document',16,'currentColor')")
    content = content.replace("'🎬'", "gwIcon('movie',16,'currentColor')")
    content = content.replace("'🏗️'", "gwIcon('construction',16,'currentColor')")
    content = content.replace("'🤔'", "gwIcon('thinking',16,'currentColor')")
    content = content.replace("'✉️'", "gwIcon('email',16,'currentColor')")
    content = content.replace("'📝'", "gwIcon('note',16,'currentColor')")
    content = content.replace("'📎'", "gwIcon('attachment',16,'currentColor')")

    # Dot status indicators
    content = content.replace("'●'", "''")
    content = content.replace("'○'", "''")

    return content


def replace_index(content):
    """index.tsx specific replacements."""
    content = content.replace("🛡", "")
    content = content.replace("🛡️", "")
    return content


# ── Main runner ───────────────────────────────────────────────────────────────

def run():
    files = {
        'public/static/app_premium.js': replace_app_premium,
        'public/static/reps.js':        replace_reps,
        'public/static/integrations.js':replace_integrations,
        'src/index.tsx':                 replace_index,
    }

    for filepath, specific_fn in files.items():
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        # Apply global simple replacements first
        for emoji, replacement in REPLACEMENTS.items():
            if emoji in content:
                content = content.replace(emoji, replacement)

        # Apply file-specific context-aware replacements
        content = specific_fn(content)

        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)

        print(f'Processed: {filepath}')

    print('\nDone. Run emoji scan to verify.')


if __name__ == '__main__':
    run()
