it('uses several variables', async () => {
  const one = await cy.wrap(3)
  const two = await cy.wrap(5)
  expect(one + two, 'sum').to.equal(8)
})
