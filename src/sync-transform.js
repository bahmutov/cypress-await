const debug = require('debug')('cypress-await')
const verbose = require('debug')('cypress-await:verbose')
const through = require('through2')
const { cyAwaitSyncMode } = require('./cy-await')

function cypressAwaitSyncTransform(file) {
  debug('init cypressAwaitSyncTransform for %s', file)
  return through(function (buf, enc, next) {
    debug('transforming %s', file)
    const source = buf.toString('utf8')
    const output = cyAwaitSyncMode(source)
    if (verbose.enabled) {
      verbose('transformed source for %s', file)
      console.error(output)
      verbose('----')
    }
    this.push(output)
    next()
  })
}

module.exports = cypressAwaitSyncTransform
