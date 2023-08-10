const test = require('ava')
const { stripIndent } = require('common-tags')
const { cyAwait } = require('../src/cy-await')

// SKIP https://github.com/bahmutov/cypress-await/issues/1
test.skip('multiple variables', (t) => {
  const input = stripIndent`
    let name
    name = await cy.location('pathname')
    let height
    height = await cy.wrap(60)
  `
  const output = cyAwait(input)
  t.is(
    output,
    stripIndent`
      let name;
      cy.location('pathname').then(___val => {
        name = ___val;
        let height;
        cy.wrap(60).then(__val => {
          height = __val;
        });
      });
    `,
  )
})
