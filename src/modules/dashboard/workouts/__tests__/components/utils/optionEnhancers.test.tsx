/**
 * Unit tests for option enhancers utility
 */

import React from 'react';
import { render } from '@testing-library/react';
import {
  getCachedEnhancedOptions,
  clearOptionsCache,
  enhanceFocusOptionsWithIntensity,
  enhanceDetailedWorkoutFocusOptions,
  enhanceEnergyOptionsWithDots,
  enhanceDurationOptionsWithSubtitles,
  enhanceDetailedDurationOptionsWithSubtitles,
  enhanceEquipmentOptions,
  enhanceFocusAreaOptions,
  enhanceSleepQualityOptions,
  enhanceStressLevelOptions,
  enhanceSorenessAreaOptions,
  getCacheStats,
} from '../../../components/utils/optionEnhancers';

import { vi } from 'vitest';

// Mock the LevelDots component
vi.mock('@/ui/shared/atoms', () => ({
  LevelDots: ({
    count,
    activeIndex,
    size,
  }: {
    count: number;
    activeIndex: number;
    size: string;
  }) => (
    <div
      data-testid="level-dots"
      data-count={count}
      data-active={activeIndex}
      data-size={size}
    >
      LevelDots
    </div>
  ),
}));

describe('getCachedEnhancedOptions', () => {
  beforeEach(() => {
    clearOptionsCache();
  });

  it('should cache and return the same result', () => {
    const enhancer = vi.fn(() => [{ id: '1', title: 'Test' }]);

    const result1 = getCachedEnhancedOptions('test-key', enhancer);
    const result2 = getCachedEnhancedOptions('test-key', enhancer);

    expect(result1).toBe(result2); // Same reference
    expect(enhancer).toHaveBeenCalledTimes(1); // Only called once
  });

  it('should call enhancer for different keys', () => {
    const enhancer1 = vi.fn(() => [{ id: '1', title: 'Test1' }]);
    const enhancer2 = vi.fn(() => [{ id: '2', title: 'Test2' }]);

    getCachedEnhancedOptions('key1', enhancer1);
    getCachedEnhancedOptions('key2', enhancer2);

    expect(enhancer1).toHaveBeenCalledTimes(1);
    expect(enhancer2).toHaveBeenCalledTimes(1);
  });
});

describe('clearOptionsCache', () => {
  it('should clear the cache', () => {
    // Clear cache first to ensure clean state
    clearOptionsCache();

    const enhancer = vi.fn(() => [{ id: '1', title: 'Test' }]);

    getCachedEnhancedOptions('test-key', enhancer);
    expect(getCacheStats().size).toBe(1);

    clearOptionsCache();
    expect(getCacheStats().size).toBe(0);

    // Should call enhancer again after cache is cleared
    getCachedEnhancedOptions('test-key', enhancer);
    expect(enhancer).toHaveBeenCalledTimes(2);
  });
});

describe('getCacheStats', () => {
  beforeEach(() => {
    clearOptionsCache();
  });

  it('should return cache statistics', () => {
    expect(getCacheStats()).toEqual({ size: 0, keys: [] });

    getCachedEnhancedOptions('key1', () => []);
    getCachedEnhancedOptions('key2', () => []);

    const stats = getCacheStats();
    expect(stats.size).toBe(2);
    expect(stats.keys).toContain('key1');
    expect(stats.keys).toContain('key2');
  });
});

