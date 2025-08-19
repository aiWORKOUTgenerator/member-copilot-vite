import { WorkoutPathCardProps } from './types';

export function WorkoutPathCard({
  title,
  description,
  features,
  difficulty,
  icon: Icon,
  colorScheme,
  onClick,
}: WorkoutPathCardProps) {
  const colorClasses = {
    quick: {
      card: 'bg-gradient-to-br from-blue-50 to-green-50 border-blue-200 hover:border-blue-300',
      icon: 'bg-gradient-to-br from-blue-500 to-green-500',
      badge: 'badge-primary',
      text: 'text-blue-700',
      bulletBg: 'bg-blue-600',
      actionBg: 'bg-blue-600/10',
    },
    detailed: {
      card: 'bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200 hover:border-purple-300',
      icon: 'bg-gradient-to-br from-purple-500 to-pink-500',
      badge: 'badge-secondary',
      text: 'text-purple-700',
      bulletBg: 'bg-purple-600',
      actionBg: 'bg-purple-600/10',
    },
  };

  const currentColors = colorClasses[colorScheme];

  return (
    <div
      className={`card ${currentColors.card} shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border-2`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <div className="card-body p-6">
        {/* Header with Icon and Title */}
        <div className="flex items-start gap-4 mb-4">
          <div className={`p-3 rounded-lg ${currentColors.icon} shadow-md`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-base-content mb-2">
              {title}
            </h3>
            <div className={`badge ${currentColors.badge} badge-sm`}>
              {difficulty}
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-base-content/70 mb-6 leading-relaxed">
          {description}
        </p>

        {/* Features List */}
        <div className="space-y-3 mb-6">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center gap-3">
              <div
                className={`w-2 h-2 rounded-full ${currentColors.bulletBg}`}
              ></div>
              <span className="text-sm text-base-content/80">{feature}</span>
            </div>
          ))}
        </div>

        {/* Action Indicator */}
        <div className="flex justify-end">
          <div
            className={`w-8 h-8 rounded-full ${currentColors.text} ${currentColors.actionBg} flex items-center justify-center`}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
