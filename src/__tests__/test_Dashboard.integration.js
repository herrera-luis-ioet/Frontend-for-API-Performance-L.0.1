import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import Dashboard from '../components/Dashboard';

// Mock API response data
const mockApiData = [
  { id: 'api-1', name: 'User Service API', avgResponseTime: '120ms', uptime: '99.9%' },
  { id: 'api-2', name: 'Authentication API', avgResponseTime: '85ms', uptime: '99.8%' },
  { id: 'api-3', name: 'Product API', avgResponseTime: '150ms', uptime: '99.7%' }
];

// Setup MSW server
const server = setupServer(
  rest.get('/api/performance', (req, res, ctx) => {
    return res(ctx.json(mockApiData));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// Wrapper component for providing router context
const DashboardWrapper = () => (
  <BrowserRouter>
    <Dashboard />
  </BrowserRouter>
);

describe('Dashboard Integration Tests', () => {
  test('displays loading state initially', () => {
    render(<DashboardWrapper />);
    expect(screen.getByText(/Loading API performance data/i)).toBeInTheDocument();
  });

  test('displays API performance data after loading', async () => {
    render(<DashboardWrapper />);

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByText(/Loading API performance data/i)).not.toBeInTheDocument();
    });

    // Verify all API cards are rendered
    mockApiData.forEach(api => {
      expect(screen.getByText(api.name)).toBeInTheDocument();
      expect(screen.getByText(`Average Response Time: ${api.avgResponseTime}`)).toBeInTheDocument();
      expect(screen.getByText(`Uptime: ${api.uptime}`)).toBeInTheDocument();
    });

    // Verify navigation links
    mockApiData.forEach(api => {
      const link = screen.getByRole('link', { name: /view details/i });
      expect(link).toHaveAttribute('href', `/performance/${api.id}`);
    });
  });

  test('displays error message when API request fails', async () => {
    // Override the default handler to simulate an error
    server.use(
      rest.get('/api/performance', (req, res, ctx) => {
        return res(ctx.status(500));
      })
    );

    render(<DashboardWrapper />);

    await waitFor(() => {
      expect(screen.getByText(/Failed to fetch API performance data/i)).toBeInTheDocument();
    });
  });

  test('renders correct number of API metric cards', async () => {
    render(<DashboardWrapper />);

    await waitFor(() => {
      const cards = screen.getAllByRole('heading', { level: 3 });
      expect(cards).toHaveLength(mockApiData.length);
    });
  });
});