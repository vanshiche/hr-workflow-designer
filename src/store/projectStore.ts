import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  Project, 
  WorkflowSummary, 
  DashboardStats, 
  ActivityItem, 
  Integration,
  ScheduledItem,
  TeamMember 
} from '../types/project.types';

interface ProjectState {
  // Projects and Workflows
  projects: Project[];
  workflows: WorkflowSummary[];
  currentProject: Project | null;
  currentWorkflow: WorkflowSummary | null;
  
  // Dashboard data
  dashboardStats: DashboardStats | null;
  
  // Other data
  integrations: Integration[];
  scheduledItems: ScheduledItem[];
  teamMembers: TeamMember[];
  
  // UI state
  currentView: string;
  isLoading: boolean;
  error: string | null;
}

interface ProjectActions {
  // Project management
  createProject: (name: string, description?: string) => Project;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  setCurrentProject: (project: Project | null) => void;
  
  // Workflow management
  createWorkflow: (projectId: string, name: string, description?: string) => WorkflowSummary;
  updateWorkflow: (id: string, updates: Partial<WorkflowSummary>) => void;
  deleteWorkflow: (id: string) => void;
  setCurrentWorkflow: (workflow: WorkflowSummary | null) => void;
  
  // Dashboard
  loadDashboardStats: () => Promise<void>;
  
  // Navigation
  setCurrentView: (view: string) => void;
  
  // Data loading
  loadProjects: () => Promise<void>;
  loadWorkflows: () => Promise<void>;
  loadIntegrations: () => Promise<void>;
  loadScheduledItems: () => Promise<void>;
  loadTeamMembers: () => Promise<void>;
  
  // Utility
  clearError: () => void;
  reset: () => void;
}

