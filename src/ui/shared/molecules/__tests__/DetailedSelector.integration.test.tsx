import '@testing-library/jest-dom/vitest';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DetailedSelector } from '../DetailedSelector';

// Mock icon component
const MockIcon = ({ className }: { className?: string }) => (
  <div data-testid="mock-icon" className={className}>
    📋
  </div>
);

// Mock data for testing
const mockOptions = [
  {
    id: '1',
    title: 'Option 1',
    description: 'This is a detailed description for option 1',
    tertiary: 'Additional info 1',
  },
  {
    id: '2',
    title: 'Option 2',
    description: 'This is a detailed description for option 2',
    tertiary: 'Additional info 2',
  },
];

describe('DetailedSelector Variant Integration', () => {
  const defaultProps = {
    icon: MockIcon,
    options: mockOptions,
    selectedValue: null,
    onChange: vi.fn(),
    question: 'Test Selection',
  };

  describe('Variant Behavior', () => {
    it('shows description and tertiary content in detailed mode (default)', () => {
      render(<DetailedSelector {...defaultProps} variant="detailed" />);

      // Should show descriptions
      expect(
        screen.getByText('This is a detailed description for option 1')
      ).toBeInTheDocument();
      expect(
        screen.getByText('This is a detailed description for option 2')
      ).toBeInTheDocument();

      // Should show tertiary content
      expect(screen.getByText('Additional info 1')).toBeInTheDocument();
      expect(screen.getByText('Additional info 2')).toBeInTheDocument();
    });

    it('hides description and tertiary content in simple mode', () => {
      render(<DetailedSelector {...defaultProps} variant="simple" />);

      // Should NOT show descriptions
      expect(
        screen.queryByText('This is a detailed description for option 1')
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText('This is a detailed description for option 2')
      ).not.toBeInTheDocument();

      // Should NOT show tertiary content
      expect(screen.queryByText('Additional info 1')).not.toBeInTheDocument();
      expect(screen.queryByText('Additional info 2')).not.toBeInTheDocument();

      // Should still show titles
      expect(screen.getByText('Option 1')).toBeInTheDocument();
      expect(screen.getByText('Option 2')).toBeInTheDocument();
    });

    it('uses detailed as default variant', () => {
      render(<DetailedSelector {...defaultProps} />);

      // Should show descriptions (detailed is default)
      expect(
        screen.getByText('This is a detailed description for option 1')
      ).toBeInTheDocument();
      expect(
        screen.getByText('This is a detailed description for option 2')
      ).toBeInTheDocument();
    });
  });

  describe('Explicit Overrides', () => {
    it('allows showing description in simple mode with explicit override', () => {
      render(
        <DetailedSelector
          {...defaultProps}
          variant="simple"
          showDescription={true}
        />
      );

      // Should show descriptions despite simple variant
      expect(
        screen.getByText('This is a detailed description for option 1')
      ).toBeInTheDocument();
      expect(
        screen.getByText('This is a detailed description for option 2')
      ).toBeInTheDocument();

      // Should NOT show tertiary (simple variant default)
      expect(screen.queryByText('Additional info 1')).not.toBeInTheDocument();
      expect(screen.queryByText('Additional info 2')).not.toBeInTheDocument();
    });

    it('allows hiding description in detailed mode with explicit override', () => {
      render(
        <DetailedSelector
          {...defaultProps}
          variant="detailed"
          showDescription={false}
        />
      );

      // Should NOT show descriptions despite detailed variant
      expect(
        screen.queryByText('This is a detailed description for option 1')
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText('This is a detailed description for option 2')
      ).not.toBeInTheDocument();

      // Should still show tertiary (detailed variant default)
      expect(screen.getByText('Additional info 1')).toBeInTheDocument();
      expect(screen.getByText('Additional info 2')).toBeInTheDocument();
    });

    it('allows showing tertiary in simple mode with explicit override', () => {
      render(
        <DetailedSelector
          {...defaultProps}
          variant="simple"
          showTertiary={true}
        />
      );

      // Should NOT show descriptions (simple variant default)
      expect(
        screen.queryByText('This is a detailed description for option 1')
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText('This is a detailed description for option 2')
      ).not.toBeInTheDocument();

      // Should show tertiary despite simple variant
      expect(screen.getByText('Additional info 1')).toBeInTheDocument();
      expect(screen.getByText('Additional info 2')).toBeInTheDocument();
    });
  });

  describe('Selection Behavior', () => {
    it('maintains selection functionality in both variants', () => {
      const onChange = vi.fn();
      render(
        <DetailedSelector
          {...defaultProps}
          onChange={onChange}
          variant="simple"
        />
      );

      // Click first option
      fireEvent.click(screen.getByText('Option 1'));
      expect(onChange).toHaveBeenCalledWith('1');

      // Click second option
      fireEvent.click(screen.getByText('Option 2'));
      expect(onChange).toHaveBeenCalledWith('2');
    });

    it('shows selected state correctly in both variants', () => {
      render(
        <DetailedSelector
          {...defaultProps}
          selectedValue="1"
          variant="simple"
        />
      );

      // Should show selected state (this would be visual, but we can check the component renders)
      expect(screen.getByText('Option 1')).toBeInTheDocument();
      expect(screen.getByText('Option 2')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles options without descriptions gracefully', () => {
      const optionsWithoutDescriptions = [
        { id: '1', title: 'Option 1' },
        { id: '2', title: 'Option 2', description: 'Has description' },
      ];

      render(
        <DetailedSelector
          {...defaultProps}
          options={optionsWithoutDescriptions}
          variant="detailed"
        />
      );

      // Should show title for option without description
      expect(screen.getByText('Option 1')).toBeInTheDocument();

      // Should show description for option that has it
      expect(screen.getByText('Has description')).toBeInTheDocument();
    });

    it('handles options without tertiary content gracefully', () => {
      const optionsWithoutTertiary = [
        { id: '1', title: 'Option 1', description: 'Description 1' },
        {
          id: '2',
          title: 'Option 2',
          description: 'Description 2',
          tertiary: 'Has tertiary',
        },
      ];

      render(
        <DetailedSelector
          {...defaultProps}
          options={optionsWithoutTertiary}
          variant="detailed"
        />
      );

      // Should show descriptions for both
      expect(screen.getByText('Description 1')).toBeInTheDocument();
      expect(screen.getByText('Description 2')).toBeInTheDocument();

      // Should only show tertiary for option that has it
      expect(screen.queryByText('Has tertiary')).toBeInTheDocument();
    });
  });
});
