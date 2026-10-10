# API

Base URL: `https://untrace-api.skylerp530.workers.dev`

## Auth
`Authorization: Bearer utk_<appid>.<secret>` (or `X-Untrace-Key`). WebSockets can't set headers, so pass the key as a
sub-protocol: `new WebSocket(url, ['untrace.v1', 'key.utk_…'])`.

Keys are stored only as SHA-256 hashes. **Never ship a secret key in a public web page** — ask for an origin-locked key, or call the API from your server.

## Endpoints
| | |
|---|---|
| `GET /v1` | service info (no key) |
| `GET /v1/attribution` | the exact attribution rule (no key) |
| `POST /v1/notes`, `GET /v1/notes/:id/peek`, `POST /v1/notes/:id/{burn,claim,confirm,release}` | [Burn Notes](burn-notes.md) |
| `GET /v1/meet/:id` (WebSocket) | [Meeting Room](meeting-protocol.md) |
| `GET /v1/threats`, `GET /v1/threats/check?url=` | [Threat Wall](threat-wall.md) |

## Limits
Standard keys: 120 requests/min. `plus` keys: 600/min. `/v1/threats/check`: 15/min per key. Errors are `{ok:false, error}`;
`429` includes `retry-after`. Every response carries `X-Untrace-Attribution`.

## Getting a key
Email your **app id** and a line about what you're building to **sky@skysmindtech.com** (origins if it's a browser app). Keys are issued by hand and sent once.
