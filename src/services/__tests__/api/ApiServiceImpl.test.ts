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
    apiService = new ApiServiceImpl(
      'http://localhost:3000',
      undefined,
      mockTokenProvider
    );
  });

  describe('get', () => {
    it('makes successful GET request', async () => {
      const mockResponse = { data: 'test data' };
      const mockFetchResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue(mockResponse),
        status: 200,
        headers: new Headers(),
        redirected: false,
        statusText: 'OK',
        type: 'default' as ResponseType,
        url: 'http://localhost:3000/test-endpoint',
        clone: vi.fn(),
        arrayBuffer: vi.fn(),
        blob: vi.fn(),
        formData: vi.fn(),
        text: vi.fn(),
        body: null,
        bodyUsed: false,
        bytes: vi.fn().mockResolvedValue(new Uint8Array()),
      } as unknown as Response;

      vi.mocked(fetch).mockResolvedValueOnce(mockFetchResponse);

      const result = await apiService.get('/test-endpoint');

      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:3000/test-endpoint',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer mock-token',
          },
        }
      );
      expect(result).toEqual(mockResponse);
    });

    it('handles API errors', async () => {
      const errorResponse = { error: 'Not found', status: 404 };
      const mockFetchResponse = {
        ok: false,
        json: vi.fn().mockResolvedValue(errorResponse),
        status: 404,
        headers: new Headers(),
        redirected: false,
        statusText: 'Not Found',
        type: 'default' as ResponseType,
        url: 'http://localhost:3000/not-found',
        clone: vi.fn(),
        arrayBuffer: vi.fn(),
        blob: vi.fn(),
        formData: vi.fn(),
        text: vi.fn(),
        body: null,
        bodyUsed: false,
        bytes: vi.fn().mockResolvedValue(new Uint8Array()),
      } as unknown as Response;

      vi.mocked(fetch).mockResolvedValueOnce(mockFetchResponse);

      await expect(apiService.get('/not-found')).rejects.toThrow(
        'API error: 404 Not Found'
      );
    });
  });

  describe('post', () => {
    it('makes successful POST request', async () => {
      const mockData = { name: 'test' };
      const mockResponse = { data: 'created' };
      const mockFetchResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue(mockResponse),
        status: 201,
        headers: new Headers(),
        redirected: false,
        statusText: 'Created',
        type: 'default' as ResponseType,
        url: 'http://localhost:3000/test-endpoint',
        clone: vi.fn(),
        arrayBuffer: vi.fn(),
        blob: vi.fn(),
        formData: vi.fn(),
        text: vi.fn(),
        body: null,
        bodyUsed: false,
        bytes: vi.fn().mockResolvedValue(new Uint8Array()),
      } as unknown as Response;

      vi.mocked(fetch).mockResolvedValueOnce(mockFetchResponse);

      const result = await apiService.post('/test-endpoint', mockData);

      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:3000/test-endpoint',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer mock-token',
          },
          body: JSON.stringify(mockData),
        }
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('put', () => {
    it('makes successful PUT request', async () => {
      const mockData = { name: 'updated' };
      const mockResponse = { data: 'updated' };
      const mockFetchResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue(mockResponse),
        status: 200,
        headers: new Headers(),
        redirected: false,
        statusText: 'OK',
        type: 'default' as ResponseType,
        url: 'http://localhost:3000/test-endpoint',
        clone: vi.fn(),
        arrayBuffer: vi.fn(),
        blob: vi.fn(),
        formData: vi.fn(),
        text: vi.fn(),
        body: null,
        bodyUsed: false,
        bytes: vi.fn().mockResolvedValue(new Uint8Array()),
      } as unknown as Response;

      vi.mocked(fetch).mockResolvedValueOnce(mockFetchResponse);

      const result = await apiService.put('/test-endpoint', mockData);

      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:3000/test-endpoint',
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer mock-token',
          },
          body: JSON.stringify(mockData),
        }
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('delete', () => {
    it('makes successful DELETE request', async () => {
      const mockResponse = { data: 'deleted' };
      const mockFetchResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue(mockResponse),
        status: 200,
        headers: new Headers(),
        redirected: false,
        statusText: 'OK',
        type: 'default' as ResponseType,
        url: 'http://localhost:3000/test-endpoint',
        clone: vi.fn(),
        arrayBuffer: vi.fn(),
        blob: vi.fn(),
        formData: vi.fn(),
        text: vi.fn(),
        body: null,
        bodyUsed: false,
        bytes: vi.fn().mockResolvedValue(new Uint8Array()),
      } as unknown as Response;

      vi.mocked(fetch).mockResolvedValueOnce(mockFetchResponse);

      const result = await apiService.delete('/test-endpoint');

      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:3000/test-endpoint',
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer mock-token',
          },
        }
      );
      expect(result).toEqual(mockResponse);
    });
  });
});
