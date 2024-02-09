const debug = require('debug')('cypress-await')
const verbose = require('debug')('cypress-await:verbose')
const through = require('through2')
const { cyAwait } = require('./cy-await')

function cypressAwaitTransform(file) {
  debug('init cypressAwaitTransform for %s', file)
  return through(function (buf, enc, next) {
    debug('transforming %s', file)
    const source = buf.toString('utf8')
    const output = cyAwait(source)
    if (verbose.enabled) {
      verbose('transformed source for %s', file)
      console.error(output)
      verbose('----')
    }
    this.push(output)
    next()
  })
}

module.exports = cypressAwaitTransform
