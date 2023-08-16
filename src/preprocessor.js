// @ts-check
const debug = require('debug')('cypress-await')
const fs = require('fs')
const path = require('path')
const chokidar = require('chokidar')
const cyBrowserify = require('@cypress/browserify-preprocessor')()
const tempWrite = require('temp-write')
const { minimatch } = require('minimatch')
const { cyAwait } = require('./cy-await')

// bundled[filename] => promise
const bundled = {}

const bundleAFile = (filePath, outputPath, debugOutput) => {
  const src = fs.readFileSync(filePath, 'utf8')
  const output = cyAwait(src)
  if (debugOutput) {
    console.log('cypress-await transpiled %s', filePath)
    console.log(output)
    console.log('-----------------')
  }
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

/**
 * Initialize Cypress spec file preprocessor to automatically
 * convert "await cy..." syntax into "cy...then(...)".
 * @example
 *    // Default use
 *    setupNodeEvents(on, config) {
 *      on('file:preprocessor', cyAwaitPreprocessor())
 *    }
 * @example
 *    // Only transform some files using minimatch
 *    setupNodeEvents(on, config) {
 *      on('file:preprocessor', cyAwaitPreprocessor({
 *        specPattern: '*.sync.cy.js'
 *      }))
 *    }
 */
function initCyAwaitModePreprocessor(options = {}) {
  debug('initCyAwaitModePreprocessor options %o', options)

  const cyAwaitPreprocessor = (file) => {
    const { filePath, outputPath, shouldWatch } = file

    debug({ filePath, outputPath, shouldWatch })

    if (options.specPattern) {
      // check if the user wants us to preprocess this file
      if (
        filePath.endsWith(options.specPattern) ||
        minimatch(filePath, options.specPattern)
      ) {
        debug('should preprocess %s', filePath)
      } else {
        debug('default preprocessor for %s', filePath)
        return cyBrowserify(file)
      }
    }

    if (bundled[filePath]) {
      debug('already have bundle promise for file %s', filePath)
      return bundled[filePath]
    }

    if (shouldWatch) {
      debug('watching the file %s', filePath)

      // start bundling the first time
      bundled[filePath] = bundleAFile(filePath, outputPath, options.debugOutput)

      // and start watching the input Markdown file
      const watcher = chokidar.watch(filePath)
      watcher.on('change', () => {
        // if the Markdown file changes, we want to rebundle it
        // and tell the Test Runner to run the tests again
        debug('file %s has changed', filePath)
        bundled[filePath] = bundleAFile(
          filePath,
          outputPath,
          options.debugOutput,
        )
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
    bundled[filePath] = bundleAFile(filePath, outputPath, options.debugOutput)
    return bundled[filePath]
  }

  return cyAwaitPreprocessor
}

module.exports = initCyAwaitModePreprocessor
