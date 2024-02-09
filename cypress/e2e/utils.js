export function add(a, b) {
  return a + b
}

export async function getProjectsCount() {
  const n = await cy
    .get('#projects-count')
    .invoke('text')
    .then(parseInt)
    .should('be.a', 'number')
  return n
}
