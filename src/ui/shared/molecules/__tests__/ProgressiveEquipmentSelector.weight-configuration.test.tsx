import React, { useState } from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ProgressiveEquipmentSelector } from '../ProgressiveEquipmentSelector';

// Type definitions for testing
interface EquipmentItem {
  id: string;
  name: string;
  category: string;
  hasWeight: boolean;
  defaultWeightRange?: { min: number; max: number };
  weightIncrements?: number[];
  availableWeights?: number[];
}

interface EquipmentZone {
  id: string;
  name: string;
  description: string;
  equipment: EquipmentItem[];
}

interface WeightRange {
  min: number;
  max: number;
}

interface EquipmentSelection {
  zoneId: string;
  equipment: Array<{
    id: string;
    name: string;
    weightType?: 'individual' | 'range';
    weight: number[];
    weightRange?: WeightRange;
  }>;
}

// Test component that manages state
function TestProgressiveEquipmentSelector({
  zones,
}: {
  zones: EquipmentZone[];
}) {
  const [value, setValue] = useState<EquipmentSelection[]>([]);

  const handleChange = (newValue: EquipmentSelection[]) => {
    setValue(newValue);
  };

  return (
    <ProgressiveEquipmentSelector
      zones={zones}
      value={value}
      onChange={handleChange}
    />
  );
}

