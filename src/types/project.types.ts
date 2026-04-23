export interface Project {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  status: 'active' | 'archived' | 'draft';
  workflows: WorkflowSummary[];
  tags: string[];
  isFavorite: boolean;
}

export interface WorkflowSummary {
  id: string;
  name: string;
  description?: string;
  projectId: string;
  createdAt: string;
  updatedAt: string;
  status: 'draft' | 'published' | 'archived';
  nodeCount: number;
  lastRunAt?: string;
  runCount: number;
  isTemplate: boolean;
  nodes?: any[];
  edges?: any[];
  workflowData?: any;
}

export interface ComplianceRule {
  id: string;
  name: string;
  description: string;
  type: 'validation' | 'audit' | 'security';
  isActive: boolean;
  appliedTo: string[];
}

export interface ScheduledItem {
  id: string;
  name: string;
  workflowId: string;
  schedule: string; // cron expression
  nextRun: string;
  lastRun?: string;
  isActive: boolean;
}

export interface Integration {
  id: string;
  name: string;
  type: 'hris' | 'email' | 'document' | 'calendar' | 'slack' | 'api';
  status: 'connected' | 'disconnected' | 'error';
  lastSync?: string;
  config: Record<string, any>;
}

export interface NavigationItem {
  id: string;
  label: string;
  icon: string;
  badge?: number;
  children?: NavigationItem[];
  path: string;
  isActive: boolean;
}

export interface DashboardStats {
  totalProjects: number;
  totalWorkflows: number;
  activeWorkflows: number;
  scheduledItems: number;
  recentActivity: ActivityItem[];
  performanceMetrics: PerformanceMetric[];
}

export interface ActivityItem {
  id: string;
  type: 'workflow_created' | 'workflow_updated' | 'workflow_run' | 'project_created';
  title: string;
  description: string;
  timestamp: string;
  userId: string;
  projectId?: string;
  workflowId?: string;
}

export interface PerformanceMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  change: number;
}

export interface Integration {
  id: string;
  name: string;
  type: 'hris' | 'email' | 'document' | 'calendar' | 'slack' | 'api';
  status: 'connected' | 'disconnected' | 'error';
  lastSync?: string;
  config: Record<string, any>;
}

export interface ScheduledItem {
  id: string;
  name: string;
  workflowId: string;
  schedule: string; // cron expression
  nextRun: string;
  lastRun?: string;
  isActive: boolean;
}

export interface ComplianceRule {
  id: string;
  name: string;
  description: string;
  type: 'validation' | 'audit' | 'security';
  isActive: boolean;
  appliedTo: string[]; // project or workflow IDs
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'editor' | 'viewer';
  avatar?: string;
  lastActive: string;
  permissions: string[];
}
