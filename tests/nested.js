const test = require('ava')
const { stripIndent } = require('common-tags')
const { cyAwait } = require('../src/cy-await')

test('inside then', (t) => {
  const input = stripIndent`
    cy.location('pathname').then(async ___val => {
      height = await cy.wrap(60);
    });
  `
  const output = cyAwait(input)
  t.is(
    output,
    stripIndent`
      cy.location('pathname').then(async ___val => {
      cy.wrap(60).then(async ___val => {
        height = ___val;
      });
    });
    `,
  )
})
