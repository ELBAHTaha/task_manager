import React from 'react';

export default function ProjectCard({ project, onClick }) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow p-4 cursor-pointer hover:shadow-md transition flex flex-col gap-1"
    >
      <h3 className="font-semibold text-lg">{project.title}</h3>
      {project.description && (
        <p className="text-sm text-gray-600 line-clamp-2">{project.description}</p>
      )}
    </div>
  );
}


