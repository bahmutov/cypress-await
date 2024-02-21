/// <reference types="cypress" />

it(
  'clicks on the button if it is enabled',
  { baseUrl: null, viewportHeight: 300, viewportWidth: 300 },
  () => {
    cy.visit('cypress/fixtures/enabled-button.html')
    const enabled = cy.contains('button', 'Click Me').invoke('is', ':enabled')
    if (enabled) {
      cy.contains('button', 'Click Me').click().should('have.text', 'Clicked')
    } else {
      cy.log('Nothing to click')
    }
  },
)
