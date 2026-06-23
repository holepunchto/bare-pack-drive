const test = require('brittle')
const Localdrive = require('localdrive')
const Bundle = require('bare-bundle')
const pack = require('.')

test('require', async (t) => {
  const bundle = await pack(new Localdrive('test/fixtures/require'), '/foo.js')

  const expected = new Bundle()
    .write('/foo.js', "require('./bar.js')\n", {
      main: true,
      imports: {
        './bar.js': '/bar.js'
      }
    })
    .write('/bar.js', "require('./baz.js')\n", {
      imports: {
        './baz.js': '/baz.js'
      }
    })
    .write('/baz.js', 'module.exports = 42\n', {
      imports: {}
    })

  t.alike(bundle, expected)
})

test('require.asset, directory', async (t) => {
  const bundle = await pack(new Localdrive('test/fixtures/directory-assets'), '/foo.js')

  const expected = new Bundle()
    .write('/foo.js', "module.exports = require.asset('./bar')\n", {
      main: true,
      imports: {
        '#package': '/package.json',
        './bar': '/bar'
      }
    })
    .write('/package.json', '{\n  "name": "foo"\n}\n', {
      imports: {}
    })
    .write('/bar/baz.txt', 'hello world\n', {
      asset: true,
      imports: {
        '#package': '/package.json'
      }
    })
    .write('/bar/qux.txt', 'hello world\n', {
      asset: true,
      imports: {
        '#package': '/package.json'
      }
    })

  t.alike(bundle, expected)
})

test('package.json#assets', async (t) => {
  const bundle = await pack(new Localdrive('test/fixtures/package-json-assets'), '/foo.js')

  const expected = new Bundle()
    .write('/foo.js', 'module.exports = 42\n', {
      main: true,
      imports: {
        '#package': '/package.json'
      }
    })
    .write(
      '/package.json',
      '{\n  "name": "foo",\n  "assets": [\n    "bar/",\n    "qux.txt"\n  ]\n}\n',
      {
        imports: {}
      }
    )
    .write('/bar/baz.txt', 'hello world\n', {
      asset: true,
      imports: {
        '#package': '/package.json'
      }
    })
    .write('/qux.txt', 'hello world\n', {
      asset: true,
      imports: {
        '#package': '/package.json'
      }
    })

  t.alike(bundle, expected)
})

test('offload', async (t) => {
  const offloaded = []

  const bundle = await pack(
    new Localdrive('test/fixtures/offload'),
    '/foo.js',
    function writeFile(url, source) {
      offloaded.push([url.href, source.toString()])

      return new URL('file:///out' + url.pathname)
    },
    { offload: true }
  )

  t.alike(offloaded, [['drive:///asset.txt', 'hello world\n']], 'routed to writeFile')

  const expected = new Bundle().write(
    '/foo.js',
    "module.exports = require.asset('./asset.txt')\n",
    {
      main: true,
      imports: {
        './asset.txt': 'file:///out/asset.txt'
      }
    }
  )

  t.alike(bundle, expected)
})
