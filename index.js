const pack = require('bare-pack')

module.exports = function (drive, entry, opts = {}) {
  const {
    protocol = 'drive:'
  } = opts

  return pack(new URL(entry, protocol + '//'), opts, readModule)

  function readModule (url) {
    return drive.get(url.pathname)
  }
}
