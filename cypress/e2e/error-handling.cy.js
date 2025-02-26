describe('Error Handling Scenarios', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('should handle API timeout errors', () => {
    cy.intercept('GET', '**/api/performance', {
      delay: 30000 // 30 seconds timeout
    }).as('timeoutRequest')

    cy.visit('/')
    cy.get('[data-testid="loading"]').should('exist')
    cy.get('[data-testid="error-message"]', { timeout: 31000 })
      .should('exist')
      .and('contain', 'Request timeout')
  })

  it('should handle server errors (500)', () => {
    cy.intercept('GET', '**/api/performance', {
      statusCode: 500,
      body: { error: 'Internal Server Error' }
    }).as('serverError')

    cy.visit('/')
    cy.wait('@serverError')
    cy.get('[data-testid="error-message"]')
      .should('exist')
      .and('contain', 'server error')
  })

  it('should handle not found errors (404)', () => {
    cy.intercept('GET', '**/api/performance/*', {
      statusCode: 404,
      body: { error: 'Not Found' }
    }).as('notFoundError')

    cy.visit('/performance/999')
    cy.wait('@notFoundError')
    cy.get('[data-testid="error-message"]')
      .should('exist')
      .and('contain', 'not found')
  })

  it('should handle network connectivity issues', () => {
    cy.intercept('GET', '**/api/performance', {
      forceNetworkError: true
    }).as('networkError')

    cy.visit('/')
    cy.get('[data-testid="error-message"]')
      .should('exist')
      .and('contain', 'network error')
  })

  it('should handle unauthorized access (401)', () => {
    cy.intercept('GET', '**/api/performance', {
      statusCode: 401,
      body: { error: 'Unauthorized' }
    }).as('unauthorizedError')

    cy.visit('/')
    cy.wait('@unauthorizedError')
    cy.get('[data-testid="error-message"]')
      .should('exist')
      .and('contain', 'unauthorized')
  })

  it('should show retry button on error', () => {
    cy.intercept('GET', '**/api/performance', {
      statusCode: 500,
      body: { error: 'Internal Server Error' }
    }).as('serverError')

    cy.visit('/')
    cy.wait('@serverError')
    cy.get('[data-testid="retry-button"]')
      .should('exist')
      .and('be.visible')
      .click()

    // Intercept the retry request with success
    cy.intercept('GET', '**/api/performance', {
      fixture: 'performance.json'
    }).as('retryRequest')

    cy.wait('@retryRequest')
    cy.get('[data-testid="error-message"]').should('not.exist')
    cy.get('[data-testid="performance-metrics"]').should('exist')
  })

  it('should handle multiple concurrent errors', () => {
    cy.intercept('GET', '**/api/performance', {
      statusCode: 500,
      body: { error: 'Internal Server Error' }
    }).as('metricsError')

    cy.intercept('GET', '**/api/config', {
      statusCode: 404,
      body: { error: 'Not Found' }
    }).as('configError')

    cy.visit('/')
    cy.wait(['@metricsError', '@configError'])
    cy.get('[data-testid="error-message"]')
      .should('have.length.at.least', 1)
  })

  it('should handle error state recovery', () => {
    // First request fails
    cy.intercept('GET', '**/api/performance', {
      statusCode: 500,
      body: { error: 'Internal Server Error' }
    }).as('initialError')

    cy.visit('/')
    cy.wait('@initialError')
    cy.get('[data-testid="error-message"]').should('exist')

    // Refresh button click with successful response
    cy.intercept('GET', '**/api/performance', {
      fixture: 'performance.json'
    }).as('refreshRequest')

    cy.get('[data-testid="refresh-button"]').click()
    cy.wait('@refreshRequest')
    cy.get('[data-testid="error-message"]').should('not.exist')
    cy.get('[data-testid="performance-metrics"]').should('exist')
  })

  it('should preserve error messages in browser history', () => {
    cy.intercept('GET', '**/api/performance', {
      statusCode: 500,
      body: { error: 'Internal Server Error' }
    }).as('serverError')

    cy.visit('/')
    cy.wait('@serverError')
    cy.get('[data-testid="error-message"]').should('exist')

    // Navigate away
    cy.visit('/performance/1')
    
    // Navigate back
    cy.go('back')
    cy.get('[data-testid="error-message"]').should('exist')
  })
})