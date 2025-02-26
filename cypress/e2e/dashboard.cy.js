describe('Dashboard Page', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('should load the dashboard page successfully', () => {
    cy.get('[data-testid="dashboard"]').should('exist')
    cy.get('[data-testid="loading"]').should('not.exist')
  })

  it('should display performance metrics', () => {
    cy.get('[data-testid="performance-metrics"]').should('exist')
    cy.get('[data-testid="performance-metrics"]').within(() => {
      cy.contains('Response Time').should('exist')
      cy.contains('Error Rate').should('exist')
      cy.contains('Request Count').should('exist')
    })
  })

  it('should handle loading state correctly', () => {
    cy.intercept('GET', '**/api/performance', (req) => {
      req.reply({
        delay: 1000,
        fixture: 'performance.json'
      })
    }).as('getPerformance')
    
    cy.visit('/')
    cy.get('[data-testid="loading"]').should('exist')
    cy.wait('@getPerformance')
    cy.get('[data-testid="loading"]').should('not.exist')
  })

  it('should navigate to performance detail page when clicking on a metric', () => {
    cy.get('[data-testid="performance-metrics"]')
      .find('[data-testid="metric-item"]')
      .first()
      .click()
    
    cy.url().should('include', '/performance/')
  })

  it('should filter metrics by time range', () => {
    cy.intercept('GET', '**/api/performance?timeRange=7d').as('getFilteredData')
    
    cy.get('[data-testid="time-range-selector"]').click()
    cy.get('[data-testid="time-range-option"]').contains('Last 7 days').click()
    
    cy.wait('@getFilteredData')
    cy.get('[data-testid="performance-metrics"]').should('exist')
  })

  it('should sort metrics by different criteria', () => {
    cy.get('[data-testid="sort-selector"]').click()
    cy.get('[data-testid="sort-option"]').contains('Response Time').click()
    
    cy.get('[data-testid="performance-metrics"]')
      .find('[data-testid="metric-item"]')
      .should('have.length.gt', 0)
  })

  it('should refresh data automatically', () => {
    cy.intercept('GET', '**/api/performance').as('refreshData')
    
    // Wait for auto-refresh interval
    cy.wait(30000) // Assuming 30s refresh interval
    cy.wait('@refreshData')
    
    cy.get('[data-testid="performance-metrics"]').should('exist')
  })

  it('should show correct metric trends', () => {
    cy.get('[data-testid="performance-metrics"]').within(() => {
      cy.get('[data-testid="trend-indicator"]').should('exist')
      cy.get('[data-testid="trend-value"]').should('exist')
    })
  })

  it('should handle search and filtering functionality', () => {
    cy.get('[data-testid="search-input"]').type('api')
    cy.get('[data-testid="performance-metrics"]')
      .find('[data-testid="metric-item"]')
      .should('have.length.gt', 0)
      .each(($el) => {
        cy.wrap($el).should('contain', 'api')
      })
  })

  it('should persist filter settings in URL', () => {
    cy.get('[data-testid="time-range-selector"]').click()
    cy.get('[data-testid="time-range-option"]').contains('Last 7 days').click()
    cy.url().should('include', 'timeRange=7d')
    
    cy.get('[data-testid="sort-selector"]').click()
    cy.get('[data-testid="sort-option"]').contains('Response Time').click()
    cy.url().should('include', 'sort=responseTime')
  })

  it('should handle multiple metric selection', () => {
    cy.get('[data-testid="metric-selector"]').click()
    cy.get('[data-testid="metric-option"]').contains('Error Rate').click()
    cy.get('[data-testid="metric-option"]').contains('Response Time').click()
    
    cy.get('[data-testid="selected-metrics"]').within(() => {
      cy.contains('Error Rate').should('exist')
      cy.contains('Response Time').should('exist')
    })
  })

  it('should validate metric thresholds', () => {
    cy.get('[data-testid="performance-metrics"]').within(() => {
      cy.get('[data-testid="metric-item"]').each(($el) => {
        cy.wrap($el).within(() => {
          cy.get('[data-testid="metric-value"]').invoke('text').then((text) => {
            const value = parseFloat(text)
            cy.get('[data-testid="threshold-indicator"]').should(($ind) => {
              if (value > 1000) expect($ind).to.have.class('critical')
              else if (value > 500) expect($ind).to.have.class('warning')
              else expect($ind).to.have.class('normal')
            })
          })
        })
      })
    })
  })

  it('should handle empty data state', () => {
    cy.intercept('GET', '**/api/performance', {
      body: { metrics: [] }
    }).as('emptyData')

    cy.visit('/')
    cy.wait('@emptyData')
    cy.get('[data-testid="empty-state"]').should('exist')
    cy.get('[data-testid="empty-state"]').should('contain', 'No data available')
  })

  it('should handle data visualization toggles', () => {
    cy.get('[data-testid="view-toggle"]').should('exist')
    cy.get('[data-testid="view-toggle"]').click()
    cy.get('[data-testid="chart-view"]').should('exist')
    
    cy.get('[data-testid="view-toggle"]').click()
    cy.get('[data-testid="table-view"]').should('exist')
  })

  it('should support keyboard navigation', () => {
    cy.get('[data-testid="metric-item"]').first().focus()
    cy.focused().type('{enter}')
    cy.url().should('include', '/performance/')
    
    cy.go('back')
    cy.get('[data-testid="metric-item"]').first().focus()
    cy.focused().type('{rightarrow}')
    cy.get('[data-testid="metric-item"]').eq(1).should('have.focus')
  })

  it('should handle data export functionality', () => {
    cy.get('[data-testid="export-button"]').click()
    cy.get('[data-testid="export-menu"]').should('be.visible')
    
    cy.get('[data-testid="export-csv"]').click()
    cy.readFile('cypress/downloads/performance-metrics.csv').should('exist')
  })

  it('should support metric grouping', () => {
    cy.get('[data-testid="group-by"]').click()
    cy.get('[data-testid="group-option"]').contains('API Endpoint').click()
    
    cy.get('[data-testid="group-header"]').should('exist')
    cy.get('[data-testid="group-content"]').should('exist')
  })

  it('should handle real-time updates', () => {
    cy.clock()
    cy.intercept('GET', '**/api/performance').as('performanceUpdate')
    
    cy.tick(30000) // Simulate 30 seconds passing
    cy.wait('@performanceUpdate')
    
    cy.get('[data-testid="last-updated"]')
      .should('contain', 'Last updated')
  })

  it('should support responsive layout', () => {
    // Test mobile view
    cy.viewport('iphone-6')
    cy.get('[data-testid="mobile-menu"]').should('exist')
    cy.get('[data-testid="performance-metrics"]')
      .should('have.css', 'flex-direction', 'column')
    
    // Test tablet view
    cy.viewport('ipad-2')
    cy.get('[data-testid="mobile-menu"]').should('not.be.visible')
    
    // Test desktop view
    cy.viewport(1920, 1080)
    cy.get('[data-testid="performance-metrics"]')
      .should('have.css', 'flex-direction', 'row')
  })
})
