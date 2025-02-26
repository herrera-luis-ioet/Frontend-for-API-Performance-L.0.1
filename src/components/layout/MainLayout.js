import React from 'react';
import styled from 'styled-components';
import Navigation from '../Navigation';
import ErrorBoundary from '../common/ErrorBoundary';

const LayoutContainer = styled.div`
  min-height: 100vh;
  background-color: #f5f5f5;
`;

const Header = styled.header`
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 1rem 2rem;
`;

const HeaderTitle = styled.h1`
  margin: 0;
  padding: 1rem 0;
  color: #333;
  font-size: 1.5rem;
`;

const Main = styled.main`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

// PUBLIC_INTERFACE
function MainLayout({ children }) {
  return (
    <LayoutContainer>
      <Header>
        <HeaderTitle>API Performance Dashboard</HeaderTitle>
        <Navigation />
      </Header>
      <Main>
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </Main>
    </LayoutContainer>
  );
}

export default MainLayout;