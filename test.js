const test = require('brittle')
const Localdrive = require('localdrive')
const Bundle = require('bare-bundle')
const pack = require('.')

test('require', async (t) => {
  const bundle = await pack(new Localdrive('test/fixtures/require'), '/foo.js')

  const expected = new Bundle()
    .write('drive:///baz.js', 'module.exports = 42\n', {
      imports: {}
    })
    .write('drive:///bar.js', 'require(\'./baz.js\')\n', {
      imports: {
        './baz.js': 'drive:///baz.js'
      }
    })
    .write('drive:///foo.js', 'require(\'./bar.js\')\n', {
      main: true,
      imports: {
        './bar.js': 'drive:///bar.js'
      }
    })

  t.alike(bundle, expected)
})
