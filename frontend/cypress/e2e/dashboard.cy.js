describe('Dashboard', () => {

  beforeEach(() => {
    cy.login()
    cy.visit('/dashboard')
  })

  it('shows welcome message', () => {
    cy.contains('Welcome back').should('be.visible')
  })

  it('shows stats without NaN', () => {
    cy.contains('Total Trips').should('be.visible')
    cy.contains('NaN').should('not.exist')
  })

  it('has Plan New Trip button', () => {
    cy.contains('Plan New Trip').should('be.visible')
  })

  it('shows saved trips section', () => {
    cy.contains('Your Saved Trips').should('be.visible')
  })

})