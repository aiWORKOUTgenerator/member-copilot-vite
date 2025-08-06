import { ReactElement } from 'react';
import {
  render,
  RenderOptions,
  screen,
  fireEvent,
  waitFor,
} from '@testing-library/react';

// Import the component from a separate file
import { AllTheProviders } from './test-providers';

// Custom render function that includes all necessary providers
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

// Export testing library functions
export { screen, fireEvent, waitFor };
export { customRender as render };

// Re-export mock utilities for convenience
export { setupAuthMock, setupAnalyticsMock, clearMocks } from './mock-utils';
