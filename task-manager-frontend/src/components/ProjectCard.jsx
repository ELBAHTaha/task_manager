import React, { useEffect, useState } from "react";
import { fetchProjectProgress } from "../services/api.js";
import ProgressBar from "./ProgressBar.jsx";

export default function ProjectCard({ project, onClick }) {
  const [progress, setProgress] = useState({
    totalTasks: 0,
    completedTasks: 0,
    progressPercentage: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProgress = async () => {
      try {
        const progressData = await fetchProjectProgress(project.id);
        setProgress(progressData);
      } catch (err) {
        console.error("Failed to load project progress:", err);
        setProgress({
          totalTasks: 0,
          completedTasks: 0,
          progressPercentage: 0,
        });
      } finally {
        setLoading(false);
      }
    };

    loadProgress();
  }, [project.id]);

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-md hover:border-blue-300 transition-all duration-200 flex flex-col gap-4"
    >
      <div>
        <h3 className="font-semibold text-xl text-gray-900 mb-2">
          {project.title}
        </h3>
        {project.description && (
          <p className="text-sm text-gray-600 line-clamp-2 mb-4">
            {project.description}
          </p>
        )}
      </div>

      <div className="mt-auto">
        {loading ? (
          <div className="animate-pulse">
            <div className="h-2 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-24"></div>
          </div>
        ) : (
          <ProgressBar
            totalTasks={progress.totalTasks}
            completedTasks={progress.completedTasks}
            percentage={progress.progressPercentage}
          />
        )}
      </div>

      <div className="flex items-center justify-between text-sm text-gray-500 mt-2">
        <span>
          {progress.totalTasks} task{progress.totalTasks !== 1 ? "s" : ""}
        </span>
        <span className="font-medium text-blue-600">View Details →</span>
      </div>
    </div>
  );
}
