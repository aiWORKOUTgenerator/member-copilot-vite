import { describe, it, expect } from 'vitest';
import {
  getPriorityLabel,
  getPriorityColor,
  getPriorityIcon,
  PRIORITY_MAPPING,
} from '../announcementPriorityMapping';

describe('announcementPriorityMapping', () => {
  describe('getPriorityLabel', () => {
    it('should map high priority to Challenge Alert', () => {
      expect(getPriorityLabel('high')).toBe('Challenge Alert');
    });

    it('should map medium priority to Announcement', () => {
      expect(getPriorityLabel('medium')).toBe('Announcement');
    });

    it('should map low priority to Offer', () => {
      expect(getPriorityLabel('low')).toBe('Offer');
    });
  });

  describe('getPriorityColor', () => {
    it('should return correct color classes', () => {
      expect(getPriorityColor('high')).toBe('badge-error');
      expect(getPriorityColor('medium')).toBe('badge-warning');
      expect(getPriorityColor('low')).toBe('badge-info');
    });
  });

  describe('getPriorityIcon', () => {
    it('should return correct icons', () => {
      expect(getPriorityIcon('high')).toBe('🏆');
      expect(getPriorityIcon('medium')).toBe('📢');
      expect(getPriorityIcon('low')).toBe('🎁');
    });
  });

  describe('PRIORITY_MAPPING', () => {
    it('should have correct mapping structure', () => {
      expect(PRIORITY_MAPPING.high.label).toBe('Challenge Alert');
      expect(PRIORITY_MAPPING.high.color).toBe('error');
      expect(PRIORITY_MAPPING.high.icon).toBe('🏆');

      expect(PRIORITY_MAPPING.medium.label).toBe('Announcement');
      expect(PRIORITY_MAPPING.medium.color).toBe('warning');
      expect(PRIORITY_MAPPING.medium.icon).toBe('📢');

      expect(PRIORITY_MAPPING.low.label).toBe('Offer');
      expect(PRIORITY_MAPPING.low.color).toBe('info');
      expect(PRIORITY_MAPPING.low.icon).toBe('🎁');
    });
  });
});
