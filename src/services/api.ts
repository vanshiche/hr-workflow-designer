import { 
  Automation, 
  SimulationRequest, 
  SimulationResponse, 
  SimulationStep,
  WorkflowDefinition,
  NodeType 
} from '../types/workflow.types';

// Mock automation data
const mockAutomations: Automation[] = [
  {
    id: 'send_email',
    label: 'Send Email',
    description: 'Send an email notification',
    params: [
      {
        name: 'to',
        type: 'text' as any,
        label: 'Recipient',
        required: true,
        placeholder: 'email@example.com',
      },
      {
        name: 'subject',
        type: 'text' as any,
        label: 'Subject',
        required: true,
        placeholder: 'Email subject',
      },
      {
        name: 'body',
        type: 'textarea' as any,
        label: 'Message',
        required: true,
        placeholder: 'Email message content',
      },
    ],
  },
  {
    id: 'generate_doc',
    label: 'Generate Document',
    description: 'Generate a PDF document',
    params: [
      {
        name: 'template',
        type: 'select' as any,
        label: 'Template',
        required: true,
        options: ['invoice', 'contract', 'report', 'certificate'],
      },
      {
        name: 'recipient',
        type: 'text' as any,
        label: 'Recipient',
        required: true,
        placeholder: 'Document recipient',
      },
    ],
  },
  {
    id: 'create_ticket',
    label: 'Create Support Ticket',
    description: 'Create a support ticket in the system',
    params: [
      {
        name: 'title',
        type: 'text' as any,
        label: 'Ticket Title',
        required: true,
        placeholder: 'Brief description of the issue',
      },
      {
        name: 'priority',
        type: 'select' as any,
        label: 'Priority',
        required: true,
        options: ['low', 'medium', 'high', 'urgent'],
      },
    ],
  },
  {
    id: 'notify_slack',
    label: 'Send Slack Notification',
    description: 'Send a notification to Slack channel',
    params: [
      {
        name: 'channel',
        type: 'text' as any,
        label: 'Channel',
        required: true,
        placeholder: '#general',
      },
      {
        name: 'message',
        type: 'textarea' as any,
        label: 'Message',
        required: true,
        placeholder: 'Slack message content',
      },
    ],
  },
];

// Helper function to simulate delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper function to generate simulation steps
const generateSimulationSteps = (workflow: WorkflowDefinition): SimulationStep[] => {
  const steps: SimulationStep[] = [];
  const startTime = Date.now();

  // Find start node
  const startNode = workflow.nodes.find(node => node.data.type === NodeType.START);
  if (!startNode) {
    return [{
      nodeId: 'error',
      nodeType: NodeType.START,
      nodeTitle: 'Error',
      status: 'error',
      message: 'No start node found',
      timestamp: new Date().toISOString(),
      duration: 0,
    }];
  }

  // Add start step
  steps.push({
    nodeId: startNode.id,
    nodeType: NodeType.START,
    nodeTitle: startNode.data.title,
    status: 'success',
    message: 'Workflow started',
    timestamp: new Date(startTime).toISOString(),
    duration: 100,
  });

  // Simulate execution of other nodes based on connections
  const visitedNodes = new Set([startNode.id]);
  let currentNodeId = startNode.id;
  let stepIndex = 1;

  while (currentNodeId) {
    // Find next node via edges
    const nextEdge = workflow.edges.find(edge => edge.source === currentNodeId);
    if (!nextEdge) break;

    const nextNode = workflow.nodes.find(node => node.id === nextEdge.target);
    if (!nextNode || visitedNodes.has(nextNode.id)) break;

    visitedNodes.add(nextNode.id);
    currentNodeId = nextNode.id;

    // Simulate different execution times and outcomes based on node type
    let status: SimulationStep['status'] = 'success';
    let message = '';
    let duration = 0;

    switch (nextNode.data.type) {
      case NodeType.TASK:
        duration = 2000 + Math.random() * 1000;
        message = 'Task completed successfully';
        // 10% chance of failure for demo purposes
        if (Math.random() < 0.1) {
          status = 'error';
          message = 'Task failed: Assignee not available';
        }
        break;

      case NodeType.APPROVAL:
        duration = 1500 + Math.random() * 500;
        const threshold = (nextNode.data as any).autoApproveThreshold || 1;
        const approvals = Math.floor(Math.random() * 3) + 1;
        if (approvals >= threshold) {
          message = `Approved with ${approvals} votes`;
        } else {
          status = 'error';
          message = `Rejected: Only ${approvals} of ${threshold} required approvals received`;
        }
        break;

      case NodeType.AUTOMATED:
        duration = 500 + Math.random() * 500;
        const actionId = (nextNode.data as any).actionId;
        const automation = mockAutomations.find(a => a.id === actionId);
        message = automation 
          ? `Executed: ${automation.label}`
          : 'Executed automated action';
        break;

      case NodeType.END:
        duration = 200;
        message = (nextNode.data as any).endMessage || 'Workflow completed';
        break;

      default:
        duration = 500;
        message = 'Step completed';
    }

    steps.push({
      nodeId: nextNode.id,
      nodeType: nextNode.data.type,
      nodeTitle: nextNode.data.title,
      status,
      message,
      timestamp: new Date(startTime + stepIndex * 1000).toISOString(),
      duration,
    });

    stepIndex++;

    // Stop if we hit an error
    if (status === 'error') break;
  }

  return steps;
};

