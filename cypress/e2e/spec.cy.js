/// <reference types="cypress" />

it('shows the number of projects', async () => {
  await cy.visit('/')
  const n = await cy.get('#projects-count').invoke('text').then(parseInt)
  cy.log(n)
  expect(n, 'number of projects').to.be.within(350, 400)
})
