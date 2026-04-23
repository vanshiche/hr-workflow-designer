import React, { useState, useEffect } from 'react';
import { useWorkflowStore } from '../../store/workflowStore';
import { NodeType, WorkflowNodeData } from '../../types/workflow.types';
import { cn } from '../../utils/cn';

interface NodeConfigurationPanelProps {}

export const NodeConfigurationPanel: React.FC<NodeConfigurationPanelProps> = () => {
  const { selectedNodeId, nodes, updateNode } = useWorkflowStore();
  
  const [formData, setFormData] = useState<Partial<WorkflowNodeData>>({});
  const [dynamicFields, setDynamicFields] = useState<Record<string, string>>({});

  const selectedNode = nodes.find(node => node.id === selectedNodeId);

  useEffect(() => {
    if (selectedNode) {
      setFormData(selectedNode.data);
      // Extract dynamic fields based on node type
      const dynamicData = extractDynamicFields(selectedNode.data);
      setDynamicFields(dynamicData);
    } else {
      setFormData({});
      setDynamicFields({});
    }
  }, [selectedNode]);

  const extractDynamicFields = (data: WorkflowNodeData): Record<string, string> => {
    switch (data.type) {
      case NodeType.START:
        return (data as any).metadata || {};
      case NodeType.TASK:
        return (data as any).customFields || {};
      case NodeType.AUTOMATED:
        return (data as any).parameters || {};
      default:
        return {};
    }
  };

  const handleFieldChange = (field: string, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDynamicFieldChange = (key: string, value: string) => {
    setDynamicFields(prev => ({ ...prev, [key]: value }));
  };

  const addDynamicField = () => {
    const newKey = `field_${Object.keys(dynamicFields).length + 1}`;
    setDynamicFields(prev => ({ ...prev, [newKey]: '' }));
  };

  const removeDynamicField = (key: string) => {
    setDynamicFields(prev => {
      const newFields = { ...prev };
      delete newFields[key];
      return newFields;
    });
  };

  const saveChanges = () => {
    if (!selectedNode) return;

    let updatedData: Partial<WorkflowNodeData> = { ...formData };

    // Update dynamic fields based on node type
    switch (selectedNode.data.type) {
      case NodeType.START:
        (updatedData as any).metadata = dynamicFields;
        break;
      case NodeType.TASK:
        (updatedData as any).customFields = dynamicFields;
        break;
      case NodeType.AUTOMATED:
        (updatedData as any).parameters = dynamicFields;
        break;
    }

    updateNode(selectedNode.id, { data: updatedData as WorkflowNodeData });
  };

  if (!selectedNode) {
    return (
      <div className="w-80 bg-white border-l border-gray-200 h-full overflow-y-auto">
        <div className="p-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Node Configuration</h2>
          <p className="text-sm text-gray-600">
            Select a node to configure its properties
          </p>
        </div>
      </div>
    );
  }

  const renderNodeSpecificFields = () => {
    switch (selectedNode.data.type) {
      case NodeType.START:
        return (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-700">Start Node Settings</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={formData.title || ''}
                  onChange={(e) => handleFieldChange('title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter node title"
                />
              </div>
            </div>
          </div>
        );

      case NodeType.TASK:
        return (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-700">Task Settings</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title || ''}
                  onChange={(e) => handleFieldChange('title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter task title"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={(formData as any).description || ''}
                  onChange={(e) => handleFieldChange('description', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Enter task description"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Assignee
                </label>
                <input
                  type="text"
                  value={(formData as any).assignee || ''}
                  onChange={(e) => handleFieldChange('assignee', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter assignee name or email"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Due Date
                </label>
                <input
                  type="date"
                  value={(formData as any).dueDate || ''}
                  onChange={(e) => handleFieldChange('dueDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        );

      case NodeType.APPROVAL:
        return (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-700">Approval Settings</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={formData.title || ''}
                  onChange={(e) => handleFieldChange('title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter approval title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Approver Role
                </label>
                <input
                  type="text"
                  value={(formData as any).approverRole || ''}
                  onChange={(e) => handleFieldChange('approverRole', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Manager, HR Director"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Auto-approve Threshold
                </label>
                <input
                  type="number"
                  value={(formData as any).autoApproveThreshold || 1}
                  onChange={(e) => handleFieldChange('autoApproveThreshold', parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="1"
                  max="10"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Number of approvals required for auto-approval
                </p>
              </div>
            </div>
          </div>
        );

      case NodeType.AUTOMATED:
        return (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-700">Automated Action Settings</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={formData.title || ''}
                  onChange={(e) => handleFieldChange('title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter action title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Action
                </label>
                <select
                  value={(formData as any).actionId || ''}
                  onChange={(e) => handleFieldChange('actionId', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select an action</option>
                  <option value="send_email">Send Email</option>
                  <option value="generate_doc">Generate Document</option>
                  <option value="create_ticket">Create Support Ticket</option>
                  <option value="notify_slack">Send Slack Notification</option>
                </select>
              </div>
            </div>
          </div>
        );

      case NodeType.END:
        return (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-700">End Node Settings</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={formData.title || ''}
                  onChange={(e) => handleFieldChange('title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter end title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Message
                </label>
                <textarea
                  value={(formData as any).endMessage || ''}
                  onChange={(e) => handleFieldChange('endMessage', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Enter completion message"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={(formData as any).summaryEnabled || false}
                  onChange={(e) => handleFieldChange('summaryEnabled', e.target.checked)}
                  className="mr-2"
                />
                <label className="text-sm font-medium text-gray-700">
                  Enable workflow summary
                </label>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const renderDynamicFields = () => {
    if (Object.keys(dynamicFields).length === 0) return null;

    return (
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-gray-700">Additional Fields</h3>
        <div className="space-y-2">
          {Object.entries(dynamicFields).map(([key, value]) => (
            <div key={key} className="flex items-center space-x-2">
              <input
                type="text"
                value={key}
                onChange={(e) => {
                  const newFields = { ...dynamicFields };
                  delete newFields[key];
                  newFields[e.target.value] = value;
                  setDynamicFields(newFields);
                }}
                className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Field name"
              />
              <input
                type="text"
                value={value}
                onChange={(e) => handleDynamicFieldChange(key, e.target.value)}
                className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Field value"
              />
              <button
                onClick={() => removeDynamicField(key)}
                className="p-1 text-red-500 hover:bg-red-50 rounded"
              >
                ×
              </button>
            </div>
          ))}
        </div>
        <button
          onClick={addDynamicField}
          className="w-full px-3 py-2 text-sm bg-blue-50 text-blue-600 border border-blue-200 rounded hover:bg-blue-100"
        >
          + Add Field
        </button>
      </div>
    );
  };

  return (
    <div className="w-80 bg-white border-l border-gray-200 h-full overflow-y-auto">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Node Configuration</h2>
          <div className="text-xs text-gray-500 capitalize">
            {selectedNode.data.type}
          </div>
        </div>

        <div className="space-y-6">
          {renderNodeSpecificFields()}
          {renderDynamicFields()}

          <div className="pt-4 border-t border-gray-200">
            <button
              onClick={saveChanges}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
