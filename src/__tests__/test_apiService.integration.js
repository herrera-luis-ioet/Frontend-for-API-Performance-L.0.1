import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { apiService } from '../services/api/apiService';
import { API_BASE_URL, ERROR_MESSAGES } from '../services/config/apiConfig';

// Mock API server
const server = setupServer(
  // GET request handler
  rest.get(`${API_BASE_URL}/test`, (req, res, ctx) => {
    return res(ctx.json({ message: 'success' }));
  }),
  
  // POST request handler
  rest.post(`${API_BASE_URL}/test`, (req, res, ctx) => {
    return res(ctx.json({ id: 1, ...req.body }));
  }),
  
  // PUT request handler
  rest.put(`${API_BASE_URL}/test/1`, (req, res, ctx) => {
    return res(ctx.json({ id: 1, ...req.body, updated: true }));
  }),
  
  // DELETE request handler
  rest.delete(`${API_BASE_URL}/test/1`, (req, res, ctx) => {
    return res(ctx.json({ success: true }));
  }),
  
  // Error handler
  rest.get(`${API_BASE_URL}/error`, (req, res, ctx) => {
    return res(ctx.status(500), ctx.json({ message: 'Server error' }));
  })
);

describe('API Service Integration Tests', () => {
  // Enable API mocking before tests
  beforeAll(() => server.listen());
  
  // Reset any runtime request handlers we may add during the tests
  afterEach(() => server.resetHandlers());
  
  // Clean up after the tests are finished
  afterAll(() => server.close());

  test('successfully makes GET request', async () => {
    const data = await apiService.get('/test');
    expect(data).toEqual({ message: 'success' });
  });

  test('successfully makes POST request', async () => {
    const postData = { name: 'test' };
    const data = await apiService.post('/test', postData);
    expect(data).toEqual({ id: 1, ...postData });
  });

  test('successfully makes PUT request', async () => {
    const putData = { name: 'updated' };
    const data = await apiService.put('/test/1', putData);
    expect(data).toEqual({ id: 1, ...putData, updated: true });
  });

  test('successfully makes DELETE request', async () => {
    const data = await apiService.delete('/test/1');
    expect(data).toEqual({ success: true });
  });

  test('handles server error correctly', async () => {
    await expect(apiService.get('/error')).rejects.toThrow(ERROR_MESSAGES.SERVER_ERROR);
  });

  test('handles network error correctly', async () => {
    server.use(
      rest.get(`${API_BASE_URL}/test`, (req, res) => {
        return res.networkError('Failed to connect');
      })
    );
    
    await expect(apiService.get('/test')).rejects.toThrow(ERROR_MESSAGES.NETWORK_ERROR);
  });

  test('handles retry logic for 5xx errors', async () => {
    let attempts = 0;
    server.use(
      rest.get(`${API_BASE_URL}/retry-test`, (req, res, ctx) => {
        attempts++;
        if (attempts < 2) {
          return res(ctx.status(503));
        }
        return res(ctx.json({ success: true }));
      })
    );

    const data = await apiService.get('/retry-test');
    expect(data).toEqual({ success: true });
    expect(attempts).toBe(2);
  });

  test('handles authentication token correctly', async () => {
    const token = 'test-token';
    localStorage.setItem('token', token);

    let capturedToken;
    server.use(
      rest.get(`${API_BASE_URL}/auth-test`, (req, res, ctx) => {
        capturedToken = req.headers.get('Authorization');
        return res(ctx.json({ success: true }));
      })
    );

    await apiService.get('/auth-test');
    expect(capturedToken).toBe(`Bearer ${token}`);
    
    localStorage.removeItem('token');
  });
});