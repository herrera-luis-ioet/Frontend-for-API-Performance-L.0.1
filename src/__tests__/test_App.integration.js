import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import App from '../App';

// Mock child components to isolate routing tests
jest.mock('../components/Dashboard', () => {
  return function MockDashboard() {
    return <div data-testid="dashboard">Dashboard Component</div>;
  };
});

jest.mock('../components/PerformanceDetail', () => {
  return function MockPerformanceDetail() {
    return <div data-testid="performance-detail">Performance Detail Component</div>;
  };
});

jest.mock('../components/NotFound', () => {
  return function MockNotFound() {
    return <div data-testid="not-found">Not Found Component</div>;
  };
});

describe('App Integration Tests', () => {
  const renderWithRouter = (ui, { route = '/' } = {}) => {
    window.history.pushState({}, 'Test page', route);
    return render(ui, { wrapper: BrowserRouter });
  };

  test('renders dashboard on root path', () => {
    renderWithRouter(<App />);
    expect(screen.getByTestId('dashboard')).toBeInTheDocument();
  });

  test('renders performance detail for specific API', () => {
    renderWithRouter(<App />, { route: '/performance/api-1' });
    expect(screen.getByTestId('performance-detail')).toBeInTheDocument();
  });

  test('renders not found for invalid routes', () => {
    renderWithRouter(<App />, { route: '/invalid-route' });
    expect(screen.getByTestId('not-found')).toBeInTheDocument();
  });

  test('navigation between routes works correctly', async () => {
    renderWithRouter(<App />);
    
    // Initially on dashboard
    expect(screen.getByTestId('dashboard')).toBeInTheDocument();
    
    // Navigate to performance detail
    window.history.pushState({}, 'Performance Detail', '/performance/api-1');
    await waitFor(() => {
      expect(screen.getByTestId('performance-detail')).toBeInTheDocument();
    });
    
    // Navigate back to dashboard
    window.history.pushState({}, 'Dashboard', '/');
    await waitFor(() => {
      expect(screen.getByTestId('dashboard')).toBeInTheDocument();
    });
  });
});