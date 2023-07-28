it('works', async () => {
  const url = await cy.location()
})

// expected
it('works', () => {
  cy.location().then((url) => {})
})

it('works', async () => {
  let url
  url = await cy.location()
  cy.log(url)
})

// expected
it('works', () => {
  cy.location().then((url) => {
    cy.log(url)
  })
})

it('works', async () => {
  const prop = await cy.wrap({ name: 'joe' }).its('name')
  cy.log(prop)
})

// expected
it('works', () => {
  cy.wrap({ name: 'joe' })
    .its('name')
    .then((prop) => {
      cy.log(prop)
    })
})