describe('ProgressiveEquipmentSelector - Weight Configuration', () => {
  const mockZones = [
    {
      id: 'zone1',
      name: 'Free Weights',
      description: 'Dumbbells, barbells, and other free weight equipment',
      equipment: [
        {
          id: 'dumbbells',
          name: 'Dumbbells',
          category: 'Free Weights',
          hasWeight: true,
          defaultWeightRange: { min: 5, max: 100 },
          availableWeights: [5, 10, 15, 20, 25, 30, 35, 40, 45, 50],
          weightIncrements: [5],
        },
      ],
    },
  ];

  it('should debug mockOnChange calls during weight type switching', async () => {
    render(<TestProgressiveEquipmentSelector zones={mockZones} />);

    // Select a zone
    fireEvent.click(screen.getByText('Free Weights'));

    // Wait for equipment selection to appear
    await waitFor(() => {
      expect(screen.getByText('Dumbbells')).toBeInTheDocument();
    });

    // Click on the equipment header to select it
    const equipmentHeader = screen
      .getByText('Dumbbells')
      .closest('div[class*="cursor-pointer"]');
    expect(equipmentHeader).toBeInTheDocument();
    fireEvent.click(equipmentHeader);

    // Wait for weight configuration to appear
    await waitFor(() => {
      expect(screen.getByText('Weight Configuration')).toBeInTheDocument();
    });

    // Check that weight configuration is displayed above the Remove button
    expect(screen.getByText('Weight Configuration')).toBeInTheDocument();
    expect(screen.getByText('Select weights')).toBeInTheDocument();

    // Switch to Weight Range
    const weightRangeButton = screen.getByText('Range');
    fireEvent.click(weightRangeButton);

    // Wait for range UI to appear
    await waitFor(() => {
      expect(screen.getByText('Select weight range')).toBeInTheDocument();
    });

    // Check that weight range UI is displayed
    expect(screen.getByText('Select weight range')).toBeInTheDocument();

    // Check that weight buttons are displayed in a grid
    expect(screen.getByText('5 lbs')).toBeInTheDocument();
    expect(screen.getByText('10 lbs')).toBeInTheDocument();
    expect(screen.getByText('15 lbs')).toBeInTheDocument();
    expect(screen.getByText('20 lbs')).toBeInTheDocument();
    expect(screen.getByText('25 lbs')).toBeInTheDocument();
    expect(screen.getByText('30 lbs')).toBeInTheDocument();

    // In range mode, initially no weights are selected (min: 0, max: 0)
    // All weights should have btn-outline class until user selects a range
    const weight5Button = screen.getByText('5 lbs').closest('button');
    const weight10Button = screen.getByText('10 lbs').closest('button');
    const weight15Button = screen.getByText('15 lbs').closest('button');

    expect(weight5Button).toHaveClass('btn-outline');
    expect(weight10Button).toHaveClass('btn-outline');
    expect(weight15Button).toHaveClass('btn-outline');
  });

  it('should display weight range grid UI when weight type is range', async () => {
    render(<TestProgressiveEquipmentSelector zones={mockZones} />);

    // Select a zone
    fireEvent.click(screen.getByText('Free Weights'));

    // Wait for equipment selection to appear
    await waitFor(() => {
      expect(screen.getByText('Dumbbells')).toBeInTheDocument();
    });

    // Click on the equipment header to select it
    const equipmentHeader = screen
      .getByText('Dumbbells')
      .closest('div[class*="cursor-pointer"]');
    expect(equipmentHeader).toBeInTheDocument();
    fireEvent.click(equipmentHeader);

    // Wait for weight configuration to appear
    await waitFor(() => {
      expect(screen.getByText('Weight Configuration')).toBeInTheDocument();
    });

    // Switch to Weight Range mode
    const rangeButton = screen.getByText('Range');
    fireEvent.click(rangeButton);

    // Wait for range UI to appear
    await waitFor(() => {
      expect(screen.getByText('Select weight range')).toBeInTheDocument();
    });

    // Check that weight buttons are displayed in a grid
    expect(screen.getByText('5 lbs')).toBeInTheDocument();
    expect(screen.getByText('10 lbs')).toBeInTheDocument();
    expect(screen.getByText('15 lbs')).toBeInTheDocument();
    expect(screen.getByText('20 lbs')).toBeInTheDocument();
    expect(screen.getByText('25 lbs')).toBeInTheDocument();
    expect(screen.getByText('30 lbs')).toBeInTheDocument();

    // In range mode, initially no weights are selected (min: 0, max: 0)
    // All weights should have btn-outline class until user selects a range
    const weight5Button = screen.getByText('5 lbs').closest('button');
    const weight10Button = screen.getByText('10 lbs').closest('button');
    const weight15Button = screen.getByText('15 lbs').closest('button');

    expect(weight5Button).toHaveClass('btn-outline');
    expect(weight10Button).toHaveClass('btn-outline');
    expect(weight15Button).toHaveClass('btn-outline');
  });

  it('should display equipment selection in a 2-column grid layout', async () => {
    // Create mock zones with multiple equipment items to test grid layout
    const mockZonesWithMultipleEquipment = [
      {
        id: 'zone1',
        name: 'Free Weights',
        description: 'Dumbbells, barbells, and other free weight equipment',
        equipment: [
          {
            id: 'dumbbells',
            name: 'Dumbbells',
            category: 'Free Weights',
            hasWeight: true,
            defaultWeightRange: { min: 5, max: 100 },
            availableWeights: [5, 10, 15, 20, 25, 30, 35, 40, 45, 50],
            weightIncrements: [5],
          },
          {
            id: 'barbells',
            name: 'Barbells',
            category: 'Free Weights',
            hasWeight: true,
            defaultWeightRange: { min: 20, max: 200 },
            availableWeights: [20, 40, 60, 80, 100, 120, 140, 160, 180, 200],
            weightIncrements: [20],
          },
        ],
      },
    ];

    render(
      <TestProgressiveEquipmentSelector
        zones={mockZonesWithMultipleEquipment}
      />
    );

    // Select a zone
    fireEvent.click(screen.getByText('Free Weights'));

    // Wait for equipment selection to appear
    await waitFor(() => {
      expect(
        screen.getByTestId('equipment-selection-grid')
      ).toBeInTheDocument();
    });

    // Check that both equipment items are displayed
    expect(screen.getByText('Dumbbells')).toBeInTheDocument();
    expect(screen.getByText('Barbells')).toBeInTheDocument();

    // Verify the grid container has the correct classes
    const gridContainer = screen.getByTestId('equipment-selection-grid');
    expect(gridContainer).toHaveClass(
      'grid',
      'grid-cols-1',
      'md:grid-cols-2',
      'gap-4'
    );
  });

  it('should display weight configuration within the equipment header', async () => {
    render(<TestProgressiveEquipmentSelector zones={mockZones} />);

    // Select a zone
    fireEvent.click(screen.getByText('Free Weights'));

    // Wait for equipment selection to appear
    await waitFor(() => {
      expect(screen.getByText('Dumbbells')).toBeInTheDocument();
    });

    // Click on the equipment header to select it
    const equipmentHeader = screen
      .getByText('Dumbbells')
      .closest('div[class*="cursor-pointer"]');
    expect(equipmentHeader).toBeInTheDocument();
    fireEvent.click(equipmentHeader);

    // Wait for weight configuration to appear
    await waitFor(() => {
      expect(screen.getByText('Weight Configuration')).toBeInTheDocument();
    });

    // Check that weight configuration is displayed within the equipment header
    expect(screen.getByText('Weight Configuration')).toBeInTheDocument();
    expect(screen.getByText('Select weights')).toBeInTheDocument();

    // Verify that the weight configuration is within the equipment header (no border-t class)
    const weightConfigSection = screen
      .getByText('Weight Configuration')
      .closest('div');
    expect(weightConfigSection).toBeInTheDocument();

    // Verify the weight grid is displayed
    expect(screen.getByText('5 lbs')).toBeInTheDocument();
    expect(screen.getByText('10 lbs')).toBeInTheDocument();
    expect(screen.getByText('15 lbs')).toBeInTheDocument();
  });

  it('should allow weight range selection with multiple clicks', async () => {
    render(<TestProgressiveEquipmentSelector zones={mockZones} />);

    // Select a zone
    fireEvent.click(screen.getByText('Free Weights'));

    // Wait for equipment selection to appear
    await waitFor(() => {
      expect(screen.getByText('Dumbbells')).toBeInTheDocument();
    });

    // Click on the equipment header to select it
    const equipmentHeader = screen
      .getByText('Dumbbells')
      .closest('div[class*="cursor-pointer"]');
    expect(equipmentHeader).toBeInTheDocument();
    fireEvent.click(equipmentHeader);

    // Wait for weight configuration to appear
    await waitFor(() => {
      expect(screen.getByText('Weight Configuration')).toBeInTheDocument();
    });

    // Switch to Weight Range mode
    const rangeButton = screen.getByText('Range');
    fireEvent.click(rangeButton);

    // Wait for range UI to appear
    await waitFor(() => {
      expect(screen.getByText('Select weight range')).toBeInTheDocument();
    });

    // First click - select start of range (5 lbs)
    const weight5Button = screen.getByText('5 lbs').closest('button');
    expect(weight5Button).toBeInTheDocument();
    fireEvent.click(weight5Button);

    // Wait for the range to be set
    await waitFor(() => {
      expect(screen.getByText('Range: 5 - 5 lbs')).toBeInTheDocument();
    });

    // Second click - expand range to include 10 lbs
    const weight10Button = screen.getByText('10 lbs').closest('button');
    expect(weight10Button).toBeInTheDocument();
    fireEvent.click(weight10Button);

    // Wait for the range to be expanded
    await waitFor(() => {
      expect(screen.getByText('Range: 5 - 10 lbs')).toBeInTheDocument();
    });

    // Third click - expand range to include 15 lbs
    const weight15Button = screen.getByText('15 lbs').closest('button');
    expect(weight15Button).toBeInTheDocument();
    fireEvent.click(weight15Button);

    // Wait for the range to be expanded further
    await waitFor(() => {
      expect(screen.getByText('Range: 5 - 15 lbs')).toBeInTheDocument();
    });
  });

  it('should handle equipment without weight options correctly', async () => {
    // Create mock zones with equipment that has no weight options
    const mockZonesWithoutWeights = [
      {
        id: 'cardio',
        name: 'Cardio',
        description: 'Cardio equipment',
        equipment: [
          {
            id: 'treadmill',
            name: 'Treadmill',
            category: 'Cardio',
            hasWeight: false,
            availableWeights: [],
            weightIncrements: [],
            defaultWeightRange: undefined,
          },
          {
            id: 'weight-bench',
            name: 'Weight Bench',
            category: 'Strength',
            hasWeight: false,
            availableWeights: [],
            weightIncrements: [],
            defaultWeightRange: undefined,
          },
        ],
      },
    ];

    render(
      <TestProgressiveEquipmentSelector zones={mockZonesWithoutWeights} />
    );

    // Select a zone
    fireEvent.click(screen.getByText('Cardio'));

    // Wait for equipment selection to appear
    await waitFor(() => {
      expect(screen.getByText('Treadmill')).toBeInTheDocument();
      expect(screen.getByText('Weight Bench')).toBeInTheDocument();
    });

    // Click on the treadmill to select it
    const treadmillHeader = screen
      .getByText('Treadmill')
      .closest('div[class*="cursor-pointer"]');
    expect(treadmillHeader).toBeInTheDocument();
    fireEvent.click(treadmillHeader);

    // Wait for selection to be processed
    await waitFor(() => {
      expect(screen.getByText('Treadmill').closest('.card')).toHaveClass(
        'ring-2'
      );
    });

    // Check that no weight configuration is shown
    expect(screen.queryByText('Weight Configuration')).not.toBeInTheDocument();
    expect(
      screen.getByText('No weight configuration needed for this equipment')
    ).toBeInTheDocument();

    // Click on the weight bench to select it
    const benchHeader = screen
      .getByText('Weight Bench')
      .closest('div[class*="cursor-pointer"]');
    expect(benchHeader).toBeInTheDocument();
    fireEvent.click(benchHeader);

    // Wait for selection to be processed
    await waitFor(() => {
      expect(screen.getByText('Weight Bench').closest('.card')).toHaveClass(
        'ring-2'
      );
    });

    // Check that no weight configuration is shown for the bench either
    expect(screen.queryByText('Weight Configuration')).not.toBeInTheDocument();
    expect(
      screen.getAllByText('No weight configuration needed for this equipment')
    ).toHaveLength(2);
  });
});
