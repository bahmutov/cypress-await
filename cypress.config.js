const { defineConfig } = require('cypress')
const cyAwaitPreprocessor = require('./src/preprocessor')

module.exports = defineConfig({
  e2e: {
    // baseUrl, etc
    baseUrl: 'https://glebbahmutov.com/',
    setupNodeEvents(on, config) {
      on('file:preprocessor', cyAwaitPreprocessor)
    },
  },
})
