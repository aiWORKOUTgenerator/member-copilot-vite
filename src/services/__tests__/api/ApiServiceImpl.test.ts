import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ApiServiceImpl } from '../../api/ApiServiceImpl';


// Mock fetch globally
global.fetch = vi.fn();

describe('ApiServiceImpl', () => {
  let apiService: ApiServiceImpl;
  let mockTokenProvider: { getToken: () => Promise<string> };

  beforeEach(() => {
    vi.clearAllMocks();
    
    mockTokenProvider = {
      getToken: vi.fn().mockResolvedValue('mock-token'),
    };
    
    apiService = new ApiServiceImpl('http://localhost:3000', undefined, mockTokenProvider);
  });

  describe('get', () => {
    it('makes successful GET request', async () => {
      const mockResponse = { data: 'test data' };
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue(mockResponse),
        status: 200,
      } as Response);

      const result = await apiService.get('/test-endpoint');

      expect(fetch).toHaveBeenCalledWith('http://localhost:3000/test-endpoint', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer mock-token',
        },
      });
      expect(result).toEqual(mockResponse);
    });

    it('handles API errors', async () => {
      const errorResponse = { error: 'Not found', status: 404 };
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: false,
        json: vi.fn().mockResolvedValue(errorResponse),
        status: 404,
      } as Response);

      await expect(apiService.get('/not-found')).rejects.toThrow('API error: 404 undefined');
    });

    it('handles network errors', async () => {
      vi.mocked(fetch).mockRejectedValueOnce(new Error('Network error'));

      await expect(apiService.get('/test')).rejects.toThrow('Network error');
    });
  });

  describe('post', () => {
    it('makes successful POST request', async () => {
      const requestData = { name: 'test' };
      const mockResponse = { data: 'created' };
      
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue(mockResponse),
        status: 201,
      } as Response);

      const result = await apiService.post('/test-endpoint', requestData);

      expect(fetch).toHaveBeenCalledWith('http://localhost:3000/test-endpoint', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer mock-token',
        },
        body: JSON.stringify(requestData),
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('put', () => {
    it('makes successful PUT request', async () => {
      const requestData = { name: 'updated' };
      const mockResponse = { data: 'updated' };
      
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue(mockResponse),
        status: 200,
      } as Response);

      const result = await apiService.put('/test-endpoint', requestData);

      expect(fetch).toHaveBeenCalledWith('http://localhost:3000/test-endpoint', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer mock-token',
        },
        body: JSON.stringify(requestData),
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('delete', () => {
    it('makes successful DELETE request', async () => {
      const mockResponse = { success: true };
      
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue(mockResponse),
        status: 200,
      } as Response);

      const result = await apiService.delete('/test-endpoint');

      expect(fetch).toHaveBeenCalledWith('http://localhost:3000/test-endpoint', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer mock-token',
        },
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('authentication', () => {
    it('includes authorization header with token', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue({}),
        status: 200,
      } as Response);

      await apiService.get('/test');

      expect(fetch).toHaveBeenCalledWith('http://localhost:3000/test', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer mock-token',
        },
      });
    });

    it('handles token provider errors', async () => {
      mockTokenProvider.getToken = vi.fn().mockRejectedValue(new Error('Token error'));

      await expect(apiService.get('/test')).rejects.toThrow('Token error');
    });
  });
}); 