describe('Quick Mode Option Enhancers', () => {
  beforeEach(() => {
    clearOptionsCache();
  });

  describe('enhanceFocusOptionsWithIntensity', () => {
    it('should enhance focus options with intensity indicators', () => {
      const enhanced = enhanceFocusOptionsWithIntensity();

      expect(enhanced).toHaveLength(6); // All focus options

      // Check that each option has tertiary content (LevelDots)
      enhanced.forEach((option) => {
        expect(option).toHaveProperty('id');
        expect(option).toHaveProperty('title');
        expect(option).toHaveProperty('description');
        expect(option).toHaveProperty('tertiary');
        expect(React.isValidElement(option.tertiary)).toBe(true);
      });
    });

    it('should assign correct intensity levels', () => {
      const enhanced = enhanceFocusOptionsWithIntensity();

      const gentleRecovery = enhanced.find(
        (opt) => opt.id === 'gentle_recovery'
      );
      const quickSweat = enhanced.find((opt) => opt.id === 'quick_sweat');

      expect(gentleRecovery).toBeDefined();
      expect(quickSweat).toBeDefined();

      // Render the tertiary content to check intensity levels
      const { container: gentleContainer } = render(
        gentleRecovery!.tertiary as React.ReactElement
      );
      const { container: quickContainer } = render(
        quickSweat!.tertiary as React.ReactElement
      );

      const gentleDots = gentleContainer.querySelector(
        '[data-testid="level-dots"]'
      );
      const quickDots = quickContainer.querySelector(
        '[data-testid="level-dots"]'
      );

      expect(gentleDots?.getAttribute('data-active')).toBe('1'); // Low intensity (index 1)
      expect(quickDots?.getAttribute('data-active')).toBe('5'); // High intensity (index 5)
    });

    it('should use cache', () => {
      const result1 = enhanceFocusOptionsWithIntensity();
      const result2 = enhanceFocusOptionsWithIntensity();

      expect(result1).toBe(result2); // Same reference due to caching
    });
  });

  describe('enhanceDetailedWorkoutFocusOptions', () => {
    it('should enhance detailed workout focus options', () => {
      const enhanced = enhanceDetailedWorkoutFocusOptions();

      expect(enhanced).toHaveLength(6); // All detailed focus options
      enhanced.forEach((option) => {
        expect(option).toHaveProperty('id');
        expect(option).toHaveProperty('title');
        expect(option).toHaveProperty('description');
        // No tertiary content for detailed focus options (no intensity dots)
        expect(option).not.toHaveProperty('tertiary');
      });
    });

    it('should provide session intent-based options', () => {
      const enhanced = enhanceDetailedWorkoutFocusOptions();

      // Check that we have the expected session intent options
      const optionIds = enhanced.map((option) => option.id);
      expect(optionIds).toContain('general_fitness_maintenance');
      expect(optionIds).toContain('strength_power_development');
      expect(optionIds).toContain('muscle_building_hypertrophy');
      expect(optionIds).toContain('endurance_conditioning');
      expect(optionIds).toContain('mobility_movement_quality');
      expect(optionIds).toContain('recovery_restoration');
    });

    it('should have descriptive titles and descriptions', () => {
      const enhanced = enhanceDetailedWorkoutFocusOptions();

      const generalFitness = enhanced.find(
        (opt) => opt.id === 'general_fitness_maintenance'
      );
      const strengthPower = enhanced.find(
        (opt) => opt.id === 'strength_power_development'
      );

      expect(generalFitness?.title).toBe('General Fitness Maintenance');
      expect(generalFitness?.description).toContain('balanced session');
      expect(strengthPower?.title).toBe('Strength & Power Development');
      expect(strengthPower?.description).toContain('maximal force');
    });

    it('should cache results for performance', () => {
      const result1 = enhanceDetailedWorkoutFocusOptions();
      const result2 = enhanceDetailedWorkoutFocusOptions();

      expect(result1).toBe(result2); // Same reference due to caching
    });
  });

  describe('enhanceEnergyOptionsWithDots', () => {
    it('should enhance energy options with level dots', () => {
      const enhanced = enhanceEnergyOptionsWithDots();

      expect(enhanced).toHaveLength(6); // All energy levels

      enhanced.forEach((option, index) => {
        expect(option).toHaveProperty('tertiary');
        expect(React.isValidElement(option.tertiary)).toBe(true);

        // Check that the active index matches the energy level
        const { container } = render(option.tertiary as React.ReactElement);
        const dots = container.querySelector('[data-testid="level-dots"]');
        expect(dots?.getAttribute('data-active')).toBe(index.toString());
      });
    });
  });

  describe('enhanceDurationOptionsWithSubtitles', () => {
    it('should enhance duration options with subtitles', () => {
      const enhanced = enhanceDurationOptionsWithSubtitles();

      expect(enhanced).toHaveLength(6); // All duration options

      enhanced.forEach((option) => {
        expect(option).toHaveProperty('id');
        expect(option).toHaveProperty('title');
        expect(option).toHaveProperty('description');
        expect(option).toHaveProperty('tertiary');
        expect(typeof option.tertiary).toBe('string'); // Subtitle is a string
      });
    });
  });

  describe('enhanceDetailedDurationOptionsWithSubtitles', () => {
    it('should enhance detailed duration options with comprehensive descriptions', () => {
      const enhanced = enhanceDetailedDurationOptionsWithSubtitles();

      expect(enhanced).toHaveLength(6); // All detailed duration options

      enhanced.forEach((option) => {
        expect(option).toHaveProperty('id');
        expect(option).toHaveProperty('title');
        expect(option).toHaveProperty('description');
        expect(option).toHaveProperty('tertiary');
        expect(typeof option.tertiary).toBe('string'); // Subtitle is a string
      });
    });

    it('should provide comprehensive duration options for detailed setup', () => {
      const enhanced = enhanceDetailedDurationOptionsWithSubtitles();

      // Check that we have the full range of detailed options
      const durations = enhanced.map((option) => parseInt(option.id, 10));
      expect(durations).toEqual([20, 30, 45, 60, 75, 90]);

      // Check that descriptions are comprehensive
      const option20 = enhanced.find((opt) => opt.id === '20');
      const option90 = enhanced.find((opt) => opt.id === '90');

      expect(option20?.description).toContain('HIIT, mobility flows');
      expect(option90?.description).toContain('Full powerlifting splits');
    });
  });

  describe('enhanceEquipmentOptions', () => {
    it('should enhance equipment options', () => {
      const enhanced = enhanceEquipmentOptions();

      expect(enhanced).toHaveLength(3); // All equipment options

      enhanced.forEach((option) => {
        expect(option).toHaveProperty('id');
        expect(option).toHaveProperty('title');
        expect(option).toHaveProperty('description');
        expect(option).not.toHaveProperty('tertiary'); // No tertiary content for equipment
      });
    });
  });
});

