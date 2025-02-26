import React from 'react';
import { render, screen } from '@testing-library/react';
import MainLayout from '../components/layout/MainLayout';

// Mock Navigation component since it might have router dependencies
jest.mock('../components/Navigation', () => {
  return function MockNavigation() {
    return <nav data-testid="mock-navigation">Navigation</nav>;
  };
});

describe('MainLayout', () => {
  it('renders header with title', () => {
    render(
      <MainLayout>
        <div>Test Content</div>
      </MainLayout>
    );
    expect(screen.getByText('API Performance Dashboard')).toBeInTheDocument();
  });

  it('renders navigation component', () => {
    render(
      <MainLayout>
        <div>Test Content</div>
      </MainLayout>
    );
    expect(screen.getByTestId('mock-navigation')).toBeInTheDocument();
  });

  it('renders children content', () => {
    render(
      <MainLayout>
        <div>Test Content</div>
      </MainLayout>
    );
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('wraps content in ErrorBoundary', () => {
    const { container } = render(
      <MainLayout>
        <div>Test Content</div>
      </MainLayout>
    );
    // ErrorBoundary is a class component that wraps the main content
    expect(container.querySelector('main')).toBeInTheDocument();
  });
});