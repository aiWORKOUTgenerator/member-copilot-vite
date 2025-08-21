import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { RadioGroupOfCards, SelectableItem } from '../RadioGroupOfCards';

describe('RadioGroupOfCards', () => {
  const mockItems: SelectableItem[] = [
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

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders with descriptions and tertiary content by default', () => {
    render(<RadioGroupOfCards {...defaultProps} />);

    // Should show legend
    expect(screen.getByText('Test Legend')).toBeInTheDocument();

    // Should show all items with titles
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();

    // Should show descriptions by default
    expect(
      screen.getByText('This is a description for item 1')
    ).toBeInTheDocument();
    expect(
      screen.getByText('This is a description for item 2')
    ).toBeInTheDocument();

    // Should show tertiary content by default
    expect(screen.getByTestId('tertiary-1')).toBeInTheDocument();
    expect(screen.getByTestId('tertiary-2')).toBeInTheDocument();
  });

  it('hides descriptions when showDescription is false', () => {
    render(<RadioGroupOfCards {...defaultProps} showDescription={false} />);

    // Should hide descriptions
    expect(
      screen.queryByText('This is a description for item 1')
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText('This is a description for item 2')
    ).not.toBeInTheDocument();

    // Should still show titles and tertiary content
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
    expect(screen.getByTestId('tertiary-1')).toBeInTheDocument();
    expect(screen.getByTestId('tertiary-2')).toBeInTheDocument();
  });

  it('hides tertiary content when showTertiary is false', () => {
    render(<RadioGroupOfCards {...defaultProps} showTertiary={false} />);

    // Should hide tertiary content
    expect(screen.queryByTestId('tertiary-1')).not.toBeInTheDocument();
    expect(screen.queryByTestId('tertiary-2')).not.toBeInTheDocument();

    // Should still show titles and descriptions
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
    expect(
      screen.getByText('This is a description for item 1')
    ).toBeInTheDocument();
    expect(
      screen.getByText('This is a description for item 2')
    ).toBeInTheDocument();
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

    // Click on first item - find the Card component that contains the text
    const firstItem = screen.getByText('Item 1').closest('[role="button"]');
    fireEvent.click(firstItem!);

    expect(defaultProps.onChange).toHaveBeenCalledWith(mockItems[0]);
  });

  it('maintains existing functionality for multiple selection', () => {
    render(<RadioGroupOfCards {...defaultProps} multiple={true} />);

    // Click on first item - find the Card component that contains the text
    const firstItem = screen.getByText('Item 1').closest('[role="button"]');
    fireEvent.click(firstItem!);

    expect(defaultProps.onChange).toHaveBeenCalledWith([mockItems[0]]);
  });
});
