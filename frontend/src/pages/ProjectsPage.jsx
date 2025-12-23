import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { projectsAPI } from '../services/api';
import ProgressBar from '../components/ProgressBar';

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [createFormData, setCreateFormData] = useState({
    title: '',
    description: ''
  });
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState('');

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setIsLoading(true);
      setError('');
      const data = await projectsAPI.getAll();
      setProjects(data);
    } catch (err) {
      console.error('Failed to load projects:', err);
      setError('Failed to load projects. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();

    if (!createFormData.title.trim()) {
      setCreateError('Project title is required');
      return;
    }

    try {
      setIsCreating(true);
      setCreateError('');

      const newProject = await projectsAPI.create(createFormData);
      setProjects([...projects, newProject]);
      setCreateFormData({ title: '', description: '' });
    } catch (err) {
      console.error('Failed to create project:', err);
      setCreateError('Failed to create project. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCreateFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (createError) {
      setCreateError('');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading-spinner w-12 h-12"></div>
      </div>
    );
  }

  return (
    <div className="page-container py-8">
      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">Projects</h1>
        <p className="page-subtitle">
          Manage and organize your projects
        </p>
      </div>

      {/* Create Project Form */}
      <div className="card mb-8">
        <div className="card-header">
          <h2 className="text-lg font-semibold text-gray-900">Create New Project</h2>
        </div>

        <form onSubmit={handleCreateProject} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Project Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={createFormData.title}
                onChange={handleInputChange}
                className="input"
                placeholder="Enter project title"
                required
                disabled={isCreating}
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <input
                type="text"
                id="description"
                name="description"
                value={createFormData.description}
                onChange={handleInputChange}
                className="input"
                placeholder="Brief project description"
                disabled={isCreating}
              />
            </div>
          </div>

          {createError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-md text-sm">
              {createError}
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
                'Create Project'
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Projects List */}
      <div className="section">
        <div className="section-header">
          <h2 className="section-title">Your Projects</h2>
          {projects.length > 0 && (
            <span className="text-sm text-gray-500">
              {projects.length} project{projects.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            <div className="flex items-center justify-between">
              <span>{error}</span>
              <button
                onClick={loadProjects}
                className="text-sm underline hover:no-underline ml-4"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {projects.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No projects yet</h3>
            <p className="mt-2 text-gray-600">
              Create your first project to get started with organizing your tasks.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Project Card Component
const ProjectCard = ({ project }) => {
  const [progress, setProgress] = useState({ totalTasks: 0, completedTasks: 0, progressPercentage: 0 });
  const [isLoadingProgress, setIsLoadingProgress] = useState(true);

  useEffect(() => {
    loadProgress();
  }, [project.id]);

  const loadProgress = async () => {
    try {
      const progressData = await projectsAPI.getProgress(project.id);
      setProgress(progressData);
    } catch (err) {
      console.error('Failed to load progress:', err);
      setProgress({ totalTasks: 0, completedTasks: 0, progressPercentage: 0 });
    } finally {
      setIsLoadingProgress(false);
    }
  };

  return (
    <Link to={`/projects/${project.id}`} className="card card-hover">
      <div className="mb-4">
        <h3 className="font-semibold text-gray-900 mb-2">
          {project.title}
        </h3>
        {project.description && (
          <p className="text-sm text-gray-600 line-clamp-2">
            {project.description}
          </p>
        )}
      </div>

      <div className="mt-auto">
        {isLoadingProgress ? (
          <div className="animate-pulse">
            <div className="h-2 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-24"></div>
          </div>
        ) : (
          <ProgressBar
            current={progress.completedTasks}
            total={progress.totalTasks}
            percentage={progress.progressPercentage}
            showLabel={false}
            height="h-2"
            color="blue"
          />
        )}

        <div className="flex items-center justify-between mt-2 text-sm text-gray-500">
          <span>
            {progress.totalTasks} task{progress.totalTasks !== 1 ? 's' : ''}
          </span>
          <span className="text-blue-600 font-medium">
            View →
          </span>
        </div>
      </div>
    </Link>
  );
};

export default ProjectsPage;
