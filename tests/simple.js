const test = require('ava')
const { stripIndent } = require('common-tags')
const { cyAwait } = require('..')

test('removes await', (t) => {
  const input = stripIndent`
    await cy.log()
  `
  const output = cyAwait(input)
  t.is(
    output,
    stripIndent`
      cy.log()
    `,
  )
})
