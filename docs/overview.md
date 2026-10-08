# Overview

Untrace is a privacy toolkit. This repo opens up four building blocks:

1. **.lockbox** — an encrypted-file format anyone can read/write offline.
2. **Burn Notes** — zero-knowledge notes that vanish after one read. The server only ever holds ciphertext.
3. **Meeting Room** — up to 6 people, video straight between browsers, invite link per person, host approves everyone.
4. **Threat Wall** — a public list of hostnames the Untrace sandbox found dangerous.

The common idea: **do the sensitive work on the user's device, keep the server dumb, short-lived and unable to read anything.**
