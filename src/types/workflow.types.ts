import type { Node as ReactFlowNode, Edge as ReactFlowEdge } from 'reactflow';

// Base node types for our workflow system
export enum NodeType {
  START = 'start',
  TASK = 'task',
  APPROVAL = 'approval',
  AUTOMATED = 'automated',
  END = 'end',
}

// Base interface for all node data
export interface BaseNodeData {
  title: string;
  type: NodeType;
}

// Specific node data interfaces
export interface StartNodeData extends BaseNodeData {
  type: NodeType.START;
  metadata?: Record<string, string>;
}

export interface TaskNodeData extends BaseNodeData {
  type: NodeType.TASK;
  description?: string;
  assignee?: string;
  dueDate?: string;
  customFields?: Record<string, string>;
}

export interface ApprovalNodeData extends BaseNodeData {
  type: NodeType.APPROVAL;
  approverRole?: string;
  autoApproveThreshold?: number;
}

export interface AutomatedNodeData extends BaseNodeData {
  type: NodeType.AUTOMATED;
  actionId?: string;
  actionLabel?: string;
  parameters?: Record<string, string>;
}

export interface EndNodeData extends BaseNodeData {
  type: NodeType.END;
  endMessage?: string;
  summaryEnabled?: boolean;
}

// Discriminated union for all node data types
export type WorkflowNodeData = 
  | StartNodeData
  | TaskNodeData
  | ApprovalNodeData
  | AutomatedNodeData
  | EndNodeData;

// Extended React Flow Node with our custom data
export interface WorkflowNode extends ReactFlowNode<WorkflowNodeData> {
  // Additional properties if needed
}

// Extended React Flow Edge
export type WorkflowEdge = ReactFlowEdge;

// Workflow definition for serialization
export interface WorkflowDefinition {
  id: string;
  name: string;
  description?: string;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  createdAt: string;
  updatedAt: string;
}

// Form field types for dynamic forms
export enum FieldType {
  TEXT = 'text',
  TEXTAREA = 'textarea',
  SELECT = 'select',
  NUMBER = 'number',
  DATE = 'date',
  BOOLEAN = 'boolean',
  KEY_VALUE = 'key-value',
}

export interface FormField {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  options?: string[]; // For SELECT type
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
  };
}

// Form schema for each node type
export interface NodeFormSchema {
  [NodeType.START]: FormField[];
  [NodeType.TASK]: FormField[];
  [NodeType.APPROVAL]: FormField[];
  [NodeType.AUTOMATED]: FormField[];
  [NodeType.END]: FormField[];
}

// Automation API types
export interface Automation {
  id: string;
  label: string;
  description?: string;
  params: AutomationParam[];
}

export interface AutomationParam {
  name: string;
  type: FieldType;
  label: string;
  required: boolean;
  placeholder?: string;
  options?: string[];
}

// Simulation types
export interface SimulationRequest {
  workflow: WorkflowDefinition;
}

export interface SimulationStep {
  nodeId: string;
  nodeType: NodeType;
  nodeTitle: string;
  status: 'pending' | 'running' | 'success' | 'error';
  message?: string;
  timestamp: string;
  duration?: number;
}

export interface SimulationResponse {
  success: boolean;
  steps: SimulationStep[];
  error?: string;
  totalTime: number;
}

// Validation types
export interface ValidationError {
  type: 'error' | 'warning';
  message: string;
  nodeId?: string;
  edgeId?: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

// Store state types
export interface WorkflowState {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  selectedNodeId?: string;
  validationErrors: ValidationError[];
  isSimulating: boolean;
  simulationResult?: SimulationResponse;
}

export interface WorkflowActions {
  // Node operations
  addNode: (node: WorkflowNode) => void;
  updateNode: (nodeId: string, updates: Partial<WorkflowNode>) => void;
  deleteNode: (nodeId: string) => void;
  
  // Edge operations
  addEdge: (edge: WorkflowEdge) => void;
  deleteEdge: (edgeId: string) => void;
  
  // Selection
  setSelectedNode: (nodeId?: string) => void;
  
  // Validation
  setValidationErrors: (errors: ValidationError[]) => void;
  
  // Simulation
  startSimulation: () => void;
  setSimulationResult: (result: SimulationResponse) => void;
  
  // Workflow operations
  clearWorkflow: () => void;
  loadWorkflow: (workflow: WorkflowDefinition) => void;
}

// Utility types
export type NodePosition = {
  x: number;
  y: number;
};

export type DraggedNodeType = {
  type: NodeType;
  label: string;
  icon?: string;
};
