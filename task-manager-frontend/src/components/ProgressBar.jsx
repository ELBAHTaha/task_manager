import React from 'react';

export default function ProgressBar({ totalTasks, completedTasks, percentage }) {
  const safeTotal = totalTasks || 0;
  const safeCompleted = completedTasks || 0;
  const safePercentage =
    typeof percentage === 'number'
      ? Math.round(percentage)
      : safeTotal === 0
      ? 0
      : Math.round((safeCompleted / safeTotal) * 100);

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-1 text-sm">
        <span className="font-medium">Progress</span>
        <span className="text-gray-600">
          {safeCompleted} / {safeTotal} ({safePercentage}%)
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3">
        <div
          className="bg-blue-500 h-3 rounded-full transition-all"
          style={{ width: `${safePercentage}%` }}
        />
      </div>
    </div>
  );
}


