# @untrace/meet
Signalling for a private 6-person meeting. You bring the WebRTC (`RTCPeerConnection` with `ICE`), we bring invites, approval and anti-spoofing.

```js
import { MeetRoom, newRoom, TRACKING_NOTICE } from '@untrace/meet'
// 1. show TRACKING_NOTICE to the host (and later every guest)
const room = newRoom()
const meet = await new MeetRoom({ apiKey, id: room.id, k: room.k, role: 'host', h: room.h, acknowledged: true }).connect()
meet.on('state', (s) => console.log(s.invites))           // who's waiting, and which invite link they used
const code = meet.invite('Alex')                           // -> guest link fragment: room.guestFragment(code)
```
Protocol: [docs/meeting-protocol.md](../../docs/meeting-protocol.md). Show the [attribution line](../../docs/attribution.md).
