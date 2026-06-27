/**
 * Avalon Sales Hub — D1 Frontend API Client (db.js)
 *
 * This module replaces direct localStorage reads/writes with async
 * fetch() calls to the Hono API layer backed by Cloudflare D1.
 *
 * Usage:
 *   const opps = await DB.opportunities.list({ repId: 'tyler' });
 *   await DB.opportunities.save(opp);  // create or update
 *   await DB.notes.add(oppId, body, repId);
 *   const me = await DB.auth.me();
 *
 * All methods return the data payload directly (unwrapped from { ok, data }).
 * On error they throw with a descriptive message.
 *
 * MIGRATION BRIDGE:
 *   DB.sync(state) — sends full localStorage state to /api/sync for one-time
 *   migration. Call on first D1-enabled load if localStorage has data.
 */

const DB = (() => {

  // ── Base fetch helper ────────────────────────────────────────────────────────
  async function api(method, path, body) {
    const opts = {
      method,
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include'  // send session cookie
    };
    if (body !== undefined) opts.body = JSON.stringify(body);
    const res = await fetch('/api' + path, opts);
    const json = await res.json();
    if (!json.ok) throw new Error(json.error || `API error ${res.status}: ${path}`);
    return json.data;
  }

  const get  = (path)        => api('GET',    path);
  const post = (path, body)  => api('POST',   path, body);
  const put  = (path, body)  => api('PUT',    path, body);
  const del  = (path)        => api('DELETE', path);

  // ── AUTH ─────────────────────────────────────────────────────────────────────
  const auth = {
    /** Login with repId + PIN. Returns rep object (no pin) on success. */
    login(repId, pin) {
      return post('/auth/login', { repId, pin });
    },
    /** Logout — clears session cookie. */
    logout() {
      return post('/auth/logout', {});
    },
    /** Returns current rep from session cookie, or throws 401. */
    me() {
      return get('/auth/me');
    }
  };

  // ── REPS ─────────────────────────────────────────────────────────────────────
  const reps = {
    list()     { return get('/reps'); },
    get(id)    { return get(`/reps/${id}`); },
    update(id, data) { return put(`/reps/${id}`, data); }
  };

  // ── OPPORTUNITIES ────────────────────────────────────────────────────────────
  const opportunities = {
    /** List all opportunities, optionally filtered by repId and/or status. */
    list({ repId, status } = {}) {
      const params = new URLSearchParams();
      if (repId)  params.set('repId', repId);
      if (status) params.set('status', status);
      const qs = params.toString();
      return get('/opportunities' + (qs ? '?' + qs : ''));
    },

    /** Get single opportunity by id. */
    get(id) {
      return get(`/opportunities/${id}`);
    },

    /**
     * Save (create or update) an opportunity.
     * If opp.id exists → PUT, else → POST.
     * Returns { id } on success.
     */
    async save(opp) {
      if (opp.id) {
        return put(`/opportunities/${opp.id}`, opp);
      } else {
        return post('/opportunities', opp);
      }
    },

    /** Delete an opportunity and all child records. */
    delete(id) {
      return del(`/opportunities/${id}`);
    }
  };

  // ── NOTES ────────────────────────────────────────────────────────────────────
  const notes = {
    /** Get all notes for an opportunity. */
    list(oppId) {
      return get(`/opportunities/${oppId}/notes`);
    },

    /** Add a new note to an opportunity. */
    add(oppId, body, repId) {
      return post(`/opportunities/${oppId}/notes`, { body, repId });
    },

    /** Delete a note by id. */
    delete(noteId) {
      return del(`/notes/${noteId}`);
    }
  };

  // ── COMMUNICATIONS ───────────────────────────────────────────────────────────
  const comms = {
    /** Get communications for an opportunity. */
    list(oppId) {
      return get(`/opportunities/${oppId}/comms`);
    },

    /** Log a communication (call, email, SMS, proposal). */
    add(oppId, { type, direction, subject, body, repId }) {
      return post(`/opportunities/${oppId}/comms`, { type, direction, subject, body, repId });
    },

    /** Get all communications (global activity log), optionally filtered by repId. */
    all(repId) {
      const qs = repId ? `?repId=${encodeURIComponent(repId)}` : '';
      return get('/comms' + qs);
    }
  };

  // ── CHECKLIST PROGRESS ───────────────────────────────────────────────────────
  const checklist = {
    /** Get all checklist progress rows for an opportunity. */
    list(oppId) {
      return get(`/checklist/${oppId}`);
    },

    /**
     * Upsert a checklist item.
     * @param {string} oppId
     * @param {string} checklistId  — e.g. 'new-lead', 'proposal-sent'
     * @param {number} itemIndex
     * @param {boolean} checked
     */
    set(oppId, checklistId, itemIndex, checked) {
      return put('/checklist', { oppId, checklistId, itemIndex, checked });
    }
  };

  // ── CLIENTS ──────────────────────────────────────────────────────────────────
  const clients = {
    list()          { return get('/clients'); },
    save(client)    {
      if (client.id) return put(`/clients/${client.id}`, client);
      return post('/clients', client);
    },
    delete(id)      { return del(`/clients/${id}`); }
  };

  // ── SETTINGS ─────────────────────────────────────────────────────────────────
  const settings = {
    getAll()         { return get('/settings'); },
    set(key, value)  { return put('/settings', { key, value }); }
  };

  // ── REVENUE ACTUALS ──────────────────────────────────────────────────────────
  const revenue = {
    list()                                           { return get('/revenue'); },
    set(month, year, rev, note, division = 'total')  {
      return put('/revenue', { month, year, revenue: rev, note, division });
    }
  };

  // ── ACADEMY ──────────────────────────────────────────────────────────────────
  const academy = {
    progress: {
      list(repId)    { return get(`/academy/progress/${repId}`); },
      set(repId, moduleId, sectionId, completed, score) {
        return put('/academy/progress', { repId, moduleId, sectionId, completed, score });
      }
    },
    quiz: {
      list(repId)    { return get(`/academy/quiz/${repId}`); },
      submit(repId, moduleId, score, total, passed, answers) {
        return post('/academy/quiz', { repId, moduleId, score, total, passed, answers });
      }
    },
    badges: {
      list(repId)    { return get(`/academy/badges/${repId}`); },
      award(repId, badgeId) {
        return post('/academy/badges', { repId, badgeId });
      }
    },
    certs: {
      list(repId)    { return get(`/academy/certs/${repId}`); },
      set(repId, phaseId, status) {
        return put('/academy/certs', { repId, phaseId, status });
      }
    }
  };

  // ── BULK SYNC (one-time localStorage → D1 migration) ─────────────────────────
  /**
   * Send full localStorage state to /api/sync for one-time migration.
   * Safe to call multiple times — uses INSERT OR IGNORE / INSERT OR REPLACE.
   * @param {object} state — { opportunities[], notes[], communications[], clients[] }
   * @returns {{ synced: number }}
   */
  async function sync(state) {
    return post('/sync', {
      opportunities:  state.opportunities  || [],
      notes:          state.notes          || [],
      communications: state.communications || [],
      clients:        state.clients        || []
    });
  }

  // ── MIGRATION BRIDGE ─────────────────────────────────────────────────────────
  /**
   * One-time migration: reads localStorage, pushes to D1, marks done.
   * Call this on app startup (before loadState from D1).
   *
   * Uses flag key 'db_migrated_v1' in D1 settings to avoid repeat migration.
   */
  async function migrateFromLocalStorage() {
    const STORAGE_KEY = 'avalonSalesHubStateV3';
    const MIGRATE_FLAG = 'db_migrated_v1';

    // Check if migration already done
    try {
      const allSettings = await settings.getAll();
      if (allSettings && allSettings[MIGRATE_FLAG] === '1') {
        console.log('[DB] Migration already done, skipping.');
        return false;
      }
    } catch(e) {
      console.warn('[DB] Could not check migration flag:', e.message);
    }

    // Check if localStorage has data
    let localData;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        console.log('[DB] No localStorage data to migrate.');
        await settings.set(MIGRATE_FLAG, '1');
        return false;
      }
      localData = JSON.parse(raw);
    } catch(e) {
      console.warn('[DB] Could not read localStorage:', e.message);
      return false;
    }

    const hasData = (
      (localData.opportunities && localData.opportunities.length > 0) ||
      (localData.notes          && localData.notes.length          > 0) ||
      (localData.communications && localData.communications.length > 0)
    );

    if (!hasData) {
      console.log('[DB] localStorage empty, nothing to migrate.');
      await settings.set(MIGRATE_FLAG, '1');
      return false;
    }

    // Also migrate clients from separate localStorage key
    let localClients = [];
    try {
      const raw = localStorage.getItem('avalonClientsV1');
      if (raw) localClients = JSON.parse(raw) || [];
    } catch(e) {}

    console.log(`[DB] Migrating ${localData.opportunities?.length || 0} opps, ` +
      `${localData.notes?.length || 0} notes, ${localData.communications?.length || 0} comms, ` +
      `${localClients.length} clients from localStorage → D1`);

    try {
      const result = await sync({
        opportunities:  localData.opportunities  || [],
        notes:          localData.notes          || [],
        communications: localData.communications || [],
        clients:        localClients
      });
      console.log(`[DB] Migration synced ${result.synced} records`);
      await settings.set(MIGRATE_FLAG, '1');
      return true;
    } catch(e) {
      console.error('[DB] Migration failed:', e.message);
      return false;
    }
  }

  // ── SESSION MANAGEMENT ───────────────────────────────────────────────────────
  /**
   * Check if user is currently logged in.
   * Returns rep object or null.
   */
  async function getSession() {
    try {
      return await auth.me();
    } catch(e) {
      return null;
    }
  }

  // ── PUBLIC API ───────────────────────────────────────────────────────────────
  return {
    auth,
    reps,
    opportunities,
    notes,
    comms,
    checklist,
    clients,
    settings,
    revenue,
    academy,
    sync,
    migrateFromLocalStorage,
    getSession
  };

})();

// Make available globally
window.DB = DB;
