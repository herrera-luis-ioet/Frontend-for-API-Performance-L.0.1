describe('Navigation', () => {
  beforeEach(() => {
    cy.intercept('GET', '/api/performance', { fixture: 'performance.json' }).as('getPerformance')
    cy.intercept('GET', '/api/performance/*', { fixture: 'performance.json' }).as('getPerformanceDetail')
  })

  it('should navigate between dashboard and detail views', () => {
    cy.visit('/')
    cy.wait('@getPerformance')
    cy.get('[data-testid="metric-card"]').first().click()
    cy.url().should('include', '/performance/')
    cy.wait('@getPerformanceDetail')
    cy.get('[data-testid="back-button"]').click()
    cy.url().should('eq', Cypress.config().baseUrl + '/')
  })

  it('should handle direct URL access', () => {
    cy.visit('/performance/1')
    cy.wait('@getPerformanceDetail')
    cy.get('[data-testid="performance-detail"]').should('exist')
  })

  it('should maintain state during navigation', () => {
    cy.visit('/')
    cy.wait('@getPerformance')
    cy.get('[data-testid="date-filter"]').click()
    cy.get('[data-testid="date-picker"]').should('be.visible')
    cy.get('[data-testid="apply-filter"]').click()
    cy.get('[data-testid="metric-card"]').first().click()
    cy.wait('@getPerformanceDetail')
    cy.get('[data-testid="back-button"]').click()
    cy.get('[data-testid="date-filter"]').should('contain', 'Custom Range')
  })

  it('should handle 404 routes', () => {
    cy.visit('/invalid-route')
    cy.get('[data-testid="not-found"]').should('exist')
    cy.get('[data-testid="home-link"]').click()
    cy.url().should('eq', Cypress.config().baseUrl + '/')
  })
})