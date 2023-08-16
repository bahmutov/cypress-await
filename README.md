# cypress-await ![cypress version](https://img.shields.io/badge/cypress-12.17.3-brightgreen)

> Cypress spec preprocessor that adds the "async / await" syntax

## Install

Add this package as a dev dependency

```
$ npm i -D cypress-await
# or using Yarn
$ yarn add -D cypress-await
```

## Use as a preprocessor

Add the following to your `cypress.config.js` file:

```js
// cypress.config.js
const { defineConfig } = require('cypress')
// https://github.com/bahmutov/cypress-await
const cyAwaitPreprocessor = require('cypress-await/src/preprocessor')

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      on('file:preprocessor', cyAwaitPreprocessor)
    },
  },
})
```

In your spec files you can use `value = await cy...` instead of `cy....then(value => )`

```js
it('shows the number of projects', async () => {
  await cy.visit('/')
  const n = await cy.get('#projects-count').invoke('text').then(parseInt)
  cy.log(n)
  expect(n, 'number of projects').to.be.within(350, 400)
})
```

The above code is equivalent to the "plain" Cypress test

```js
it('shows the number of projects', () => {
  cy.visit('/')
  cy.get('#projects-count')
    .invoke('text')
    .then(parseInt)
    .then((n) => {
      cy.log(n)
      expect(n, 'number of projects').to.be.within(350, 400)
    })
})
```

## Preprocessor sync mode

It might seem redundant to always write `n = await cy...`, thus there is a "sync" mode preprocessor where you can write the spec code without using `await` before each Cypress chain.

```js
// cypress.config.js
const { defineConfig } = require('cypress')
// https://github.com/bahmutov/cypress-await
const cyAwaitPreprocessor = require('cypress-await/src/preprocessor-sync-mode')

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      on('file:preprocessor', cyAwaitPreprocessor)
    },
  },
})
```

We can get the parsed number of projects from the page

```js
it('shows the number of projects', () => {
  cy.visit('/')
  const n = cy.get('#projects-count').invoke('text').then(parseInt)
  cy.log(n)
  expect(n, 'number of projects').to.be.within(350, 400)
})
```

## Small print

Author: Gleb Bahmutov &lt;gleb.bahmutov@gmail.com&gt; &copy; 2023

- [@bahmutov](https://twitter.com/bahmutov)
- [glebbahmutov.com](https://glebbahmutov.com)
- [blog](https://glebbahmutov.com/blog)
- [videos](https://www.youtube.com/glebbahmutov)
- [presentations](https://slides.com/bahmutov)
- [cypress.tips](https://cypress.tips)
- [Cypress Tips & Tricks Newsletter](https://cypresstips.substack.com/)
- [my Cypress courses](https://cypress.tips/courses)

License: MIT - do anything with the code, but don't blame me if it does not work.

Support: if you find any problems with this module, email / tweet /
[open issue](https://github.com/bahmutov/cy-await/issues) on Github

## MIT License

Copyright (c) 2023 Gleb Bahmutov &lt;gleb.bahmutov@gmail.com&gt;

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.
