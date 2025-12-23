import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { projectsAPI, tasksAPI } from '../services/api';
import ProgressBar from '../components/ProgressBar';

const ProjectDetailPage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [progress, setProgress] = useState({ totalTasks: 0, completedTasks: 0, progressPercentage: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [tasksLoading, setTasksLoading] = useState(false);
  const [error, setError] = useState('');
  const [taskError, setTaskError] = useState('');

  // Task creation state
  const [isCreating, setIsCreating] = useState(false);
  const [createFormData, setCreateFormData] = useState({
    title: '',
    description: '',
    dueDate: ''
  });

  // Filter state
  const [filter, setFilter] = useState('all'); // all, completed, pending
  const [filteredTasks, setFilteredTasks] = useState([]);

  useEffect(() => {
    if (projectId) {
      loadProject();
      loadTasksAndProgress();
    }
  }, [projectId]);

  useEffect(() => {
    applyFilter();
  }, [tasks, filter]);

  const loadProject = async () => {
    try {
      setIsLoading(true);
      setError('');
      const projectData = await projectsAPI.getById(projectId);
      setProject(projectData);
    } catch (err) {
      console.error('Failed to load project:', err);
      setError('Failed to load project. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const loadTasksAndProgress = async () => {
    try {
      setTasksLoading(true);
      setTaskError('');

      const [taskData, progressData] = await Promise.all([
        tasksAPI.getByProject(projectId),
        projectsAPI.getProgress(projectId)
      ]);

      setTasks(taskData);
      setProgress(progressData);
    } catch (err) {
      console.error('Failed to load tasks and progress:', err);
      setTaskError('Failed to load tasks. Please try again.');
    } finally {
      setTasksLoading(false);
    }
  };

  const applyFilter = () => {
    if (filter === 'completed') {
      setFilteredTasks(tasks.filter(task => task.completed));
    } else if (filter === 'pending') {
      setFilteredTasks(tasks.filter(task => !task.completed));
    } else {
      setFilteredTasks(tasks);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();

    if (!createFormData.title.trim()) {
      setTaskError('Task title is required');
      return;
    }

    try {
      setIsCreating(true);
      setTaskError('');

      const newTask = await tasksAPI.create(projectId, createFormData);
      setTasks([...tasks, newTask]);
      setCreateFormData({ title: '', description: '', dueDate: '' });

      // Reload progress
      const progressData = await projectsAPI.getProgress(projectId);
      setProgress(progressData);
    } catch (err) {
      console.error('Failed to create task:', err);
      setTaskError('Failed to create task. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleCompleteTask = async (taskId) => {
    try {
      await tasksAPI.complete(taskId);
      setTasks(tasks.map(task =>
        task.id === taskId ? { ...task, completed: true } : task
      ));

      // Update progress
      const progressData = await projectsAPI.getProgress(projectId);
      setProgress(progressData);
    } catch (err) {
      console.error('Failed to complete task:', err);
      setTaskError('Failed to complete task.');
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }

    try {
      await tasksAPI.delete(taskId);
      setTasks(tasks.filter(task => task.id !== taskId));

      // Update progress
      const progressData = await projectsAPI.getProgress(projectId);
      setProgress(progressData);
    } catch (err) {
      console.error('Failed to delete task:', err);
      setTaskError('Failed to delete task.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCreateFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (taskError) {
      setTaskError('');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading-spinner w-12 h-12"></div>
      </div>
    );
  }

  if (error && !project) {
    return (
      <div className="page-container py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          <div className="flex items-center justify-between">
            <span>{error}</span>
            <div className="space-x-4">
              <button
                onClick={loadProject}
                className="text-sm underline hover:no-underline"
              >
                Retry
              </button>
              <Link
                to="/projects"
                className="text-sm underline hover:no-underline"
              >
                Back to Projects
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container py-8">
      {/* Header */}
      <div className="page-header">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-4 mb-2">
              <Link
                to="/projects"
                className="text-blue-600 hover:text-blue-500 font-medium"
              >
                ← Back to Projects
              </Link>
            </div>
            <h1 className="page-title">{project?.title}</h1>
            {project?.description && (
              <p className="page-subtitle">{project.description}</p>
            )}
          </div>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="card mb-8">
        <div className="card-header">
          <h2 className="text-lg font-semibold text-gray-900">Project Progress</h2>
        </div>
        <ProgressBar
          current={progress.completedTasks}
          total={progress.totalTasks}
          percentage={progress.progressPercentage}
          height="h-6"
          color="blue"
          animated={true}
        />
      </div>

      {/* Create Task Form */}
      <div className="card mb-8">
        <div className="card-header">
          <h2 className="text-lg font-semibold text-gray-900">Add New Task</h2>
        </div>

        <form onSubmit={handleCreateTask} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Task Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={createFormData.title}
                onChange={handleInputChange}
                className="input"
                placeholder="Enter task title"
                required
                disabled={isCreating}
              />
            </div>

            <div>
              <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">
                Due Date
              </label>
              <input
                type="date"
                id="dueDate"
                name="dueDate"
                value={createFormData.dueDate}
                onChange={handleInputChange}
                className="input"
                disabled={isCreating}
              />
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={createFormData.description}
              onChange={handleInputChange}
              className="input"
              rows="3"
              placeholder="Task description (optional)"
              disabled={isCreating}
            />
          </div>

          {taskError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-md text-sm">
              {taskError}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isCreating}
              className="btn-primary"
            >
              {isCreating ? (
                <>
                  <div className="loading-spinner w-4 h-4 mr-2"></div>
                  Creating...
                </>
              ) : (
                'Create Task'
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Tasks Section */}
      <div className="section">
        <div className="section-header flex items-center justify-between">
          <h2 className="section-title">Tasks</h2>
          {tasks.length > 0 && (
            <span className="text-sm text-gray-500">
              {filteredTasks.length} of {tasks.length} task{tasks.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        {/* Filter Buttons */}
        {tasks.length > 0 && (
          <div className="flex items-center space-x-2 mb-6 p-1 bg-gray-100 rounded-lg w-fit">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              All ({tasks.length})
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                filter === 'pending'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Pending ({tasks.filter(t => !t.completed).length})
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                filter === 'completed'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Completed ({tasks.filter(t => t.completed).length})
            </button>
          </div>
        )}

        {/* Tasks List */}
        {tasksLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="loading-spinner w-8 h-8"></div>
          </div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 4h6m-6 4h6" />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No tasks yet</h3>
            <p className="mt-2 text-gray-600">
              Create your first task above to get started.
            </p>
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">No {filter} tasks</h3>
            <p className="mt-2 text-gray-600">
              No tasks match the current filter.
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
};

// Task Card Component
const TaskCard = ({ task, onComplete, onDelete }) => {
  const [isCompleting, setIsCompleting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleComplete = async () => {
    if (task.completed) return;

    setIsCompleting(true);
    try {
      await onComplete();
    } finally {
      setIsCompleting(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete();
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const isOverdue = (dateString) => {
    if (!dateString || task.completed) return false;
    const dueDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return dueDate < today;
  };

  return (
    <div className="card">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 flex-1">
          {/* Checkbox */}
          <input
            type="checkbox"
            checked={task.completed}
            onChange={handleComplete}
            disabled={isCompleting || task.completed}
            className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />

          {/* Task Details */}
          <div className="flex-1">
            <h4 className={`font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
              {task.title}
            </h4>

            {task.description && (
              <p className={`text-sm mt-1 ${task.completed ? 'text-gray-400' : 'text-gray-600'}`}>
                {task.description}
              </p>
            )}

            <div className="flex items-center gap-4 mt-2">
              {/* Status Badge */}
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                task.completed
                  ? 'bg-green-100 text-green-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {task.completed ? '✓ Completed' : '○ Pending'}
              </span>

              {/* Due Date */}
              {task.dueDate && (
                <span className={`text-xs ${
                  isOverdue(task.dueDate)
                    ? 'text-red-600 font-medium'
                    : 'text-gray-500'
                }`}>
                  Due: {formatDate(task.dueDate)}
                  {isOverdue(task.dueDate) && ' (Overdue)'}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {!task.completed && (
            <button
              onClick={handleComplete}
              disabled={isCompleting}
              className="btn-sm bg-green-100 text-green-700 hover:bg-green-200 border-green-200"
            >
              {isCompleting ? 'Completing...' : 'Complete'}
            </button>
          )}

          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="btn-sm bg-red-100 text-red-700 hover:bg-red-200 border-red-200"
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailPage;
