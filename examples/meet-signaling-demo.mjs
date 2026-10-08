// Two peers in one process: a host and a guest, exchanging an encrypted message through the API.
// UNTRACE_KEY=utk_… node examples/meet-signaling-demo.mjs
import { MeetRoom, newRoom } from '../packages/meet/index.js'
setInterval(() => {}, 1000) // Node's WebSocket doesn't keep the process alive on its own
const apiKey = process.env.UNTRACE_KEY, r = newRoom()
const host = await new MeetRoom({ apiKey, id: r.id, k: r.k, role: 'host', h: r.h, acknowledged: true }).connect()
host.on('state', (s) => { const w = Object.values(s.invites).find((i) => i.state === 'waiting'); if (w) { console.log('host: admitting', w.label); host.admit(w.pid) } })
host.on('message', (m, who) => { console.log(`host got "${m.text}" from ${who.label}`); process.exit(0) })
setTimeout(() => { console.log('timed out'); process.exit(1) }, 15000)
await new Promise((res) => host.on('joined', res))
const code = host.invite('Alex')
const guest = await new MeetRoom({ apiKey, id: r.id, k: r.k, role: 'guest', invite: code, acknowledged: true }).connect()
guest.on('joined', () => guest.send({ k: 'chat', text: 'hello from the guest' }))
