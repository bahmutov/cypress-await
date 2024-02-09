const { defineConfig } = require('cypress')
// const cyAwaitPreprocessor = require('./src/preprocessor')
const browserify = require('@cypress/browserify-preprocessor')
// const { cypressAwaitTransform } = require('./src/transform')
const awaitTransform = require.resolve('./src/transform')

const browserifyOptions = structuredClone(
  browserify.defaultOptions.browserifyOptions,
)
browserifyOptions.transform.unshift([awaitTransform, {}])

module.exports = defineConfig({
  e2e: {
    // baseUrl, etc
    baseUrl: 'https://glebbahmutov.com/',
    viewportHeight: 1200,
    setupNodeEvents(on, config) {
      on(
        'file:preprocessor',
        browserify({
          debugOutput: true,
          browserifyOptions,
        }),
      )
      // on(
      //   'file:preprocessor',
      //   cyAwaitPreprocessor({
      //     debugOutput: true,
      //   }),
      // )
    },
  },
})
