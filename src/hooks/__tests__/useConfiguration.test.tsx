import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { ReactNode } from 'react';
import {
  useConfiguration,
  useConfigurationData,
  useConfigurationLoading,
  useConfigurationLoaded,
  useConfigurationError,
  useAppConfig,
  useAppColors,
  useCurrentColorScheme,
  useIsDarkMode,
  usePrimaryColor,
  useTenant,
  useApiDomain,
} from '../useConfiguration';
import {
  ConfigurationContext,
  ConfigurationState,
} from '@/contexts/configuration.types';
import {
  AppConfiguration,
  AppConfigurationData,
} from '@/domain/entities/appConfiguration';

// Mock configuration data
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

const mockConfiguration = AppConfiguration.fromApiResponse(mockApiResponse);

const createWrapper = (state: Partial<ConfigurationState>) => {
  const defaultState: ConfigurationState = {
    configuration: null,
    isLoading: false,
    isLoaded: false,
    error: null,
    refetch: vi.fn(),
    ...state,
  };

  return ({ children }: { children: ReactNode }) => (
    <ConfigurationContext.Provider value={defaultState}>
      {children}
    </ConfigurationContext.Provider>
  );
};

describe('useConfiguration', () => {
  it('should throw error when used outside provider', () => {
    expect(() => {
      renderHook(() => useConfiguration());
    }).toThrow('useConfiguration must be used within a ConfigurationProvider');
  });

  it('should return configuration state when used within provider', () => {
    const mockState: ConfigurationState = {
      configuration: mockConfiguration,
      isLoading: false,
      isLoaded: true,
      error: null,
      refetch: vi.fn(),
    };

    const { result } = renderHook(() => useConfiguration(), {
      wrapper: createWrapper(mockState),
    });

    expect(result.current).toEqual(mockState);
  });
});

describe('useConfigurationData', () => {
  it('should return configuration object', () => {
    const { result } = renderHook(() => useConfigurationData(), {
      wrapper: createWrapper({ configuration: mockConfiguration }),
    });

    expect(result.current).toBe(mockConfiguration);
  });

  it('should return null when no configuration', () => {
    const { result } = renderHook(() => useConfigurationData(), {
      wrapper: createWrapper({ configuration: null }),
    });

    expect(result.current).toBeNull();
  });
});

describe('useConfigurationLoading', () => {
  it('should return loading state', () => {
    const { result } = renderHook(() => useConfigurationLoading(), {
      wrapper: createWrapper({ isLoading: true }),
    });

    expect(result.current).toBe(true);
  });
});

describe('useConfigurationLoaded', () => {
  it('should return loaded state', () => {
    const { result } = renderHook(() => useConfigurationLoaded(), {
      wrapper: createWrapper({ isLoaded: true }),
    });

    expect(result.current).toBe(true);
  });
});

describe('useConfigurationError', () => {
  it('should return error message', () => {
    const errorMessage = 'Configuration failed to load';
    const { result } = renderHook(() => useConfigurationError(), {
      wrapper: createWrapper({ error: errorMessage }),
    });

    expect(result.current).toBe(errorMessage);
  });
});

describe('useAppConfig', () => {
  it('should return app config when configuration exists', () => {
    const { result } = renderHook(() => useAppConfig(), {
      wrapper: createWrapper({ configuration: mockConfiguration }),
    });

    expect(result.current).toEqual(mockConfiguration.appConfig);
  });

  it('should return null when no configuration', () => {
    const { result } = renderHook(() => useAppConfig(), {
      wrapper: createWrapper({ configuration: null }),
    });

    expect(result.current).toBeNull();
  });
});

describe('useAppColors', () => {
  it('should return app colors when configuration exists', () => {
    const { result } = renderHook(() => useAppColors(), {
      wrapper: createWrapper({ configuration: mockConfiguration }),
    });

    expect(result.current).toEqual(mockConfiguration.appColors);
  });

  it('should return null when no configuration', () => {
    const { result } = renderHook(() => useAppColors(), {
      wrapper: createWrapper({ configuration: null }),
    });

    expect(result.current).toBeNull();
  });
});

describe('useCurrentColorScheme', () => {
  it('should return current color scheme when configuration exists', () => {
    const { result } = renderHook(() => useCurrentColorScheme(), {
      wrapper: createWrapper({ configuration: mockConfiguration }),
    });

    expect(result.current).toEqual(mockConfiguration.getCurrentColorScheme());
  });

  it('should return null when no configuration', () => {
    const { result } = renderHook(() => useCurrentColorScheme(), {
      wrapper: createWrapper({ configuration: null }),
    });

    expect(result.current).toBeNull();
  });
});

describe('useIsDarkMode', () => {
  it('should return true for dark mode', () => {
    const { result } = renderHook(() => useIsDarkMode(), {
      wrapper: createWrapper({ configuration: mockConfiguration }),
    });

    expect(result.current).toBe(true);
  });

  it('should return false when no configuration', () => {
    const { result } = renderHook(() => useIsDarkMode(), {
      wrapper: createWrapper({ configuration: null }),
    });

    expect(result.current).toBe(false);
  });
});

describe('usePrimaryColor', () => {
  it('should return primary color when configuration exists', () => {
    const { result } = renderHook(() => usePrimaryColor(), {
      wrapper: createWrapper({ configuration: mockConfiguration }),
    });

    expect(result.current).toBe('#FFDD00');
  });

  it('should return default color when no configuration', () => {
    const { result } = renderHook(() => usePrimaryColor(), {
      wrapper: createWrapper({ configuration: null }),
    });

    expect(result.current).toBe('#FFDD00');
  });
});

describe('useTenant', () => {
  it('should return tenant name when configuration exists', () => {
    const { result } = renderHook(() => useTenant(), {
      wrapper: createWrapper({ configuration: mockConfiguration }),
    });

    expect(result.current).toBe('test-tenant');
  });

  it('should return empty string when no configuration', () => {
    const { result } = renderHook(() => useTenant(), {
      wrapper: createWrapper({ configuration: null }),
    });

    expect(result.current).toBe('');
  });
});

describe('useApiDomain', () => {
  it('should return API domain when configuration exists', () => {
    const { result } = renderHook(() => useApiDomain(), {
      wrapper: createWrapper({ configuration: mockConfiguration }),
    });

    expect(result.current).toBe('test.api.domain.com');
  });

  it('should return empty string when no configuration', () => {
    const { result } = renderHook(() => useApiDomain(), {
      wrapper: createWrapper({ configuration: null }),
    });

    expect(result.current).toBe('');
  });
});
