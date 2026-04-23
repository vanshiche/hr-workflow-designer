import React, { useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { MainSidebar } from './components/layout/MainSidebar';
import { Dashboard } from './components/dashboard/Dashboard';
import { ProjectsView } from './components/projects/ProjectsView';
import { WorkflowsView } from './components/workflows/WorkflowsView';
import { ComplianceView } from './components/compliance/ComplianceView';
import { SchedulerView } from './components/scheduler/SchedulerView';
import { AnalyticsView } from './components/analytics/AnalyticsView';
import { IntegrationsView } from './components/integrations/IntegrationsView';
import { RepositoryView } from './components/repository/RepositoryView';
import { MembersView } from './components/members/MembersView';
import { TemplatesView } from './components/templates/TemplatesView';
import { DocumentationView } from './components/documentation/DocumentationView';
import { SettingsView } from './components/settings/SettingsView';
import { HelpView } from './components/help/HelpView';
import { WorkflowCanvas } from './components/canvas/WorkflowCanvas';
import { NodeSidebar } from './components/panels/NodeSidebar';
import { NodeConfigurationPanel } from './components/panels/NodeConfigurationPanel';
import { SimulationPanel } from './components/panels/SimulationPanel';
import { useProjectStore } from './store/projectStore';
import { useWorkflowStore } from './store/workflowStore';
import { WorkflowValidator } from './utils/validation';
import { WorkflowSerializer } from './utils/serialization';
import './index.css';

// Layout component for views with sidebar
const LayoutWithSidebar: React.FC<{ children: React.ReactNode; showHeader?: boolean }> = ({ 
  children, 
  showHeader = false 
}) => {
  const { projects, workflows, currentProject } = useProjectStore();
  const { nodes, edges } = useWorkflowStore();
  const location = useLocation();
  const isWorkflowDesigner = ['/workflow-designer', '/project-designer'].includes(location.pathname);

  const handleExport = () => {
    const workflowDefinition = {
      id: 'current',
      name: currentProject?.name || 'My Workflow',
      nodes,
      edges,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    WorkflowSerializer.exportToFile(workflowDefinition);
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const json = e.target?.result as string;
            const workflow = WorkflowSerializer.importFromJSON(json);
            console.log('Imported workflow:', workflow);
          } catch (error) {
            alert('Failed to import workflow: ' + (error instanceof Error ? error.message : 'Unknown error'));
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleClear = () => {
    if (window.confirm('Are you sure you want to clear the current workflow?')) {
      console.log('Clear workflow');
    }
  };

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Main Sidebar */}
      <MainSidebar
        projects={projects}
        workflows={workflows}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header - Only show for workflow designer */}
        {showHeader && isWorkflowDesigner && (
          <header className="bg-white border-b border-gray-200 px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <h1 className="text-xl font-bold text-gray-800">
                  {currentProject?.name || 'HR Workflow Designer'}
                </h1>
                <div className="text-sm text-gray-500">
                  {nodes.length} nodes, {edges.length} connections
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleExport}
                  className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  Export
                </button>
                <button
                  onClick={handleImport}
                  className="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                >
                  Import
                </button>
                <button
                  onClick={handleClear}
                  className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                >
                  Clear
                </button>
              </div>
            </div>
          </header>
        )}

        {/* Main Content */}
        <div className="flex-1">
          {children}
        </div>
      </div>

      {/* Validation Errors Toast */}
      {useWorkflowStore.getState().validationErrors.length > 0 && isWorkflowDesigner && (
        <div className="fixed bottom-4 left-4 max-w-md bg-red-50 border border-red-200 rounded-lg shadow-lg p-4 z-20">
          <h3 className="text-sm font-semibold text-red-800 mb-2">Validation Errors</h3>
          <ul className="text-sm text-red-700 space-y-1">
            {useWorkflowStore.getState().validationErrors.slice(0, 3).map((error, index) => (
              <li key={index}>• {error.message}</li>
            ))}
            {useWorkflowStore.getState().validationErrors.length > 3 && (
              <li className="text-xs text-red-600">
                ...and {useWorkflowStore.getState().validationErrors.length - 3} more
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

function App() {
  const { loadProjects, loadWorkflows } = useProjectStore();
  const { nodes, edges, setValidationErrors } = useWorkflowStore();

  // Load initial data
  useEffect(() => {
    loadProjects();
    loadWorkflows();
  }, [loadProjects, loadWorkflows]);

  // Validate workflow on changes
  useEffect(() => {
    if (nodes.length > 0 || edges.length > 0) {
      const workflowDefinition = {
        id: 'current',
        name: 'Current Workflow',
        nodes,
        edges,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const validation = WorkflowValidator.validateWorkflow(workflowDefinition);
      setValidationErrors(validation.errors);
    }
  }, [nodes, edges, setValidationErrors]);

  return (
    <Routes>
      <Route path="/" element={<LayoutWithSidebar><Dashboard /></LayoutWithSidebar>} />
      <Route path="/dashboard" element={<LayoutWithSidebar><Dashboard /></LayoutWithSidebar>} />
      <Route path="/projects" element={<LayoutWithSidebar><ProjectsView /></LayoutWithSidebar>} />
      <Route path="/workflows" element={<LayoutWithSidebar><WorkflowsView /></LayoutWithSidebar>} />
      <Route path="/compliance" element={<LayoutWithSidebar><ComplianceView /></LayoutWithSidebar>} />
      <Route path="/scheduler" element={<LayoutWithSidebar><SchedulerView /></LayoutWithSidebar>} />
      <Route path="/analytics" element={<LayoutWithSidebar><AnalyticsView /></LayoutWithSidebar>} />
      <Route path="/integrations" element={<LayoutWithSidebar><IntegrationsView /></LayoutWithSidebar>} />
      <Route path="/repository" element={<LayoutWithSidebar><RepositoryView /></LayoutWithSidebar>} />
      <Route path="/members" element={<LayoutWithSidebar><MembersView /></LayoutWithSidebar>} />
      <Route path="/templates" element={<LayoutWithSidebar><TemplatesView /></LayoutWithSidebar>} />
      <Route path="/docs" element={<LayoutWithSidebar><DocumentationView /></LayoutWithSidebar>} />
      <Route path="/settings" element={<LayoutWithSidebar><SettingsView /></LayoutWithSidebar>} />
      <Route path="/help" element={<LayoutWithSidebar><HelpView /></LayoutWithSidebar>} />
      <Route 
        path="/workflow-designer" 
        element={
          <LayoutWithSidebar showHeader={true}>
            <div className="flex flex-1">
              <NodeSidebar />
              <div className="flex-1 relative">
                <WorkflowCanvas />
              </div>
              <div className="flex flex-col w-80">
                <div className="flex-1 border-r border-gray-200">
                  <NodeConfigurationPanel />
                </div>
                <div className="border-t border-gray-200">
                  <SimulationPanel />
                </div>
              </div>
            </div>
          </LayoutWithSidebar>
        } 
      />
      <Route 
        path="/project-designer" 
        element={
          <LayoutWithSidebar showHeader={true}>
            <div className="flex flex-1">
              <NodeSidebar />
              <div className="flex-1 relative">
                <WorkflowCanvas />
              </div>
              <div className="flex flex-col w-80">
                <div className="flex-1 border-r border-gray-200">
                  <NodeConfigurationPanel />
                </div>
                <div className="border-t border-gray-200">
                  <SimulationPanel />
                </div>
              </div>
            </div>
          </LayoutWithSidebar>
        } 
      />
      <Route 
        path="*" 
        element={
          <LayoutWithSidebar>
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="text-gray-400 text-6xl mb-4">🔧</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Page Not Found</h3>
                <p className="text-gray-600">The page you're looking for doesn't exist</p>
              </div>
            </div>
          </LayoutWithSidebar>
        } 
      />
    </Routes>
  );
}

export default App;
