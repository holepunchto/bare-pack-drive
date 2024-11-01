const test = require('brittle')
const Localdrive = require('localdrive')
const Bundle = require('bare-bundle')
const pack = require('.')

test('require', async (t) => {
  const bundle = await pack(new Localdrive('test/fixtures/require'), '/foo.js')

  const expected = new Bundle()
    .write('/foo.js', 'require(\'./bar.js\')\n', {
      main: true,
      imports: {
        './bar.js': '/bar.js'
      }
    })
    .write('/bar.js', 'require(\'./baz.js\')\n', {
      imports: {
        './baz.js': '/baz.js'
      }
    })
    .write('/baz.js', 'module.exports = 42\n', {
      imports: {}
    })

  t.alike(bundle, expected)
})

test('package.json#assets', async (t) => {
  const bundle = await pack(new Localdrive('test/fixtures/package-json-assets'), '/foo.js')

  const expected = new Bundle()
    .write('/foo.js', '\n', {
      main: true,
      imports: {
        '#package': '/package.json'
      }
    })
    .write('/package.json', '{ "name": "foo", "assets": ["bar/"] }\n', {
      imports: {}
    })
    .write('/bar/baz.txt', 'hello world\n', {
      asset: true,
      imports: {
        '#package': '/package.json'
      }
    })

  t.alike(bundle, expected)
})
