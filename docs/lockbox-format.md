# `.lockbox` file format — version 1

A `.lockbox` file is one file, encrypted with a passphrase. Everything runs locally; there is no server involved.

```
offset  size  field
0       6     magic            ASCII "UTLBX1"
6       4     iterations       uint32, big-endian (Untrace writes 310000)
10      16    salt             random
26      12    iv               random (AES-GCM nonce)
38      …     ciphertext + 16-byte GCM tag
```

**Key:** `PBKDF2-HMAC-SHA256(passphrase as UTF-8, salt, iterations) → 256-bit AES-GCM key`.

**Plaintext (before encryption):**

```
0       2     nameLength       uint16, big-endian
2       n     name             original file name, UTF-8
2+n     …     file bytes
```

Readers must reject files whose magic doesn't match, whose `iterations` is below 100,000 or above 5,000,000, and must treat a
failed GCM check as "wrong passphrase or damaged file" (the two are indistinguishable by design). The conventional extension is
`<original name>.lockbox`.

Reference implementation: [`packages/lockbox`](../packages/lockbox).
