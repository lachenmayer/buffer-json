function stringify (value, space) {
  return JSON.stringify(value, replacer, space)
}

function parse (text) {
  return JSON.parse(text, reviver)
}

function replacer (key, value) {
  if (Buffer.isBuffer(value)) {
    return {
      type: 'Buffer',
      data: value.length === 0 ? '' : 'base64:' + value.toString('base64')
    }
  }
  return value
}

function reviver (key, value) {
  if (isBufferLike(value)) {
    if (isArray(value.data)) {
      return Buffer.from(value.data)
    } else if (isString(value.data)) {
      if (value.data.startsWith('base64:')) {
        return Buffer.from(value.data.slice('base64:'.length), 'base64')
      }
      // Assume that the string is UTF-8 encoded (or empty).
      return Buffer.from(value.data)
    }
  }
  return value
}

function isBufferLike (x) {
  return (
    isObject(x) && x.type === 'Buffer' && (isArray(x.data) || isString(x.data))
  )
}

function isArray (x) {
  return Array.isArray(x)
}

function isString (x) {
  return typeof x === 'string'
}

function isObject (x) {
  return typeof x === 'object' && x !== null
}

module.exports = {
  stringify,
  parse,
  replacer,
  reviver
}
