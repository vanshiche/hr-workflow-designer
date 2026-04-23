import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { StartNodeData } from '../../types/workflow.types';
import { cn } from '../../utils/cn';

interface StartNodeProps extends NodeProps<StartNodeData> {}

export const StartNode: React.FC<StartNodeProps> = ({ data, selected }) => {
  const { title } = data;

  return (
    <div className={cn(
      'px-4 py-3 rounded-lg border-2 min-w-[160px] text-center transition-all duration-200',
      'bg-green-100 border-green-300 hover:bg-green-200',
      selected && 'ring-2 ring-blue-500 ring-offset-2'
    )}>
      {/* Large invisible hover area */}
      <Handle
        type="source"
        position={Position.Right}
        className="opacity-0 w-12 h-12 -translate-x-6 hover:opacity-0 transition-all duration-200"
      />
      
      {/* Visible dot */}
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-green-400 border-2 border-white pointer-events-none"
      />

      <div className="flex flex-col items-center space-y-1">
        <div className="text-lg">▶️</div>
        <div className="font-semibold text-sm text-gray-800">{title}</div>
        <div className="text-xs text-green-700">Start</div>
      </div>
    </div>
  );
};
