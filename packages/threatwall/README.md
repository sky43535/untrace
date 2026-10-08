# @untrace/threatwall
```js
import { ThreatWall, mountThreatWall } from '@untrace/threatwall'
const wall = new ThreatWall({ apiKey })
const { verdict, score } = await wall.check('http://paypa1-login.example')
mountThreatWall(document.querySelector('#wall'), { apiKey })   // includes the "Provided by untrace." line
```
In a public web page use an **origin-locked** key. If you build your own UI instead of the widget, add `<untrace-attribution>` at the top yourself.
