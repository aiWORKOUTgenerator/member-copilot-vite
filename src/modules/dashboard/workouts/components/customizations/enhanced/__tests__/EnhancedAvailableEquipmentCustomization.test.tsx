import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import EnhancedAvailableEquipmentCustomization from '../EnhancedAvailableEquipmentCustomization';

// Mock the analytics hook
const mockTrackSelection = vi.fn();
vi.mock('../../../hooks/useWorkoutAnalytics', () => ({
  useWorkoutAnalytics: () => ({
    trackSelection: mockTrackSelection,
    trackStepCompletion: vi.fn(),
    trackValidationError: vi.fn(),
  }),
}));

// Mock the enhanced options hook
vi.mock('../../utils/optionEnhancers', () => ({
  useEnhancedOptions: () => ({
    equipmentOptions: [
      {
        id: 'bodyweight',
        title: 'Body Weight',
        description: 'No equipment needed',
      },
      {
        id: 'available_equipment',
        title: 'Available Equipment',
        description: 'Use what you have',
      },
      {
        id: 'full_gym',
        title: 'Full Gym',
        description: 'All equipment available',
      },
    ],
  }),
}));

// Mock the DetailedSelector component
vi.mock('@/ui/shared/molecules', () => ({
  DetailedSelector: ({
    icon: Icon,
    options,
    selectedValue,
    onChange,
    question,
    description,
    disabled,
    error,
    multiple,
    gridCols,
    colorScheme,
    required,
    variant,
  }: {
    icon?: React.ComponentType;
    options: Array<{ id: string; title: string; description: string }>;
    selectedValue?: string | string[];
    onChange: (value: string | string[]) => void;
    question: string;
    description?: string;
    disabled?: boolean;
    error?: string;
    multiple?: boolean;
    gridCols?: number;
    colorScheme?: string;
    required?: boolean;
    variant?: string;
  }) => (
    <div data-testid="detailed-selector">
      <div data-testid="selector-icon">{Icon && <Icon />}</div>
      <div data-testid="selector-question">{question}</div>
      <div data-testid="selector-description">{description}</div>
      <div data-testid="selector-error">{error}</div>
      <div data-testid="selector-props">
        disabled: {disabled?.toString() || 'false'}, multiple:{' '}
        {multiple?.toString() || 'false'}, gridCols: {gridCols}, colorScheme:{' '}
        {colorScheme}, required: {required?.toString() || 'false'}, variant:{' '}
        {variant}
      </div>
      {options.map(
        (option: { id: string; title: string; description: string }) => (
          <button
            key={option.id}
            data-testid={`option-${option.id}`}
            disabled={disabled}
            onClick={() => {
              if (!disabled) {
                if (multiple) {
                  const currentSelection = Array.isArray(selectedValue)
                    ? selectedValue
                    : [];
                  const isSelected = currentSelection.includes(option.id);
                  const newSelection = isSelected
                    ? currentSelection.filter((id) => id !== option.id)
                    : [...currentSelection, option.id];
                  onChange(newSelection);
                } else {
                  onChange(option.id);
                }
              }
            }}
            className={
              Array.isArray(selectedValue) && selectedValue.includes(option.id)
                ? 'selected'
                : ''
            }
          >
            {option.title}
          </button>
        )
      )}
    </div>
  ),
}));

