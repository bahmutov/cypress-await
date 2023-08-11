const babel = require('@babel/core')

function isCyObject(node) {
  if (!node) {
    return false
  }
  if (node.type === 'MemberExpression' && node.object.name === 'cy') {
    return true
  }
  return (
    (node.type === 'CallExpression' && node.object?.name === 'cy') ||
    (node.type === 'MemberExpression' && isCyObject(node.object?.callee))
  )
}

function isCyAwaitExpression(node) {
  if (node.type !== 'AwaitExpression') {
    return false
  }
  try {
    return (
      (node.argument.callee.type === 'MemberExpression' &&
        node.argument.callee.object.name === 'cy') ||
      isCyObject(node.argument.callee)
    )
  } catch (err) {
    console.error('isCyAwaitExpression error', err)
    console.error(node)
    return false
  }
}

function isCyExpression(node) {
  if (node.type !== 'CallExpression') {
    return false
  }
  try {
    return (
      (node.callee.type === 'MemberExpression' &&
        node.callee.object.name === 'cy') ||
      isCyObject(node.callee)
    )
  } catch (err) {
    console.error('isCyExpression error', err)
    console.error(node)
    return false
  }
}

function cyAwaitOnce(code) {
  const output = babel.transformSync(code, {
    plugins: [
      function myCustomPlugin() {
        return {
          visitor: {
            VariableDeclarator(path) {
              // console.log('VariableDeclarator')
              // console.log(path.node.init.argument.callee)
              if (path.node.init && isCyAwaitExpression(path.node.init)) {
                const variableName = path.node.id.name
                // console.log('declarator %s = await cy', variableName)
                const myIndex = path.parentPath.parentPath.node.body.findIndex(
                  (node) =>
                    node.declarations && node.declarations.includes(path.node),
                )
                // console.log(path.parentPath.parentPath.node.body)
                // console.log('my index', myIndex)

                if (myIndex !== -1) {
                  const statementsAfterMe = path.parentPath.parentPath.node.body
                    .slice(myIndex + 1)
                    .map((node) => babel.types.cloneNode(node))
                  // console.log('statements after me')
                  // console.log(statementsAfterMe)
                  // and remove the rest of the statements
                  path.parentPath.parentPath.node.body.length = myIndex

                  path.parentPath.parentPath.node.body.push(
                    babel.types.expressionStatement(
                      babel.types.callExpression(
                        // callee
                        babel.types.memberExpression(
                          path.node.init.argument,
                          babel.types.Identifier('then'),
                        ),
                        [
                          babel.types.arrowFunctionExpression(
                            [babel.types.Identifier(variableName)],
                            babel.types.blockStatement([
                              // babel.types.expressionStatement(
                              //   babel.types.assignmentExpression(
                              //     '=',
                              //     babel.types.Identifier(variableName),
                              //     babel.types.Identifier('___val'),
                              //   ),
                              // ),
                              ...statementsAfterMe,
                            ]),
                            true /* async */,
                          ),
                        ],
                      ),
                    ),
                  )
                }
              }
            },
            AssignmentExpression(path) {
              if (isCyAwaitExpression(path.node.right)) {
                const variableName = path.node.left.name
                const myIndex = path.parentPath.parentPath.node.body.findIndex(
                  (node) => node.expression === path.node,
                )
                // console.log('my index', myIndex)
                const statementsAfterMe = path.parentPath.parentPath.node.body
                  .slice(myIndex + 1)
                  .map((node) => babel.types.cloneNode(node))

                // and remove the rest of the statements
                path.parentPath.parentPath.node.body.length = myIndex + 1
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
                      true /* async */,
                    ),
                  ],
                )
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

function cyAwaitSyncOnce(code) {
  const output = babel.transformSync(code, {
    plugins: [
      function myCustomPlugin() {
        return {
          visitor: {
            VariableDeclarator(path) {
              // console.log('VariableDeclarator')
              // console.log(path.node.init.argument.callee)
              if (path.node.init && isCyExpression(path.node.init)) {
                const variableName = path.node.id.name
                // console.log('declarator %s = cy...', variableName)
                const myIndex = path.parentPath.parentPath.node.body.findIndex(
                  (node) =>
                    node.declarations && node.declarations.includes(path.node),
                )
                // console.log(path.parentPath.parentPath.node.body)
                // console.log('my index', myIndex)

                if (myIndex !== -1) {
                  const statementsAfterMe = path.parentPath.parentPath.node.body
                    .slice(myIndex + 1)
                    .map((node) => babel.types.cloneNode(node))
                  // console.log('statements after me')
                  // console.log(statementsAfterMe)
                  // and remove the rest of the statements
                  path.parentPath.parentPath.node.body.length = myIndex

                  path.parentPath.parentPath.node.body.push(
                    babel.types.expressionStatement(
                      babel.types.callExpression(
                        // callee
                        babel.types.memberExpression(
                          path.node.init,
                          babel.types.Identifier('then'),
                        ),
                        [
                          babel.types.arrowFunctionExpression(
                            [babel.types.Identifier(variableName)],
                            babel.types.blockStatement([...statementsAfterMe]),
                          ),
                        ],
                      ),
                    ),
                  )
                }
              }
            },
            AssignmentExpression(path) {
              // console.log('sync AssignmentExpression')
              // console.log(path.node.right)

              if (isCyExpression(path.node.right)) {
                const variableName = path.node.left.name

                const myIndex = path.parentPath.parentPath.node.body.findIndex(
                  (node) => node.expression === path.node,
                )
                // console.log('variable "%s" my index', variableName, myIndex)
                const statementsAfterMe = path.parentPath.parentPath.node.body
                  .slice(myIndex + 1)
                  .map((node) => babel.types.cloneNode(node))
                // console.log('cloned')

                // and remove the rest of the statements
                path.parentPath.parentPath.node.body.length = myIndex + 1
                path.parent.expression = babel.types.callExpression(
                  // callee
                  babel.types.memberExpression(
                    path.node.right,
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
              }
            },
          },
        }
      },
    ],
  })
  return output.code
}

function cyAwait(code) {
  const output = cyAwaitOnce(code)
  // console.log(output)
  if (output === code) {
    return output
  }
  return cyAwait(output)
}

function cyAwaitSyncMode(code) {
  const output = cyAwaitSyncOnce(code)
  // console.log(output)
  if (output === code) {
    return output
  }
  return cyAwaitSyncMode(output)
}

module.exports = { cyAwait, cyAwaitSyncMode }