describe('Detailed Mode Option Enhancers', () => {
  beforeEach(() => {
    clearOptionsCache();
  });

  describe('enhanceFocusAreaOptions', () => {
    it('should enhance focus area options', () => {
      const enhanced = enhanceFocusAreaOptions();

      expect(enhanced).toHaveLength(10); // All focus areas

      enhanced.forEach((option) => {
        expect(option).toHaveProperty('id');
        expect(option).toHaveProperty('title');
        expect(option).toHaveProperty('description');
        expect(typeof option.description).toBe('string');
      });
    });

    it('should provide meaningful descriptions', () => {
      const enhanced = enhanceFocusAreaOptions();

      const upperBody = enhanced.find((opt) => opt.id === 'upper_body');
      const core = enhanced.find((opt) => opt.id === 'core');

      expect(upperBody?.description).toBe('Chest, shoulders, arms, and back');
      expect(core?.description).toBe('Abdominals and lower back');
    });
  });

  describe('enhanceSleepQualityOptions', () => {
    it('should enhance sleep quality options with level dots', () => {
      const enhanced = enhanceSleepQualityOptions();

      expect(enhanced).toHaveLength(6); // 1-6 sleep quality scale (uniform)

      enhanced.forEach((option, index) => {
        expect(option).toHaveProperty('id');
        expect(option).toHaveProperty('title');
        expect(option).toHaveProperty('description');
        expect(option).toHaveProperty('tertiary');
        expect(React.isValidElement(option.tertiary)).toBe(true);

        // Check that the active index matches the sleep quality level
        const { container } = render(option.tertiary as React.ReactElement);
        const dots = container.querySelector('[data-testid="level-dots"]');
        expect(dots?.getAttribute('data-count')).toBe('6');
        expect(dots?.getAttribute('data-active')).toBe(index.toString());
      });
    });
  });

  describe('enhanceStressLevelOptions', () => {
    it('should enhance stress level options with level dots', () => {
      const enhanced = enhanceStressLevelOptions();

      expect(enhanced).toHaveLength(6); // 1-6 stress level scale (uniform)

      enhanced.forEach((option, index) => {
        expect(option).toHaveProperty('tertiary');
        expect(React.isValidElement(option.tertiary)).toBe(true);

        const { container } = render(option.tertiary as React.ReactElement);
        const dots = container.querySelector('[data-testid="level-dots"]');
        expect(dots?.getAttribute('data-count')).toBe('6');
        expect(dots?.getAttribute('data-active')).toBe(index.toString());
      });
    });
  });

  describe('enhanceSorenessAreaOptions', () => {
    it('should enhance soreness area options', () => {
      const enhanced = enhanceSorenessAreaOptions();

      expect(enhanced).toHaveLength(10); // All soreness areas

      enhanced.forEach((option) => {
        expect(option).toHaveProperty('id');
        expect(option).toHaveProperty('title');
        expect(option).toHaveProperty('description');
      });
    });

    it('should provide meaningful descriptions for soreness areas', () => {
      const enhanced = enhanceSorenessAreaOptions();

      const neckShoulders = enhanced.find((opt) => opt.id === 'neck_shoulders');
      const lowerBack = enhanced.find((opt) => opt.id === 'lower_back');

      expect(neckShoulders?.description).toBe('Neck and shoulder region');
      expect(lowerBack?.description).toBe('Lower back and lumbar region');
    });
  });
});

