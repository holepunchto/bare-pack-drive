const pack = require('bare-pack')

module.exports = function (drive, entry, opts) {
  return pack(new URL(entry, 'drive://'), opts, readModule)

  function readModule (url) {
    return drive.get(url.pathname)
  }
}
