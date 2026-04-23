import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProjectStore } from '../../store/projectStore';
import { useWorkflowStore } from '../../store/workflowStore';
import { WorkflowSummary } from '../../types/project.types';
import { cn } from '../../utils/cn';

export const WorkflowsView: React.FC = () => {
  const navigate = useNavigate();
  const {
    projects,
    workflows,
    currentProject,
    currentWorkflow,
    isLoading,
    createWorkflow,
    deleteWorkflow,
    setCurrentWorkflow,
  } = useProjectStore();

  const { 
    nodes, 
    edges, 
    clearWorkflow, 
    loadWorkflow: loadWorkflowData 
  } = useWorkflowStore();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newWorkflowName, setNewWorkflowName] = useState('');
  const [newWorkflowDescription, setNewWorkflowDescription] = useState('');
  const [selectedProject, setSelectedProject] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'draft' | 'published' | 'archived'>('all');
  const [filterProject, setFilterProject] = useState<string>('all');

  const filteredWorkflows = workflows.filter(workflow => {
    const matchesSearch = workflow.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (workflow.description?.toLowerCase().includes(searchTerm.toLowerCase()) || false);
    const matchesStatus = filterStatus === 'all' || workflow.status === filterStatus;
    const matchesProject = filterProject === 'all' || workflow.projectId === filterProject;
    return matchesSearch && matchesStatus && matchesProject;
  });

  const handleCreateWorkflow = () => {
    if (newWorkflowName.trim() && selectedProject) {
      const newWorkflow = createWorkflow(selectedProject, newWorkflowName.trim(), newWorkflowDescription.trim() || undefined);
      setShowCreateModal(false);
      setNewWorkflowName('');
      setNewWorkflowDescription('');
      setSelectedProject('');
      
      // Load the new workflow in the designer
      setCurrentWorkflow(newWorkflow);
      navigate('/workflow-designer');
    }
  };

  const handleOpenWorkflow = (workflow: WorkflowSummary) => {
    // Load the workflow data into the workflow store
    if (workflow.nodes && workflow.edges) {
      loadWorkflowData({
        id: workflow.id,
        name: workflow.name,
        nodes: workflow.nodes,
        edges: workflow.edges,
        createdAt: workflow.createdAt,
        updatedAt: workflow.updatedAt,
      });
    }
    
    // Set as current workflow and navigate to designer
    setCurrentWorkflow(workflow);
    navigate('/workflow-designer');
  };

  const handleDeleteWorkflow = (workflowId: string) => {
    if (confirm('Are you sure you want to delete this workflow? This action cannot be undone.')) {
      deleteWorkflow(workflowId);
    }
  };

  const handleSaveCurrentWorkflow = () => {
    if (currentWorkflow && (nodes.length > 0 || edges.length > 0)) {
      const workflowData = {
        nodes,
        edges,
        metadata: {
          lastSaved: new Date().toISOString(),
          version: '1.0',
        }
      };
      
      // Update the workflow with the current data
      const updatedWorkflow = {
        ...currentWorkflow,
        nodes,
        edges,
        workflowData,
        nodeCount: nodes.length,
        updatedAt: new Date().toISOString(),
      };
      
      // Use the updateWorkflow method from the project store
      useProjectStore.getState().updateWorkflow(currentWorkflow.id, updatedWorkflow);
      alert('Workflow saved successfully!');
    } else if (!currentWorkflow) {
      alert('Please select a workflow first');
    } else {
      alert('No changes to save');
    }
  };

  const handleCreateNewWorkflow = () => {
    // Clear current workflow
    clearWorkflow();
    
    // Navigate to workflow designer
    navigate('/workflow-designer');
  };

  const getProjectName = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    return project?.name || 'Unknown Project';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-500';
      case 'draft': return 'bg-yellow-500';
      case 'archived': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Workflows</h1>
          <p className="text-gray-600">Manage and design your automation workflows</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handleCreateNewWorkflow}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            + New Workflow
          </button>
          {currentWorkflow && (
            <button
              onClick={handleSaveCurrentWorkflow}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Save Current
            </button>
          )}
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex items-center space-x-4 mb-6">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search workflows..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex space-x-2">
          {(['all', 'draft', 'published', 'archived'] as const).map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={cn(
                'px-3 py-2 text-sm rounded-lg transition-colors',
                filterStatus === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              )}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
        <select
          value={filterProject}
          onChange={(e) => setFilterProject(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Projects</option>
          {projects.map(project => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </select>
      </div>

      {/* Workflows Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredWorkflows.map((workflow) => (
          <div
            key={workflow.id}
            className="bg-white border border-gray-200 rounded-lg hover:shadow-lg transition-shadow"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={cn(
                    'w-3 h-3 rounded-full',
                    getStatusColor(workflow.status)
                  )} />
                  <div>
                    <h3 className="font-semibold text-gray-900">{workflow.name}</h3>
                    <p className="text-sm text-gray-600">{workflow.status}</p>
                  </div>
                </div>
                {workflow.isTemplate && (
                  <span className="text-blue-500 text-sm">📋 Template</span>
                )}
              </div>

              <p className="text-gray-600 mb-4 line-clamp-2">
                {workflow.description || 'No description provided'}
              </p>

              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <div>
                  <p>{workflow.nodeCount} nodes</p>
                  <p>{getProjectName(workflow.projectId)}</p>
                </div>
                <div className="text-right">
                  <p>{workflow.runCount} runs</p>
                  <p>
                    {workflow.lastRunAt 
                      ? new Date(workflow.lastRunAt).toLocaleDateString()
                      : 'Never run'
                    }
                  </p>
                </div>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => handleOpenWorkflow(workflow)}
                  className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Open
                </button>
                <button
                  onClick={() => handleDeleteWorkflow(workflow.id)}
                  className="px-3 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredWorkflows.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">⚡</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No workflows found</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm || filterStatus !== 'all' || filterProject !== 'all' 
              ? 'Try adjusting your search or filters' 
              : 'Create your first workflow to get started'}
          </p>
          {!searchTerm && filterStatus === 'all' && filterProject === 'all' && (
            <button
              onClick={handleCreateNewWorkflow}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              + Create Workflow
            </button>
          )}
        </div>
      )}

      {/* Create Workflow Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Create New Workflow</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Workflow Name *
                </label>
                <input
                  type="text"
                  value={newWorkflowName}
                  onChange={(e) => setNewWorkflowName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter workflow name"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={newWorkflowDescription}
                  onChange={(e) => setNewWorkflowDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="Enter workflow description"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Project *
                </label>
                <select
                  value={selectedProject}
                  onChange={(e) => setSelectedProject(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a project</option>
                  {projects.map(project => (
                    <option key={project.id} value={project.id}>
                      {project.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={handleCreateWorkflow}
                disabled={!newWorkflowName.trim() || !selectedProject}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Create Workflow
              </button>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setNewWorkflowName('');
                  setNewWorkflowDescription('');
                  setSelectedProject('');
                }}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
