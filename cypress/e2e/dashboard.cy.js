describe('Dashboard Page', () => {
  beforeEach(() => {
    cy.intercept('GET', '/api/performance', { fixture: 'performance.json' }).as('getPerformance')
    cy.intercept('GET', '/api/performance/summary', { fixture: 'performance-summary.json' }).as('getPerformanceSummary')
    cy.visit('/')
  })

  // Test suite for initial loading and data display

  describe('Initial Loading', () => {
    it('should load the dashboard page with correct structure', () => {
      cy.get('[data-testid="dashboard"]').should('exist')
      cy.get('[data-testid="loading"]').should('exist')
      cy.wait('@getPerformance')
      cy.get('[data-testid="loading"]').should('not.exist')
      cy.get('[data-testid="dashboard-header"]').should('exist')
      cy.get('[data-testid="dashboard-content"]').should('exist')
      cy.get('[data-testid="dashboard-footer"]').should('exist')
    })

    it('should show loading states correctly', () => {
      cy.get('[data-testid="loading"]').should('be.visible')
      cy.get('[data-testid="dashboard-skeleton"]').should('exist')
      cy.wait('@getPerformance')
      cy.get('[data-testid="loading"]').should('not.exist')
      cy.get('[data-testid="dashboard-skeleton"]').should('not.exist')
    })
  })

  describe('Performance Metrics Display', () => {
    beforeEach(() => {
      cy.wait('@getPerformance')
    })

    it('should display performance metrics correctly', () => {
      cy.get('[data-testid="performance-metrics"]').should('exist')
      cy.get('[data-testid="metric-card"]').should('have.length.at.least', 1)
      cy.get('[data-testid="metric-value"]').first().should('not.be.empty')
    })

    it('should display metric cards with correct information', () => {
      cy.get('[data-testid="metric-card"]').each(($card) => {
        cy.wrap($card).within(() => {
          cy.get('[data-testid="metric-title"]').should('be.visible')
          cy.get('[data-testid="metric-value"]').should('be.visible')
          cy.get('[data-testid="metric-trend"]').should('be.visible')
        })
      })
    })

    it('should show performance trends correctly', () => {
      cy.get('[data-testid="metric-trend"]').each(($trend) => {
        cy.wrap($trend).should('have.attr', 'data-trend-direction')
        cy.wrap($trend).should('have.attr', 'data-trend-value')
      })
    })
  })

  describe('Filtering and Sorting', () => {
    beforeEach(() => {
      cy.wait('@getPerformance')
    })

    it('should allow filtering by date range', () => {
      cy.get('[data-testid="date-filter"]').should('exist')
      cy.get('[data-testid="date-filter"]').click()
      cy.get('[data-testid="date-picker"]').should('be.visible')
      cy.get('[data-testid="date-range-start"]').type('2023-01-01')
      cy.get('[data-testid="date-range-end"]').type('2023-12-31')
      cy.get('[data-testid="apply-filter"]').click()
      cy.get('[data-testid="loading"]').should('exist')
      cy.wait('@getPerformance')
      cy.get('[data-testid="loading"]').should('not.exist')
      cy.get('[data-testid="active-filters"]').should('contain', '2023')
    })

    it('should allow sorting metrics by different criteria', () => {
      cy.get('[data-testid="sort-dropdown"]').click()
      cy.get('[data-testid="sort-option-value"]').click()
      cy.get('[data-testid="metric-card"]').should('have.length.at.least', 1)
      
      cy.get('[data-testid="sort-dropdown"]').click()
      cy.get('[data-testid="sort-option-name"]').click()
      cy.get('[data-testid="metric-card"]').should('have.length.at.least', 1)
    })

    it('should allow filtering by metric type', () => {
      cy.get('[data-testid="metric-filter"]').click()
      cy.get('[data-testid="metric-type-response"]').click()
      cy.get('[data-testid="apply-metric-filter"]').click()
      cy.wait('@getPerformance')
      cy.get('[data-testid="metric-card"]').should('have.length.at.least', 1)
    })
  })

  it('should navigate to performance detail view', () => {
    cy.wait('@getPerformance')
    cy.get('[data-testid="metric-card"]').first().click()
    cy.url().should('include', '/performance/')
  })

  it('should handle refresh of metrics data', () => {
    cy.wait('@getPerformance')
    cy.get('[data-testid="refresh-button"]').click()
    cy.wait('@getPerformance')
    cy.get('[data-testid="performance-metrics"]').should('exist')
    cy.get('[data-testid="loading"]').should('not.exist')
  })

  it('should persist filter settings', () => {
    cy.wait('@getPerformance')
    cy.get('[data-testid="date-filter"]').click()
    cy.get('[data-testid="date-picker"]').should('be.visible')
    cy.get('[data-testid="apply-filter"]').click()
    cy.reload()
    cy.wait('@getPerformance')
    cy.get('[data-testid="date-filter"]').should('contain', 'Custom Range')
  })
})
