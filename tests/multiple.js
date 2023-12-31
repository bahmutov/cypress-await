const test = require('ava')
const { stripIndent } = require('common-tags')
const { cyAwait } = require('../src/cy-await')

// SKIP https://github.com/bahmutov/cypress-await/issues/1
test('multiple variables', (t) => {
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
      cy.location('pathname').then(async ___val => {
        name = ___val;
        let height;
        cy.wrap(60).then(async ___val => {
          height = ___val;
        });
      });
    `,
  )
})

test('two wraps', (t) => {
  const input = stripIndent`
    const one = await cy.wrap(3)
    const two = await cy.wrap(5)
    expect(one + two, 'sum').to.equal(8)
  `
  const output = cyAwait(input)
  // console.log(output)
  t.is(
    output,
    stripIndent`
      cy.wrap(3).then(async one => {
      cy.wrap(5).then(async two => {
        expect(one + two, 'sum').to.equal(8);
      });
    });
    `,
  )
})
