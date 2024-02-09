// https://github.com/bahmutov/cypress-await/issues/10

import 'cypress-map'

it('has a test', () => {
  cy.log('ok')
})

it('uses cypress-map commands without async', () => {
  cy.visit('/')
  cy.get('#projects-count')
    .map('innerText')
    .map(parseInt)
    .at(0)
    .should('be.a', 'number')
    .then((n) => {
      expect(n, 'number of projects').to.be.greaterThan(300)
    })
})

// investigate why it does not wait to fail
it('uses cypress-map commands', async () => {
  await cy.visit('/')
  const n = await cy
    .get('#projects-count')
    .map('innerText')
    .map(parseInt)
    .should('be.a', 'number')
  expect(n, 'number of projects').to.be.greaterThan(300)
})
