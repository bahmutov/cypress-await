const test = require('ava')
const { stripIndent } = require('common-tags')
const { cyAwait } = require('..')

test.skip('several assignments', (t) => {
  const input = stripIndent`
    n = await cy.get('#projects-count')
  `
  const output = cyAwait(input)
  console.log(output)
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

test.skip('get number and assert', (t) => {
  const input = stripIndent`
    await cy.visit('/')
    const n = await cy.get('#projects-count').invoke('text').then(parseInt)
    expect(n, 'projects').to.be.within(350, 400)
  `
  const output = cyAwait(input)
  console.log(output)
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
