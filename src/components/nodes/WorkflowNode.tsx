import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { WorkflowNodeData, NodeType } from '../../types/workflow.types';
import { cn } from '../../utils/cn';

interface WorkflowNodeProps extends NodeProps<WorkflowNodeData> {}

const getNodeStyles = (type: NodeType, selected: boolean) => {
  const baseStyles = 'px-4 py-3 rounded-lg border-2 min-w-[160px] text-center transition-all duration-200';
  
  const typeStyles = {
    [NodeType.START]: 'bg-green-100 border-green-300 hover:bg-green-200',
    [NodeType.TASK]: 'bg-blue-100 border-blue-300 hover:bg-blue-200',
    [NodeType.APPROVAL]: 'bg-yellow-100 border-yellow-300 hover:bg-yellow-200',
    [NodeType.AUTOMATED]: 'bg-purple-100 border-purple-300 hover:bg-purple-200',
    [NodeType.END]: 'bg-red-100 border-red-300 hover:bg-red-200',
  };

  const selectedStyles = selected ? 'ring-2 ring-blue-500 ring-offset-2' : '';

  return cn(baseStyles, typeStyles[type], selectedStyles);
};

const getNodeIcon = (type: NodeType) => {
  const icons = {
    [NodeType.START]: '▶️',
    [NodeType.TASK]: '📋',
    [NodeType.APPROVAL]: '✅',
    [NodeType.AUTOMATED]: '🤖',
    [NodeType.END]: '🏁',
  };
  return icons[type];
};

export const WorkflowNode: React.FC<WorkflowNodeProps> = ({ data, selected }) => {
  const { title, type } = data;

  return (
    <div className={getNodeStyles(type, selected)}>
      {/* Source handle - only for nodes that can have outgoing connections */}
      {type !== NodeType.END && (
        <Handle
          type="source"
          position={Position.Right}
          className="w-3 h-3 bg-gray-400 border-2 border-white"
        />
      )}

      {/* Target handle - only for nodes that can have incoming connections */}
      {type !== NodeType.START && (
        <Handle
          type="target"
          position={Position.Left}
          className="w-3 h-3 bg-gray-400 border-2 border-white"
        />
      )}

      {/* Node content */}
      <div className="flex flex-col items-center space-y-1">
        <div className="text-lg">{getNodeIcon(type)}</div>
        <div className="font-semibold text-sm text-gray-800">{title}</div>
        <div className="text-xs text-gray-600 capitalize">{type}</div>
      </div>
    </div>
  );
};
