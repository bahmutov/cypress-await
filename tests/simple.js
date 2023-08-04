const test = require('ava')
const { stripIndent } = require('common-tags')
const { cyAwait } = require('..')

test('removes one await', (t) => {
  const input = stripIndent`
    await cy.log()
  `
  const output = cyAwait(input)
  t.is(
    output,
    stripIndent`
      cy.log();
    `,
  )
})

test('removes several awaits', (t) => {
  const input = stripIndent`
    await cy.log()
    await cy.location('pathname')
  `
  const output = cyAwait(input)
  t.is(
    output,
    stripIndent`
      cy.log();
      cy.location('pathname');
    `,
  )
})
