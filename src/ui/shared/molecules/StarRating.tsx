import { useState, useCallback, KeyboardEvent } from "react";

export interface StarRatingProps {
  /** Current rating value (1-5) */
  value: number;
  /** Callback when rating changes */
  onChange?: (rating: number) => void;
  /** Whether the rating is disabled/read-only */
  disabled?: boolean;
  /** Size of the rating stars */
  size?: "sm" | "md" | "lg";
  /** Additional CSS classes */
  className?: string;
  /** Label for accessibility */
  label?: string;
  /** Show rating number next to stars */
  showNumber?: boolean;
}

export default function StarRating({
  value,
  onChange,
  disabled = false,
  size = "md",
  className = "",
  label = "Rating",
  showNumber = false,
}: StarRatingProps) {
  const [hoverValue, setHoverValue] = useState<number>(0);

  const handleStarClick = useCallback(
    (rating: number) => {
      if (!disabled && onChange) {
        onChange(rating);
      }
    },
    [disabled, onChange]
  );

  const handleStarHover = useCallback(
    (rating: number) => {
      if (!disabled) {
        setHoverValue(rating);
      }
    },
    [disabled]
  );

  const handleMouseLeave = useCallback(() => {
    if (!disabled) {
      setHoverValue(0);
    }
  }, [disabled]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent, rating: number) => {
      if (disabled) return;

      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        handleStarClick(rating);
      } else if (event.key === "ArrowRight" || event.key === "ArrowUp") {
        event.preventDefault();
        const nextRating = Math.min(5, rating + 1);
        handleStarClick(nextRating);
      } else if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
        event.preventDefault();
        const prevRating = Math.max(1, rating - 1);
        handleStarClick(prevRating);
      }
    },
    [disabled, handleStarClick]
  );

  const displayValue = hoverValue || value;

  const getSizeClass = () => {
    switch (size) {
      case "sm":
        return "rating-sm";
      case "lg":
        return "rating-lg";
      default:
        return "rating-md";
    }
  };

  const getStarClass = (starNumber: number) => {
    const baseClass = "mask mask-star-2 bg-orange-400";
    const isActive = starNumber <= displayValue;
    const isHovered = hoverValue > 0 && starNumber <= hoverValue;

    if (disabled) {
      return `${baseClass} ${isActive ? "opacity-100" : "opacity-30"}`;
    }

    return `${baseClass} ${isActive ? "opacity-100" : "opacity-30"} ${
      !disabled ? "cursor-pointer hover:opacity-80 transition-opacity" : ""
    } ${isHovered ? "scale-110 transition-transform" : ""}`;
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div
        className={`rating ${getSizeClass()}`}
        onMouseLeave={handleMouseLeave}
        role="radiogroup"
        aria-label={label}
        aria-describedby={showNumber ? `rating-value-${value}` : undefined}
      >
        {/* Hidden radio button for reset (0 rating) */}
        <input
          type="radio"
          name="rating"
          className="rating-hidden"
          value={0}
          checked={value === 0}
          onChange={() => handleStarClick(0)}
          disabled={disabled}
          aria-label="No rating"
        />

        {[1, 2, 3, 4, 5].map((starNumber) => (
          <input
            key={starNumber}
            type="radio"
            name="rating"
            className={getStarClass(starNumber)}
            value={starNumber}
            checked={!hoverValue && value === starNumber}
            onChange={() => handleStarClick(starNumber)}
            onMouseEnter={() => handleStarHover(starNumber)}
            onKeyDown={(e) => handleKeyDown(e, starNumber)}
            disabled={disabled}
            aria-label={`${starNumber} star${starNumber !== 1 ? "s" : ""}`}
            role="radio"
            aria-checked={value === starNumber}
            tabIndex={value === starNumber ? 0 : -1}
          />
        ))}
      </div>

      {showNumber && (
        <span
          id={`rating-value-${value}`}
          className="text-sm font-medium text-base-content/70"
          aria-live="polite"
        >
          {displayValue}/5
        </span>
      )}
    </div>
  );
}
