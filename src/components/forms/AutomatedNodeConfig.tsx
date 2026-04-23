import React, { useEffect } from 'react';
import { useAutomations } from '../../hooks/useAutomations';
import { cn } from '../../utils/cn';

interface AutomatedNodeConfigProps {
  actionId: string;
  parameters: Record<string, string>;
  onActionChange: (actionId: string) => void;
  onParameterChange: (paramName: string, value: string) => void;
}

export const AutomatedNodeConfig: React.FC<AutomatedNodeConfigProps> = ({
  actionId,
  parameters,
  onActionChange,
  onParameterChange,
}) => {
  const { automations, loading, error, selectedAutomation, selectAutomation } = useAutomations();

  useEffect(() => {
    if (actionId) {
      selectAutomation(actionId);
    }
  }, [actionId, selectAutomation]);

  const handleActionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newActionId = e.target.value;
    onActionChange(newActionId);
    if (newActionId) {
      selectAutomation(newActionId);
    }
  };

  const renderParameterField = (param: any) => {
    const value = parameters[param.name] || '';

    const renderInput = () => {
      switch (param.type) {
        case 'text':
          return (
            <input
              type="text"
              value={value}
              onChange={(e) => onParameterChange(param.name, e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={param.placeholder}
              required={param.required}
            />
          );

        case 'textarea':
          return (
            <textarea
              value={value}
              onChange={(e) => onParameterChange(param.name, e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={3}
              placeholder={param.placeholder}
              required={param.required}
            />
          );

        case 'select':
          return (
            <select
              value={value}
              onChange={(e) => onParameterChange(param.name, e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required={param.required}
            >
              <option value="">Select an option</option>
              {param.options?.map((option: string) => (
                <option key={option} value={option}>
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </option>
              ))}
            </select>
          );

        case 'number':
          return (
            <input
              type="number"
              value={value}
              onChange={(e) => onParameterChange(param.name, e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={param.placeholder}
              required={param.required}
            />
          );

        default:
          return (
            <input
              type="text"
              value={value}
              onChange={(e) => onParameterChange(param.name, e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={param.placeholder}
              required={param.required}
            />
          );
        }
      };

    return (
      <div key={param.name} className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">
          {param.label}
          {param.required && <span className="text-red-500 ml-1">*</span>}
        </label>
        {renderInput()}
        {param.placeholder && (
          <p className="text-xs text-gray-500">{param.placeholder}</p>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-10 bg-gray-200 rounded mb-4"></div>
        <div className="space-y-3">
          <div className="h-8 bg-gray-200 rounded"></div>
          <div className="h-8 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md">
        <p className="text-sm text-red-600">Error loading automations: {error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 text-sm text-red-700 underline"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Action *
        </label>
        <select
          value={actionId}
          onChange={handleActionChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        >
          <option value="">Select an action</option>
          {automations.map((automation) => (
            <option key={automation.id} value={automation.id}>
              {automation.label}
            </option>
          ))}
        </select>
      </div>

      {selectedAutomation && (
        <div className="space-y-4">
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
            <h4 className="text-sm font-medium text-blue-800 mb-1">
              {selectedAutomation.label}
            </h4>
            {selectedAutomation.description && (
              <p className="text-xs text-blue-600">
                {selectedAutomation.description}
              </p>
            )}
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-gray-700">Parameters</h4>
            {selectedAutomation.params.length > 0 ? (
              selectedAutomation.params.map(renderParameterField)
            ) : (
              <p className="text-sm text-gray-500">No parameters required</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
