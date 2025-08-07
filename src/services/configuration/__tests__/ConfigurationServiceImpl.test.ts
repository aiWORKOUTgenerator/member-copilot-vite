import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
  type MockedFunction,
} from 'vitest';
import {
  ConfigurationServiceImpl,
  MockConfigurationService,
} from '../ConfigurationServiceImpl';
import { AppConfigurationData } from '@/domain/entities/appConfiguration';

// Mock fetch globally
global.fetch = vi.fn();

describe('ConfigurationServiceImpl', () => {
  let service: ConfigurationServiceImpl;

  beforeEach(() => {
    service = new ConfigurationServiceImpl();
    vi.clearAllMocks();
  });

  const mockApiResponse: AppConfigurationData = {
    tenant: 'test-tenant',
    app_colors: {
      dark: {
        error: '#FFB4AB',
        scrim: '#000000',
        shadow: '#000000',
        onError: '#690005',
        outline: '#979080',
        primary: '#FFDD00',
        surface: '#000000',
        tertiary: '#FFDD00',
        onPrimary: '#000000',
        onSurface: '#E8E2D9',
        secondary: '#D3C6A1',
        background: '#000000',
        brightness: 'dark',
        onTertiary: '#3B2F00',
        onSecondary: '#373016',
        surfaceTint: '#FFDD00',
        onBackground: '#E8E2D9',
        errorContainer: '#93000A',
        inversePrimary: '#715D00',
        inverseSurface: '#E8E2D9',
        outlineVariant: '#4B4639',
        surfaceVariant: '#4B4639',
        onErrorContainer: '#FFDAD6',
        onInverseSurface: '#000000',
        onSurfaceVariant: '#CEC6B4',
        primaryContainer: '#554500',
        tertiaryContainer: '#554500',
        onPrimaryContainer: '#FFE175',
        secondaryContainer: '#4F462A',
        onTertiaryContainer: '#FFE175',
        onSecondaryContainer: '#EFE2BB',
      },
      light: {
        error: '#BA1A1A',
        scrim: '#000000',
        shadow: '#000000',
        onError: '#FFFFFF',
        outline: '#7D7767',
        primary: '#715D00',
        surface: '#FFFFFBFF',
        tertiary: '#715D00',
        onPrimary: '#FFFFFF',
        onSurface: '#000000',
        secondary: '#675E40',
        background: '#FFFFFBFF',
        brightness: 'light',
        onTertiary: '#FFFFFF',
        onSecondary: '#FFFFFF',
        surfaceTint: '#715D00',
        onBackground: '#000000',
        errorContainer: '#FFDAD6',
        inversePrimary: '#FFDD00',
        inverseSurface: '#33302A',
        outlineVariant: '#CEC6B4',
        surfaceVariant: '#EAE2CF',
        onErrorContainer: '#410002',
        onInverseSurface: '#F6F0E7',
        onSurfaceVariant: '#4B4639',
        primaryContainer: '#FFE175',
        tertiaryContainer: '#FFE175',
        onPrimaryContainer: '#221B00',
        secondaryContainer: '#EFE2BB',
        onTertiaryContainer: '#221B00',
        onSecondaryContainer: '#211B04',
      },
    },
    app_config: {
      logo: 'https://example.com/logo.png',
      apiUrl: 'https://test.api.domain.com',
      logoUrl: 'https://example.com/logo.png',
      subtext: 'TEST LOCATION',
      themeMode: 'dark',
      gtmContainerId: 'GTM-TEST123',
      rudderWriteKey: 'test-rudder-key',
      backgroundImage: 'assets/images/test-background.jpeg',
      rudderDataPlaneUrl: 'https://test.dataplane.rudderstack.com',
      favicon: 'https://example.com/favicon.ico',
    },
    api_domain: 'test.api.domain.com',
  };

  it('should fetch configuration successfully', async () => {
    const mockResponse = {
      ok: true,
      json: vi.fn().mockResolvedValue(mockApiResponse),
    };
    (fetch as MockedFunction<typeof fetch>).mockResolvedValue(mockResponse);

    const result = await service.getConfiguration('https://test.domain.com');

    expect(fetch).toHaveBeenCalledWith(
      'https://api.aiworkoutgenerator.com/configs/?domain=https%3A%2F%2Ftest.domain.com',
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    expect(result.tenant).toBe('test-tenant');
    expect(result.apiDomain).toBe('test.api.domain.com');
  });

  it('should handle HTTP errors', async () => {
    const mockResponse = {
      ok: false,
      status: 404,
      statusText: 'Not Found',
    };
    (fetch as MockedFunction<typeof fetch>).mockResolvedValue(mockResponse);

    await expect(
      service.getConfiguration('https://invalid.domain.com')
    ).rejects.toThrow(
      'Configuration service error: Failed to fetch configuration: 404 Not Found'
    );
  });

  it('should handle network errors', async () => {
    (fetch as MockedFunction<typeof fetch>).mockRejectedValue(
      new Error('Network error')
    );

    await expect(
      service.getConfiguration('https://test.domain.com')
    ).rejects.toThrow('Configuration service error: Network error');
  });

  it('should handle unknown errors', async () => {
    (fetch as MockedFunction<typeof fetch>).mockRejectedValue('Unknown error');

    await expect(
      service.getConfiguration('https://test.domain.com')
    ).rejects.toThrow('Unknown error occurred while fetching configuration');
  });

  it('should URL encode the domain parameter', async () => {
    const mockResponse = {
      ok: true,
      json: vi.fn().mockResolvedValue(mockApiResponse),
    };
    (fetch as MockedFunction<typeof fetch>).mockResolvedValue(mockResponse);

    await service.getConfiguration(
      'https://special-chars@test.domain.com:8080'
    );

    expect(fetch).toHaveBeenCalledWith(
      'https://api.aiworkoutgenerator.com/configs/?domain=https%3A%2F%2Fspecial-chars%40test.domain.com%3A8080',
      expect.any(Object)
    );
  });
});

describe('MockConfigurationService', () => {
  let service: MockConfigurationService;

  beforeEach(() => {
    service = new MockConfigurationService();
  });

  it('should return mock configuration after delay', async () => {
    const startTime = Date.now();
    const result = await service.getConfiguration('https://mock.domain.com');
    const endTime = Date.now();

    // Should take at least 1000ms due to simulated delay
    expect(endTime - startTime).toBeGreaterThanOrEqual(1000);

    expect(result.tenant).toBe('mock-tenant');
    expect(result.apiDomain).toBe('mock.api.domain.com');
    expect(result.appConfig.themeMode).toBe('dark');
  });

  it('should return consistent mock data', async () => {
    const result1 = await service.getConfiguration('https://test1.domain.com');
    const result2 = await service.getConfiguration('https://test2.domain.com');

    expect(result1.tenant).toBe(result2.tenant);
    expect(result1.appConfig.logo).toBe(result2.appConfig.logo);
  });
});
