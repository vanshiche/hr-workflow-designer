import { 
  WorkflowNode, 
  WorkflowEdge, 
  WorkflowDefinition, 
  ValidationError, 
  ValidationResult,
  NodeType 
} from '../types/workflow.types';

export class WorkflowValidator {
  static validateWorkflow(workflow: WorkflowDefinition): ValidationResult {
    const errors: ValidationError[] = [];

    // Validate nodes
    errors.push(...this.validateNodes(workflow.nodes));

    // Validate edges
    errors.push(...this.validateEdges(workflow.edges, workflow.nodes));

    // Validate workflow structure
    errors.push(...this.validateWorkflowStructure(workflow.nodes, workflow.edges));

    // Validate node configurations
    errors.push(...this.validateNodeConfigurations(workflow.nodes));

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  private static validateNodes(nodes: WorkflowNode[]): ValidationError[] {
    const errors: ValidationError[] = [];

    // Check for duplicate node IDs
    const nodeIds = nodes.map(node => node.id);
    const duplicateIds = nodeIds.filter((id, index) => nodeIds.indexOf(id) !== index);
    
    duplicateIds.forEach(id => {
      errors.push({
        type: 'error',
        message: `Duplicate node ID: ${id}`,
        nodeId: id,
      });
    });

    // Check for required node types
    const startNodes = nodes.filter(node => node.data.type === NodeType.START);
    const endNodes = nodes.filter(node => node.data.type === NodeType.END);

    if (startNodes.length === 0) {
      errors.push({
        type: 'error',
        message: 'Workflow must have at least one Start node',
      });
    } else if (startNodes.length > 1) {
      startNodes.forEach(node => {
        errors.push({
          type: 'error',
          message: 'Workflow can only have one Start node',
          nodeId: node.id,
        });
      });
    }

    if (endNodes.length === 0) {
      errors.push({
        type: 'error',
        message: 'Workflow must have at least one End node',
      });
    }

    // Validate node titles
    nodes.forEach(node => {
      if (!node.data.title || node.data.title.trim() === '') {
        errors.push({
          type: 'error',
          message: 'Node title is required',
          nodeId: node.id,
        });
      }
    });

    return errors;
  }

  private static validateEdges(edges: WorkflowEdge[], nodes: WorkflowNode[]): ValidationError[] {
    const errors: ValidationError[] = [];
    const nodeIds = nodes.map(node => node.id);

    // Check for duplicate edge IDs
    const edgeIds = edges.map(edge => edge.id).filter(Boolean);
    const duplicateEdgeIds = edgeIds.filter((id, index) => edgeIds.indexOf(id) !== index);
    
    duplicateEdgeIds.forEach(id => {
      errors.push({
        type: 'error',
        message: `Duplicate edge ID: ${id}`,
        edgeId: id,
      });
    });

    // Check edge connections
    edges.forEach(edge => {
      if (!nodeIds.includes(edge.source)) {
        errors.push({
          type: 'error',
          message: `Edge source node not found: ${edge.source}`,
          edgeId: edge.id,
        });
      }

      if (!nodeIds.includes(edge.target)) {
        errors.push({
          type: 'error',
          message: `Edge target node not found: ${edge.target}`,
          edgeId: edge.id,
        });
      }
    });

    return errors;
  }

  private static validateWorkflowStructure(nodes: WorkflowNode[], edges: WorkflowEdge[]): ValidationError[] {
    const errors: ValidationError[] = [];

    // Build adjacency map
    const adjacencyMap = new Map<string, string[]>();
    const incomingEdges = new Map<string, string[]>();

    nodes.forEach(node => {
      adjacencyMap.set(node.id, []);
      incomingEdges.set(node.id, []);
    });

    edges.forEach(edge => {
      if (adjacencyMap.has(edge.source)) {
        adjacencyMap.get(edge.source)!.push(edge.target);
      }
      if (incomingEdges.has(edge.target)) {
        incomingEdges.get(edge.target)!.push(edge.source);
      }
    });

    // Check for disconnected nodes
    nodes.forEach(node => {
      const hasIncoming = incomingEdges.get(node.id)!.length > 0;
      const hasOutgoing = adjacencyMap.get(node.id)!.length > 0;

      // Start node should not have incoming edges
      if (node.data.type === NodeType.START && hasIncoming) {
        errors.push({
          type: 'error',
          message: 'Start node cannot have incoming connections',
          nodeId: node.id,
        });
      }

      // End node should not have outgoing edges
      if (node.data.type === NodeType.END && hasOutgoing) {
        errors.push({
          type: 'error',
          message: 'End node cannot have outgoing connections',
          nodeId: node.id,
        });
      }

      // Other nodes should have both incoming and outgoing edges
      if (node.data.type !== NodeType.START && 
          node.data.type !== NodeType.END && 
          (!hasIncoming || !hasOutgoing)) {
        errors.push({
          type: 'warning',
          message: 'Node should have both incoming and outgoing connections',
          nodeId: node.id,
        });
      }
    });

    // Check for cycles
    const cycles = this.detectCycles(nodes, edges);
    cycles.forEach(cycle => {
      errors.push({
        type: 'error',
        message: `Cycle detected in workflow: ${cycle.join(' → ')}`,
      });
    });

    // Check for unreachable nodes
    const startNode = nodes.find(node => node.data.type === NodeType.START);
    if (startNode) {
      const reachableNodes = this.getReachableNodes(startNode.id, adjacencyMap);
      const unreachableNodes = nodes.filter(node => 
        node.id !== startNode.id && !reachableNodes.has(node.id)
      );

      unreachableNodes.forEach(node => {
        errors.push({
          type: 'warning',
          message: 'Node is not reachable from the start node',
          nodeId: node.id,
        });
      });
    }

    return errors;
  }

  private static validateNodeConfigurations(nodes: WorkflowNode[]): ValidationError[] {
    const errors: ValidationError[] = [];

    nodes.forEach(node => {
      switch (node.data.type) {
        case NodeType.TASK:
          const taskData = node.data as any;
          if (!taskData.assignee) {
            errors.push({
              type: 'warning',
              message: 'Task node should have an assignee',
              nodeId: node.id,
            });
          }
          break;

        case NodeType.APPROVAL:
          const approvalData = node.data as any;
          if (!approvalData.approverRole) {
            errors.push({
              type: 'warning',
              message: 'Approval node should have an approver role',
              nodeId: node.id,
            });
          }
          if (approvalData.autoApproveThreshold && approvalData.autoApproveThreshold < 1) {
            errors.push({
              type: 'error',
              message: 'Auto-approve threshold must be at least 1',
              nodeId: node.id,
            });
          }
          break;

        case NodeType.AUTOMATED:
          const automatedData = node.data as any;
          if (!automatedData.actionId) {
            errors.push({
              type: 'error',
              message: 'Automated node must have an action selected',
              nodeId: node.id,
            });
          }
          break;

        default:
          break;
      }
    });

    return errors;
  }

  private static detectCycles(nodes: WorkflowNode[], edges: WorkflowEdge[]): string[][] {
    const cycles: string[][] = [];
    const visited = new Set<string>();
    const recursionStack = new Set<string>();
    const path: string[] = [];

    const adjacencyMap = new Map<string, string[]>();
    nodes.forEach(node => {
      adjacencyMap.set(node.id, []);
    });
    edges.forEach(edge => {
      if (adjacencyMap.has(edge.source)) {
        adjacencyMap.get(edge.source)!.push(edge.target);
      }
    });

    const dfs = (nodeId: string): boolean => {
      if (recursionStack.has(nodeId)) {
        // Found a cycle
        const cycleStart = path.indexOf(nodeId);
        cycles.push([...path.slice(cycleStart), nodeId]);
        return true;
      }

      if (visited.has(nodeId)) {
        return false;
      }

      visited.add(nodeId);
      recursionStack.add(nodeId);
      path.push(nodeId);

      const neighbors = adjacencyMap.get(nodeId) || [];
      for (const neighbor of neighbors) {
        if (dfs(neighbor)) {
          return true;
        }
      }

      recursionStack.delete(nodeId);
      path.pop();
      return false;
    };

    nodes.forEach(node => {
      if (!visited.has(node.id)) {
        dfs(node.id);
      }
    });

    return cycles;
  }

  private static getReachableNodes(startId: string, adjacencyMap: Map<string, string[]>): Set<string> {
    const reachable = new Set<string>();
    const queue = [startId];

    while (queue.length > 0) {
      const current = queue.shift()!;
      if (reachable.has(current)) continue;

      reachable.add(current);
      const neighbors = adjacencyMap.get(current) || [];
      queue.push(...neighbors);
    }

    return reachable;
  }

  // Quick validation for real-time feedback
  static validateNodeAddition(newNode: WorkflowNode, existingNodes: WorkflowNode[]): ValidationError[] {
    const errors: ValidationError[] = [];

    // Check if this would create multiple start nodes
    if (newNode.data.type === NodeType.START) {
      const existingStartNodes = existingNodes.filter(node => node.data.type === NodeType.START);
      if (existingStartNodes.length > 0) {
        errors.push({
          type: 'error',
          message: 'Workflow already has a Start node',
          nodeId: newNode.id,
        });
      }
    }

    // Check for duplicate titles
    const duplicateTitle = existingNodes.find(node => 
      node.data.title === newNode.data.title
    );
    if (duplicateTitle) {
      errors.push({
        type: 'warning',
        message: 'Node title already exists',
        nodeId: newNode.id,
      });
    }

    return errors;
  }

  static validateEdgeAddition(newEdge: WorkflowEdge, nodes: WorkflowNode[], existingEdges: WorkflowEdge[]): ValidationError[] {
    const errors: ValidationError[] = [];

    const sourceNode = nodes.find(node => node.id === newEdge.source);
    const targetNode = nodes.find(node => node.id === newEdge.target);

    if (!sourceNode || !targetNode) {
      errors.push({
        type: 'error',
        message: 'Edge connects to non-existent nodes',
        edgeId: newEdge.id,
      });
      return errors;
    }

    // Check if this would create invalid connections
    if (targetNode.data.type === NodeType.START) {
      errors.push({
        type: 'error',
        message: 'Cannot connect to a Start node',
        edgeId: newEdge.id,
      });
    }

    if (sourceNode.data.type === NodeType.END) {
      errors.push({
        type: 'error',
        message: 'Cannot connect from an End node',
        edgeId: newEdge.id,
      });
    }

    // Check for duplicate edges
    const duplicateEdge = existingEdges.find(edge => 
      edge.source === newEdge.source && edge.target === newEdge.target
    );
    if (duplicateEdge) {
      errors.push({
        type: 'warning',
        message: 'Connection already exists between these nodes',
        edgeId: newEdge.id,
      });
    }

    return errors;
  }
}