// API Service class
export class WorkflowApiService {
  // Get available automations
  static async getAutomations(): Promise<Automation[]> {
    // Simulate network delay
    await delay(800);
    return [...mockAutomations];
  }

  // Simulate workflow execution
  static async simulateWorkflow(request: SimulationRequest): Promise<SimulationResponse> {
    // Simulate processing delay
    await delay(1500);

    try {
      const steps = generateSimulationSteps(request.workflow);
      const totalTime = steps.reduce((sum, step) => sum + (step.duration || 0), 0);
      
      // Check if any step failed
      const hasErrors = steps.some(step => step.status === 'error');
      
      return {
        success: !hasErrors,
        steps,
        totalTime,
        error: hasErrors ? 'Workflow execution failed' : undefined,
      };
    } catch (error) {
      return {
        success: false,
        steps: [],
        totalTime: 0,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  // Save workflow (mock)
  static async saveWorkflow(workflow: WorkflowDefinition): Promise<{ id: string }> {
    await delay(500);
    return { id: workflow.id };
  }

  // Load workflow (mock)
  static async loadWorkflow(id: string): Promise<WorkflowDefinition | null> {
    await delay(500);
    // In a real app, this would fetch from a backend
    return null;
  }

  // Validate workflow (mock)
  static async validateWorkflow(workflow: WorkflowDefinition): Promise<{
    isValid: boolean;
    errors: string[];
  }> {
    await delay(300);
    
    const errors: string[] = [];

    // Check for start node
    const startNodes = workflow.nodes.filter(node => node.data.type === NodeType.START);
    if (startNodes.length === 0) {
      errors.push('Workflow must have a start node');
    } else if (startNodes.length > 1) {
      errors.push('Workflow can only have one start node');
    }

    // Check for end nodes
    const endNodes = workflow.nodes.filter(node => node.data.type === NodeType.END);
    if (endNodes.length === 0) {
      errors.push('Workflow must have at least one end node');
    }

    // Check for disconnected nodes
    const connectedNodeIds = new Set<string>();
    workflow.edges.forEach(edge => {
      connectedNodeIds.add(edge.source);
      connectedNodeIds.add(edge.target);
    });

    const disconnectedNodes = workflow.nodes.filter(node => 
      node.data.type !== NodeType.START && 
      !connectedNodeIds.has(node.id)
    );

    if (disconnectedNodes.length > 0) {
      errors.push(`${disconnectedNodes.length} node(s) are not connected`);
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}

// Export convenience functions
export const api = {
  getAutomations: WorkflowApiService.getAutomations,
  simulateWorkflow: WorkflowApiService.simulateWorkflow,
  saveWorkflow: WorkflowApiService.saveWorkflow,
  loadWorkflow: WorkflowApiService.loadWorkflow,
  validateWorkflow: WorkflowApiService.validateWorkflow,
};
