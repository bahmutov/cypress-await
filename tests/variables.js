const test = require('ava')
const { stripIndent } = require('common-tags')
const { cyAwait } = require('../src/cy-await')

test('transforms variable assignment', (t) => {
  const input = stripIndent`
    let name
    name = await cy.location('pathname')
  `
  const output = cyAwait(input)
  t.is(
    output,
    stripIndent`
      let name;
      cy.location('pathname').then(async ___val => {
        name = ___val;
      });
    `,
  )
})

test('use variable', (t) => {
  const input = stripIndent`
    let name
    name = await cy.location('pathname');
    cy.log(name)
  `
  const output = cyAwait(input)
  // console.log(output)
  t.is(
    output,
    stripIndent`
      let name;
      cy.location('pathname').then(async ___val => {
        name = ___val;
        cy.log(name);
      });
    `,
  )
})

test('variable declaration', (t) => {
  const input = stripIndent`
    const name = await cy.location('pathname')
    cy.log(name)
  `
  const output = cyAwait(input)
  // console.log(output)
  t.is(
    output,
    stripIndent`
      cy.location('pathname').then(async name => {
        cy.log(name);
      });
    `,
  )
})
