# bare-pack-drive

Pack drives to Bare bundles.

```
npm i bare-pack-drive
```

## Usage

```js
const pack = require('bare-pack-drive')

const bundle = await pack(drive, '/entry.js')
```

## API

#### `const bundle = await pack(drive[, entry][, writeFile][, options])`

Options supported by <https://github.com/holepunchto/bare-pack> may be specified.

`writeFile` is the callback used when offloading addons and assets; see [Offloading](https://github.com/holepunchto/bare-pack#offloading). It is called with the `drive:` URL and source of each offloaded file and behaves as described by <https://github.com/holepunchto/bare-pack>. Pair it with the `offload` option:

```js
const bundle = await pack(
  drive,
  '/entry.js',
  async function writeFile(url, source) {
    // Persist `source` for `url`, e.g. to disk, and return its location.
  },
  { offload: true }
)
```

## License

Apache-2.0
