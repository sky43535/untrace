# Terms for using the Untrace API, name and wordmark

The code and specs in this repository are licensed under **Apache-2.0** — read it, run it, fork it, learn from it.
Apache-2.0 doesn't cover trademarks, and it can't govern a hosted service. These terms do, for the parts that are ours.

## 1. Attribution (required)
Every app, site or screen that displays data or functionality served by the Untrace API must show, **at the top of that
surface**, the line **“Provided by”** followed by the **untrace.** wordmark, linking to
`https://untrace.skylerp530.workers.dev`. It must be readable (at least 12px / 9pt), on a contrasting background, and not hidden,
collapsed, or removed. The `<untrace-attribution>` element does this correctly.

## 2. Keys
- Keys are issued manually, per app id, and are yours alone. Don't share or publish a secret key; for browser apps ask for
  an **origin-locked** key.
- We may rate-limit, suspend or revoke a key for abuse, for breaking these terms, or to protect the service.
- Don't try to get around limits (e.g. by rotating app ids).

## 3. Use it, don't rebuild it on top
You may use the API inside your own products. You may not (a) resell or re-expose the API as your own API or
proxy service, (b) present Untrace features as your own, or (c) build a competing hosted service whose backend is the Untrace API.
(Forking the Apache-2.0 client code to run against your *own* servers is fine — that's what the licence allows.)

## 4. Meeting Room safety
The Meeting Room invite model exists to prevent spoofing and harassment. Apps using `@untrace/meet` must show the tracking
notice exported by the SDK to the host **and** every guest before they join, and must not hide or alter the server-assigned
names of participants.

## 5. Don't abuse it
No illegal content, spam, phishing, harassment, or attempts to unmask people. Burn Notes are ciphertext we can't read — if
you put something harmful in one, that's on you, and we may remove it and cut your key. Report problems via `/.well-known/security.txt`.

## 6. Name and mark
"Untrace" and the wordmark are not licensed for your product name, logo, or domain. Saying "works with Untrace" is fine.

## 7. Verified badge
The “Verified by Untrace” badge is served live and can be withdrawn at any time; don’t copy it, host your own version, or use it after verification is withdrawn.

## 8. No warranty
The API is provided as is. Threat Wall verdicts are signals, not guarantees. Data may expire or be removed at any time.
