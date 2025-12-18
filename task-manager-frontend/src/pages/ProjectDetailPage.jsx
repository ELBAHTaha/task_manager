import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  fetchProject,
  fetchTasks,
  createTask,
  completeTask,
  deleteTask,
  fetchProjectProgress
} from '../services/api.js';
import Loader from '../components/Loader.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';
import TaskCard from '../components/TaskCard.jsx';
import ProgressBar from '../components/ProgressBar.jsx';

export default function ProjectDetailPage() {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [progress, setProgress] = useState({
    totalTasks: 0,
    completedTasks: 0,
    progressPercentage: 0
  });
  const [loading, setLoading] = useState(true);
  const [tasksLoading, setTasksLoading] = useState(true);
  const [error, setError] = useState('');
  const [taskError, setTaskError] = useState('');
  const [creating, setCreating] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');

  const loadProject = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchProject(projectId);
      setProject(data);
    } catch (err) {
      console.error(err);
      setError('Failed to load project.');
    } finally {
      setLoading(false);
    }
  };

  const loadTasksAndProgress = async () => {
    setTasksLoading(true);
    setTaskError('');
    try {
      const [taskList, progressData] = await Promise.all([
        fetchTasks(projectId),
        fetchProjectProgress(projectId)
      ]);
      setTasks(taskList);
      setProgress(progressData);
    } catch (err) {
      console.error(err);
      setTaskError('Failed to load tasks or progress.');
    } finally {
      setTasksLoading(false);
    }
  };

  useEffect(() => {
    loadProject();
    loadTasksAndProgress();
  }, [projectId]);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setTaskError('Task title is required');
      return;
    }
    if (!dueDate) {
      setTaskError('Due date is required');
      return;
    }
    setCreating(true);
    setTaskError('');
    try {
      await createTask(projectId, { title, description, dueDate });
      setTitle('');
      setDescription('');
      setDueDate('');
      await loadTasksAndProgress();
    } catch (err) {
      console.error(err);
      setTaskError('Failed to create task.');
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
      setTaskError('Failed to complete task.');
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await deleteTask(taskId);
      await loadTasksAndProgress();
    } catch (err) {
      console.error(err);
      setTaskError('Failed to delete task.');
    }
  };

  if (loading) return <Loader />;

  if (!project) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-4">
        <ErrorMessage message={error || 'Project not found.'} />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-4 flex flex-col gap-4">
      <div className="bg-white shadow rounded-lg p-4">
        <h1 className="text-2xl font-semibold mb-1">{project.title}</h1>
        {project.description && (
          <p className="text-gray-700">{project.description}</p>
        )}
      </div>

      <div className="bg-white shadow rounded-lg p-4">
        <ProgressBar
          totalTasks={progress.totalTasks}
          completedTasks={progress.completedTasks}
          percentage={progress.progressPercentage}
        />
      </div>

      <div className="bg-white shadow rounded-lg p-4">
        <h2 className="font-semibold mb-3">Add Task</h2>
        <form className="flex flex-col gap-3" onSubmit={handleCreateTask}>
          <div className="flex flex-col md:flex-row gap-3">
            <input
              type="text"
              placeholder="Task title"
              className="flex-1 border rounded px-3 py-2"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <input
              type="date"
              className="border rounded px-3 py-2"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              required
            />
          </div>
          <textarea
            placeholder="Description (optional)"
            className="border rounded px-3 py-2 min-h-[80px]"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <button
            type="submit"
            disabled={creating}
            className="self-start bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-60 text-sm"
          >
            {creating ? 'Creating...' : 'Create Task'}
          </button>
          <ErrorMessage message={taskError} />
        </form>
      </div>

      <div>
        <h2 className="font-semibold mb-3">Tasks</h2>
        {tasksLoading ? (
          <Loader />
        ) : tasks.length === 0 ? (
          <p className="text-gray-600">No tasks yet. Add a task above.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {tasks.map((task) => (
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


