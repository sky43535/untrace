# Attribution

Show this at the **top** of every screen or page that displays Untrace-provided data:

> **Provided by** `untrace.` — the wordmark (dashed circle with the salmon centre dot + the word *untrace* + a salmon full stop), linked to `https://untrace.skylerp530.workers.dev`.

```html
<script type="module" src="./packages/attribution/index.js"></script>
<untrace-attribution></untrace-attribution>
```

Or `import '@untrace/attribution'`. Attributes: `theme="dark|light"` (default dark). For non-web apps: draw the same line natively using the mark and link in [`packages/attribution`](../packages/attribution).
Don't hide it, shrink it below readability, or put it behind a menu. See [TERMS.md](../TERMS.md).
