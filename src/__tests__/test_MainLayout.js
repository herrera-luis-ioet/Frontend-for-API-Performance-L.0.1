import React from 'react';
import { render, screen } from '@testing-library/react';
import MainLayout from '../components/layout/MainLayout';

// Mock the Navigation component since we're only testing MainLayout
jest.mock('../components/Navigation', () => {
  return function MockNavigation() {
    return <div data-testid="mock-navigation">Navigation</div>;
  };
});

describe('MainLayout Component', () => {
  test('renders header with correct title', () => {
    render(<MainLayout />);
    expect(screen.getByText('API Performance Dashboard')).toBeInTheDocument();
  });

  test('renders navigation component', () => {
    render(<MainLayout />);
    expect(screen.getByTestId('mock-navigation')).toBeInTheDocument();
  });

  test('renders children content', () => {
    render(
      <MainLayout>
        <div data-testid="test-content">Test Content</div>
      </MainLayout>
    );
    expect(screen.getByTestId('test-content')).toBeInTheDocument();
  });

  test('wraps content in ErrorBoundary', () => {
    const { container } = render(
      <MainLayout>
        <div>Test Content</div>
      </MainLayout>
    );
    
    // ErrorBoundary should be present in the main section
    const main = container.querySelector('main');
    expect(main.children[0].className).toBeTruthy(); // ErrorBoundary has styled components class
  });

  test('layout container has correct styling', () => {
    const { container } = render(<MainLayout />);
    expect(container.firstChild).toHaveStyle({
      minHeight: '100vh',
      backgroundColor: '#f5f5f5'
    });
  });

  test('header has correct styling', () => {
    render(<MainLayout />);
    const header = screen.getByRole('banner');
    expect(header).toHaveStyle({
      backgroundColor: '#ffffff',
      padding: '1rem 2rem'
    });
  });

  test('main content has correct layout', () => {
    const { container } = render(<MainLayout />);
    const main = container.querySelector('main');
    expect(main).toHaveStyle({
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '2rem'
    });
  });
});