// https://github.com/bahmutov/cypress-await/issues/10

import 'cypress-map'

it('has a test', () => {
  cy.log('ok')
})

it('uses cypress-map commands', async () => {
  await cy.visit('/')
  const n = await cy.get('#projects-count').map('innerText').map(parseInt)
  expect(n, 'number of projects').to.be.greaterThan(300)
})
