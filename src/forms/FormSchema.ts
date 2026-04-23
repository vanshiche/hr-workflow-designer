import { NodeType, FormField, NodeFormSchema, FieldType } from '../types/workflow.types';

// Form schema definitions for each node type
export const nodeFormSchemas: NodeFormSchema = {
  [NodeType.START]: [
    {
      name: 'title',
      label: 'Title',
      type: FieldType.TEXT,
      required: true,
      placeholder: 'Enter start node title',
    },
  ],
  
  [NodeType.TASK]: [
    {
      name: 'title',
      label: 'Title',
      type: FieldType.TEXT,
      required: true,
      placeholder: 'Enter task title',
    },
    {
      name: 'description',
      label: 'Description',
      type: FieldType.TEXTAREA,
      required: false,
      placeholder: 'Enter task description',
    },
    {
      name: 'assignee',
      label: 'Assignee',
      type: FieldType.TEXT,
      required: false,
      placeholder: 'Enter assignee name or email',
    },
    {
      name: 'dueDate',
      label: 'Due Date',
      type: FieldType.DATE,
      required: false,
    },
  ],
  
  [NodeType.APPROVAL]: [
    {
      name: 'title',
      label: 'Title',
      type: FieldType.TEXT,
      required: true,
      placeholder: 'Enter approval title',
    },
    {
      name: 'approverRole',
      label: 'Approver Role',
      type: FieldType.TEXT,
      required: false,
      placeholder: 'e.g., Manager, HR Director',
    },
    {
      name: 'autoApproveThreshold',
      label: 'Auto-approve Threshold',
      type: FieldType.NUMBER,
      required: false,
      validation: {
        min: 1,
        max: 10,
      },
    },
  ],
  
  [NodeType.AUTOMATED]: [
    {
      name: 'title',
      label: 'Title',
      type: FieldType.TEXT,
      required: true,
      placeholder: 'Enter action title',
    },
    {
      name: 'actionId',
      label: 'Action',
      type: FieldType.SELECT,
      required: true,
      options: [
        'send_email',
        'generate_doc',
        'create_ticket',
        'notify_slack',
      ],
    },
  ],
  
  [NodeType.END]: [
    {
      name: 'title',
      label: 'Title',
      type: FieldType.TEXT,
      required: true,
      placeholder: 'Enter end node title',
    },
    {
      name: 'endMessage',
      label: 'End Message',
      type: FieldType.TEXTAREA,
      required: false,
      placeholder: 'Enter completion message',
    },
    {
      name: 'summaryEnabled',
      label: 'Enable workflow summary',
      type: FieldType.BOOLEAN,
      required: false,
    },
  ],
};

// Dynamic field types that support key-value pairs
export const dynamicFieldTypes = {
  [NodeType.START]: 'metadata',
  [NodeType.TASK]: 'customFields',
  [NodeType.AUTOMATED]: 'parameters',
} as const;

// Validation functions
export const validateField = (field: FormField, value: any): string | null => {
  // Required field validation
  if (field.required && (!value || value === '')) {
    return `${field.label} is required`;
  }

  // Type-specific validation
  switch (field.type) {
    case FieldType.NUMBER:
      const numValue = Number(value);
      if (isNaN(numValue)) {
        return `${field.label} must be a number`;
      }
      if (field.validation?.min && numValue < field.validation.min) {
        return `${field.label} must be at least ${field.validation.min}`;
      }
      if (field.validation?.max && numValue > field.validation.max) {
        return `${field.label} must be at most ${field.validation.max}`;
      }
      break;

    case FieldType.TEXT:
    case FieldType.TEXTAREA:
      if (field.validation?.pattern && !new RegExp(field.validation.pattern).test(value)) {
        return `${field.label} format is invalid`;
      }
      break;

    case FieldType.SELECT:
      if (field.options && !field.options.includes(value)) {
        return `${field.label} must be one of the provided options`;
      }
      break;

    default:
      break;
  }

  return null;
};

// Get form schema for a specific node type
export const getFormSchema = (nodeType: NodeType): FormField[] => {
  return nodeFormSchemas[nodeType] || [];
};

// Check if a node type supports dynamic fields
export const supportsDynamicFields = (nodeType: NodeType): boolean => {
  return nodeType in dynamicFieldTypes;
};

// Get the dynamic field property name for a node type
export const getDynamicFieldProperty = (nodeType: NodeType): string => {
  return dynamicFieldTypes[nodeType as keyof typeof dynamicFieldTypes] || '';
};
