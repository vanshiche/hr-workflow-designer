import { 
  WorkflowNode, 
  WorkflowEdge, 
  WorkflowDefinition, 
  NodeType,
  WorkflowNodeData 
} from '../types/workflow.types';

// Serialized workflow format for export/import
export interface SerializedWorkflow {
  version: string;
  metadata: {
    name: string;
    description?: string;
    createdAt: string;
    updatedAt: string;
    exportedAt: string;
  };
  nodes: SerializedNode[];
  edges: SerializedEdge[];
}

export interface SerializedNode {
  id: string;
  type: NodeType;
  position: {
    x: number;
    y: number;
  };
  data: Omit<WorkflowNodeData, 'type'> & { type: NodeType };
}

export interface SerializedEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
  type?: string;
}

export class WorkflowSerializer {
  private static readonly CURRENT_VERSION = '1.0.0';

  // Serialize workflow to JSON
  static serialize(workflow: WorkflowDefinition): SerializedWorkflow {
    const serialized: SerializedWorkflow = {
      version: this.CURRENT_VERSION,
      metadata: {
        name: workflow.name,
        description: workflow.description,
        createdAt: workflow.createdAt,
        updatedAt: workflow.updatedAt,
        exportedAt: new Date().toISOString(),
      },
      nodes: workflow.nodes.map(this.serializeNode),
      edges: workflow.edges.map(this.serializeEdge),
    };

    return serialized;
  }

  // Deserialize workflow from JSON
  static deserialize(serialized: SerializedWorkflow): WorkflowDefinition {
    // Validate version compatibility
    this.validateVersion(serialized.version);

    const workflow: WorkflowDefinition = {
      id: `workflow_${Date.now()}`,
      name: serialized.metadata.name || 'Imported Workflow',
      description: serialized.metadata.description,
      nodes: serialized.nodes.map(this.deserializeNode),
      edges: serialized.edges.map(this.deserializeEdge),
      createdAt: serialized.metadata.createdAt,
      updatedAt: new Date().toISOString(),
    };

    return workflow;
  }

  // Export workflow to JSON string
  static exportToJSON(workflow: WorkflowDefinition): string {
    const serialized = this.serialize(workflow);
    return JSON.stringify(serialized, null, 2);
  }

