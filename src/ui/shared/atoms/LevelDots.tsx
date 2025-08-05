export interface LevelDotsProps {
  /** Total number of dots in the scale (e.g. 5) */
  count: number;
  /** Zero-based index of the "filled" dot (e.g. 0 = first, 4 = last) */
  activeIndex: number;
  /** Optional size preset: small, medium (default), or large */
  size?: "sm" | "md" | "lg";
  /** Extra wrapper classes if you need margin, padding, etc */
  className?: string;
}

const SIZE_CLASSES: Record<NonNullable<LevelDotsProps["size"]>, string> = {
  sm: "w-1.5 h-1.5",
  md: "w-2 h-2",
  lg: "w-3 h-3",
};

export function LevelDots({
  count,
  activeIndex,
  size = "md",
  className = "",
}: LevelDotsProps) {
  const dotClass = SIZE_CLASSES[size];

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <span
          key={i}
          className={`
            ${dotClass} rounded-full
            ${i <= activeIndex ? "bg-base-content" : "bg-base-content/30"}
          `}
        />
      ))}
    </div>
  );
}
