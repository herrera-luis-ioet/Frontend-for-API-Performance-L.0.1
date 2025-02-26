import React from 'react';
import { render, screen } from '@testing-library/react';
import Loading from '../components/common/Loading';

describe('Loading', () => {
  it('renders with default loading message', () => {
    render(<Loading />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders with custom loading message', () => {
    const customMessage = 'Please wait...';
    render(<Loading message={customMessage} />);
    expect(screen.getByText(customMessage)).toBeInTheDocument();
  });

  it('renders spinner element', () => {
    const { container } = render(<Loading />);
    // Using a more specific test-id for the spinner
    const spinner = container.querySelector('[data-testid="loading-spinner"]');
    expect(spinner).toBeInTheDocument();
  });

  it('has accessible loading indicator', () => {
    render(<Loading />);
    const loadingContainer = screen.getByText('Loading...').closest('div');
    expect(loadingContainer).toBeVisible();
  });
});
