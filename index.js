const pack = require('bare-pack')

module.exports = async function (drive, entry, opts = {}) {
  const root = new URL('drive:///')

  const bundle = await pack(new URL(entry, root), opts, readModule, listPrefix)

  return bundle.unmount(root)

  async function readModule (url) {
    return drive.get(url.pathname)
  }

  async function * listPrefix (url) {
    if (url.pathname[url.pathname.length - 1] !== '/') url.pathname += '/'

    for await (const { key } of drive.list(url.pathname, { recursive: true })) {
      yield new URL(key, url)
    }
  }
}