const generateId = () => `id_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

const mockProjects: Project[] = [
  {
    id: 'project_1',
    name: 'Employee Onboarding',
    description: 'Complete employee onboarding workflow',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T14:30:00Z',
    createdBy: 'user_1',
    status: 'active',
    workflows: [],
    tags: ['HR', 'Onboarding'],
    isFavorite: true,
  },
  {
    id: 'project_2',
    name: 'Leave Management',
    description: 'Leave request and approval process',
    createdAt: '2024-01-10T09:00:00Z',
    updatedAt: '2024-01-18T16:45:00Z',
    createdBy: 'user_1',
    status: 'active',
    workflows: [],
    tags: ['HR', 'Leave'],
    isFavorite: false,
  },
  {
    id: 'project_3',
    name: 'Performance Reviews',
    description: 'Annual performance review workflow',
    createdAt: '2024-01-05T11:00:00Z',
    updatedAt: '2024-01-22T10:15:00Z',
    createdBy: 'user_1',
    status: 'draft',
    workflows: [],
    tags: ['HR', 'Performance'],
    isFavorite: false,
  },
];

const mockWorkflows: WorkflowSummary[] = [
  {
    id: 'workflow_1',
    name: 'New Hire Onboarding',
    description: 'Complete onboarding process for new employees',
    projectId: 'project_1',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T14:30:00Z',
    status: 'published',
    nodeCount: 8,
    lastRunAt: '2024-01-22T09:00:00Z',
    runCount: 15,
    isTemplate: false,
  },
  {
    id: 'workflow_2',
    name: 'Leave Request',
    description: 'Employee leave request and approval',
    projectId: 'project_2',
    createdAt: '2024-01-10T09:00:00Z',
    updatedAt: '2024-01-18T16:45:00Z',
    status: 'published',
    nodeCount: 5,
    lastRunAt: '2024-01-21T14:30:00Z',
    runCount: 23,
    isTemplate: false,
  },
  {
    id: 'workflow_3',
    name: 'Document Generation',
    description: 'Automated document generation',
    projectId: 'project_1',
    createdAt: '2024-01-12T13:00:00Z',
    updatedAt: '2024-01-19T11:20:00Z',
    status: 'draft',
    nodeCount: 3,
    runCount: 0,
    isTemplate: false,
  },
];

const mockIntegrations: Integration[] = [
  {
    id: 'integration_1',
    name: 'HRIS System',
    type: 'hris',
    status: 'connected',
    lastSync: '2024-01-22T08:00:00Z',
    config: {},
  },
  {
    id: 'integration_2',
    name: 'Email Service',
    type: 'email',
    status: 'connected',
    lastSync: '2024-01-22T09:00:00Z',
    config: {},
  },
  {
    id: 'integration_3',
    name: 'Slack',
    type: 'slack',
    status: 'disconnected',
    config: {},
  },
];

const mockScheduledItems: ScheduledItem[] = [
  {
    id: 'schedule_1',
    name: 'Daily Onboarding Report',
    workflowId: 'workflow_1',
    schedule: '0 9 * * *',
    nextRun: '2024-01-23T09:00:00Z',
    lastRun: '2024-01-22T09:00:00Z',
    isActive: true,
  },
  // Add 10 more mock scheduled items to match the badge count
  ...Array.from({ length: 10 }, (_, i) => ({
    id: `schedule_${i + 2}`,
    name: `Scheduled Item ${i + 2}`,
    workflowId: `workflow_${(i % 3) + 1}`,
    schedule: '0 10 * * *',
    nextRun: '2024-01-23T10:00:00Z',
    isActive: true,
  })),
];

const mockTeamMembers: TeamMember[] = [
  {
    id: 'member_1',
    name: 'John Doe',
    email: 'john.doe@company.com',
    role: 'admin',
    lastActive: '2024-01-22T16:30:00Z',
    permissions: ['read', 'write', 'delete', 'admin'],
  },
  {
    id: 'member_2',
    name: 'Jane Smith',
    email: 'jane.smith@company.com',
    role: 'editor',
    lastActive: '2024-01-22T15:45:00Z',
    permissions: ['read', 'write'],
  },
  {
    id: 'member_3',
    name: 'Bob Johnson',
    email: 'bob.johnson@company.com',
    role: 'viewer',
    lastActive: '2024-01-21T14:20:00Z',
    permissions: ['read'],
  },
];

export const useProjectStore = create<ProjectState & ProjectActions>()(
  persist(
    (set, get) => ({
      // Initial state
      projects: mockProjects,
      workflows: mockWorkflows,
      currentProject: null,
      currentWorkflow: null,
      dashboardStats: null,
      integrations: mockIntegrations,
      scheduledItems: mockScheduledItems,
      teamMembers: mockTeamMembers,
      currentView: 'dashboard',
      isLoading: false,
      error: null,

      // Project management
      createProject: (name, description) => {
        const newProject: Project = {
          id: generateId(),
          name,
          description,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          createdBy: 'current_user',
          status: 'active',
          workflows: [],
          tags: [],
          isFavorite: false,
        };

        set((state) => ({
          projects: [...state.projects, newProject],
        }));

        return newProject;
      },

      updateProject: (id, updates) => {
        set((state) => ({
          projects: state.projects.map((project) =>
            project.id === id
              ? { ...project, ...updates, updatedAt: new Date().toISOString() }
              : project
          ),
        }));
      },

      deleteProject: (id) => {
        set((state) => ({
          projects: state.projects.filter((project) => project.id !== id),
          workflows: state.workflows.filter((workflow) => workflow.projectId !== id),
          currentProject: state.currentProject?.id === id ? null : state.currentProject,
        }));
      },

      setCurrentProject: (project) => {
        set({ currentProject: project });
      },

      // Workflow management
      createWorkflow: (projectId, name, description) => {
        const newWorkflow: WorkflowSummary = {
          id: generateId(),
          name,
          description,
          projectId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          status: 'draft',
          nodeCount: 0,
          runCount: 0,
          isTemplate: false,
        };

        set((state) => ({
          workflows: [...state.workflows, newWorkflow],
        }));

        return newWorkflow;
      },

      updateWorkflow: (id, updates) => {
        set((state) => ({
          workflows: state.workflows.map((workflow) =>
            workflow.id === id
              ? { ...workflow, ...updates, updatedAt: new Date().toISOString() }
              : workflow
          ),
        }));
      },

      deleteWorkflow: (id) => {
        set((state) => ({
          workflows: state.workflows.filter((workflow) => workflow.id !== id),
          currentWorkflow: state.currentWorkflow?.id === id ? null : state.currentWorkflow,
        }));
      },

      setCurrentWorkflow: (workflow) => {
        set({ currentWorkflow: workflow });
      },

      saveWorkflow: (workflowId: string, nodes: any[], edges: any[], workflowData: any) => {
        set((state) => ({
          workflows: state.workflows.map((workflow) =>
            workflow.id === workflowId
              ? { 
                  ...workflow, 
                  nodes, 
                  edges, 
                  workflowData,
                  nodeCount: nodes.length,
                  updatedAt: new Date().toISOString()
                }
              : workflow
          ),
        }));
      },

      loadWorkflow: (workflowId: string) => {
        const workflow = get().workflows.find(w => w.id === workflowId);
        if (workflow) {
          set({ 
            currentWorkflow: workflow,
            currentView: 'workflow-designer'
          });
          return workflow;
        }
        return null;
      },

      // Dashboard
      loadDashboardStats: async () => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const state = get();
          const stats: DashboardStats = {
            totalProjects: state.projects.length,
            totalWorkflows: state.workflows.length,
            activeWorkflows: state.workflows.filter(w => w.status === 'published').length,
            scheduledItems: state.scheduledItems.filter(s => s.isActive).length,
            recentActivity: [
              {
                id: 'activity_1',
                type: 'workflow_run',
                title: 'New Hire Onboarding executed',
                description: 'Successfully processed 5 new hires',
                timestamp: '2024-01-22T09:00:00Z',
                userId: 'user_1',
                workflowId: 'workflow_1',
              },
              {
                id: 'activity_2',
                type: 'workflow_created',
                title: 'New workflow created',
                description: 'Document Generation workflow created',
                timestamp: '2024-01-22T11:30:00Z',
                userId: 'user_1',
                projectId: 'project_1',
              },
            ],
            performanceMetrics: [
              {
                id: 'metric_1',
                name: 'Workflow Success Rate',
                value: 94.5,
                unit: '%',
                trend: 'up',
                change: 2.3,
              },
              {
                id: 'metric_2',
                name: 'Avg Execution Time',
                value: 2.8,
                unit: 'min',
                trend: 'down',
                change: -0.5,
              },
            ],
          };
          
          set({ dashboardStats: stats, isLoading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to load dashboard stats',
            isLoading: false 
          });
        }
      },

      // Navigation
      setCurrentView: (view) => {
        set({ currentView: view });
      },

      // Data loading
      loadProjects: async () => {
        set({ isLoading: true, error: null });
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          // Projects are already loaded from mock data
          set({ isLoading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to load projects',
            isLoading: false 
          });
        }
      },

      loadWorkflows: async () => {
        set({ isLoading: true, error: null });
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          // Workflows are already loaded from mock data
          set({ isLoading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to load workflows',
            isLoading: false 
          });
        }
      },

      loadIntegrations: async () => {
        set({ isLoading: true, error: null });
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          // Integrations are already loaded from mock data
          set({ isLoading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to load integrations',
            isLoading: false 
          });
        }
      },

      loadScheduledItems: async () => {
        set({ isLoading: true, error: null });
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          // Scheduled items are already loaded from mock data
          set({ isLoading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to load scheduled items',
            isLoading: false 
          });
        }
      },

      loadTeamMembers: async () => {
        set({ isLoading: true, error: null });
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          // Team members are already loaded from mock data
          set({ isLoading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to load team members',
            isLoading: false 
          });
        }
      },

      // Utility
      clearError: () => {
        set({ error: null });
      },

      reset: () => {
        set({
          currentProject: null,
          currentWorkflow: null,
          currentView: 'dashboard',
          isLoading: false,
          error: null,
        });
      },
    }),
    {
      name: 'project-store',
      partialize: (state) => ({
        projects: state.projects,
        workflows: state.workflows,
        currentProject: state.currentProject,
        currentWorkflow: state.currentWorkflow,
        currentView: state.currentView,
      }),
    }
  )
);
