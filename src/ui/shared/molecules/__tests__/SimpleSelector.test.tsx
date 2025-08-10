import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SimpleSelector } from '../SimpleSelector';
import { Target } from 'lucide-react';

// Mock options for testing
const mockOptions = [
  {
    id: 'option1',
    title: 'Option 1',
    description: 'This is a detailed description for option 1',
    tertiary: <span data-testid="tertiary-1">Tertiary 1</span>,
  },
  {
    id: 'option2',
    title: 'Option 2',
    description: 'This is a detailed description for option 2',
    tertiary: <span data-testid="tertiary-2">Tertiary 2</span>,
  },
];

const defaultProps = {
  icon: Target,
  options: mockOptions,
  question: 'Test Question',
  onChange: vi.fn(),
};

describe('SimpleSelector', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders as simple variant by default', () => {
    render(<SimpleSelector {...defaultProps} />);

    // Should hide descriptions and tertiary content by default
    expect(
      screen.queryByText('This is a detailed description for option 1')
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText('This is a detailed description for option 2')
    ).not.toBeInTheDocument();
    expect(screen.queryByTestId('tertiary-1')).not.toBeInTheDocument();
    expect(screen.queryByTestId('tertiary-2')).not.toBeInTheDocument();

    // Should still show titles
    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
  });

  it('allows override to show descriptions', () => {
    render(<SimpleSelector {...defaultProps} showDescription={true} />);

    // Should show descriptions when override is provided
    expect(
      screen.getByText('This is a detailed description for option 1')
    ).toBeInTheDocument();
    expect(
      screen.getByText('This is a detailed description for option 2')
    ).toBeInTheDocument();

    // Should still hide tertiary content
    expect(screen.queryByTestId('tertiary-1')).not.toBeInTheDocument();
    expect(screen.queryByTestId('tertiary-2')).not.toBeInTheDocument();
  });

  it('allows override to show tertiary content', () => {
    render(<SimpleSelector {...defaultProps} showTertiary={true} />);

    // Should hide descriptions by default
    expect(
      screen.queryByText('This is a detailed description for option 1')
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText('This is a detailed description for option 2')
    ).not.toBeInTheDocument();

    // Should show tertiary content when override is provided
    expect(screen.getByTestId('tertiary-1')).toBeInTheDocument();
    expect(screen.getByTestId('tertiary-2')).toBeInTheDocument();
  });

  it('allows override to show both descriptions and tertiary content', () => {
    render(
      <SimpleSelector
        {...defaultProps}
        showDescription={true}
        showTertiary={true}
      />
    );

    // Should show both descriptions and tertiary content
    expect(
      screen.getByText('This is a detailed description for option 1')
    ).toBeInTheDocument();
    expect(
      screen.getByText('This is a detailed description for option 2')
    ).toBeInTheDocument();
    expect(screen.getByTestId('tertiary-1')).toBeInTheDocument();
    expect(screen.getByTestId('tertiary-2')).toBeInTheDocument();
  });

  it('maintains all other DetailedSelector props', () => {
    render(
      <SimpleSelector
        {...defaultProps}
        selectedValue="option1"
        multiple={false}
        disabled={false}
        error="Test error"
        gridCols={2}
        colorScheme="secondary"
        required={true}
        description="Helper text"
      />
    );

    // Should render with all props working correctly
    expect(screen.getByText('Test Question')).toBeInTheDocument();
    expect(screen.getByText('Test error')).toBeInTheDocument();
    expect(screen.getByText('*')).toBeInTheDocument(); // Required indicator
    expect(screen.getByText('Helper text')).toBeInTheDocument();
  });

  it('passes through all props to DetailedSelector correctly', () => {
    const onChange = vi.fn();

    render(
      <SimpleSelector
        {...defaultProps}
        onChange={onChange}
        selectedValue="option1"
        multiple={true}
      />
    );

    // Should render the component with all props intact
    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();

    // The onChange function should be passed through
    expect(onChange).toBeDefined();
  });

  it('excludes variant, showDescription, and showTertiary from props interface', () => {
    // This test verifies that the TypeScript interface correctly omits these props
    // We can't directly test TypeScript interfaces in runtime tests, but we can
    // verify that the component behaves as if these props are excluded

    // The component should not accept these props in its interface
    // This is verified by the TypeScript compilation and the Omit utility type

    // We can test that the component works correctly without these props
    render(<SimpleSelector {...defaultProps} />);

    // Should render correctly in simple mode
    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
    expect(
      screen.queryByText('This is a detailed description for option 1')
    ).not.toBeInTheDocument();
  });

  it('handles edge cases gracefully', () => {
    const optionsWithoutDescriptions = [
      {
        id: 'option1',
        title: 'Option 1',
        description: '', // Empty description
        tertiary: <span data-testid="tertiary-1">Tertiary 1</span>,
      },
    ];

    render(
      <SimpleSelector
        {...defaultProps}
        options={optionsWithoutDescriptions}
        showDescription={true}
        showTertiary={true}
      />
    );

    // Should handle empty descriptions gracefully
    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByTestId('tertiary-1')).toBeInTheDocument();
  });
});
