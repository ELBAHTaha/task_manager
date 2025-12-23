import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { projectsAPI, tasksAPI } from '../services/api';
import ProgressBar from '../components/ProgressBar';
import { Link } from 'react-router-dom';

const DashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalTasks: 0,
    completedTasks: 0,
    overallProgress: 0
  });
  const [recentProjects, setRecentProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      setError('');

      // Fetch projects
      const projects = await projectsAPI.getAll();
      setRecentProjects(projects.slice(0, 5)); // Show only first 5

      // Calculate stats
      let totalTasks = 0;
      let completedTasks = 0;

      // For demo purposes, we'll simulate task counts
      // In a real app, you'd have a dedicated stats endpoint
      const statsPromises = projects.map(async (project) => {
        try {
          const progress = await projectsAPI.getProgress(project.id);
          return {
            total: progress.totalTasks || 0,
            completed: progress.completedTasks || 0
          };
        } catch (err) {
          return { total: 0, completed: 0 };
        }
      });

      const projectStats = await Promise.all(statsPromises);

      totalTasks = projectStats.reduce((sum, stat) => sum + stat.total, 0);
      completedTasks = projectStats.reduce((sum, stat) => sum + stat.completed, 0);

      const overallProgress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

      setStats({
        totalProjects: projects.length,
        totalTasks,
        completedTasks,
        overallProgress: Math.round(overallProgress)
      });

    } catch (err) {
      console.error('Dashboard data loading error:', err);
      setError('Failed to load dashboard data. Please refresh the page.');
    } finally {
      setIsLoading(false);
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
        <h1 className="page-title">
          Welcome back, {user?.fullName || user?.firstName || user?.email || 'User'}! 👋
        </h1>
        <p className="page-subtitle">
          Here's what's happening with your projects today.
        </p>
      </div>

      {error && (
        <div className="mb-8 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
            <button
              onClick={loadDashboardData}
              className="ml-4 text-sm underline hover:no-underline"
            >
              Try again
            </button>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Projects */}
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                Total Projects
              </p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {stats.totalProjects}
              </p>
            </div>
            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
          </div>
        </div>

        {/* Total Tasks */}
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                Total Tasks
              </p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {stats.totalTasks}
              </p>
            </div>
            <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>
          </div>
        </div>

        {/* Completed Tasks */}
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                Completed Tasks
              </p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {stats.completedTasks}
              </p>
            </div>
            <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Overall Progress */}
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                Overall Progress
              </p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {stats.overallProgress}%
              </p>
            </div>
            <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <svg className="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="card mb-8">
        <div className="card-header">
          <h2 className="text-lg font-semibold text-gray-900">
            Overall Progress
          </h2>
        </div>
        <ProgressBar
          current={stats.completedTasks}
          total={stats.totalTasks}
          percentage={stats.overallProgress}
          color="blue"
          height="h-6"
          animated={true}
        />
      </div>

      {/* Recent Projects */}
      <div className="section">
        <div className="section-header flex items-center justify-between">
          <h2 className="section-title">Recent Projects</h2>
          <Link
            to="/projects"
            className="text-blue-600 hover:text-blue-500 font-medium text-sm"
          >
            View all projects →
          </Link>
        </div>

        {recentProjects.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No projects yet</h3>
            <p className="mt-2 text-gray-600">
              Get started by creating your first project!
            </p>
            <Link
              to="/projects"
              className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Create Project
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recentProjects.map((project) => (
              <Link
                key={project.id}
                to={`/projects/${project.id}`}
                className="card card-hover"
              >
                <h3 className="font-semibold text-gray-900 mb-2">
                  {project.title}
                </h3>
                {project.description && (
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {project.description}
                  </p>
                )}
                {/* Placeholder for project progress */}
                <div className="mt-auto">
                  <div className="text-xs text-gray-500 mb-2">Progress</div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: '0%' }}
                    ></div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="section">
        <div className="section-header">
          <h2 className="section-title">Quick Actions</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link
            to="/projects"
            className="card card-hover text-center"
          >
            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h3 className="font-medium text-gray-900 mb-2">Create Project</h3>
            <p className="text-sm text-gray-600">Start a new project and organize your tasks</p>
          </Link>

          <Link
            to="/projects"
            className="card card-hover text-center"
          >
            <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="font-medium text-gray-900 mb-2">View Projects</h3>
            <p className="text-sm text-gray-600">Browse and manage all your projects</p>
          </Link>

          <button
            onClick={loadDashboardData}
            className="card card-hover text-center"
          >
            <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <h3 className="font-medium text-gray-900 mb-2">Refresh Data</h3>
            <p className="text-sm text-gray-600">Update your dashboard with latest information</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
