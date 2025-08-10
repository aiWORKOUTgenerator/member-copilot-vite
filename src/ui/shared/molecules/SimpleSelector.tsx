import { DetailedSelector, DetailedSelectorProps } from './DetailedSelector';

export interface SimpleSelectorProps<T>
  extends Omit<
    DetailedSelectorProps<T>,
    'variant' | 'showDescription' | 'showTertiary'
  > {
  /** Override to show descriptions in simple mode */
  showDescription?: boolean;
  /** Override to show tertiary content in simple mode */
  showTertiary?: boolean;
}

/**
 * SimpleSelector - A convenience wrapper for DetailedSelector with simple variant
 *
 * This component provides a developer-friendly API for using DetailedSelector in simple mode.
 * It automatically sets the variant to 'simple' and provides optional overrides for
 * description and tertiary content visibility.
 *
 * @example
 * // Basic simple selector - hides descriptions and tertiary content
 * <SimpleSelector
 *   icon={Target}
 *   options={focusOptions}
 *   selectedValue={selectedFocus}
 *   onChange={setSelectedFocus}
 *   question="What's your main goal?"
 * />
 *
 * @example
 * // Simple selector with description override
 * <SimpleSelector
 *   icon={Target}
 *   options={focusOptions}
 *   selectedValue={selectedFocus}
 *   onChange={setSelectedFocus}
 *   question="What's your main goal?"
 *   showDescription={true} // Override to show descriptions
 * />
 *
 * @example
 * // Simple selector with tertiary content override
 * <SimpleSelector
 *   icon={Target}
 *   options={focusOptions}
 *   selectedValue={selectedFocus}
 *   onChange={setSelectedFocus}
 *   question="What's your main goal?"
 *   showTertiary={true} // Override to show tertiary content
 * />
 *
 * @template T - The type of the selected value(s)
 * @param props - Component props (excluding variant, showDescription, showTertiary)
 * @returns A DetailedSelector configured for simple mode
 */
export function SimpleSelector<T>(props: SimpleSelectorProps<T>) {
  return (
    <DetailedSelector
      {...props}
      variant="simple"
      showDescription={props.showDescription ?? false}
      showTertiary={props.showTertiary ?? false}
    />
  );
}
