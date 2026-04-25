describe('Landing Page', () => {

  beforeEach(() => {
    cy.clearLocalStorage()
    cy.clearCookies()
  })

  it('login page loads', () => {
    cy.visit('/login')
    cy.contains('TripGenie').should('be.visible')
    cy.contains('Sign In').should('be.visible')
  })

  it('signup page loads', () => {
    cy.visit('/signup')
    cy.contains('TripGenie').should('be.visible')
    cy.contains('Create Account').should('be.visible')
  })

  it('login page links to signup', () => {
    cy.visit('/login')
    cy.get('a[href="/signup"]').click()
    cy.url().should('include', '/signup')
  })

  it('signup page links to login', () => {
    cy.visit('/signup')
    cy.get('a[href="/login"]').click()
    cy.url().should('include', '/login')
  })

  it('dashboard is protected', () => {
    cy.visit('/dashboard')
    cy.url().should('include', '/login')
  })

  it('plan page is protected', () => {
    cy.visit('/plan')
    cy.url().should('include', '/login')
  })

})