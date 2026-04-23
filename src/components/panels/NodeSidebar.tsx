import React from 'react';
import { NodeType } from '../../types/workflow.types';
import { cn } from '../../utils/cn';

interface NodeTemplate {
  type: NodeType;
  label: string;
  description: string;
  icon: string;
  color: string;
}

const nodeTemplates: NodeTemplate[] = [
  {
    type: NodeType.START,
    label: 'Start',
    description: 'Begin the workflow',
    icon: '▶️',
    color: 'bg-green-100 border-green-300 hover:bg-green-200',
  },
  {
    type: NodeType.TASK,
    label: 'Task',
    description: 'Manual task to complete',
    icon: '📋',
    color: 'bg-blue-100 border-blue-300 hover:bg-blue-200',
  },
  {
    type: NodeType.APPROVAL,
    label: 'Approval',
    description: 'Requires approval',
    icon: '✅',
    color: 'bg-yellow-100 border-yellow-300 hover:bg-yellow-200',
  },
  {
    type: NodeType.AUTOMATED,
    label: 'Automated',
    description: 'Automated action',
    icon: '🤖',
    color: 'bg-purple-100 border-purple-300 hover:bg-purple-200',
  },
  {
    type: NodeType.END,
    label: 'End',
    description: 'End the workflow',
    icon: '🏁',
    color: 'bg-red-100 border-red-300 hover:bg-red-200',
  },
];

export const NodeSidebar: React.FC = () => {
  const onDragStart = (event: React.DragEvent, nodeType: NodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-full overflow-y-auto">
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Workflow Nodes</h2>
        <p className="text-sm text-gray-600 mb-6">
          Drag and drop nodes to create your workflow
        </p>
        
        <div className="space-y-3">
          {nodeTemplates.map((template) => (
            <div
              key={template.type}
              draggable
              onDragStart={(event) => onDragStart(event, template.type)}
              className={cn(
                'p-3 rounded-lg border-2 cursor-move transition-all duration-200',
                template.color,
                'hover:shadow-md'
              )}
            >
              <div className="flex items-center space-x-3">
                <div className="text-lg">{template.icon}</div>
                <div className="flex-1">
                  <div className="font-semibold text-sm text-gray-800">
                    {template.label}
                  </div>
                  <div className="text-xs text-gray-600">
                    {template.description}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="p-4 border-t border-gray-200">
        <h3 className="text-sm font-semibold text-gray-800 mb-2">Tips</h3>
        <ul className="text-xs text-gray-600 space-y-1">
          <li>• Only one Start node allowed</li>
          <li>• Connect nodes by dragging between handles</li>
          <li>• Click nodes to configure them</li>
          <li>• Press Delete to remove selected nodes</li>
        </ul>
      </div>
    </div>
  );
};
