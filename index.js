const babel = require('@babel/parser')
const walk = require('acorn-walk')

const source = `
  it('works', async () => {
    const url = await cy.location()
  })
`

const plugins = [
  'estree', // To generate estree compatible AST
]

const AST = babel.parse(source, {
  plugins,
  sourceType: 'script',
}).program

// console.log(AST)

function isAssignmentFromCy(node) {
  // console.log(node)
  const firstDeclarator = node.declarations[0].init
  return (
    firstDeclarator.type === 'AwaitExpression' &&
    firstDeclarator.argument.callee?.object.name === 'cy'
  )
}

walk.simple(AST, {
  VariableDeclaration(node) {
    // check if we are declaring
    // const|var|let foo = await cy...
    if (isAssignmentFromCy(node)) {
      console.log('%s %s = await cy', node.kind, node.declarations[0].id.name)
    }
  },
})
