import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TrainerPersonaServiceImpl } from '@/services/trainerPersona/TrainerPersonaServiceImpl';
import { createMockTrainerPersona } from '../utils/mock-factories';

describe('TrainerPersonaServiceImpl', () => {
  let service: TrainerPersonaServiceImpl;
  let mockApiService: {
    get: ReturnType<typeof vi.fn>;
    post: ReturnType<typeof vi.fn>;
    put: ReturnType<typeof vi.fn>;
    delete: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    vi.clearAllMocks();

    // Create a mock API service
    mockApiService = {
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
    };

    // Create service instance with mocked API service
    service = new TrainerPersonaServiceImpl(mockApiService);
  });

  describe('getTrainerPersona', () => {
    it('should fetch trainer persona successfully', async () => {
      const mockPersona = createMockTrainerPersona();
      mockApiService.get.mockResolvedValue(mockPersona);

      const result = await service.getTrainerPersona();

      expect(mockApiService.get).toHaveBeenCalledWith(
        '/members/trainer-persona/'
      );
      expect(result).toEqual(mockPersona);
    });

    it('should handle API errors', async () => {
      const error = new Error('API Error');
      mockApiService.get.mockRejectedValue(error);

      await expect(service.getTrainerPersona()).rejects.toThrow('API Error');
    });
  });

  describe('generateTrainerPersona', () => {
    it('should generate trainer persona successfully', async () => {
      mockApiService.post.mockResolvedValue(undefined);

      await service.generateTrainerPersona();

      expect(mockApiService.post).toHaveBeenCalledWith(
        '/members/trainer-persona/',
        {}
      );
    });

    it('should handle generation errors', async () => {
      const error = new Error('Generation failed');
      mockApiService.post.mockRejectedValue(error);

      await expect(service.generateTrainerPersona()).rejects.toThrow(
        'Generation failed'
      );
    });
  });
});
