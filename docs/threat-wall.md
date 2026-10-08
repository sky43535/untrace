# Threat Wall

The Untrace sandbox follows a link hop-by-hop from the edge, reads the first bytes of the final page as inert text, and scores it.
Links scoring ≥ 70 ("danger") are added to the wall. The wall stores **hostnames only** — no full URLs, no visitor data.

- `GET /v1/threats` → `{items:[{host, score, flags, count, last…}], total}` (cached ~60 s)
- `GET /v1/threats/check?url=<link>` → `{verdict:"clear|caution|danger", score, blocked, finalHost, hops}` (rate limited harder: runs the sandbox)

Treat verdicts as **signals, not guarantees**. Display the attribution line at the top of anything that shows wall data.
Reference client + drop-in widget: [`packages/threatwall`](../packages/threatwall).
