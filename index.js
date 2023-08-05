const babel = require('@babel/core')

function isCyAwaitExpression(node) {
  return (
    node.argument.callee.type === 'MemberExpression' &&
    node.argument.callee.object.name === 'cy'
  )
}

function cyAwait(code) {
  const output = babel.transformSync(code, {
    plugins: [
      function myCustomPlugin() {
        return {
          visitor: {
            VariableDeclarator(path) {
              // console.log('VariableDeclarator')
            },
            AssignmentExpression(path) {
              // console.log(path.node.left)
              // console.log(path.node.right)
              if (isCyAwaitExpression(path.node.right)) {
                const variableName = path.node.left.name
                // console.log('%s = await cy', variableName)

                // console.log(path.node)
                const myIndex = path.parentPath.parentPath.node.body.findIndex(
                  (node) => node.expression === path.node,
                )
                // console.log('my index', myIndex)
                const statementsAfterMe = path.parentPath.parentPath.node.body
                  .slice(myIndex + 1)
                  .map((node) => babel.types.cloneNode(node))
                // and remove the rest of the statements
                path.parentPath.parentPath.node.body.length = myIndex + 1
                // console.log(
                //   ...statementsAfterMe.map((s) => babel.types.cloneNode(s)),
                // )

                // console.log(path.parentPath.parentPath.node.body)

                // remove the "variable = await" part
                path.parent.expression = babel.types.callExpression(
                  // callee
                  babel.types.memberExpression(
                    path.node.right.argument,
                    babel.types.Identifier('then'),
                  ),
                  [
                    babel.types.arrowFunctionExpression(
                      [babel.types.Identifier('___val')],
                      babel.types.blockStatement([
                        babel.types.expressionStatement(
                          babel.types.assignmentExpression(
                            '=',
                            babel.types.Identifier(variableName),
                            babel.types.Identifier('___val'),
                          ),
                        ),
                        ...statementsAfterMe,
                      ]),
                    ),
                  ],
                )
                // path.skip()

                // path.node.right.argument
                // append ".then(x => ...)" expression
              }
            },
            AwaitExpression(path) {
              if (isCyAwaitExpression(path.node)) {
                // console.log('AwaitExpression for cy')
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
  return output.code
}

// console.log(output.code)

module.exports = { cyAwait }
