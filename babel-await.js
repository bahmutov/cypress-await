const babel = require('@babel/core')
const code = `
  await cy.location()
`
const output = babel.transformSync(code, {
  plugins: [
    function myCustomPlugin() {
      return {
        visitor: {
          VariableDeclarator(path) {
            console.log('VariableDeclarator')
          },
          AwaitExpression(path) {
            if (
              path.node.argument.callee.type === 'MemberExpression' &&
              path.node.argument.callee.object.name === 'cy'
            ) {
              console.log('AwaitExpression for cy')
              // remove the "await" expression
              path.parent.expression = path.node.argument
            }
            // console.log(path.node)
          },
        },
      }
    },
  ],
})
console.log(output.code)
