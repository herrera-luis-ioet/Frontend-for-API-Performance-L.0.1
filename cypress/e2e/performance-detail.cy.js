describe('Performance Detail Page', () => {
  beforeEach(() => {
    cy.intercept('GET', '/api/performance/*', { fixture: 'performance.json' }).as('getPerformanceDetail')
    cy.visit('/performance/1')
  })

  it('should load the performance detail page', () => {
    cy.get('[data-testid="performance-detail"]').should('exist')
    cy.get('[data-testid="loading"]').should('exist')
    cy.wait('@getPerformanceDetail')
    cy.get('[data-testid="loading"]').should('not.exist')
  })

  it('should display detailed metrics', () => {
    cy.wait('@getPerformanceDetail')
    cy.get('[data-testid="metric-details"]').should('exist')
    cy.get('[data-testid="response-time-chart"]').should('exist')
    cy.get('[data-testid="error-rate-chart"]').should('exist')
  })

  it('should allow data export', () => {
    cy.wait('@getPerformanceDetail')
    cy.get('[data-testid="export-button"]').should('exist')
    cy.get('[data-testid="export-button"]').click()
    cy.get('[data-testid="export-options"]').should('be.visible')
    cy.get('[data-testid="export-csv"]').click()
    cy.get('[data-testid="export-success"]').should('be.visible')
  })

  it('should handle data filtering', () => {
    cy.wait('@getPerformanceDetail')
    cy.get('[data-testid="filter-options"]').should('exist')
    cy.get('[data-testid="filter-dropdown"]').click()
    cy.get('[data-testid="filter-item"]').first().click()
    cy.get('[data-testid="loading"]').should('exist')
    cy.wait('@getPerformanceDetail')
    cy.get('[data-testid="loading"]').should('not.exist')
  })

  it('should update charts when time range changes', () => {
    cy.wait('@getPerformanceDetail')
    cy.get('[data-testid="time-range-selector"]').click()
    cy.get('[data-testid="range-option-week"]').click()
    cy.wait('@getPerformanceDetail')
    cy.get('[data-testid="response-time-chart"]').should('exist')
    cy.get('[data-testid="error-rate-chart"]').should('exist')
  })

  it('should allow comparison with historical data', () => {
    cy.wait('@getPerformanceDetail')
    cy.get('[data-testid="compare-button"]').click()
    cy.get('[data-testid="date-picker"]').should('be.visible')
    cy.get('[data-testid="compare-date"]').click()
    cy.wait('@getPerformanceDetail')
    cy.get('[data-testid="comparison-chart"]').should('exist')
  })

  it('should persist chart configurations', () => {
    cy.wait('@getPerformanceDetail')
    cy.get('[data-testid="chart-config"]').click()
    cy.get('[data-testid="chart-type-line"]').click()
    cy.reload()
    cy.wait('@getPerformanceDetail')
    cy.get('[data-testid="chart-type-line"]').should('have.class', 'active')
  })
})
