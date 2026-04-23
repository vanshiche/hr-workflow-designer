import { create } from 'zustand';
import { NodeType } from '../types/workflow.types';
import type { 
  WorkflowNode, 
  WorkflowEdge, 
  WorkflowState, 
  WorkflowActions, 
  WorkflowDefinition,
  ValidationError,
  SimulationResponse,
  NodePosition
} from '../types/workflow.types';

// Generate unique IDs
const generateId = () => `node_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

const generateEdgeId = () => `edge_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

// Initial state
const initialState: WorkflowState = {
  nodes: [],
  edges: [],
  selectedNodeId: undefined,
  validationErrors: [],
  isSimulating: false,
  simulationResult: undefined,
};

// Create the Zustand store
export const useWorkflowStore = create<WorkflowState & WorkflowActions>((set) => ({
  ...initialState,

  // Node operations
  addNode: (node: WorkflowNode) => {
    set((state) => ({
      nodes: [...state.nodes, node],
    }));
  },

  updateNode: (nodeId: string, updates: Partial<WorkflowNode>) => {
    set((state) => ({
      nodes: state.nodes.map((node) =>
        node.id === nodeId ? { ...node, ...updates } : node
      ),
    }));
  },

  deleteNode: (nodeId: string) => {
    set((state) => {
      // Remove the node and any connected edges
      const filteredNodes = state.nodes.filter((node) => node.id !== nodeId);
      const filteredEdges = state.edges.filter(
        (edge) => edge.source !== nodeId && edge.target !== nodeId
      );
      
      // Clear selection if the deleted node was selected
      const newSelectedNodeId = state.selectedNodeId === nodeId ? undefined : state.selectedNodeId;
      
      return {
        nodes: filteredNodes,
        edges: filteredEdges,
        selectedNodeId: newSelectedNodeId,
      };
    });
  },

  // Edge operations
  addEdge: (edge: WorkflowEdge) => {
    set((state) => ({
      edges: [...state.edges, edge],
    }));
  },

  deleteEdge: (edgeId: string) => {
    set((state) => ({
      edges: state.edges.filter((edge) => edge.id !== edgeId),
    }));
  },

  // Selection
  setSelectedNode: (nodeId?: string) => {
    set({ selectedNodeId: nodeId });
  },

  // Validation
  setValidationErrors: (errors: ValidationError[]) => {
    set({ validationErrors: errors });
  },

  // Simulation
  startSimulation: () => {
    set({ isSimulating: true, simulationResult: undefined });
  },

  setSimulationResult: (result: SimulationResponse) => {
    set({ simulationResult: result, isSimulating: false });
  },

  // Workflow operations
  clearWorkflow: () => {
    set({
      nodes: [],
      edges: [],
      selectedNodeId: undefined,
      validationErrors: [],
      isSimulating: false,
      simulationResult: undefined,
    });
  },

  loadWorkflow: (workflow: WorkflowDefinition) => {
    set({
      nodes: workflow.nodes,
      edges: workflow.edges,
      selectedNodeId: undefined,
      validationErrors: [],
      isSimulating: false,
      simulationResult: undefined,
    });
  },
}));

// Helper functions for creating nodes
export const createWorkflowNode = (
  type: WorkflowNode['data']['type'],
  position: NodePosition,
  title?: string
): WorkflowNode => {
  const nodeId = generateId();
  const defaultTitles = {
    start: 'Start',
    task: 'Task',
    approval: 'Approval',
    automated: 'Automated Step',
    end: 'End',
  };

  const baseData = {
    title: title || defaultTitles[type],
    type,
  };

  let nodeData: WorkflowNode['data'];

  switch (type) {
    case NodeType.START:
      nodeData = { ...baseData, type: NodeType.START, metadata: {} };
      break;
    case NodeType.TASK:
      nodeData = { 
        ...baseData, 
        type: NodeType.TASK,
        description: '',
        assignee: '',
        dueDate: '',
        customFields: {}
      };
      break;
    case NodeType.APPROVAL:
      nodeData = { 
        ...baseData, 
        type: NodeType.APPROVAL,
        approverRole: '',
        autoApproveThreshold: 1
      };
      break;
    case NodeType.AUTOMATED:
      nodeData = { 
        ...baseData, 
        type: NodeType.AUTOMATED,
        actionId: '',
        actionLabel: '',
        parameters: {}
      };
      break;
    case NodeType.END:
      nodeData = { 
        ...baseData, 
        type: NodeType.END,
        endMessage: '',
        summaryEnabled: false
      };
      break;
    default:
      throw new Error(`Unknown node type: ${type}`);
  }

  return {
    id: nodeId,
    type: 'custom',
    position,
    data: nodeData,
  };
};

// Helper function for creating edges
export const createWorkflowEdge = (
  source: string,
  target: string,
  sourceHandle?: string,
  targetHandle?: string
): WorkflowEdge => {
  return {
    id: generateEdgeId(),
    source,
    target,
    sourceHandle,
    targetHandle,
    type: 'smoothstep',
  };
};

// Selectors for computed values
export const useWorkflowSelectors = {
  selectedNode: () => useWorkflowStore((state) => 
    state.nodes.find((node) => node.id === state.selectedNodeId)
  ),
  
  nodeById: (nodeId: string) => useWorkflowStore((state) => 
    state.nodes.find((node) => node.id === nodeId)
  ),
  
  nodesByType: (type: WorkflowNode['data']['type']) => useWorkflowStore((state) => 
    state.nodes.filter((node) => node.data.type === type)
  ),
  
  startNode: () => useWorkflowStore((state) => 
    state.nodes.find((node) => node.data.type === 'start')
  ),
  
  endNodes: () => useWorkflowStore((state) => 
    state.nodes.filter((node) => node.data.type === 'end')
  ),
  
  hasValidationErrors: () => useWorkflowStore((state) => 
    state.validationErrors.length > 0
  ),
  
  workflowDefinition: (): WorkflowDefinition => {
    const { nodes, edges } = useWorkflowStore.getState();
    return {
      id: 'current_workflow',
      name: 'Current Workflow',
      nodes,
      edges,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  },
};
