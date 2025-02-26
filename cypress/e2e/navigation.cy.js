describe('Navigation Tests', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('should navigate between dashboard and performance detail pages', () => {
    // Verify initial dashboard load
    cy.get('[data-testid="dashboard"]').should('exist')

    // Click on a performance metric to navigate to detail page
    cy.get('[data-testid="performance-metrics"]')
      .find('[data-testid="metric-item"]')
      .first()
      .click()

    // Verify navigation to performance detail page
    cy.url().should('include', '/performance/')
    cy.get('[data-testid="performance-detail"]').should('exist')

    // Navigate back to dashboard
    cy.get('[data-testid="back-button"]').click()
    cy.url().should('eq', Cypress.config().baseUrl + '/')
    cy.get('[data-testid="dashboard"]').should('exist')
  })

  it('should maintain filter state during navigation', () => {
    // Set filters on dashboard
    cy.get('[data-testid="time-range-selector"]').click()
    cy.get('[data-testid="time-range-option"]').contains('Last 7 days').click()
    
    cy.get('[data-testid="sort-selector"]').click()
    cy.get('[data-testid="sort-option"]').contains('Response Time').click()

    // Navigate to detail page
    cy.get('[data-testid="performance-metrics"]')
      .find('[data-testid="metric-item"]')
      .first()
      .click()

    // Verify filters persist
    cy.get('[data-testid="time-range-selector"]')
      .should('contain', 'Last 7 days')

    // Navigate back
    cy.get('[data-testid="back-button"]').click()

    // Verify filters still persist on dashboard
    cy.get('[data-testid="time-range-selector"]')
      .should('contain', 'Last 7 days')
    cy.get('[data-testid="sort-selector"]')
      .should('contain', 'Response Time')
  })

  it('should handle browser navigation buttons', () => {
    // Navigate to detail page
    cy.get('[data-testid="performance-metrics"]')
      .find('[data-testid="metric-item"]')
      .first()
      .click()

    cy.url().should('include', '/performance/')
    
    // Use browser back button
    cy.go('back')
    cy.url().should('eq', Cypress.config().baseUrl + '/')
    cy.get('[data-testid="dashboard"]').should('exist')
    
    // Use browser forward button
    cy.go('forward')
    cy.url().should('include', '/performance/')
    cy.get('[data-testid="performance-detail"]').should('exist')
  })

  it('should handle direct URL access', () => {
    // Access performance detail page directly
    cy.visit('/performance/1')
    cy.get('[data-testid="performance-detail"]').should('exist')

    // Access dashboard directly
    cy.visit('/')
    cy.get('[data-testid="dashboard"]').should('exist')
  })

  it('should handle invalid routes', () => {
    // Visit invalid route
    cy.visit('/invalid-route')
    cy.get('[data-testid="not-found"]').should('exist')

    // Navigate back to dashboard from 404 page
    cy.get('[data-testid="home-link"]').click()
    cy.url().should('eq', Cypress.config().baseUrl + '/')
    cy.get('[data-testid="dashboard"]').should('exist')
  })

  it('should preserve search params during navigation', () => {
    // Set search parameters
    cy.visit('/?timeRange=7d&sort=responseTime')
    cy.get('[data-testid="time-range-selector"]')
      .should('contain', 'Last 7 days')
    cy.get('[data-testid="sort-selector"]')
      .should('contain', 'Response Time')

    // Navigate to detail page
    cy.get('[data-testid="performance-metrics"]')
      .find('[data-testid="metric-item"]')
      .first()
      .click()

    // Verify URL contains search params
    cy.url().should('include', 'timeRange=7d')

    // Navigate back
    cy.get('[data-testid="back-button"]').click()

    // Verify search params are preserved
    cy.url().should('include', 'timeRange=7d')
    cy.url().should('include', 'sort=responseTime')
  })

  it('should handle navigation during loading states', () => {
    // Intercept API call with delay
    cy.intercept('GET', '**/api/performance', {
      delay: 1000,
      fixture: 'performance.json'
    }).as('getPerformance')

    // Start navigation during loading
    cy.visit('/')
    cy.get('[data-testid="loading"]').should('exist')
    
    // Try to navigate to detail page
    cy.get('[data-testid="performance-metrics"]')
      .find('[data-testid="metric-item"]')
      .first()
      .click()

    // Verify navigation completed after loading
    cy.wait('@getPerformance')
    cy.url().should('include', '/performance/')
    cy.get('[data-testid="performance-detail"]').should('exist')
  })

  it('should maintain scroll position during navigation', () => {
    // Scroll dashboard to bottom
    cy.get('[data-testid="dashboard"]').scrollTo('bottom')
    
    // Navigate to detail page
    cy.get('[data-testid="performance-metrics"]')
      .find('[data-testid="metric-item"]')
      .last()
      .click()

    // Navigate back
    cy.get('[data-testid="back-button"]').click()
    
    // Verify scroll position is maintained
    cy.window().its('scrollY').should('be.gt', 0)
  })

  it('should handle rapid navigation between pages', () => {
    // Perform rapid navigation between pages
    cy.get('[data-testid="performance-metrics"]')
      .find('[data-testid="metric-item"]')
      .first()
      .click()

    cy.get('[data-testid="back-button"]').click()
    
    cy.get('[data-testid="performance-metrics"]')
      .find('[data-testid="metric-item"]')
      .last()
      .click()

    // Verify final navigation state is correct
    cy.url().should('include', '/performance/')
    cy.get('[data-testid="performance-detail"]').should('exist')
  })
})