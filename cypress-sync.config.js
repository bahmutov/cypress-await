const { defineConfig } = require('cypress')
const cyAwaitPreprocessor = require('./src/preprocessor-sync-mode')

module.exports = defineConfig({
  e2e: {
    // baseUrl, etc
    baseUrl: 'https://glebbahmutov.com/',
    viewportHeight: 1200,
    specPattern: 'cypress/e2e-sync/*.cy.js',
    setupNodeEvents(on, config) {
      on(
        'file:preprocessor',
        cyAwaitPreprocessor({
          debugOutput: true,
        }),
      )
    },
  },
})
