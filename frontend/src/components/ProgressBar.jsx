import React from 'react';

const ProgressBar = ({
  current = 0,
  total = 100,
  percentage = null,
  showLabel = true,
  showNumbers = true,
  height = 'h-4',
  color = 'blue',
  backgroundColor = 'gray-200',
  className = '',
  animated = true
}) => {
  // Calculate percentage if not provided
  const calculatedPercentage = percentage !== null
    ? Math.min(100, Math.max(0, percentage))
    : total > 0
      ? Math.min(100, Math.max(0, (current / total) * 100))
      : 0;

  // Color classes mapping
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    red: 'bg-red-500',
    yellow: 'bg-yellow-500',
    purple: 'bg-purple-500',
    indigo: 'bg-indigo-500',
    pink: 'bg-pink-500',
    gray: 'bg-gray-500'
  };

  const progressColorClass = colorClasses[color] || colorClasses.blue;

  return (
    <div className={`w-full ${className}`}>
      {/* Label and numbers */}
      {(showLabel || showNumbers) && (
        <div className="flex justify-between items-center mb-2 text-sm">
          {showLabel && (
            <span className="font-medium text-gray-700">Progress</span>
          )}
          {showNumbers && (
            <div className="flex items-center space-x-2">
              {percentage === null && (
                <span className="text-gray-600">
                  {current} / {total}
                </span>
              )}
              <span className="font-semibold text-gray-900">
                {Math.round(calculatedPercentage)}%
              </span>
            </div>
          )}
        </div>
      )}

      {/* Progress bar container */}
      <div className={`w-full bg-${backgroundColor} rounded-full ${height} overflow-hidden`}>
        {/* Progress bar fill */}
        <div
          className={`${height} ${progressColorClass} rounded-full transition-all duration-500 ease-out ${
            animated ? 'transform origin-left' : ''
          }`}
          style={{ width: `${calculatedPercentage}%` }}
        >
          {/* Shimmer effect for incomplete progress */}
          {calculatedPercentage > 0 && calculatedPercentage < 100 && animated && (
            <div className="h-full w-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
          )}
        </div>
      </div>

      {/* Additional info for completed state */}
      {calculatedPercentage === 100 && (
        <div className="flex items-center justify-center mt-2">
          <span className="text-green-600 text-xs font-medium flex items-center">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Complete!
          </span>
        </div>
      )}
    </div>
  );
};

export default ProgressBar;
