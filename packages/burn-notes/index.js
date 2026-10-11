// @untrace/burn-notes — encrypt in the client, store ciphertext, read once. Spec: docs/burn-notes.md
const enc = new TextEncoder()
const b64 = (buf) => btoa(String.fromCharCode(...new Uint8Array(buf)))
const unb64 = (s) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0))
const b64url = (buf) => b64(buf).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
const unb64url = (s) => unb64(s.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((s.length + 3) % 4))

async function deriveKey(keyStr, pass, saltB64) {
  if (!pass) return crypto.subtle.importKey('raw', unb64url(keyStr), 'AES-GCM', false, ['encrypt', 'decrypt'])
  const base = await crypto.subtle.importKey('raw', enc.encode(keyStr + '\u0000' + pass), 'PBKDF2', false, ['deriveKey'])
  return crypto.subtle.deriveKey({ name: 'PBKDF2', salt: unb64(saltB64), iterations: 250000, hash: 'SHA-256' }, base, { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt'])
}

/** Encrypt text. Returns { ct, iv, key, salt, pw } — send ct/iv/salt/pw to the server, keep `key` for the link #fragment. */
export async function sealNote(text, pass) {
  const key = b64url(crypto.getRandomValues(new Uint8Array(32))), salt = pass ? b64(crypto.getRandomValues(new Uint8Array(16))) : null
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const ct = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, await deriveKey(key, pass, salt), enc.encode(text))
  return { ct: b64(ct), iv: b64(iv), key, salt, pw: !!pass }
}
export async function openNote({ ct, iv, salt }, key, pass) {
  return new TextDecoder().decode(await crypto.subtle.decrypt({ name: 'AES-GCM', iv: unb64(iv) }, await deriveKey(key, pass, salt), unb64(ct)))
}

export class NotesClient {
  /** @param {{apiKey:string, base?:string, siteOrigin?:string}} o */
  constructor({ apiKey, base = 'https://untrace-api.skylerp530.workers.dev', siteOrigin = 'https://untrace.skysmindtech.com' }) { this.apiKey = apiKey; this.base = base; this.site = siteOrigin }
  async #call(path, method = 'GET', body) {
    const r = await fetch(this.base + path, { method, headers: { authorization: 'Bearer ' + this.apiKey, ...(body ? { 'content-type': 'application/json' } : {}) }, body: body ? JSON.stringify(body) : undefined })
    const d = await r.json().catch(() => ({})); return { status: r.status, ...d }
  }
  /** Create a note. Returns { id, link } — the link opens on the Untrace site; the key never leaves it. */
  async create(text, { passphrase, ttl = 86400 } = {}) {
    const s = await sealNote(text, passphrase)
    const d = await this.#call('/v1/notes', 'POST', { ct: s.ct, iv: s.iv, ttl, salt: s.salt, pw: s.pw })
    if (!d.ok) throw new Error(d.error || 'Could not create note')
    return { id: d.id, ttl: d.ttl, link: `${this.site}/note/${d.id}#${s.key}` }
  }
  async peek(id) { return this.#call(`/v1/notes/${id}/peek`) }
  /** Read & burn. `key` is the part after # in the link. */
  async read(id, key, passphrase) {
    if (!passphrase) { const d = await this.#call(`/v1/notes/${id}/burn`, 'POST'); if (d.ok === false) throw new Error(d.error || 'Gone'); return openNote(d, key) }
    const c = await this.#call(`/v1/notes/${id}/claim`, 'POST'); if (c.ok === false) throw new Error(c.error || 'Gone')
    let text; try { text = await openNote(c, key, passphrase) } catch { const rel = await this.#call(`/v1/notes/${id}/release?token=${c.token}`, 'POST'); throw new Error(rel.burned ? 'Wrong passphrase — the note has burned.' : `Wrong passphrase — ${rel.left} attempts left.`) }
    await this.#call(`/v1/notes/${id}/confirm?token=${c.token}`, 'POST'); return text
  }
}
