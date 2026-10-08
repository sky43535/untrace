// @untrace/meet — signalling + message crypto for the Meeting Room. WebRTC itself is yours to wire up (see examples/).
// Spec: docs/meeting-protocol.md
const b64 = (buf) => btoa(String.fromCharCode(...new Uint8Array(buf)))
const unb64 = (s) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0))
const unb64url = (s) => unb64(s.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((s.length + 3) % 4))
export const randId = (n = 16) => { const A = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'; return Array.from(crypto.getRandomValues(new Uint8Array(n)), (b) => A[b % A.length]).join('') }

export const ICE = { iceServers: [{ urls: ['stun:stun.cloudflare.com:3478', 'stun:stun.l.google.com:19302'] }] }
export const MAX_PEOPLE = 6

/** Show this (or equivalent wording) to the host AND every guest BEFORE they join. Required by TERMS.md. */
export const TRACKING_NOTICE = {
  title: 'Heads-up: this link tracks one thing',
  body: 'Meeting Room is the only Untrace share link that uses tracking — and only for spoofing and harassment prevention. Each invite link is single-person and bound to the first browser that uses it, and carries the name the host gave it. Untrace does not record audio or video, store chat, or keep your IP address; video and audio go directly between participants.',
}
export const CLOSE_REASONS = { 4000: 'Replaced by a newer connection.', 4001: 'The host ended the meeting.', 4401: 'Bad host token.', 4403: "You weren't admitted, or the invite was removed.", 4404: 'No such meeting.', 4409: 'This invite is already in use by another browser.', 4423: 'The host has locked the room.' }

/** Make a new room. Share `hostPath` with yourself, then mint invites with room.invite(). */
export function newRoom() { const id = randId(9), k = randId(32), h = randId(24); return { id, k, h, hostFragment: `k=${k}&h=${h}`, guestFragment: (code) => `k=${k}&i=${code}` } }

export class MeetRoom {
  #handlers = {}
  /** @param {{apiKey:string, id:string, k:string, role:'host'|'guest', h?:string, invite?:string, acknowledged:boolean, base?:string}} o */
  constructor(o) {
    if (!o.acknowledged) throw new Error('Show TRACKING_NOTICE to the user first, then pass acknowledged: true.')
    this.o = { base: 'wss://untrace-api.skylerp530.workers.dev', ...o }; this.cid = o.cid || randId(18)
  }
  on(ev, fn) { (this.#handlers[ev] ||= []).push(fn); return this }
  #emit(ev, ...a) { for (const f of this.#handlers[ev] || []) f(...a) }
  async connect() {
    const { base, id, k, role, h, invite, apiKey } = this.o
    this.key = await crypto.subtle.importKey('raw', unb64url(k), 'AES-GCM', false, ['encrypt', 'decrypt'])
    const ws = (this.ws = new WebSocket(`${base}/v1/meet/${id}`, ['untrace.v1', 'key.' + apiKey]))
    ws.onopen = () => ws.send(JSON.stringify({ t: 'auth', role, token: h, invite, cid: this.cid }))
    ws.onmessage = async (e) => {
      let d; try { d = JSON.parse(e.data) } catch { return }
      if (d.t === 'hello') { this.pid = d.pid; this.#emit('joined', d) }
      else if (d.t === 'wait') this.#emit('waiting', d)
      else if (d.t === 'p') this.#emit('peers', d.peers)
      else if (d.t === 'state') this.#emit('state', d)
      else if (d.t === 'error') this.#emit('error', d.e)
      else if (d.t === 'm') { try { const pt = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: unb64(d.iv) }, this.key, unb64(d.ct)); this.#emit('message', JSON.parse(new TextDecoder().decode(pt)), { from: d.from, label: d.label, host: d.host }) } catch {} }
    }
    ws.onclose = (e) => this.#emit('closed', { code: e.code, reason: CLOSE_REASONS[e.code] || 'Disconnected.' })
    return this
  }
  /** Send any JSON to everyone (or one pid). It's encrypted with the room key; the server stamps the sender. */
  async send(obj, to) {
    const iv = crypto.getRandomValues(new Uint8Array(12))
    const ct = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, this.key, new TextEncoder().encode(JSON.stringify(obj)))
    this.ws.send(JSON.stringify({ iv: b64(iv), ct: b64(ct), to }))
  }
  // host controls
  invite(label) { const code = randId(16); this.ws.send(JSON.stringify({ t: 'invite', code, label })); return code }
  admit(pid) { this.ws.send(JSON.stringify({ t: 'admit', pid })) }
  deny(pid) { this.ws.send(JSON.stringify({ t: 'deny', pid })) }
  kick(pid) { this.ws.send(JSON.stringify({ t: 'kick', pid })) }
  reset(pid) { this.ws.send(JSON.stringify({ t: 'reset', pid })) }
  lock(on = true) { this.ws.send(JSON.stringify({ t: 'lock', on })) }
  end() { this.ws.send(JSON.stringify({ t: 'end' })) }
  close() { this.ws?.close() }
}
