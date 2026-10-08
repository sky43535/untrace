# Burn Notes

A note is encrypted **in the client** with AES-GCM. The random 256-bit key goes in the link's `#fragment`, which browsers never
send to a server. An optional passphrase is mixed in with PBKDF2 (250,000 rounds, SHA-256), so the reader needs the link *and* the passphrase.

```
link = https://<site>/note/<id>#<key>
key  = base64url(32 random bytes)
with passphrase:  AES key = PBKDF2(key + "\0" + passphrase, salt(16), 250000, SHA-256)
```

## Server flow
| Step | Call | Notes |
|---|---|---|
| create | `POST /v1/notes` `{ct, iv, ttl, salt?, pw?}` → `{ok, id, ttl}` | `ct` ≤ 40,000 chars, `ttl` 300 s – 7 days |
| peek | `GET /v1/notes/:id/peek` → `{exists, pw}` | doesn't consume the note |
| read (no passphrase) | `POST /v1/notes/:id/burn` → `{ct, iv, …}` | atomic: the first caller wins, then it's gone |
| read (passphrase) | `POST …/claim` → `{token, ct, iv, salt}` then `POST …/confirm?token=` | on a wrong passphrase call `…/release?token=`; **5 wrong tries burn the note** |

Each note is its own Durable Object, which is what makes “read once” atomic.

Reference implementation: [`packages/burn-notes`](../packages/burn-notes).
