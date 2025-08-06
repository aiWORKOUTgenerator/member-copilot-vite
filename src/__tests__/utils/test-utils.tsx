import { render, RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router';
import { ReactElement } from 'react';
import { it } from 'vitest';

// Custom render function that includes providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return <BrowserRouter>{children}</BrowserRouter>;
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

// Re-export everything
export * from '@testing-library/react';
export { customRender as render };

// Data-driven test helpers
export const createTestCases = <
  TInput extends Record<string, unknown>,
  TExpected = unknown,
>(
  testCases: Array<{ name: string; input: TInput; expected: TExpected }>
) => testCases;

export const runTestCases = <
  TInput extends Record<string, unknown>,
  TExpected = unknown,
>(
  testCases: Array<{ name: string; input: TInput; expected: TExpected }>,
  testFn: (input: TInput, expected: TExpected) => void
) => {
  testCases.forEach(({ name, input, expected }) => {
    it(name, () => testFn(input, expected));
  });
};
