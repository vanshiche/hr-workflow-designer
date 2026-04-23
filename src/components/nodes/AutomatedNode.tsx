import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { AutomatedNodeData } from '../../types/workflow.types';
import { cn } from '../../utils/cn';

interface AutomatedNodeProps extends NodeProps<AutomatedNodeData> {}

export const AutomatedNode: React.FC<AutomatedNodeProps> = ({ data, selected }) => {
  const { title, actionLabel } = data;

  return (
    <div className={cn(
      'px-4 py-3 rounded-lg border-2 min-w-[160px] text-center transition-all duration-200',
      'bg-purple-100 border-purple-300 hover:bg-purple-200',
      selected && 'ring-2 ring-blue-500 ring-offset-2'
    )}>
      {/* Large invisible hover area for input */}
      <Handle
        type="target"
        position={Position.Left}
        className="opacity-0 w-12 h-12 translate-x-6 hover:opacity-0 transition-all duration-200"
      />
      
      {/* Visible dot for input */}
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-purple-400 border-2 border-white pointer-events-none"
      />
      
      {/* Large invisible hover area for output */}
      <Handle
        type="source"
        position={Position.Right}
        className="opacity-0 w-12 h-12 -translate-x-6 hover:opacity-0 transition-all duration-200"
      />
      
      {/* Visible dot for output */}
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-purple-400 border-2 border-white pointer-events-none"
      />

      <div className="flex flex-col items-center space-y-1">
        <div className="text-lg">🤖</div>
        <div className="font-semibold text-sm text-gray-800">{title}</div>
        {actionLabel && (
          <div className="text-xs text-gray-600 truncate max-w-[140px]">{actionLabel}</div>
        )}
        <div className="text-xs text-purple-700">Automated</div>
      </div>
    </div>
  );
};
