const test = require('ava')
const { stripIndent } = require('common-tags')
const { cyAwaitSyncMode } = require('../../src/cy-await')

test('transforms variable assignment', (t) => {
  const input = stripIndent`
    let name
    name = cy.location('pathname')
  `
  const output = cyAwaitSyncMode(input)
  // console.log(output)
  t.is(
    output,
    stripIndent`
      let name;
      cy.location('pathname').then(___val => {
        name = ___val;
      });
    `,
  )
})

test('use variable', (t) => {
  const input = stripIndent`
    let name
    name = cy.location('pathname');
    cy.log(name)
  `
  const output = cyAwaitSyncMode(input)
  // console.log(output)
  t.is(
    output,
    stripIndent`
      let name;
      cy.location('pathname').then(___val => {
        name = ___val;
        cy.log(name);
      });
    `,
  )
})

test('variable declaration', (t) => {
  const input = stripIndent`
    const name = cy.location('pathname')
    cy.log(name)
  `
  const output = cyAwaitSyncMode(input)
  // console.log(output)
  t.is(
    output,
    stripIndent`
      cy.location('pathname').then(name => {
        cy.log(name);
      });
    `,
  )
})
