# Meeting Room protocol (v1)

Up to **6 people**. Media (audio/video) is **WebRTC peer-to-peer**; the server relays only small, encrypted signalling messages.
There is no recording, no stored chat, and no screen share or whiteboard in v1.

## Roles & invites
- The **host** creates the room: random `id`, `k` (AES-GCM room key, base64url, never sent to the server), and `h` (host token, ≥16 chars).
  Host link: `/meet/<id>#k=<k>&h=<h>`.
- The host mints one **invite per person** (`{t:'invite', code, label}`, up to 12). Guest link: `/meet/<id>#k=<k>&i=<code>`.
- An invite is bound to the **first browser** that uses it. A different browser gets close code `4409`. The host sees *which invite* each waiting person used and decides who gets in.

## Connection
`wss://…/v1/meet/<id>` with sub-protocols `untrace.v1, key.<utk_…>`. The **first message** must be:

```json
{"t":"auth","role":"host","token":"<h>","cid":"<random browser id>"}
{"t":"auth","role":"guest","invite":"<code>","cid":"<random browser id>"}
```

Server → client: `hello {pid, host, max}`, `wait {label, full}`, `p {peers:[{pid,label,host}]}`, `state {invites, locked, seats, max}` (host only), `error {e}`, `m {from,label,host,to?,iv,ct}`.
Host → server controls: `invite`, `admit {pid}`, `deny {pid}`, `kick {pid}`, `reset {pid}`, `lock {on}`, `end`.

## Encrypted messages
Anything else is `{iv, ct, to?}` where `ct = AES-GCM(roomKey, JSON message)`. The server relays it with **server-assigned** `from`, `label` and `host` fields,
so a participant can't impersonate another. Message kinds used by Untrace (inside the ciphertext): `offer`, `answer`, `ice`, `media`, `hand`, `react`, `chat`, `poll`, `vote`, `pollEnd`, `timer`, `muteAll`, `ag`, `need`, `sync`.

## Close codes
`4001` ended · `4401` bad token · `4403` not admitted / removed · `4404` no such meeting · `4409` invite in use · `4423` locked · `4000` replaced by a newer connection.

## The tracking notice (mandatory)
Meeting Room is the only Untrace share link that uses tracking — an invite binds a person's label to one browser, **only to prevent spoofing and harassment**.
Both the host and every guest must be shown the notice before joining. The SDK exports it as `TRACKING_NOTICE` and refuses to connect unless you pass `acknowledged: true`.

Reference client: [`packages/meet`](../packages/meet).
