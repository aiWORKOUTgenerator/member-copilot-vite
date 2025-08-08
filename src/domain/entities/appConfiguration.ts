import { BaseEntity } from './baseEntity';

/**
 * Color configuration for app theming
 */
export interface AppColors {
  dark: ColorScheme;
  light: ColorScheme;
}

/**
 * Individual color scheme (dark or light mode)
 */
export interface ColorScheme {
  error: string;
  scrim: string;
  shadow: string;
  onError: string;
  outline: string;
  primary: string;
  surface: string;
  tertiary: string;
  onPrimary: string;
  onSurface: string;
  secondary: string;
  background: string;
  brightness: 'dark' | 'light';
  onTertiary: string;
  onSecondary: string;
  surfaceTint: string;
  onBackground: string;
  errorContainer: string;
  inversePrimary: string;
  inverseSurface: string;
  outlineVariant: string;
  surfaceVariant: string;
  onErrorContainer: string;
  onInverseSurface: string;
  onSurfaceVariant: string;
  primaryContainer: string;
  tertiaryContainer: string;
  onPrimaryContainer: string;
  secondaryContainer: string;
  onTertiaryContainer: string;
  onSecondaryContainer: string;
}

/**
 * Application configuration settings
 */
export interface AppConfig {
  logo: string;
  apiUrl: string;
  logoUrl: string;
  subtext: string;
  themeMode: 'dark' | 'light';
  gtmContainerId: string;
  rudderWriteKey: string;
  backgroundImage: string;
  rudderDataPlaneUrl: string;
  favicon: string;
}

/**
 * Complete application configuration response
 */
export interface AppConfigurationData {
  tenant: string;
  app_colors: AppColors;
  app_config: AppConfig;
  api_domain: string;
}

/**
 * AppConfiguration entity representing the app's configuration
 */
export class AppConfiguration extends BaseEntity<string> {
  constructor(
    public readonly tenant: string,
    public readonly appColors: AppColors,
    public readonly appConfig: AppConfig,
    public readonly apiDomain: string
  ) {
    super(tenant);
  }

  /**
   * Get the current color scheme based on theme mode
   */
  getCurrentColorScheme(): ColorScheme {
    return this.appColors[this.appConfig.themeMode];
  }

  /**
   * Check if dark mode is enabled
   */
  isDarkMode(): boolean {
    return this.appConfig.themeMode === 'dark';
  }

  /**
   * Get primary brand color for current theme
   */
  getPrimaryColor(): string {
    return this.getCurrentColorScheme().primary;
  }

  /**
   * Create AppConfiguration from API response
   */
  static fromApiResponse(data: AppConfigurationData): AppConfiguration {
    return new AppConfiguration(
      data.tenant,
      data.app_colors,
      data.app_config,
      data.api_domain
    );
  }
}
