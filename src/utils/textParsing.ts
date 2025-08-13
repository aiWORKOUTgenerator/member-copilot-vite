import { ViewMode } from '@/contexts/ViewModeContext';

/**
 * Utility functions for parsing choice text with delimiters
 */

/**
 * Checks if text contains supported delimiters (- or :)
 */
export function hasTextDelimiter(text: string): boolean {
  return /[-:]/.test(text);
}

/**
 * Extracts the title portion (before delimiter) from choice text
 */
export function parseChoiceTitle(text: string): string {
  return text.split(/[-:]/)[0].trim();
}

/**
 * Extracts the description portion (after delimiter) from choice text
 */
export function parseChoiceDescription(text: string): string {
  return text.split(/[-:]/).slice(1).join(':').trim();
}

/**
 * Parses choice text based on view mode, returning appropriate title and description
 */
export function parseChoiceText(text: string, viewMode: ViewMode) {
  const hasDelimiter = hasTextDelimiter(text);

  return {
    title: parseChoiceTitle(text),
    description:
      viewMode === 'detailed' && hasDelimiter
        ? parseChoiceDescription(text)
        : '',
    hasDelimiter,
  };
}
