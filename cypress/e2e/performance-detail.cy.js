describe('Performance Detail Page', () => {
  beforeEach(() => {
    cy.visit('/performance/1')
  })

  it('should load the performance detail page successfully', () => {
    cy.get('[data-testid="performance-detail"]').should('exist')
    cy.get('[data-testid="loading"]').should('not.exist')
  })

  it('should display detailed performance metrics', () => {
    cy.get('[data-testid="performance-detail"]').within(() => {
      cy.get('[data-testid="response-time"]').should('exist')
      cy.get('[data-testid="error-rate"]').should('exist')
      cy.get('[data-testid="request-count"]').should('exist')
    })
  })

  it('should handle API errors gracefully', () => {
    cy.intercept('GET', '**/api/performance/*', {
      statusCode: 500,
      body: { error: 'Internal Server Error' }
    }).as('getPerformanceError')

    cy.visit('/performance/1')
    cy.get('[data-testid="error-message"]').should('exist')
    cy.contains('Error loading performance data').should('exist')
  })

  it('should allow navigation back to dashboard', () => {
    cy.get('[data-testid="back-button"]').click()
    cy.url().should('eq', Cypress.config().baseUrl + '/')
  })

  it('should update data when time range changes', () => {
    cy.get('[data-testid="time-range-selector"]').click()
    cy.get('[data-testid="time-range-option"]').contains('Last 7 days').click()
    cy.get('[data-testid="loading"]').should('exist')
    cy.get('[data-testid="loading"]').should('not.exist')
    cy.get('[data-testid="performance-detail"]').should('exist')
  })

  it('should display historical trend data', () => {
    cy.get('[data-testid="trend-chart"]').should('exist')
    cy.get('[data-testid="trend-chart"]').within(() => {
      cy.get('[data-testid="chart-tooltip"]').should('exist')
      cy.get('[data-testid="chart-legend"]').should('exist')
    })
  })

  it('should allow data export', () => {
    cy.get('[data-testid="export-button"]').click()
    cy.get('[data-testid="export-options"]').should('be.visible')
    cy.get('[data-testid="export-csv"]').click()
    
    // Verify download using Cypress task (requires configuration)
    cy.readFile('cypress/downloads/performance-data.csv').should('exist')
  })

  it('should display comparative metrics', () => {
    cy.get('[data-testid="comparative-metrics"]').should('exist')
    cy.get('[data-testid="comparative-metrics"]').within(() => {
      cy.get('[data-testid="previous-period"]').should('exist')
      cy.get('[data-testid="change-percentage"]').should('exist')
    })
  })

  it('should handle data refresh', () => {
    cy.intercept('GET', '**/api/performance/*').as('refreshData')
    cy.get('[data-testid="refresh-button"]').click()
    
    cy.get('[data-testid="loading"]').should('exist')
    cy.wait('@refreshData')
    cy.get('[data-testid="loading"]').should('not.exist')
    cy.get('[data-testid="last-updated"]').should('contain', 'Last updated')
  })

  it('should support metric breakdown by dimensions', () => {
    cy.get('[data-testid="breakdown-selector"]').click()
    cy.get('[data-testid="breakdown-option"]').contains('By Endpoint').click()
    
    cy.get('[data-testid="breakdown-chart"]').should('exist')
    cy.get('[data-testid="breakdown-table"]').should('exist')
  })

  it('should handle chart interactions', () => {
    cy.get('[data-testid="trend-chart"]').within(() => {
      cy.get('[data-testid="chart-datapoint"]').first().trigger('mouseover')
      cy.get('[data-testid="chart-tooltip"]')
        .should('be.visible')
        .and('contain', 'Response Time')
        .and('contain', 'ms')
    })
  })

  it('should support data range selection on chart', () => {
    cy.get('[data-testid="trend-chart"]').within(() => {
      cy.get('[data-testid="chart-range-selector"]').should('exist')
      cy.get('[data-testid="range-start"]').click().type('2023-01-01')
      cy.get('[data-testid="range-end"]').click().type('2023-01-07')
      cy.get('[data-testid="apply-range"]').click()
    })
    
    cy.get('[data-testid="loading"]').should('exist')
    cy.get('[data-testid="loading"]').should('not.exist')
    cy.get('[data-testid="trend-chart"]').should('exist')
  })

  it('should handle metric threshold configuration', () => {
    cy.get('[data-testid="settings-button"]').click()
    cy.get('[data-testid="threshold-config"]').should('be.visible')
    
    cy.get('[data-testid="warning-threshold"]').clear().type('500')
    cy.get('[data-testid="critical-threshold"]').clear().type('1000')
    cy.get('[data-testid="save-thresholds"]').click()
    
    cy.get('[data-testid="threshold-indicator"]').should('exist')
  })

  it('should support metric annotations', () => {
    cy.get('[data-testid="add-annotation"]').click()
    cy.get('[data-testid="annotation-input"]').type('Performance test conducted')
    cy.get('[data-testid="annotation-save"]').click()
    
    cy.get('[data-testid="trend-chart"]').within(() => {
      cy.get('[data-testid="annotation-marker"]').should('exist')
      cy.get('[data-testid="annotation-marker"]').trigger('mouseover')
      cy.get('[data-testid="annotation-tooltip"]')
        .should('be.visible')
        .and('contain', 'Performance test conducted')
    })
  })

  it('should handle metric comparison mode', () => {
    cy.get('[data-testid="compare-button"]').click()
    cy.get('[data-testid="comparison-selector"]').should('be.visible')
    
    cy.get('[data-testid="compare-timerange"]').click()
    cy.get('[data-testid="timerange-option"]').contains('Previous period').click()
    
    cy.get('[data-testid="trend-chart"]').within(() => {
      cy.get('[data-testid="comparison-line"]').should('exist')
      cy.get('[data-testid="chart-legend"]').should('contain', 'Current')
      cy.get('[data-testid="chart-legend"]').should('contain', 'Previous')
    })
  })

  it('should handle custom date range selection', () => {
    cy.get('[data-testid="date-range-picker"]').click()
    cy.get('[data-testid="custom-range"]').click()
    
    cy.get('[data-testid="start-date"]').type('2023-01-01')
    cy.get('[data-testid="end-date"]').type('2023-01-31')
    cy.get('[data-testid="apply-range"]').click()
    
    cy.get('[data-testid="loading"]').should('exist')
    cy.get('[data-testid="loading"]').should('not.exist')
    cy.get('[data-testid="date-range-display"]')
      .should('contain', 'Jan 1, 2023')
      .and('contain', 'Jan 31, 2023')
  })

  it('should support metric value aggregation', () => {
    cy.get('[data-testid="aggregation-selector"]').click()
    cy.get('[data-testid="aggregation-option"]').contains('Average').click()
    
    cy.get('[data-testid="metric-value"]').should('exist')
    
    cy.get('[data-testid="aggregation-selector"]').click()
    cy.get('[data-testid="aggregation-option"]').contains('Maximum').click()
    
    cy.get('[data-testid="metric-value"]').should('exist')
  })

  it('should handle chart zoom interactions', () => {
    cy.get('[data-testid="trend-chart"]').within(() => {
      cy.get('[data-testid="zoom-in"]').click()
      cy.get('[data-testid="chart-container"]')
        .trigger('mousedown', 100, 100)
        .trigger('mousemove', 200, 100)
        .trigger('mouseup')
      
      cy.get('[data-testid="zoom-reset"]').click()
    })
  })

  it('should support metric value formatting', () => {
    cy.get('[data-testid="format-selector"]').click()
    cy.get('[data-testid="format-option"]').contains('Percentage').click()
    
    cy.get('[data-testid="metric-value"]')
      .should('contain', '%')
    
    cy.get('[data-testid="format-selector"]').click()
    cy.get('[data-testid="format-option"]').contains('Raw').click()
    
    cy.get('[data-testid="metric-value"]')
      .should('not.contain', '%')
  })

  it('should handle chart type switching', () => {
    cy.get('[data-testid="chart-type-selector"]').click()
    cy.get('[data-testid="chart-type-option"]').contains('Bar').click()
    cy.get('[data-testid="bar-chart"]').should('exist')
    
    cy.get('[data-testid="chart-type-selector"]').click()
    cy.get('[data-testid="chart-type-option"]').contains('Line').click()
    cy.get('[data-testid="line-chart"]').should('exist')
  })

  it('should support data point selection', () => {
    cy.get('[data-testid="trend-chart"]').within(() => {
      cy.get('[data-testid="data-point"]').first().click()
      cy.get('[data-testid="point-details"]').should('be.visible')
      cy.get('[data-testid="point-timestamp"]').should('exist')
      cy.get('[data-testid="point-value"]').should('exist')
    })
  })

  it('should handle metric alerts configuration', () => {
    cy.get('[data-testid="alerts-button"]').click()
    cy.get('[data-testid="alert-config"]').should('be.visible')
    
    cy.get('[data-testid="add-alert"]').click()
    cy.get('[data-testid="alert-threshold"]').type('1000')
    cy.get('[data-testid="alert-condition"]').select('greater_than')
    cy.get('[data-testid="save-alert"]').click()
    
    cy.get('[data-testid="alert-list"]')
      .should('contain', '> 1000')
  })

  it('should support responsive chart resizing', () => {
    // Test mobile view
    cy.viewport('iphone-6')
    cy.get('[data-testid="trend-chart"]')
      .should('have.css', 'width', '100%')
    
    // Test desktop view
    cy.viewport(1920, 1080)
    cy.get('[data-testid="trend-chart"]')
      .should('have.css', 'width', '800px')
  })

  it('should handle chart legend interactions', () => {
    cy.get('[data-testid="chart-legend"]').within(() => {
      // Toggle series visibility
      cy.get('[data-testid="legend-item"]').first().click()
      cy.get('[data-testid="legend-item"]').first()
        .should('have.class', 'disabled')
      
      // Reset visibility
      cy.get('[data-testid="legend-item"]').first().click()
      cy.get('[data-testid="legend-item"]').first()
        .should('not.have.class', 'disabled')
    })
  })
})
