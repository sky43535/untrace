# @untrace/burn-notes
```js
import { NotesClient } from '@untrace/burn-notes'
const notes = new NotesClient({ apiKey: process.env.UNTRACE_KEY })
const { link } = await notes.create('the door code is 4417', { ttl: 3600 })
// send `link` to someone — it works once, then the note is gone
```
Needs an API key. Show the [attribution line](../../docs/attribution.md) wherever your UI offers this. Spec: [docs/burn-notes.md](../../docs/burn-notes.md).
