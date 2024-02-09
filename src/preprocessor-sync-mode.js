// @ts-check
const debug = require('debug')('cypress-await')
const cyBrowserify = require('@cypress/browserify-preprocessor')
const awaitTransform = require.resolve('./sync-transform')

// insert our Browserify transform as the first one
const browserifyOptions = structuredClone(
  cyBrowserify.defaultOptions.browserifyOptions,
)
browserifyOptions.transform.unshift([awaitTransform, {}])

function initCyAwaitModePreprocessor(options) {
  const mergedOptions = {
    ...options,
    browserifyOptions,
  }
  debug('merged Browserify options %o', mergedOptions)
  return cyBrowserify(mergedOptions)
}

module.exports = initCyAwaitModePreprocessor