  // Import workflow from JSON string
  static importFromJSON(jsonString: string): WorkflowDefinition {
    try {
      const serialized: SerializedWorkflow = JSON.parse(jsonString);
      return this.deserialize(serialized);
    } catch (error) {
      throw new Error(`Failed to parse workflow JSON: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Export workflow to file download
  static exportToFile(workflow: WorkflowDefinition, filename?: string): void {
    const jsonString = this.exportToJSON(workflow);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename || `${workflow.name.replace(/\s+/g, '_')}_${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  // Validate serialized workflow version
  private static validateVersion(version: string): void {
    const supportedVersions = ['1.0.0'];
    
    if (!supportedVersions.includes(version)) {
      throw new Error(`Unsupported workflow version: ${version}. Supported versions: ${supportedVersions.join(', ')}`);
    }
  }

  // Serialize individual node
  private static serializeNode(node: WorkflowNode): SerializedNode {
    return {
      id: node.id,
      type: node.data.type,
      position: node.position,
      data: {
        ...node.data,
        type: node.data.type, // Ensure type is included in data
      },
    };
  }

  // Deserialize individual node
  private static deserializeNode(serializedNode: SerializedNode): WorkflowNode {
    return {
      id: serializedNode.id,
      type: 'custom', // All our nodes are custom type in React Flow
      position: serializedNode.position,
      data: serializedNode.data as WorkflowNodeData,
    };
  }

  // Serialize individual edge
  private static serializeEdge(edge: WorkflowEdge): SerializedEdge {
    return {
      id: edge.id,
      source: edge.source,
      target: edge.target,
      sourceHandle: edge.sourceHandle || undefined,
      targetHandle: edge.targetHandle || undefined,
      type: edge.type,
    };
  }

  // Deserialize individual edge
  private static deserializeEdge(serializedEdge: SerializedEdge): WorkflowEdge {
    return {
      id: serializedEdge.id,
      source: serializedEdge.source,
      target: serializedEdge.target,
      sourceHandle: serializedEdge.sourceHandle,
      targetHandle: serializedEdge.targetHandle,
      type: serializedEdge.type || 'smoothstep',
    };
  }

  // Validate workflow structure
  static validateSerializedWorkflow(serialized: SerializedWorkflow): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    // Check required fields
    if (!serialized.version) {
      errors.push('Missing version field');
    }

    if (!serialized.metadata) {
      errors.push('Missing metadata field');
    } else {
      if (!serialized.metadata.name) {
        errors.push('Missing workflow name in metadata');
      }
    }

    if (!serialized.nodes) {
      errors.push('Missing nodes array');
    } else {
      // Validate nodes
      const nodeIds = new Set<string>();
      serialized.nodes.forEach((node, index) => {
        if (!node.id) {
          errors.push(`Node at index ${index} is missing ID`);
        } else {
          if (nodeIds.has(node.id)) {
            errors.push(`Duplicate node ID: ${node.id}`);
          }
          nodeIds.add(node.id);
        }

        if (!node.type) {
          errors.push(`Node ${node.id} is missing type`);
        }

        if (!Object.values(NodeType).includes(node.type)) {
          errors.push(`Node ${node.id} has invalid type: ${node.type}`);
        }

        if (!node.position) {
          errors.push(`Node ${node.id} is missing position`);
        } else {
          if (typeof node.position.x !== 'number' || typeof node.position.y !== 'number') {
            errors.push(`Node ${node.id} has invalid position coordinates`);
          }
        }

        if (!node.data) {
          errors.push(`Node ${node.id} is missing data`);
        }
      });
    }

    if (!serialized.edges) {
      errors.push('Missing edges array');
    } else {
      // Validate edges
      const edgeIds = new Set<string>();
      serialized.edges.forEach((edge, index) => {
        if (!edge.id) {
          errors.push(`Edge at index ${index} is missing ID`);
        } else {
          if (edgeIds.has(edge.id)) {
            errors.push(`Duplicate edge ID: ${edge.id}`);
          }
          edgeIds.add(edge.id);
        }

        if (!edge.source) {
          errors.push(`Edge ${edge.id} is missing source`);
        } else if (serialized.nodes && !serialized.nodes.some(n => n.id === edge.source)) {
          errors.push(`Edge ${edge.id} references non-existent source node: ${edge.source}`);
        }

        if (!edge.target) {
          errors.push(`Edge ${edge.id} is missing target`);
        } else if (serialized.nodes && !serialized.nodes.some(n => n.id === edge.target)) {
          errors.push(`Edge ${edge.id} references non-existent target node: ${edge.target}`);
        }
      });
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  // Get workflow statistics
  static getWorkflowStatistics(workflow: WorkflowDefinition): {
    totalNodes: number;
    totalEdges: number;
    nodeTypes: Record<NodeType, number>;
    hasStartNode: boolean;
    hasEndNode: boolean;
    estimatedComplexity: 'simple' | 'moderate' | 'complex';
  } {
    const nodeTypes = Object.values(NodeType).reduce((acc, type) => {
      acc[type] = workflow.nodes.filter(node => node.data.type === type).length;
      return acc;
    }, {} as Record<NodeType, number>);

    const complexity = 
      workflow.nodes.length <= 5 ? 'simple' :
      workflow.nodes.length <= 15 ? 'moderate' : 'complex';

    return {
      totalNodes: workflow.nodes.length,
      totalEdges: workflow.edges.length,
      nodeTypes,
      hasStartNode: nodeTypes[NodeType.START] > 0,
      hasEndNode: nodeTypes[NodeType.END] > 0,
      estimatedComplexity: complexity,
    };
  }
}
