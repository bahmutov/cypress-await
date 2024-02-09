/// <reference types="cypress" />

it('shows the number of projects', () => {
  cy.visit('/')
  const n = cy.get('#projects-count').invoke('text').then(parseInt)
  cy.log(n)
  expect(n, 'number of projects').to.be.within(350, 400)
})
