import React from "react";

export default function ProgressBar({
  totalTasks,
  completedTasks,
  percentage,
  showLabel = true,
  size = "md",
  color = "blue",
}) {
  const safeTotal = totalTasks || 0;
  const safeCompleted = completedTasks || 0;
  const safePercentage =
    typeof percentage === "number"
      ? Math.round(percentage)
      : safeTotal === 0
        ? 0
        : Math.round((safeCompleted / safeTotal) * 100);

  const sizeClasses = {
    sm: "h-2",
    md: "h-3",
    lg: "h-4",
  };

  const colorClasses = {
    blue: "bg-gradient-to-r from-blue-500 to-blue-600",
    green: "bg-gradient-to-r from-green-500 to-green-600",
    purple: "bg-gradient-to-r from-purple-500 to-purple-600",
    yellow: "bg-gradient-to-r from-yellow-500 to-yellow-600",
    red: "bg-gradient-to-r from-red-500 to-red-600",
  };

  const height = sizeClasses[size] || sizeClasses.md;
  const progressColor = colorClasses[color] || colorClasses.blue;

  const getProgressColor = () => {
    if (safePercentage === 100) return colorClasses.green;
    if (safePercentage >= 75) return colorClasses.blue;
    if (safePercentage >= 50) return colorClasses.yellow;
    if (safePercentage >= 25) return colorClasses.purple;
    return colorClasses.red;
  };

  const dynamicColor = color === "auto" ? getProgressColor() : progressColor;

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between items-center mb-2 text-sm">
          <span className="font-medium text-gray-700">Progress</span>
          <div className="flex items-center space-x-2">
            <span className="text-gray-600">
              {safeCompleted} / {safeTotal}
            </span>
            <span className="font-semibold text-gray-900">
              {safePercentage}%
            </span>
          </div>
        </div>
      )}
      <div
        className={`w-full bg-gray-200 rounded-full ${height} overflow-hidden`}
      >
        <div
          className={`${dynamicColor} ${height} rounded-full transition-all duration-700 ease-out transform origin-left`}
          style={{ width: `${safePercentage}%` }}
        >
          {/* Shimmer effect for active progress */}
          {safePercentage > 0 && safePercentage < 100 && (
            <div className="w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
          )}
        </div>
      </div>
      {/* Progress milestones for larger bars */}
      {size === "lg" && safeTotal > 0 && (
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>0%</span>
          <span>25%</span>
          <span>50%</span>
          <span>75%</span>
          <span>100%</span>
        </div>
      )}
    </div>
  );
}
