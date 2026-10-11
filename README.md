# Untrace Open

[github.com/sky43535/untrace](https://github.com/sky43535/untrace) · [site](https://untrace.skysmindtech.com) · [developer page](https://untrace.skysmindtech.com/developers)

The shareable parts of [Untrace](https://untrace.skysmindtech.com): the formats, protocols and small client
libraries behind **.lockbox files**, **Burn Notes**, the **Meeting Room**, and the **Threat Wall** — so you can use them in
your own app.

> **What this is:** specs + client SDKs + examples under Apache-2.0. **What it isn't:** the whole Untrace source. The
> Untrace servers, the scrubbers (photo, document, text, email, QR, link cleaning) and the site itself are not part of this repo.

| Package | What it does | Needs the API? |
|---|---|---|
| [`@untrace/lockbox`](packages/lockbox) | Read & write the `.lockbox` encrypted-file format. Fully offline. | No |
| [`@untrace/burn-notes`](packages/burn-notes) | Zero-knowledge, read-once notes (client crypto + API client). | Yes |
| [`@untrace/meet`](packages/meet) | Signalling client for the 6-person private Meeting Room (video stays peer-to-peer). | Yes |
| [`@untrace/threatwall`](packages/threatwall) | Read the Threat Wall feed, check a link, drop in a ready-made widget. | Yes |
| [`@untrace/attribution`](packages/attribution) | The required "Provided by untrace." line (`<untrace-attribution>`). | No |

## The one rule
Anything that shows Untrace-provided data (Threat Wall, Burn Notes, Meeting Room) must show the line
**“Provided by” + the untrace. wordmark**, linking to Untrace, at the top of that surface. The Threat Wall widget and the
`<untrace-attribution>` element do this for you. Details: [docs/attribution.md](docs/attribution.md) and [TERMS.md](TERMS.md).

## Getting an API key
Anything that talks to `https://untrace-api.skylerp530.workers.dev` needs a key. Keys are issued by hand:
choose an **app id** (3–32 chars, `a-z 0-9 -`), email it to **sky@skysmindtech.com** with a line about what you're building, and you'll be sent a key like
`utk_<appid>.<secret>`. See [docs/api.md](docs/api.md).

## Verified
Apps that build on Untrace, or share its principles, can get a verified page and a revocable badge: https://untrace.skysmindtech.com/verified

## Docs
[Overview](docs/overview.md) · [.lockbox format](docs/lockbox-format.md) · [Burn Notes](docs/burn-notes.md) ·
[Meeting protocol](docs/meeting-protocol.md) · [Threat Wall](docs/threat-wall.md) · [API](docs/api.md) ·
[Attribution](docs/attribution.md) · [How Untrace is built](docs/architecture.md)

## Licence
Code and docs: [Apache-2.0](LICENSE). API use, the name and the wordmark: [TERMS.md](TERMS.md).
