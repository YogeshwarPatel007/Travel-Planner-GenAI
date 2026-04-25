Cypress.Commands.add('login', () => {
  cy.visit('/login')
  cy.get('input[type="email"]').type('yogesh@gmail.com')
  cy.get('input[type="password"]').type('yogesh@234')
  cy.contains('Sign In').click()
  cy.url().should('include', '/dashboard')
})