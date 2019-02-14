const test = require('tape')
const BJSON = require('.')

test("don't touch anything other than buffers", t => {
  t.deepEquals(
    BJSON.stringify({ foo: 'bar', baz: 5, removeMe: undefined, boing: null }),
    JSON.stringify({ foo: 'bar', baz: 5, removeMe: undefined, boing: null })
  )
  t.end()
})

test('buffers come out unscathed', t => {
  const bufs = [
    Buffer.from('foo'),
    Buffer.from(''),
    Buffer.from('🌈'),
    { buf: Buffer.from('🌈'), test: 'yep' }
  ]
  for (const buf of bufs) {
    t.deepEquals(BJSON.parse(BJSON.stringify(buf)), buf)
  }
  for (const buf of bufs) {
    t.deepEquals(BJSON.parse(JSON.stringify(buf)), buf)
  }
  t.end()
})

test('utf8', t => {
  const str = '{"foo":{"type":"Buffer","data":"🌈"}}'
  t.deepEquals(BJSON.parse(str), { foo: Buffer.from('🌈') })
  t.end()
})

test('not actually a buffer', t => {
  const almosts = [
    { type: 'Buffer' },
    { type: 'Buffer', data: 500 },
    { type: 'Buffer', whatever: [123, 124, 125] }
  ]
  for (const almost of almosts) {
    const str = JSON.stringify(almost)
    t.deepEquals(BJSON.parse(str), almost)
  }
  t.end()
})
