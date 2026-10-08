# How Untrace is built (the 10,000-ft view)

Cloudflare Workers + Durable Objects, no database. Five workers:

| Worker | Role | Public? |
|---|---|---|
| `untrace` | site + routes `/api/*` to the others | yes |
| `untrace-api` | developer API: keys, per-key limits, CORS | yes |
| `untrace-vault` | notes, drops, capsules, switches, polls | no (service binding only) |
| `untrace-meet` | meeting + burn-room signalling | no |
| `untrace-intel` | link sandbox, Threat Wall, safe links | no |

- **Zero-knowledge by default.** Encryption happens in the browser; the server stores ciphertext in tiny, capped, expiring Durable Objects.
- **Read-once is atomic** because each note/drop is its own Durable Object.
- **Media never touches us.** Meetings are WebRTC mesh; the worker only relays encrypted setup messages.
- **Rate limiting & keys** live in the API worker; private workers can't be reached from the internet.
- **Hardened edge:** strict CSP, HSTS, no-referrer, COOP, nosniff, Permissions-Policy.

What's deliberately *not* here: the server source, the scrubbers, abuse thresholds, and the site UI.