describe('Performance and Caching', () => {
  beforeEach(() => {
    clearOptionsCache();
  });

  it('should cache all enhanced options independently', () => {
    // Define all enhancer functions to call
    const enhancerFunctions = [
      enhanceFocusOptionsWithIntensity,
      enhanceDetailedWorkoutFocusOptions,
      enhanceEnergyOptionsWithDots,
      enhanceDurationOptionsWithSubtitles,
      enhanceDetailedDurationOptionsWithSubtitles,
      enhanceEquipmentOptions,
      enhanceFocusAreaOptions,
      enhanceSleepQualityOptions,
      enhanceStressLevelOptions,
      enhanceSorenessAreaOptions,
    ];

    // Call all enhancer functions
    enhancerFunctions.forEach((enhancer) => enhancer());

    const stats = getCacheStats();
    expect(stats.size).toBe(enhancerFunctions.length); // Dynamic count based on actual functions
    expect(stats.keys).toContain('focusWithIntensity');
    expect(stats.keys).toContain('detailedWorkoutFocus');
    expect(stats.keys).toContain('energyWithDots');
    expect(stats.keys).toContain('durationWithSubtitles');
    expect(stats.keys).toContain('detailedDurationWithSubtitles');
    expect(stats.keys).toContain('equipment');
    expect(stats.keys).toContain('focusAreas');
    expect(stats.keys).toContain('sleepQuality');
    expect(stats.keys).toContain('stressLevel');
    expect(stats.keys).toContain('sorenessAreas');
  });

  it('should reuse cached results on subsequent calls', () => {
    // Clear cache first
    clearOptionsCache();

    // First call should create cache entry
    const result1 = enhanceFocusOptionsWithIntensity();
    expect(getCacheStats().size).toBe(1);

    // Second call should use cache (same reference)
    const result2 = enhanceFocusOptionsWithIntensity();
    expect(result1).toBe(result2); // Same reference due to caching
    expect(getCacheStats().size).toBe(1); // Still only one cache entry
  });
});
