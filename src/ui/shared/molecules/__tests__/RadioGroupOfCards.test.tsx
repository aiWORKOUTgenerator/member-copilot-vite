import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { RadioGroupOfCards } from '../RadioGroupOfCards';

// Mock items for testing
const mockItems = [
  {
    id: 'item1',
    title: 'Item 1',
    description: 'This is a description for item 1',
    tertiary: <span data-testid="tertiary-1">Tertiary 1</span>,
  },
  {
    id: 'item2',
    title: 'Item 2',
    description: 'This is a description for item 2',
    tertiary: <span data-testid="tertiary-2">Tertiary 2</span>,
  },
];

const defaultProps = {
  items: mockItems,
  onChange: vi.fn(),
  legend: 'Test Legend',
};

describe('RadioGroupOfCards', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders with descriptions and tertiary content by default', () => {
    render(<RadioGroupOfCards {...defaultProps} />);

    // Should show descriptions and tertiary content
    expect(
      screen.getByText('This is a description for item 1')
    ).toBeInTheDocument();
    expect(
      screen.getByText('This is a description for item 2')
    ).toBeInTheDocument();
    expect(screen.getByTestId('tertiary-1')).toBeInTheDocument();
    expect(screen.getByTestId('tertiary-2')).toBeInTheDocument();
  });

  it('hides descriptions when showDescription is false', () => {
    render(<RadioGroupOfCards {...defaultProps} showDescription={false} />);

    // Should hide descriptions but show tertiary content
    expect(
      screen.queryByText('This is a description for item 1')
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText('This is a description for item 2')
    ).not.toBeInTheDocument();
    expect(screen.getByTestId('tertiary-1')).toBeInTheDocument();
    expect(screen.getByTestId('tertiary-2')).toBeInTheDocument();
  });

  it('hides tertiary content when showTertiary is false', () => {
    render(<RadioGroupOfCards {...defaultProps} showTertiary={false} />);

    // Should show descriptions but hide tertiary content
    expect(
      screen.getByText('This is a description for item 1')
    ).toBeInTheDocument();
    expect(
      screen.getByText('This is a description for item 2')
    ).toBeInTheDocument();
    expect(screen.queryByTestId('tertiary-1')).not.toBeInTheDocument();
    expect(screen.queryByTestId('tertiary-2')).not.toBeInTheDocument();
  });

  it('hides both descriptions and tertiary content when both flags are false', () => {
    render(
      <RadioGroupOfCards
        {...defaultProps}
        showDescription={false}
        showTertiary={false}
      />
    );

    // Should hide both descriptions and tertiary content
    expect(
      screen.queryByText('This is a description for item 1')
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText('This is a description for item 2')
    ).not.toBeInTheDocument();
    expect(screen.queryByTestId('tertiary-1')).not.toBeInTheDocument();
    expect(screen.queryByTestId('tertiary-2')).not.toBeInTheDocument();

    // Should still show titles
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
  });

  it('handles items without descriptions gracefully', () => {
    const itemsWithoutDescriptions = [
      {
        id: 'item1',
        title: 'Item 1',
        description: '', // Empty description
        tertiary: <span data-testid="tertiary-1">Tertiary 1</span>,
      },
    ];

    render(
      <RadioGroupOfCards
        {...defaultProps}
        items={itemsWithoutDescriptions}
        showDescription={true}
      />
    );

    // Should not render empty description paragraph
    // Check that no description paragraph exists (since description is empty)
    const descriptionParagraphs = screen.queryAllByText('', { selector: 'p' });
    expect(descriptionParagraphs.length).toBe(0);
    expect(screen.getByTestId('tertiary-1')).toBeInTheDocument();
  });

  it('handles items without tertiary content gracefully', () => {
    const itemsWithoutTertiary = [
      {
        id: 'item1',
        title: 'Item 1',
        description: 'This is a description',
        tertiary: undefined, // No tertiary content
      },
    ];

    render(
      <RadioGroupOfCards
        {...defaultProps}
        items={itemsWithoutTertiary}
        showTertiary={true}
      />
    );

    // Should show description but not render tertiary section
    expect(screen.getByText('This is a description')).toBeInTheDocument();
    expect(screen.queryByTestId('tertiary-1')).not.toBeInTheDocument();
  });

  it('maintains existing functionality for selection', () => {
    render(<RadioGroupOfCards {...defaultProps} />);

    // Click on first item
    const firstItem = screen.getByText('Item 1').closest('.card');
    fireEvent.click(firstItem!);

    expect(defaultProps.onChange).toHaveBeenCalledWith(mockItems[0]);
  });

  it('maintains existing functionality for multiple selection', () => {
    render(<RadioGroupOfCards {...defaultProps} multiple={true} />);

    // Click on first item
    const firstItem = screen.getByText('Item 1').closest('.card');
    fireEvent.click(firstItem!);

    expect(defaultProps.onChange).toHaveBeenCalledWith([mockItems[0]]);
  });
});
