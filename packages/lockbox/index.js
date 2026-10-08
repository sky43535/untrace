// @untrace/lockbox — the .lockbox format (v1). Works in browsers, Node ≥ 19, Deno, Bun and Workers (WebCrypto only).
// Spec: docs/lockbox-format.md
const MAGIC = new TextEncoder().encode('UTLBX1')
export const DEFAULT_ITERATIONS = 310000
const MIN_ITER = 100000, MAX_ITER = 5000000

async function deriveKey(pass, salt, iterations) {
  const base = await crypto.subtle.importKey('raw', new TextEncoder().encode(pass), 'PBKDF2', false, ['deriveKey'])
  return crypto.subtle.deriveKey({ name: 'PBKDF2', salt, iterations, hash: 'SHA-256' }, base, { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt'])
}

/** Lock bytes under a passphrase. Returns the .lockbox file as a Uint8Array. */
export async function lock(name, data, passphrase, { iterations = DEFAULT_ITERATIONS } = {}) {
  if (!passphrase) throw new Error('A passphrase is required.')
  const nameBytes = new TextEncoder().encode(name), bytes = data instanceof Uint8Array ? data : new Uint8Array(data)
  if (nameBytes.length > 0xffff) throw new Error('File name too long.')
  const plain = new Uint8Array(2 + nameBytes.length + bytes.length)
  new DataView(plain.buffer).setUint16(0, nameBytes.length); plain.set(nameBytes, 2); plain.set(bytes, 2 + nameBytes.length)
  const salt = crypto.getRandomValues(new Uint8Array(16)), iv = crypto.getRandomValues(new Uint8Array(12))
  const ct = new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, await deriveKey(passphrase, salt, iterations), plain))
  const out = new Uint8Array(MAGIC.length + 4 + 16 + 12 + ct.length)
  out.set(MAGIC); new DataView(out.buffer).setUint32(MAGIC.length, iterations); out.set(salt, MAGIC.length + 4); out.set(iv, MAGIC.length + 20); out.set(ct, MAGIC.length + 32)
  return out
}

/** Is this (at least) shaped like a .lockbox file? */
export const isLockbox = (b) => b.length >= MAGIC.length + 32 && MAGIC.every((v, i) => b[i] === v)

/** Unlock a .lockbox file. Returns { name, data }. Throws on a wrong passphrase or damaged file. */
export async function unlock(file, passphrase) {
  const b = file instanceof Uint8Array ? file : new Uint8Array(file)
  if (!isLockbox(b)) throw new Error("This isn't a Lockbox file.")
  const iterations = new DataView(b.buffer, b.byteOffset).getUint32(MAGIC.length)
  if (iterations < MIN_ITER || iterations > MAX_ITER) throw new Error('Damaged file.')
  const salt = b.slice(MAGIC.length + 4, MAGIC.length + 20), iv = b.slice(MAGIC.length + 20, MAGIC.length + 32)
  let plain
  try { plain = new Uint8Array(await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, await deriveKey(passphrase, salt, iterations), b.slice(MAGIC.length + 32))) }
  catch { throw new Error('Wrong passphrase, or the file is damaged.') }
  const nl = new DataView(plain.buffer).getUint16(0)
  return { name: new TextDecoder().decode(plain.slice(2, 2 + nl)), data: plain.slice(2 + nl) }
}
