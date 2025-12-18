import React from 'react';

export default function TaskCard({ task, onComplete, onDelete }) {
  return (
    <div className="bg-white rounded-lg shadow p-4 flex justify-between items-start gap-3">
      <div>
        <h4 className={`font-semibold ${task.completed ? 'line-through text-gray-400' : ''}`}>
          {task.title}
        </h4>
        {task.description && (
          <p className="text-sm text-gray-600 mt-1">{task.description}</p>
        )}
        <p className="text-xs text-gray-500 mt-1">
          Due: {task.dueDate || 'N/A'}
        </p>
      </div>
      <div className="flex flex-col gap-2 items-end">
        {!task.completed && (
          <button
            onClick={onComplete}
            className="px-3 py-1 rounded bg-green-500 text-white text-xs hover:bg-green-600"
          >
            Complete
          </button>
        )}
        <button
          onClick={onDelete}
          className="px-3 py-1 rounded bg-red-500 text-white text-xs hover:bg-red-600"
        >
          Delete
        </button>
      </div>
    </div>
  );
}


