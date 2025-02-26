import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const NotFoundContainer = styled.div`
  text-align: center;
  padding: 40px;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  color: #dc3545;
  margin-bottom: 20px;
`;

const Message = styled.p`
  color: #6c757d;
  margin-bottom: 30px;
`;

const HomeLink = styled(Link)`
  display: inline-block;
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  transition: background-color 0.2s;

  &:hover {
    background-color: #0056b3;
  }
`;

// PUBLIC_INTERFACE
function NotFound() {
  return (
    <NotFoundContainer>
      <Title>404 - Page Not Found</Title>
      <Message>The page you are looking for does not exist.</Message>
      <HomeLink to="/">Return to Dashboard</HomeLink>
    </NotFoundContainer>
  );
}

export default NotFound;