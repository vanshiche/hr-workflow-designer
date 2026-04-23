import React, { useEffect } from 'react';
import { useProjectStore } from '../../store/projectStore';
import { cn } from '../../utils/cn';

export const Dashboard: React.FC = () => {
  const {
    projects,
    workflows,
    dashboardStats,
    currentProject,
    isLoading,
    error,
    loadDashboardStats,
    setCurrentProject,
    setCurrentView,
  } = useProjectStore();

  useEffect(() => {
    loadDashboardStats();
  }, [loadDashboardStats]);

  const handleCreateProject = () => {
    const name = prompt('Enter project name:');
    if (name) {
      const newProject = useProjectStore.getState().createProject(name);
      setCurrentProject(newProject);
      setCurrentView('project-designer');
    }
  };

  const handleOpenProject = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (project) {
      setCurrentProject(project);
      setCurrentView('project-designer');
    }
  };

  const handleCreateWorkflow = (projectId: string) => {
    const name = prompt('Enter workflow name:');
    if (name) {
      const newWorkflow = useProjectStore.getState().createWorkflow(projectId, name);
      setCurrentView('workflow-designer');
    }
  };

  if (isLoading && !dashboardStats) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md">
        <p className="text-red-600">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's an overview of your workflows.</p>
        </div>
        <button
          onClick={handleCreateProject}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          + New Project
        </button>
      </div>

      {/* Stats Cards */}
      {dashboardStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Projects</p>
                <p className="text-2xl font-bold text-gray-900">{dashboardStats.totalProjects}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-xl">📁</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Workflows</p>
                <p className="text-2xl font-bold text-gray-900">{dashboardStats.totalWorkflows}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-xl">⚡</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Workflows</p>
                <p className="text-2xl font-bold text-gray-900">{dashboardStats.activeWorkflows}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-xl">🚀</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Scheduled Items</p>
                <p className="text-2xl font-bold text-gray-900">{dashboardStats.scheduledItems}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <span className="text-xl">⏰</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Performance Metrics */}
      {dashboardStats?.performanceMetrics && (
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dashboardStats.performanceMetrics.map((metric) => (
              <div key={metric.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">{metric.name}</p>
                  <p className="text-xl font-bold text-gray-900">
                    {metric.value}{metric.unit}
                  </p>
                </div>
                <div className={cn(
                  'flex items-center space-x-1 text-sm',
                  metric.trend === 'up' ? 'text-green-600' : 
                  metric.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                )}>
                  <span>{metric.trend === 'up' ? '↑' : metric.trend === 'down' ? '↓' : '→'}</span>
                  <span>{Math.abs(metric.change)}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects and Workflows */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Projects */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Projects</h2>
            <button
              onClick={() => setCurrentView('projects')}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              View All
            </button>
          </div>
          <div className="space-y-3">
            {projects.slice(0, 5).map((project) => (
              <div
                key={project.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                onClick={() => handleOpenProject(project.id)}
              >
                <div className="flex items-center space-x-3">
                  <div className={cn(
                    'w-2 h-2 rounded-full',
                    project.status === 'active' ? 'bg-green-500' :
                    project.status === 'archived' ? 'bg-gray-400' : 'bg-yellow-500'
                  )} />
                  <div>
                    <p className="font-medium text-gray-900">{project.name}</p>
                    <p className="text-sm text-gray-600">{project.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">{project.workflows.length} workflows</p>
                  <p className="text-xs text-gray-400">
                    {new Date(project.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Workflows */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Workflows</h2>
            <button
              onClick={() => setCurrentView('workflows')}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              View All
            </button>
          </div>
          <div className="space-y-3">
            {workflows.slice(0, 5).map((workflow) => {
              const project = projects.find(p => p.id === workflow.projectId);
              return (
                <div
                  key={workflow.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                  onClick={() => setCurrentView('workflow-designer')}
                >
                  <div className="flex items-center space-x-3">
                    <div className={cn(
                      'w-2 h-2 rounded-full',
                      workflow.status === 'published' ? 'bg-green-500' :
                      workflow.status === 'archived' ? 'bg-gray-400' : 'bg-yellow-500'
                    )} />
                    <div>
                      <p className="font-medium text-gray-900">{workflow.name}</p>
                      <p className="text-sm text-gray-600">{project?.name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">{workflow.nodeCount} nodes</p>
                    <p className="text-xs text-gray-400">
                      {workflow.runCount} runs
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      {dashboardStats?.recentActivity && (
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {dashboardStats.recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-sm',
                  activity.type === 'workflow_run' ? 'bg-green-100' :
                  activity.type === 'workflow_created' ? 'bg-blue-100' :
                  activity.type === 'workflow_updated' ? 'bg-purple-100' : 'bg-gray-100'
                )}>
                  {activity.type === 'workflow_run' ? '▶️' :
                   activity.type === 'workflow_created' ? '➕' :
                   activity.type === 'workflow_updated' ? '✏️' : '📄'}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{activity.title}</p>
                  <p className="text-sm text-gray-600">{activity.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400">
                    {new Date(activity.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
