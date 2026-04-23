import React from 'react';
import { FormField, FieldType, WorkflowNodeData } from '../types/workflow.types';
import { cn } from '../utils/cn';

interface DynamicFormProps {
  schema: FormField[];
  data: Partial<WorkflowNodeData>;
  onChange: (field: string, value: any) => void;
  errors?: Record<string, string>;
}

export const DynamicForm: React.FC<DynamicFormProps> = ({
  schema,
  data,
  onChange,
  errors = {},
}) => {
  const renderField = (field: FormField) => {
    const value = data[field.name as keyof WorkflowNodeData] || '';
    const error = errors[field.name];

    const baseInputClasses = cn(
      'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500',
      error
        ? 'border-red-300 focus:ring-red-500'
        : 'border-gray-300'
    );

    const renderInput = () => {
      switch (field.type) {
        case FieldType.TEXT:
          return (
            <input
              type="text"
              value={value as string}
              onChange={(e) => onChange(field.name, e.target.value)}
              className={baseInputClasses}
              placeholder={field.placeholder}
              required={field.required}
            />
          );

        case FieldType.TEXTAREA:
          return (
            <textarea
              value={value as string}
              onChange={(e) => onChange(field.name, e.target.value)}
              className={cn(baseInputClasses, 'resize-none')}
              rows={3}
              placeholder={field.placeholder}
              required={field.required}
            />
          );

        case FieldType.NUMBER:
          return (
            <input
              type="number"
              value={value as number}
              onChange={(e) => onChange(field.name, (parseInt(e.target.value) || 0) as unknown as number)}
              className={baseInputClasses}
              placeholder={field.placeholder}
              required={field.required}
              min={field.validation?.min}
              max={field.validation?.max}
            />
          );

        case FieldType.DATE:
          return (
            <input
              type="date"
              value={value as string}
              onChange={(e) => onChange(field.name, e.target.value)}
              className={baseInputClasses}
              required={field.required}
            />
          );

        case FieldType.SELECT:
          return (
            <select
              value={value as string}
              onChange={(e) => onChange(field.name, e.target.value)}
              className={baseInputClasses}
              required={field.required}
            >
              <option value="">Select an option</option>
              {field.options?.map((option) => (
                <option key={option} value={option}>
                  {option.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </option>
              ))}
            </select>
          );

        case FieldType.BOOLEAN:
          return (
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={(value as unknown) as boolean || false}
                onChange={(e) => onChange(field.name, e.target.checked)}
                className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                required={field.required}
              />
              <label className="text-sm text-gray-700">
                {field.label}
              </label>
            </div>
          );

        default:
          return null;
      }
    };

    return (
      <div key={field.name} className="space-y-1">
        {field.type !== FieldType.BOOLEAN && (
          <label className="block text-sm font-medium text-gray-700">
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        {renderInput()}
        {error && (
          <p className="text-xs text-red-600">{error}</p>
        )}
        {field.validation && (
          <p className="text-xs text-gray-500">
            {field.validation.min && `Min: ${field.validation.min}`}
            {field.validation.max && `Max: ${field.validation.max}`}
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {schema.map(renderField)}
    </div>
  );
};
