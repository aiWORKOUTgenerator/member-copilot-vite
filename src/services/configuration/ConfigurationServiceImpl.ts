import { ConfigurationService } from '@/domain/interfaces/services/ConfigurationService';
import {
  AppConfiguration,
  AppConfigurationData,
} from '@/domain/entities/appConfiguration';

/**
 * Implementation of ConfigurationService that fetches configuration from the backend API
 */
export class ConfigurationServiceImpl implements ConfigurationService {
  private readonly baseApiUrl: string;

  constructor() {
    // Use the configs API URL from environment or fallback
    this.baseApiUrl =
      import.meta.env.VITE_CONFIG_API_URL ||
      'https://api.aiworkoutgenerator.com';
  }

  /**
   * Fetch configuration for the specified domain
   * @param domain - The domain with schema and port to fetch configuration for
   * @returns Promise resolving to AppConfiguration entity
   */
  async getConfiguration(domain: string): Promise<AppConfiguration> {
    try {
      const url = `${this.baseApiUrl}/configs/?domain=${encodeURIComponent(domain)}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(
          `Failed to fetch configuration: ${response.status} ${response.statusText}`
        );
      }

      const data: AppConfigurationData = await response.json();

      // Transform API response to domain entity
      return AppConfiguration.fromApiResponse(data);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Configuration service error: ${error.message}`);
      }
      throw new Error('Unknown error occurred while fetching configuration');
    }
  }
}

/**
 * Mock implementation for testing and development
 */
export class MockConfigurationService implements ConfigurationService {
  async getConfiguration(domain: string): Promise<AppConfiguration> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    console.log('domain', domain);

    // Return mock configuration data
    const mockData: AppConfigurationData = {
      tenant: 'mock-tenant',
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
        logo: 'https://via.placeholder.com/200x100?text=Mock+Logo',
        apiUrl: 'https://mock.api.domain.com',
        logoUrl: 'https://via.placeholder.com/200x100?text=Mock+Logo',
        subtext: 'MOCK LOCATION',
        themeMode: 'dark',
        gtmContainerId: 'GTM-MOCK123',
        rudderWriteKey: 'mock-rudder-key',
        backgroundImage: 'assets/images/mock-background.jpeg',
        rudderDataPlaneUrl: 'https://mock.dataplane.rudderstack.com',
        favicon: 'https://via.placeholder.com/32x32?text=M',
      },
      api_domain: 'mock.api.domain.com',
    };

    return AppConfiguration.fromApiResponse(mockData);
  }
}
