import React, { useState } from 'react';
import { useWorkflowStore } from '../../store/workflowStore';
import { useWorkflowSelectors } from '../../store/workflowStore';
import { api } from '../../services/api';
import { WorkflowValidator } from '../../utils/validation';
import { SimulationStep, SimulationResponse } from '../../types/workflow.types';
import { cn } from '../../utils/cn';

export const SimulationPanel: React.FC = () => {
  const { 
    nodes, 
    edges, 
    isSimulating, 
    simulationResult, 
    startSimulation, 
    setSimulationResult,
    setValidationErrors 
  } = useWorkflowStore();

  const [validationStatus, setValidationStatus] = useState<{
    isValid: boolean;
    errors: string[];
  } | null>(null);

  const [isRunning, setIsRunning] = useState(false);

  const workflowDefinition = useWorkflowSelectors.workflowDefinition();

  const handleRunSimulation = async () => {
    try {
      setIsRunning(true);
      setValidationStatus(null);
      setSimulationResult({
      success: false,
      steps: [],
      totalTime: 0,
      error: 'Simulation cancelled',
    } as SimulationResponse);
      
      // First validate the workflow
      const validation = WorkflowValidator.validateWorkflow(workflowDefinition);
      setValidationErrors(validation.errors);
      
      if (!validation.isValid) {
        setValidationStatus({
          isValid: false,
          errors: validation.errors.map(e => e.message),
        });
        return;
      }

      // Start simulation
      startSimulation();
      
      // Run simulation
      const result: SimulationResponse = await api.simulateWorkflow({
        workflow: workflowDefinition,
      });

      setSimulationResult(result);
      
    } catch (error) {
      setSimulationResult({
        success: false,
        steps: [],
        totalTime: 0,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      });
    } finally {
      setIsRunning(false);
    }
  };

  const renderValidationStatus = () => {
    if (!validationStatus) return null;

    return (
      <div className={cn(
        'p-4 rounded-md mb-4',
        validationStatus.isValid 
          ? 'bg-green-50 border border-green-200' 
          : 'bg-red-50 border border-red-200'
      )}>
        <h3 className={cn(
          'text-sm font-semibold mb-2',
          validationStatus.isValid ? 'text-green-800' : 'text-red-800'
        )}>
          {validationStatus.isValid ? '✅ Workflow Valid' : '❌ Workflow Invalid'}
        </h3>
        {!validationStatus.isValid && (
          <ul className="text-sm text-red-700 space-y-1">
            {validationStatus.errors.map((error, index) => (
              <li key={index}>• {error}</li>
            ))}
          </ul>
        )}
      </div>
    );
  };

  const renderSimulationSteps = () => {
    if (!simulationResult) return null;

    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-800">Execution Log</h3>
          <div className={cn(
            'px-2 py-1 rounded text-xs font-medium',
            simulationResult.success 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          )}>
            {simulationResult.success ? 'Success' : 'Failed'}
          </div>
        </div>

        <div className="space-y-2 max-h-96 overflow-y-auto">
          {simulationResult.steps.map((step, index) => (
            <div
              key={step.nodeId}
              className={cn(
                'p-3 rounded-lg border-l-4 bg-white',
                step.status === 'success' && 'border-green-500',
                step.status === 'error' && 'border-red-500',
                step.status === 'running' && 'border-blue-500',
                step.status === 'pending' && 'border-gray-300'
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className={cn(
                    'w-2 h-2 rounded-full',
                    step.status === 'success' && 'bg-green-500',
                    step.status === 'error' && 'bg-red-500',
                    step.status === 'running' && 'bg-blue-500',
                    step.status === 'pending' && 'bg-gray-300'
                  )} />
                  <span className="text-sm font-medium text-gray-800">
                    {step.nodeTitle}
                  </span>
                  <span className="text-xs text-gray-500 capitalize">
                    {step.nodeType}
                  </span>
                </div>
                <div className="text-xs text-gray-500">
                  {step.duration ? `${step.duration}ms` : ''}
                </div>
              </div>
              <div className="mt-1 text-xs text-gray-600">
                {step.message}
              </div>
              <div className="mt-1 text-xs text-gray-400">
                {new Date(step.timestamp).toLocaleTimeString()}
              </div>
            </div>
          ))}
        </div>

        {simulationResult.error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-800">{simulationResult.error}</p>
          </div>
        )}

        <div className="pt-3 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Total execution time:</span>
            <span className="font-medium">{simulationResult.totalTime}ms</span>
          </div>
          <div className="flex items-center justify-between text-sm mt-1">
            <span className="text-gray-600">Steps executed:</span>
            <span className="font-medium">{simulationResult.steps.length}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-80 bg-white border-l border-gray-200 h-full overflow-y-auto">
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Workflow Simulation</h2>
        
        <div className="space-y-4">
          {/* Run Simulation Button */}
          <button
            onClick={handleRunSimulation}
            disabled={isRunning || isSimulating || nodes.length === 0}
            className={cn(
              'w-full px-4 py-2 rounded-md font-medium transition-colors',
              (isRunning || isSimulating || nodes.length === 0)
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            )}
          >
            {isRunning || isSimulating ? (
              <span className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Running Simulation...
              </span>
            ) : nodes.length === 0 ? (
              'Add nodes to simulate'
            ) : (
              'Run Simulation'
            )}
          </button>

          {/* Workflow Statistics */}
          <div className="p-3 bg-gray-50 rounded-md">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Workflow Statistics</h3>
            <div className="space-y-1 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Total Nodes:</span>
                <span className="font-medium">{nodes.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Connections:</span>
                <span className="font-medium">{edges.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Start Nodes:</span>
                <span className="font-medium">
                  {nodes.filter(n => n.data.type === 'start').length}
                </span>
              </div>
              <div className="flex justify-between">
                <span>End Nodes:</span>
                <span className="font-medium">
                  {nodes.filter(n => n.data.type === 'end').length}
                </span>
              </div>
            </div>
          </div>

          {/* Validation Status */}
          {renderValidationStatus()}

          {/* Simulation Results */}
          {renderSimulationSteps()}

          {/* Help Text */}
          {!simulationResult && !isRunning && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
              <h4 className="text-sm font-semibold text-blue-800 mb-1">How to use</h4>
              <ul className="text-xs text-blue-700 space-y-1">
                <li>• Create a workflow with start and end nodes</li>
                <li>• Connect nodes to create a flow</li>
                <li>• Configure each node as needed</li>
                <li>• Click "Run Simulation" to test</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
