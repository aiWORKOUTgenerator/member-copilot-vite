export function WorkoutPathCardSkeleton() {
  return (
    <div className="card bg-base-100 shadow-lg animate-pulse">
      <div className="card-body">
        <div className="w-12 h-12 bg-base-300 rounded-lg mb-4" />
        <div className="h-6 bg-base-300 rounded mb-2" />
        <div className="h-4 bg-base-300 rounded mb-4" />
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-2 h-2 bg-base-300 rounded-full" />
              <div className="h-3 bg-base-300 rounded flex-1" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
