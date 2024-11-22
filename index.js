const pack = require('bare-pack')

module.exports = async function (drive, entry = '/index.js', opts = {}) {
  if (typeof entry === 'object' && entry !== null) {
    opts = entry
    entry = '/index.js'
  }

  const root = new URL('drive:///')

  const bundle = await pack(new URL(entry, root), opts, readModule, listPrefix)

  return bundle.unmount(root)

  async function readModule(url) {
    return drive.get(url.pathname)
  }

  async function* listPrefix(url) {
    const entry = await drive.get(url.pathname)

    if (entry !== null) return yield url

    for await (const { key } of drive.list(url.pathname, { recursive: true })) {
      yield new URL(key, url)
    }
  }
}
