// @untrace/threatwall — client for the Threat Wall + a drop-in widget that always shows the required attribution line.
import '../attribution/index.js'

export class ThreatWall {
  /** @param {{apiKey:string, base?:string}} o */
  constructor({ apiKey, base = 'https://untrace-api.skylerp530.workers.dev' }) { this.apiKey = apiKey; this.base = base }
  async #get(path) { const r = await fetch(this.base + path, { headers: { authorization: 'Bearer ' + this.apiKey } }); const d = await r.json().catch(() => ({})); if (!r.ok || d.ok === false) throw new Error(d.error || 'Request failed (' + r.status + ')'); return d }
  /** The public wall: { items:[{host, score, count, …}], total } */
  feed() { return this.#get('/v1/threats') }
  /** Ask the sandbox about one link: { verdict:'clear'|'caution'|'danger', score, blocked, finalHost, hops } */
  check(url) { return this.#get('/v1/threats/check?url=' + encodeURIComponent(url)) }
}

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c])

/** Render the wall into an element. The attribution line is part of the widget and sits at the top. */
export async function mountThreatWall(el, { apiKey, base, limit = 12, theme = 'dark' } = {}) {
  const wall = new ThreatWall({ apiKey, base })
  el.replaceChildren()
  const attr = document.createElement('untrace-attribution'); attr.setAttribute('theme', theme); el.append(attr)
  const body = document.createElement('div'); body.style.cssText = 'font:14px system-ui;padding:12px'; el.append(body)
  try {
    const { items = [], total = 0 } = await wall.feed()
    body.innerHTML = items.length ? `<div style="opacity:.6;margin-bottom:8px">${total} dangerous hosts seen</div>` + items.slice(0, limit).map((i) => `<div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid rgba(128,128,128,.2)"><span>${esc(i.host)}</span><b>${esc(i.score)}</b></div>`).join('') : 'Nothing on the wall right now.'
  } catch (e) { body.textContent = 'Could not load the Threat Wall: ' + e.message }
}
