import React from 'react';
import styled from 'styled-components';

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  min-height: 200px;
`;

const Spinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const LoadingText = styled.p`
  margin-left: 1rem;
  color: #666;
`;

// PUBLIC_INTERFACE
function Loading({ message = 'Loading...' }) {
  return (
    <LoadingContainer>
      <Spinner data-testid="loading-spinner" />
      <LoadingText data-testid="loading-text">{message}</LoadingText>
    </LoadingContainer>
  );
}

export default Loading;
