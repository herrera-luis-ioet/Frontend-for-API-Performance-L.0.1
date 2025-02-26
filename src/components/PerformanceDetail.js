import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Loading from './common/Loading';

const DetailContainer = styled.div`
  padding: 20px;
`;

const MetricsSection = styled.section`
  margin: 20px 0;
  padding: 20px;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const MetricRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #eee;

  &:last-child {
    border-bottom: none;
  }
`;

const BackButton = styled.button`
  padding: 8px 16px;
  background-color: #f0f0f0;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-bottom: 20px;

  &:hover {
    background-color: #e0e0e0;
  }
`;

// PUBLIC_INTERFACE
function PerformanceDetail() {
  const { apiId } = useParams();
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // TODO: Replace with actual API call
    const fetchApiMetrics = async () => {
      try {
        // Simulated API data
        const mockMetrics = {
          id: apiId,
          name: apiId === 'api-1' ? 'User Service API' : 
                apiId === 'api-2' ? 'Authentication API' : 
                apiId === 'api-3' ? 'Product API' : 'Unknown API',
          metrics: {
            avgResponseTime: '120ms',
            uptime: '99.9%',
            requestsPerMinute: '250',
            errorRate: '0.1%',
            lastDowntime: '2023-11-15 08:30:00',
            p95LatencyMs: '180',
            p99LatencyMs: '250'
          }
        };
        setMetrics(mockMetrics);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch API metrics');
        setLoading(false);
      }
    };

    fetchApiMetrics();
  }, [apiId]);

  if (loading) {
    return <Loading message="Loading API metrics..." />;
  }

  if (error) {
    return (
      <div style={{ color: '#dc3545', padding: '2rem', textAlign: 'center' }}>
        Error: {error}
      </div>
    );
  }

  if (!metrics) {
    return (
      <div style={{ color: '#666', padding: '2rem', textAlign: 'center' }}>
        No metrics found for this API
      </div>
    );
  }

  return (
    <DetailContainer>
      <BackButton onClick={() => navigate('/')}>← Back to Dashboard</BackButton>
      <h2>{metrics.name} Performance Details</h2>
      <MetricsSection>
        <h3>Current Metrics</h3>
        <MetricRow>
          <span>Average Response Time:</span>
          <span>{metrics.metrics.avgResponseTime}</span>
        </MetricRow>
        <MetricRow>
          <span>Uptime:</span>
          <span>{metrics.metrics.uptime}</span>
        </MetricRow>
        <MetricRow>
          <span>Requests per Minute:</span>
          <span>{metrics.metrics.requestsPerMinute}</span>
        </MetricRow>
        <MetricRow>
          <span>Error Rate:</span>
          <span>{metrics.metrics.errorRate}</span>
        </MetricRow>
        <MetricRow>
          <span>95th Percentile Latency:</span>
          <span>{metrics.metrics.p95LatencyMs}ms</span>
        </MetricRow>
        <MetricRow>
          <span>99th Percentile Latency:</span>
          <span>{metrics.metrics.p99LatencyMs}ms</span>
        </MetricRow>
        <MetricRow>
          <span>Last Downtime:</span>
          <span>{metrics.metrics.lastDowntime}</span>
        </MetricRow>
      </MetricsSection>
    </DetailContainer>
  );
}

export default PerformanceDetail;
