import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProject, fetchProjects } from '../services/api.js';
import Loader from '../components/Loader.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';
import ProjectCard from '../components/ProjectCard.jsx';

export default function ProjectsPage() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');
  const [createError, setCreateError] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const loadProjects = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchProjects();
      setProjects(data);
    } catch (err) {
      console.error(err);
      setError('Failed to load projects.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setCreateError('Title is required');
      return;
    }
    setCreating(true);
    setCreateError('');
    try {
      const newProject = await createProject({ title, description });
      setProjects((prev) => [...prev, newProject]);
      setTitle('');
      setDescription('');
    } catch (err) {
      console.error(err);
      setCreateError('Failed to create project.');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-4">
      <h1 className="text-2xl font-semibold mb-4">Projects</h1>

      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <h2 className="font-semibold mb-3">Create New Project</h2>
        <form className="flex flex-col gap-3" onSubmit={handleCreateProject}>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="Project title"
              className="flex-1 border rounded px-3 py-2"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Description (optional)"
              className="flex-1 border rounded px-3 py-2"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <button
            type="submit"
            disabled={creating}
            className="self-start bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-60 text-sm"
          >
            {creating ? 'Creating...' : 'Create Project'}
          </button>
          <ErrorMessage message={createError} />
        </form>
      </div>

      <h2 className="font-semibold mb-3">Your Projects</h2>
      {loading ? (
        <Loader />
      ) : error ? (
        <ErrorMessage message={error} />
      ) : projects.length === 0 ? (
        <p className="text-gray-600">No projects yet. Create your first project above.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onClick={() => navigate(`/projects/${project.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}


