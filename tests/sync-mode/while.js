const test = require('ava')
const { stripIndent } = require('common-tags')
const { cyAwaitSyncMode } = require('../../src/cy-await')

test('transforms while assignment', (t) => {
  t.plan(0)
  const input = stripIndent`
    while (cy.get('[value=next]').invoke('attr', 'disabled') !== 'disabled') {
      cy.wait(500).log('clicking next').get('[value=next]').click()
    }
  `
  const output = cyAwaitSyncMode(input)
  console.log(output)
})
