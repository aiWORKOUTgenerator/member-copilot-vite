import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useSelectionSummary } from '../useSelectionSummary';
import type { PerWorkoutOptions } from '../../components/types';

describe('useSelectionSummary', () => {
  it('returns empty selections for empty options', () => {
    const { result } = renderHook(() => useSelectionSummary({}));

    expect(result.current.selections).toEqual([]);
    expect(result.current.hasSelections).toBe(false);
  });

  it('formats focus selection correctly', () => {
    const options: PerWorkoutOptions = {
      customization_focus: 'core_abs',
    };

    const { result } = renderHook(() => useSelectionSummary(options));

    expect(result.current.selections).toHaveLength(1);
    expect(result.current.selections[0]).toMatchObject({
      key: 'focus',
      label: 'Focus',
      value: 'Core Abs',
    });
    expect(result.current.hasSelections).toBe(true);
  });

  it('formats energy selection correctly', () => {
    const options: PerWorkoutOptions = {
      customization_energy: 4,
    };

    const { result } = renderHook(() => useSelectionSummary(options));

    expect(result.current.selections).toHaveLength(1);
    expect(result.current.selections[0]).toMatchObject({
      key: 'energy',
      label: 'Energy',
      value: 'High (4/5)',
    });
  });

  it('handles invalid energy values safely', () => {
    const options: PerWorkoutOptions = {
      customization_energy: 10, // Invalid value outside 1-5 range
    };

    const { result } = renderHook(() => useSelectionSummary(options));

    expect(result.current.selections).toHaveLength(1);
    expect(result.current.selections[0]).toMatchObject({
      key: 'energy',
      label: 'Energy',
      value: 'Energy Level 10', // Fallback for invalid values
    });
  });

  it('formats duration selection correctly', () => {
    const options: PerWorkoutOptions = {
      customization_duration: 30,
    };

    const { result } = renderHook(() => useSelectionSummary(options));

    expect(result.current.selections).toHaveLength(1);
    expect(result.current.selections[0]).toMatchObject({
      key: 'duration',
      label: 'Duration',
      value: '30 min',
    });
  });

  it('formats duration in hours correctly', () => {
    const options: PerWorkoutOptions = {
      customization_duration: 90,
    };

    const { result } = renderHook(() => useSelectionSummary(options));

    expect(result.current.selections[0].value).toBe('1h 30m');
  });

  it('formats equipment selection correctly', () => {
    const options: PerWorkoutOptions = {
      customization_equipment: ['dumbbells'],
    };

    const { result } = renderHook(() => useSelectionSummary(options));

    expect(result.current.selections).toHaveLength(1);
    expect(result.current.selections[0]).toMatchObject({
      key: 'equipment',
      label: 'Equipment',
      value: 'Dumbbells',
    });
  });

  it('formats multiple equipment items correctly', () => {
    const options: PerWorkoutOptions = {
      customization_equipment: ['dumbbells', 'resistance_bands'],
    };

    const { result } = renderHook(() => useSelectionSummary(options));

    expect(result.current.selections[0].value).toBe('2 items');
  });

  it('handles multiple selections', () => {
    const options: PerWorkoutOptions = {
      customization_focus: 'core_abs',
      customization_energy: 3,
      customization_duration: 20,
      customization_equipment: ['bodyweight_only'],
    };

    const { result } = renderHook(() => useSelectionSummary(options));

    expect(result.current.selections).toHaveLength(4);
    expect(result.current.hasSelections).toBe(true);

    const keys = result.current.selections.map((s) => s.key);
    expect(keys).toEqual(['focus', 'energy', 'duration', 'equipment']);
  });

  it('uses custom formatters when provided', () => {
    const options: PerWorkoutOptions = {
      customization_focus: 'core_abs',
    };

    const customFormatters = {
      focus: () => 'Custom Focus Format',
    };

    const { result } = renderHook(() =>
      useSelectionSummary(options, customFormatters)
    );

    expect(result.current.selections[0].value).toBe('Custom Focus Format');
  });
});
