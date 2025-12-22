import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  fetchProject,
  fetchTasks,
  createTask,
  completeTask,
  deleteTask,
  fetchProjectProgress,
} from "../services/api.js";
import Loader from "../components/Loader.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";
import TaskCard from "../components/TaskCard.jsx";
import ProgressBar from "../components/ProgressBar.jsx";
import LoadingSpinner from "../components/LoadingSpinner.jsx";

export default function ProjectDetailPage() {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [progress, setProgress] = useState({
    totalTasks: 0,
    completedTasks: 0,
    progressPercentage: 0,
  });
  const [loading, setLoading] = useState(true);
  const [tasksLoading, setTasksLoading] = useState(true);
  const [error, setError] = useState("");
  const [taskError, setTaskError] = useState("");
  const [creating, setCreating] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [filter, setFilter] = useState("all");

  const loadProject = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchProject(projectId);
      setProject(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load project.");
    } finally {
      setLoading(false);
    }
  };

  const loadTasksAndProgress = async () => {
    setTasksLoading(true);
    setTaskError("");
    try {
      const [taskList, progressData] = await Promise.all([
        fetchTasks(projectId),
        fetchProjectProgress(projectId),
      ]);
      setTasks(taskList);
      setProgress(progressData);
    } catch (err) {
      console.error(err);
      setTaskError("Failed to load tasks or progress.");
    } finally {
      setTasksLoading(false);
    }
  };

  const applyFilter = (tasks, filterType) => {
    switch (filterType) {
      case "completed":
        return tasks.filter((task) => task.completed);
      case "pending":
        return tasks.filter((task) => !task.completed);
      default:
        return tasks;
    }
  };

  useEffect(() => {
    setFilteredTasks(applyFilter(tasks, filter));
  }, [tasks, filter]);

  useEffect(() => {
    loadProject();
    loadTasksAndProgress();
  }, [projectId]);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setTaskError("Task title is required");
      return;
    }
    if (!dueDate) {
      setTaskError("Due date is required");
      return;
    }
    setCreating(true);
    setTaskError("");
    try {
      await createTask(projectId, { title, description, dueDate });
      setTitle("");
      setDescription("");
      setDueDate("");
      await loadTasksAndProgress();
    } catch (err) {
      console.error(err);
      setTaskError("Failed to create task.");
    } finally {
      setCreating(false);
    }
  };

  const handleCompleteTask = async (taskId) => {
    try {
      await completeTask(taskId);
      await loadTasksAndProgress();
    } catch (err) {
      console.error(err);
      setTaskError("Failed to complete task.");
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await deleteTask(taskId);
      await loadTasksAndProgress();
    } catch (err) {
      console.error(err);
      setTaskError("Failed to delete task.");
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" text="Loading project..." />
      </div>
    );

  if (!project) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <ErrorMessage message={error || "Project not found."} />
          <Link
            to="/projects"
            className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {project.title}
            </h1>
            {project.description && (
              <p className="text-gray-600">{project.description}</p>
            )}
          </div>
          <Link
            to="/projects"
            className="flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <svg
              className="h-4 w-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Projects
          </Link>
        </div>

        {/* Progress Bar */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <ProgressBar
            totalTasks={progress.totalTasks}
            completedTasks={progress.completedTasks}
            percentage={progress.progressPercentage}
          />
        </div>
      </div>

      {/* Add Task Form */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex items-center mb-4">
          <svg
            className="h-5 w-5 text-blue-600 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          <h2 className="text-lg font-semibold text-gray-900">Add New Task</h2>
        </div>
        <form className="space-y-4" onSubmit={handleCreateTask}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Task Title
              </label>
              <input
                type="text"
                placeholder="Enter task title"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Due Date
              </label>
              <input
                type="date"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              placeholder="Task description (optional)"
              rows="3"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              disabled={creating}
              className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {creating ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Creating...
                </>
              ) : (
                <>
                  <svg
                    className="h-4 w-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  Create Task
                </>
              )}
            </button>
            <ErrorMessage message={taskError} />
          </div>
        </form>
      </div>

      {/* Tasks Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Tasks</h2>
          {tasks.length > 0 && (
            <span className="text-sm text-gray-500">
              {tasks.length} task{tasks.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        {/* Task Filters */}
        {tasks.length > 0 && (
          <div className="flex items-center gap-2 mb-6 p-1 bg-gray-100 rounded-lg w-fit">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                filter === "all"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              All ({tasks.length})
            </button>
            <button
              onClick={() => setFilter("pending")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                filter === "pending"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Pending ({tasks.filter((t) => !t.completed).length})
            </button>
            <button
              onClick={() => setFilter("completed")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                filter === "completed"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Completed ({tasks.filter((t) => t.completed).length})
            </button>
          </div>
        )}

        {tasksLoading ? (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner size="lg" text="Loading tasks..." />
          </div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 4h6m-6 4h6"
              />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              No tasks yet
            </h3>
            <p className="mt-2 text-gray-600">
              📝 Create your first task above to get started!
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Break down your project into manageable tasks to track progress.
            </p>
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              No {filter} tasks
            </h3>
            <p className="mt-2 text-gray-600">
              No tasks match the current filter. Try selecting a different
              filter.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onComplete={() => handleCompleteTask(task.id)}
                onDelete={() => handleDeleteTask(task.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
