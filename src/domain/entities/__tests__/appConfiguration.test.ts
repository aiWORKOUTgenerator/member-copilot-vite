import { describe, it, expect } from 'vitest';
import { AppConfiguration, AppConfigurationData } from '../appConfiguration';

describe('AppConfiguration', () => {
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

  it('should create an AppConfiguration from API response', () => {
    const config = AppConfiguration.fromApiResponse(mockApiResponse);

    expect(config.tenant).toBe('test-tenant');
    expect(config.appColors).toEqual(mockApiResponse.app_colors);
    expect(config.appConfig).toEqual(mockApiResponse.app_config);
    expect(config.apiDomain).toBe('test.api.domain.com');
  });

  it('should return the correct color scheme for dark mode', () => {
    const config = AppConfiguration.fromApiResponse(mockApiResponse);
    const colorScheme = config.getCurrentColorScheme();

    expect(colorScheme).toEqual(mockApiResponse.app_colors.dark);
    expect(colorScheme.brightness).toBe('dark');
  });

  it('should return the correct color scheme for light mode', () => {
    const lightModeResponse = {
      ...mockApiResponse,
      app_config: {
        ...mockApiResponse.app_config,
        themeMode: 'light' as const,
      },
    };

    const config = AppConfiguration.fromApiResponse(lightModeResponse);
    const colorScheme = config.getCurrentColorScheme();

    expect(colorScheme).toEqual(mockApiResponse.app_colors.light);
    expect(colorScheme.brightness).toBe('light');
  });

  it('should correctly identify dark mode', () => {
    const config = AppConfiguration.fromApiResponse(mockApiResponse);
    expect(config.isDarkMode()).toBe(true);
  });

  it('should correctly identify light mode', () => {
    const lightModeResponse = {
      ...mockApiResponse,
      app_config: {
        ...mockApiResponse.app_config,
        themeMode: 'light' as const,
      },
    };

    const config = AppConfiguration.fromApiResponse(lightModeResponse);
    expect(config.isDarkMode()).toBe(false);
  });

  it('should return the primary color for current theme', () => {
    const config = AppConfiguration.fromApiResponse(mockApiResponse);
    const primaryColor = config.getPrimaryColor();

    expect(primaryColor).toBe('#FFDD00');
  });

  it('should inherit from BaseEntity and have proper identity', () => {
    const config1 = AppConfiguration.fromApiResponse(mockApiResponse);
    const config2 = AppConfiguration.fromApiResponse(mockApiResponse);
    const config3 = AppConfiguration.fromApiResponse({
      ...mockApiResponse,
      tenant: 'different-tenant',
    });

    expect(config1.equals(config2)).toBe(true);
    expect(config1.equals(config3)).toBe(false);
    expect(config1.id).toBe('test-tenant');
  });
});
