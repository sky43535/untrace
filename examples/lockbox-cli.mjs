// node examples/lockbox-cli.mjs lock secret.pdf  |  node examples/lockbox-cli.mjs unlock secret.pdf.lockbox
import { readFileSync, writeFileSync } from 'node:fs'
import { basename } from 'node:path'
import { createInterface } from 'node:readline/promises'
import { lock, unlock } from '../packages/lockbox/index.js'

const [cmd, path] = process.argv.slice(2)
const rl = createInterface({ input: process.stdin, output: process.stdout })
const pass = await rl.question('Passphrase: '); rl.close()
if (cmd === 'lock') { writeFileSync(path + '.lockbox', await lock(basename(path), readFileSync(path), pass)); console.log('Wrote', path + '.lockbox') }
else if (cmd === 'unlock') { const { name, data } = await unlock(readFileSync(path), pass); writeFileSync(name, data); console.log('Wrote', name) }
else console.log('usage: lock|unlock <file>')
