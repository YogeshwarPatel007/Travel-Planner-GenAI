describe('Authentication', () => {

  beforeEach(() => {
    cy.clearLocalStorage()
    cy.clearCookies()
  })

  it('login page has email and password fields', () => {
    cy.visit('/login')
    cy.get('input[type="email"]').should('be.visible')
    cy.get('input[type="password"]').should('be.visible')
    cy.contains('Sign In').should('be.visible')
  })

  it('login page shows TripGenie branding', () => {
    cy.visit('/login')
    cy.contains('TripGenie').should('be.visible')
    cy.contains('Welcome back').should('be.visible')
  })

  it('signup page has all fields', () => {
    cy.visit('/signup')
    cy.get('input[type="email"]').should('be.visible')
    cy.get('input[type="password"]').should('be.visible')
    cy.contains('Create Account').should('be.visible')
  })

  it('empty signup shows errors', () => {
    cy.visit('/signup')
    cy.contains('Create Account').click()
    cy.get('.text-red-500').should('exist')
  })

  it('dashboard needs login', () => {
    cy.visit('/dashboard')
    cy.url().should('include', '/login')
  })

  it('plan page needs login', () => {
    cy.visit('/plan')
    cy.url().should('include', '/login')
  })

})