import { add, getProjectsCount } from './utils'

it('adds numbers', async () => {
  expect(add(2, 3), 'sum').to.equal(5)
})

// need to think how a function can return the last value
it.skip('gets returned subject', async () => {
  await cy.visit('/')
  const n = await getProjectsCount()
  expect(n, 'number of projects').to.be.within(350, 400)
})
