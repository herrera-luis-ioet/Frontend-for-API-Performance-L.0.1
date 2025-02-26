describe('Error Handling', () => {
  it('should handle API errors on dashboard', () => {
    cy.intercept('GET', '/api/performance', {
      statusCode: 500,
      body: { error: 'Internal Server Error' }
    }).as('getPerformanceError')
    
    cy.visit('/')
    cy.wait('@getPerformanceError')
    cy.get('[data-testid="error-message"]').should('exist')
    cy.get('[data-testid="retry-button"]').should('exist')
    cy.get('[data-testid="retry-button"]').click()
    cy.get('[data-testid="loading"]').should('exist')
  })

  it('should handle API errors on performance detail', () => {
    cy.intercept('GET', '/api/performance/*', {
      statusCode: 404,
      body: { error: 'Not Found' }
    }).as('getDetailError')
    
    cy.visit('/performance/1')
    cy.wait('@getDetailError')
    cy.get('[data-testid="error-message"]').should('exist')
    cy.get('[data-testid="back-button"]').should('exist')
    cy.get('[data-testid="back-button"]').click()
    cy.url().should('eq', Cypress.config().baseUrl + '/')
  })

  it('should handle network errors', () => {
    cy.intercept('GET', '/api/performance', {
      forceNetworkError: true
    }).as('networkError')
    
    cy.visit('/')
    cy.get('[data-testid="error-message"]')
      .should('exist')
      .and('contain', 'network')
    cy.get('[data-testid="retry-button"]').should('exist')
  })

  it('should recover from errors after retry', () => {
    let firstAttempt = true
    cy.intercept('GET', '/api/performance', (req) => {
      if (firstAttempt) {
        firstAttempt = false
        req.reply({
          statusCode: 500,
          body: { error: 'Internal Server Error' }
        })
      } else {
        req.reply({ fixture: 'performance.json' })
      }
    }).as('getPerformanceRetry')
    
    cy.visit('/')
    cy.wait('@getPerformanceRetry')
    cy.get('[data-testid="error-message"]').should('exist')
    cy.get('[data-testid="retry-button"]').click()
    cy.wait('@getPerformanceRetry')
    cy.get('[data-testid="error-message"]').should('not.exist')
    cy.get('[data-testid="performance-metrics"]').should('exist')
  })
})