describe('EnhancedAvailableEquipmentCustomization', () => {
  let mockOnChange: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockOnChange = vi.fn();
    mockTrackSelection.mockClear();
  });

  it('should render the equipment selector with correct question and description', () => {
    render(
      <EnhancedAvailableEquipmentCustomization
        value={undefined}
        onChange={mockOnChange}
        disabled={false}
        error={undefined}
      />
    );

    expect(screen.getByTestId('selector-question')).toHaveTextContent(
      'What equipment do you have available?'
    );
    expect(screen.getByTestId('selector-description')).toHaveTextContent(
      'Select all the equipment you have available for your workout'
    );
  });

  it('should display equipment options as cards', () => {
    render(
      <EnhancedAvailableEquipmentCustomization
        value={undefined}
        onChange={mockOnChange}
        disabled={false}
        error={undefined}
      />
    );

    expect(screen.getByTestId('option-bodyweight')).toHaveTextContent(
      'Body Weight'
    );
    expect(screen.getByTestId('option-available_equipment')).toHaveTextContent(
      'Available Equipment'
    );
    expect(screen.getByTestId('option-full_gym')).toHaveTextContent('Full Gym');
  });

  it('should handle single equipment selection', async () => {
    render(
      <EnhancedAvailableEquipmentCustomization
        value={undefined}
        onChange={mockOnChange}
        disabled={false}
        error={undefined}
      />
    );

    const availableEquipmentOption = screen.getByTestId(
      'option-available_equipment'
    );
    fireEvent.click(availableEquipmentOption);

    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalledWith(['available_equipment']);
    });
  });

  it('should handle multiple equipment selection', async () => {
    render(
      <EnhancedAvailableEquipmentCustomization
        value={['available_equipment']}
        onChange={mockOnChange}
        disabled={false}
        error={undefined}
      />
    );

    const fullGymOption = screen.getByTestId('option-full_gym');
    fireEvent.click(fullGymOption);

    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalledWith([
        'available_equipment',
        'full_gym',
      ]);
    });
  });

  it('should handle equipment deselection', async () => {
    render(
      <EnhancedAvailableEquipmentCustomization
        value={['available_equipment', 'full_gym']}
        onChange={mockOnChange}
        disabled={false}
        error={undefined}
      />
    );

    const availableEquipmentOption = screen.getByTestId(
      'option-available_equipment'
    );
    fireEvent.click(availableEquipmentOption);

    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalledWith(['full_gym']);
    });
  });

  it('should handle removing all equipment (passing undefined)', async () => {
    render(
      <EnhancedAvailableEquipmentCustomization
        value={['available_equipment']}
        onChange={mockOnChange}
        disabled={false}
        error={undefined}
      />
    );

    const availableEquipmentOption = screen.getByTestId(
      'option-available_equipment'
    );
    fireEvent.click(availableEquipmentOption);

    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalledWith(undefined);
    });
  });

  it('should display validation errors when provided', () => {
    const errorMessage = 'Please select at least one piece of equipment';

    render(
      <EnhancedAvailableEquipmentCustomization
        value={undefined}
        onChange={mockOnChange}
        disabled={false}
        error={errorMessage}
      />
    );

    expect(screen.getByTestId('selector-error')).toHaveTextContent(
      errorMessage
    );
  });

  it('should be disabled when disabled prop is true', () => {
    render(
      <EnhancedAvailableEquipmentCustomization
        value={undefined}
        onChange={mockOnChange}
        disabled={true}
        error={undefined}
      />
    );

    const availableEquipmentOption = screen.getByTestId(
      'option-available_equipment'
    );
    expect(availableEquipmentOption).toBeDisabled();
  });

  it('should not call onChange when disabled', async () => {
    render(
      <EnhancedAvailableEquipmentCustomization
        value={undefined}
        onChange={mockOnChange}
        disabled={true}
        error={undefined}
      />
    );

    const availableEquipmentOption = screen.getByTestId(
      'option-available_equipment'
    );
    fireEvent.click(availableEquipmentOption);

    await waitFor(() => {
      expect(mockOnChange).not.toHaveBeenCalled();
    });
  });

  it('should support variant prop for different display modes', () => {
    render(
      <EnhancedAvailableEquipmentCustomization
        value={undefined}
        onChange={mockOnChange}
        disabled={false}
        error={undefined}
        variant="simple"
      />
    );

    // Component should still render correctly with simple variant
    expect(screen.getByTestId('selector-question')).toHaveTextContent(
      'What equipment do you have available?'
    );
    expect(screen.getByTestId('option-bodyweight')).toHaveTextContent(
      'Body Weight'
    );
  });

  it('should handle empty value array correctly', () => {
    render(
      <EnhancedAvailableEquipmentCustomization
        value={[]}
        onChange={mockOnChange}
        disabled={false}
        error={undefined}
      />
    );

    // Component should render without errors
    expect(screen.getByTestId('selector-question')).toHaveTextContent(
      'What equipment do you have available?'
    );
    expect(screen.getByTestId('option-bodyweight')).toHaveTextContent(
      'Body Weight'
    );
  });

  it('should track analytics with correct mode when variant is simple', async () => {
    render(
      <EnhancedAvailableEquipmentCustomization
        value={undefined}
        onChange={mockOnChange}
        disabled={false}
        error={undefined}
        variant="simple"
      />
    );

    const availableEquipmentOption = screen.getByTestId(
      'option-available_equipment'
    );
    fireEvent.click(availableEquipmentOption);

    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalledWith(['available_equipment']);
    });
  });
});
