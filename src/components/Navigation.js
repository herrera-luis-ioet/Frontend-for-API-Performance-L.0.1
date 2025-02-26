import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';

const Nav = styled.nav`
  background: #f8f9fa;
  padding: 1rem;
  border-bottom: 1px solid #e9ecef;
`;

const NavList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  gap: 20px;
`;

const NavItem = styled.li`
  margin: 0;
`;

const NavLink = styled(Link)`
  text-decoration: none;
  color: #495057;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: background-color 0.2s;

  &:hover {
    background-color: #e9ecef;
  }

  ${props => props.$active && `
    background-color: #e9ecef;
    font-weight: bold;
  `}
`;

// PUBLIC_INTERFACE
function Navigation() {
  const location = useLocation();

  return (
    <Nav>
      <NavList>
        <NavItem>
          <NavLink to="/" $active={location.pathname === '/'}>
            Dashboard
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink 
            to="/performance/api-1" 
            $active={location.pathname.startsWith('/performance')}
          >
            Performance Metrics
          </NavLink>
        </NavItem>
      </NavList>
    </Nav>
  );
}

export default Navigation;
