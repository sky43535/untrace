# @untrace/lockbox
Read and write `.lockbox` files. Offline, no dependencies, no API key.

```js
import { lock, unlock } from '@untrace/lockbox'
const file = await lock('taxes.pdf', pdfBytes, 'correct-horse-battery')   // -> Uint8Array (.lockbox)
const { name, data } = await unlock(file, 'correct-horse-battery')
```
Format: [docs/lockbox-format.md](../../docs/lockbox-format.md). Files made here open on the Untrace site and vice versa.
