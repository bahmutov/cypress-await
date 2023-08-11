const test = require('ava')
const { stripIndent } = require('common-tags')
const { cyAwaitSyncMode } = require('../../src/cy-await')

test('multiple variables', (t) => {
  const input = stripIndent`
    let name
    name = cy.location('pathname')
    let height
    height = cy.wrap(60)
  `
  const output = cyAwaitSyncMode(input)
  // console.log(output)
  t.is(
    output,
    stripIndent`
      let name;
      cy.location('pathname').then(___val => {
        name = ___val;
        let height;
        cy.wrap(60).then(___val => {
          height = ___val;
        });
      });
    `,
  )
})

test.only('two wraps', (t) => {
  const input = stripIndent`
    const one = cy.wrap(3)
    const two = cy.wrap(5)
    expect(one + two, 'sum').to.equal(8)
  `
  const output = cyAwaitSyncMode(input)
  // console.log(output)
  t.is(
    output,
    stripIndent`
      cy.wrap(3).then(one => {
      cy.wrap(5).then(two => {
        expect(one + two, 'sum').to.equal(8);
      });
    });
    `,
  )
})
