// @ts-check
const debug = require('debug')('cy-await')
const fs = require('fs')
const path = require('path')
const chokidar = require('chokidar')
const cyBrowserify = require('@cypress/browserify-preprocessor')()
const tempWrite = require('temp-write')
const { cyAwait } = require('..')

// bundled[filename] => promise
const bundled = {}

const bundleAFile = (filePath, outputPath) => {
  const src = fs.readFileSync(filePath, 'utf8')
  const output = cyAwait(src)
  const writtenTempFilename = tempWrite.sync(
    output,
    path.basename(filePath) + '.js',
  )
  debug('wrote temp file', writtenTempFilename)

  return cyBrowserify({
    filePath: writtenTempFilename,
    outputPath,
    // since the file is generated once, no need to watch it
    shouldWatch: false,
    on: () => {},
  })
}

const cyAwaitPreprocessor = (file) => {
  const { filePath, outputPath, shouldWatch } = file

  debug({ filePath, outputPath, shouldWatch })

  if (bundled[filePath]) {
    debug('already have bundle promise for file %s', filePath)
    return bundled[filePath]
  }

  if (shouldWatch) {
    debug('watching the file %s', filePath)

    // start bundling the first time
    bundled[filePath] = bundleAFile(filePath, outputPath)

    // and start watching the input Markdown file
    const watcher = chokidar.watch(filePath)
    watcher.on('change', () => {
      // if the Markdown file changes, we want to rebundle it
      // and tell the Test Runner to run the tests again
      debug('file %s has changed', filePath)
      bundled[filePath] = bundleAFile(filePath, outputPath)
      bundled[filePath].then(() => {
        debug('finished bundling, emit rerun')
        file.emit('rerun')
      })
    })

    // when the test runner closes this spec
    file.on('close', () => {
      debug('file %s close, removing bundle promise', filePath)
      delete bundled[filePath]
      watcher.close()
    })

    return bundled[filePath]
  }

  // non-interactive mode
  bundled[filePath] = bundleAFile(filePath, outputPath)
  return bundled[filePath]
}

module.exports = cyAwaitPreprocessor
