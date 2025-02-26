import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import PerformanceDetail from '../components/PerformanceDetail';

// Mock API response data
const mockMetricsData = {
  id: 'api-1',
  name: 'User Service API',
  metrics: {
    avgResponseTime: '120ms',
    uptime: '99.9%',
    requestsPerMinute: '250',
    errorRate: '0.1%',
    lastDowntime: '2023-11-15 08:30:00',
    p95LatencyMs: '180',
    p99LatencyMs: '250'
  }
};

// Setup MSW server
const server = setupServer(
  rest.get('/api/performance/:apiId', (req, res, ctx) => {
    const { apiId } = req.params;
    return res(ctx.json({ ...mockMetricsData, id: apiId }));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}));

// Wrapper component for providing router context
const PerformanceDetailWrapper = ({ apiId = 'api-1' }) => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<div>Dashboard</div>} />
      <Route path="/performance/:apiId" element={<PerformanceDetail />} />
    </Routes>
  </BrowserRouter>
);

describe('PerformanceDetail Integration Tests', () => {
  beforeEach(() => {
    window.history.pushState({}, '', `/performance/api-1`);
  });

  test('displays loading state initially', () => {
    render(<PerformanceDetailWrapper />);
    expect(screen.getByText(/Loading API metrics/i)).toBeInTheDocument();
  });

  test('displays API metrics after loading', async () => {
    render(<PerformanceDetailWrapper />);

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByText(/Loading API metrics/i)).not.toBeInTheDocument();
    });

    // Verify API name and metrics are displayed
    expect(screen.getByText(/User Service API Performance Details/i)).toBeInTheDocument();
    expect(screen.getByText(mockMetricsData.metrics.avgResponseTime)).toBeInTheDocument();
    expect(screen.getByText(mockMetricsData.metrics.uptime)).toBeInTheDocument();
    expect(screen.getByText(mockMetricsData.metrics.requestsPerMinute)).toBeInTheDocument();
    expect(screen.getByText(mockMetricsData.metrics.errorRate)).toBeInTheDocument();
    expect(screen.getByText(`${mockMetricsData.metrics.p95LatencyMs}ms`)).toBeInTheDocument();
    expect(screen.getByText(`${mockMetricsData.metrics.p99LatencyMs}ms`)).toBeInTheDocument();
    expect(screen.getByText(mockMetricsData.metrics.lastDowntime)).toBeInTheDocument();
  });

  test('displays error message when API request fails', async () => {
    server.use(
      rest.get('/api/performance/:apiId', (req, res, ctx) => {
        return res(ctx.status(500));
      })
    );

    render(<PerformanceDetailWrapper />);

    await waitFor(() => {
      expect(screen.getByText(/Failed to fetch API metrics/i)).toBeInTheDocument();
    });
  });

  test('navigates back to dashboard when back button is clicked', async () => {
    render(<PerformanceDetailWrapper />);

    await waitFor(() => {
      expect(screen.queryByText(/Loading API metrics/i)).not.toBeInTheDocument();
    });

    const backButton = screen.getByText(/Back to Dashboard/i);
    fireEvent.click(backButton);

    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  test('displays "No metrics found" message when API returns no data', async () => {
    server.use(
      rest.get('/api/performance/:apiId', (req, res, ctx) => {
        return res(ctx.json(null));
      })
    );

    render(<PerformanceDetailWrapper />);

    await waitFor(() => {
      expect(screen.getByText(/No metrics found for this API/i)).toBeInTheDocument();
    });
  });

  test('updates metrics when API ID changes', async () => {
    render(<PerformanceDetailWrapper />);

    await waitFor(() => {
      expect(screen.getByText(/User Service API Performance Details/i)).toBeInTheDocument();
    });

    // Change URL to simulate navigation to different API
    window.history.pushState({}, '', '/performance/api-2');

    // Verify that loading state is shown again
    expect(screen.getByText(/Loading API metrics/i)).toBeInTheDocument();

    // Wait for new data to load
    await waitFor(() => {
      expect(screen.queryByText(/Loading API metrics/i)).not.toBeInTheDocument();
    });
  });
});