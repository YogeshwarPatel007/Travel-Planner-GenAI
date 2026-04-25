describe('Planner Form', () => {

  beforeEach(() => {
    cy.login()
    cy.visit('/plan')
  })

  it('planner page loads', () => {
    cy.url().should('include', '/plan')
  })

  it('shows all travel modes', () => {
    cy.contains('Flight').should('be.visible')
    cy.contains('Train').should('be.visible')
    cy.contains('Bus').should('be.visible')
    cy.contains('Car').should('be.visible')
  })

  it('auto selects solo when people is 1', () => {
    cy.get('input[name="people"]').clear().type('1')
    cy.contains('Solo auto-selected').should('be.visible')
  })

  it('can click Train mode', () => {
    cy.contains('Train').click()
    cy.contains('Train').should('be.visible')
  })

})