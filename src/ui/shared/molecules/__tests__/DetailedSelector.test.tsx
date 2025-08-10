import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DetailedSelector } from '../DetailedSelector';
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

describe('DetailedSelector', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders with detailed variant by default', () => {
    render(<DetailedSelector {...defaultProps} />);

    // Should show descriptions and tertiary content
    expect(
      screen.getByText('This is a detailed description for option 1')
    ).toBeInTheDocument();
    expect(
      screen.getByText('This is a detailed description for option 2')
    ).toBeInTheDocument();
    expect(screen.getByTestId('tertiary-1')).toBeInTheDocument();
    expect(screen.getByTestId('tertiary-2')).toBeInTheDocument();
  });

  it('renders with simple variant hiding descriptions and tertiary content', () => {
    render(<DetailedSelector {...defaultProps} variant="simple" />);

    // Should hide descriptions and tertiary content
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

  it('allows explicit override of showDescription in simple variant', () => {
    render(
      <DetailedSelector
        {...defaultProps}
        variant="simple"
        showDescription={true}
      />
    );

    // Should show descriptions even in simple variant
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

  it('allows explicit override of showTertiary in simple variant', () => {
    render(
      <DetailedSelector
        {...defaultProps}
        variant="simple"
        showTertiary={true}
      />
    );

    // Should hide descriptions in simple variant
    expect(
      screen.queryByText('This is a detailed description for option 1')
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText('This is a detailed description for option 2')
    ).not.toBeInTheDocument();

    // Should show tertiary content even in simple variant
    expect(screen.getByTestId('tertiary-1')).toBeInTheDocument();
    expect(screen.getByTestId('tertiary-2')).toBeInTheDocument();
  });

  it('allows explicit override of both flags in detailed variant', () => {
    render(
      <DetailedSelector
        {...defaultProps}
        variant="detailed"
        showDescription={false}
        showTertiary={false}
      />
    );

    // Should hide descriptions and tertiary content even in detailed variant
    expect(
      screen.queryByText('This is a detailed description for option 1')
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText('This is a detailed description for option 2')
    ).not.toBeInTheDocument();
    expect(screen.queryByTestId('tertiary-1')).not.toBeInTheDocument();
    expect(screen.queryByTestId('tertiary-2')).not.toBeInTheDocument();
  });

  it('maintains backward compatibility with existing props', () => {
    render(
      <DetailedSelector
        {...defaultProps}
        selectedValue="option1"
        multiple={false}
        disabled={false}
        error="Test error"
        gridCols={2}
        colorScheme="secondary"
        required={true}
      />
    );

    // Should render with all existing props working
    expect(screen.getByText('Test Question')).toBeInTheDocument();
    expect(screen.getByText('Test error')).toBeInTheDocument();
    expect(screen.getByText('*')).toBeInTheDocument(); // Required indicator
  });
});
