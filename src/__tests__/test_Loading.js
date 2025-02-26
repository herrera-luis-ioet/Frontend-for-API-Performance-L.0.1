import React from 'react';
import { render, screen } from '@testing-library/react';
import Loading from '../components/common/Loading';

describe('Loading Component', () => {
  test('renders loading spinner', () => {
    render(<Loading />);
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  test('displays default loading message', () => {
    render(<Loading />);
    expect(screen.getByTestId('loading-text')).toHaveTextContent('Loading...');
  });

  test('displays custom loading message', () => {
    const customMessage = 'Please wait...';
    render(<Loading message={customMessage} />);
    expect(screen.getByTestId('loading-text')).toHaveTextContent(customMessage);
  });

  test('spinner has correct styling', () => {
    render(<Loading />);
    const spinner = screen.getByTestId('loading-spinner');
    const styles = window.getComputedStyle(spinner);
    
    expect(spinner).toHaveStyle({
      width: '40px',
      height: '40px',
      borderRadius: '50%'
    });
  });

  test('loading container has correct layout', () => {
    const { container } = render(<Loading />);
    const loadingContainer = container.firstChild;
    
    expect(loadingContainer).toHaveStyle({
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '2rem',
      minHeight: '200px'
    });
  });
});