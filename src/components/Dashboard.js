import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import Loading from './common/Loading';

const DashboardContainer = styled.div`
  padding: 20px;
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 20px;
`;

const MetricCard = styled.div`
  background: #ffffff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-5px);
  }
`;

// PUBLIC_INTERFACE
function Dashboard() {
  const [apis, setApis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // TODO: Replace with actual API call
    const fetchApiData = async () => {
      try {
        // Simulated API data
        const mockData = [
          { id: 'api-1', name: 'User Service API', avgResponseTime: '120ms', uptime: '99.9%' },
          { id: 'api-2', name: 'Authentication API', avgResponseTime: '85ms', uptime: '99.8%' },
          { id: 'api-3', name: 'Product API', avgResponseTime: '150ms', uptime: '99.7%' }
        ];
        setApis(mockData);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch API performance data');
        setLoading(false);
      }
    };

    fetchApiData();
  }, []);

  if (loading) {
    return <Loading message="Loading API performance data..." />;
  }

  if (error) {
    return (
      <div style={{ color: '#dc3545', padding: '2rem', textAlign: 'center' }}>
        Error: {error}
      </div>
    );
  }

  return (
    <DashboardContainer>
      <h2>API Performance Dashboard</h2>
      <MetricsGrid>
        {apis.map(api => (
          <MetricCard key={api.id}>
            <h3>{api.name}</h3>
            <p>Average Response Time: {api.avgResponseTime}</p>
            <p>Uptime: {api.uptime}</p>
            <Link to={`/performance/${api.id}`}>View Details</Link>
          </MetricCard>
        ))}
      </MetricsGrid>
    </DashboardContainer>
  );
}

export default Dashboard;
