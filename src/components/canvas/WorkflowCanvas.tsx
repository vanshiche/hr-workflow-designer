import React, { useCallback, useRef, useState } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  MiniMap,
  Background,
  Connection,
  Edge,
  Node,
  NodeDragHandler,
} from 'reactflow';
import 'reactflow/dist/style.css';

import { useWorkflowStore, createWorkflowEdge } from '../../store/workflowStore';
import { NodeType } from '../../types/workflow.types';
import { StartNode, TaskNode, ApprovalNode, AutomatedNode, EndNode } from '../nodes';

const nodeTypes = {
  start: StartNode,
  task: TaskNode,
  approval: ApprovalNode,
  automated: AutomatedNode,
  end: EndNode,
};

const WorkflowCanvasInner: React.FC = () => {
  const {
    nodes,
    edges,
    selectedNodeId,
    addNode,
    updateNode,
    deleteNode,
    addEdge: addWorkflowEdge,
    deleteEdge,
    setSelectedNode,
  } = useWorkflowStore();

  const [nodesState, setNodesState, onNodesChange] = useNodesState(nodes);
  const [edgesState, setEdgesState, onEdgesChange] = useEdgesState(edges);

  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);

  // Sync store state with React Flow state
  React.useEffect(() => {
    setNodesState(nodes);
    setEdgesState(edges);
  }, [nodes, edges, setNodesState, setEdgesState]);

  // Handle node selection
  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNode(node.id);
  }, [setSelectedNode]);

  // Handle edge connections
  const onConnect = useCallback(
    (connection: Connection) => {
      if (connection.source && connection.target) {
        const newEdge = createWorkflowEdge(
          connection.source,
          connection.target,
          connection.sourceHandle || undefined,
          connection.targetHandle || undefined
        );
        addWorkflowEdge(newEdge);
      }
    },
    [addWorkflowEdge]
  );

  // Handle node drag
  const onNodeDrag = useCallback(
    (event: React.MouseEvent, node: Node) => {
      updateNode(node.id, { position: node.position });
    },
    [updateNode]
  );

  // Handle edge deletion
  const onEdgesDelete = useCallback(
    (edgesToDelete: Edge[]) => {
      edgesToDelete.forEach((edge) => {
        if (edge.id) {
          deleteEdge(edge.id as string);
        }
      });
    },
    [deleteEdge]
  );

  // Handle node deletion
  const onNodesDelete = useCallback(
    (nodesToDelete: Node[]) => {
      nodesToDelete.forEach((node) => {
        deleteNode(node.id);
      });
    },
    [deleteNode]
  );

  // Handle drag over
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  // Handle drop from sidebar
  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect();
      if (!reactFlowBounds || !reactFlowInstance) return;

      const type = event.dataTransfer.getData('application/reactflow') as NodeType;
      if (!type) return;

      // Calculate position
      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      // Create new node
      const newNode = {
        id: `node_${Date.now()}`,
        type: type, // Use the specific node type
        position,
        data: {
          type,
          title: getDefaultTitle(type),
        },
      };

      addNode(newNode);
    },
    [reactFlowInstance, addNode]
  );

  // Helper function to get default titles
  const getDefaultTitle = (type: NodeType): string => {
    const titles = {
      [NodeType.START]: 'Start',
      [NodeType.TASK]: 'Task',
      [NodeType.APPROVAL]: 'Approval',
      [NodeType.AUTOMATED]: 'Automated Step',
      [NodeType.END]: 'End',
    };
    return titles[type] || 'Node';
  };

  return (
    <div className="flex-1 h-full" ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodesState}
        edges={edgesState}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onNodeDrag={onNodeDrag}
        onEdgesDelete={onEdgesDelete}
        onNodesDelete={onNodesDelete}
        onDragOver={onDragOver}
        onDrop={onDrop}
        onInit={setReactFlowInstance}
        nodeTypes={nodeTypes}
        fitView
        attributionPosition="bottom-left"
      >
        <Background color="#aaa" gap={16} />
        <Controls />
        <MiniMap 
          nodeStrokeColor="#1a1a1a"
          nodeColor="#f0f0f0"
          nodeBorderRadius={8}
        />
      </ReactFlow>
    </div>
  );
};

// Wrapper component with ReactFlowProvider
export const WorkflowCanvas: React.FC = () => {
  return (
    <ReactFlowProvider>
      <WorkflowCanvasInner />
    </ReactFlowProvider>
  );
};
