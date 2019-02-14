const test = require('tape')
const BJSON = require('.')

test("don't touch anything other than buffers", t => {
  t.deepEquals(
    BJSON.stringify({ foo: 'bar', baz: 5, removeMe: undefined, boing: null }),
    JSON.stringify({ foo: 'bar', baz: 5, removeMe: undefined, boing: null })
  )
  t.end()
})

test('buffers encoded/decoded as expected', t => {
  const tests = [
    {
      obj: Buffer.from('foo'),
      str: '{"type":"Buffer","data":"base64:Zm9v"}'
    },
    { obj: Buffer.from(''), str: '{"type":"Buffer","data":""}' },
    {
      obj: Buffer.from('🌈'),
      str: '{"type":"Buffer","data":"base64:8J+MiA=="}'
    },
    {
      obj: { buf: Buffer.from('🌈'), test: 'yep' },
      str: '{"buf":{"type":"Buffer","data":"base64:8J+MiA=="},"test":"yep"}'
    }
  ]
  for (const test of tests) {
    t.deepEquals(BJSON.stringify(test.obj), test.str)
    t.deepEquals(BJSON.parse(test.str), test.obj)
    t.deepEquals(BJSON.parse(BJSON.stringify(test.obj)), test.obj)
    t.deepEquals(BJSON.parse(JSON.stringify(test.obj)), test.obj)
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
