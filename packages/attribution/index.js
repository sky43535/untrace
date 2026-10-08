// <untrace-attribution> — the required "Provided by [untrace. wordmark]" line. Put it at the TOP of any surface showing Untrace data.
export const SITE = 'https://untrace.skylerp530.workers.dev'

export const MARK_SVG = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.6" stroke-dasharray="3.4 3.4"/><circle cx="12" cy="12" r="3" fill="#ef8f7b"/></svg>'

const Base = typeof HTMLElement !== 'undefined' ? HTMLElement : class {} // lets the package import cleanly on a server
export class UntraceAttribution extends Base {
  connectedCallback() {
    if (this.shadowRoot) return
    const light = this.getAttribute('theme') === 'light'
    const root = this.attachShadow({ mode: 'open' })
    root.innerHTML = `
      <style>
        :host { display: flex; align-items: center; justify-content: center; gap: 10px; padding: 8px 14px; font: 12px/1 ui-monospace, SFMono-Regular, Menlo, monospace; letter-spacing: .08em; text-transform: uppercase;
          color: ${light ? '#5b554c' : '#9a948a'}; background: ${light ? '#f6f2ea' : '#050403'}; border-bottom: 1px solid ${light ? '#ddd5c6' : 'rgba(239,143,123,.25)'}; }
        a { display: inline-flex; align-items: center; gap: 6px; color: ${light ? '#14100e' : '#f4efe6'}; text-decoration: none; text-transform: none; letter-spacing: -.01em; font: 400 18px/1 Georgia, 'Times New Roman', serif; }
        a:hover { color: #ef8f7b; } .dot { color: #ef8f7b; }
      </style>
      <span>Provided by</span>
      <a href="${SITE}" target="_blank" rel="noopener" aria-label="Untrace">${MARK_SVG}<span>untrace<span class="dot">.</span></span></a>`
  }
}
if (typeof customElements !== 'undefined' && !customElements.get('untrace-attribution')) customElements.define('untrace-attribution', UntraceAttribution)
