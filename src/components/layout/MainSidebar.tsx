import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { NavigationItem, Project, WorkflowSummary } from '../../types/project.types';
import { cn } from '../../utils/cn';

interface MainSidebarProps {
  projects: Project[];
  workflows: WorkflowSummary[];
}

export const MainSidebar: React.FC<MainSidebarProps> = ({
  projects,
  workflows,
}) => {
  const location = useLocation();
  const currentPath = location.pathname;
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['general', 'automation']));

  const navigationItems: NavigationItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: '📊',
      path: '/dashboard',
      isActive: currentPath === '/dashboard',
    },
    {
      id: 'general',
      label: 'General',
      icon: '📁',
      path: '/general',
      isActive: false,
      children: [
        {
          id: 'compliance',
          label: 'Compliance',
          icon: '✅',
          path: '/compliance',
          isActive: currentPath === '/compliance',
        },
        {
          id: 'scheduler',
          label: 'Scheduler',
          icon: '⏰',
          badge: 11,
          path: '/scheduler',
          isActive: currentPath === '/scheduler',
        },
        {
          id: 'analytics',
          label: 'Analytics',
          icon: '📈',
          path: '/analytics',
          isActive: currentPath === '/analytics',
        },
      ],
    },
    {
      id: 'automation',
      label: 'Automation',
      icon: '🤖',
      path: '/automation',
      isActive: false,
      children: [
        {
          id: 'workflows',
          label: 'Workflows',
          icon: '⚡',
          badge: workflows.length,
          path: '/workflows',
          isActive: currentPath === '/workflows',
        },
        {
          id: 'integrations',
          label: 'Integrations',
          icon: '🔗',
          path: '/integrations',
          isActive: currentPath === '/integrations',
        },
        {
          id: 'repository',
          label: 'Repository',
          icon: '📦',
          path: '/repository',
          isActive: currentPath === '/repository',
        },
      ],
    },
    {
      id: 'resources',
      label: 'Resources',
      icon: '📚',
      path: '/resources',
      isActive: false,
      children: [
        {
          id: 'members',
          label: 'Member',
          icon: '👥',
          path: '/members',
          isActive: currentPath === '/members',
        },
        {
          id: 'templates',
          label: 'Templates',
          icon: '📄',
          path: '/templates',
          isActive: currentPath === '/templates',
        },
        {
          id: 'documentation',
          label: 'Documentation',
          icon: '📖',
          path: '/docs',
          isActive: currentPath === '/docs',
        },
      ],
    },
  ];

  const toggleSection = (sectionId: string) => {
    // Clear all expanded sections and only keep the clicked one
    const newExpanded = new Set<string>();
    if (!expandedSections.has(sectionId)) {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const renderNavigationItem = (item: NavigationItem, level: number = 0) => {
    const isExpanded = expandedSections.has(item.id);
    const hasChildren = item.children && item.children.length > 0;

    return (
      <div key={item.id}>
        {hasChildren ? (
          <button
            onClick={() => toggleSection(item.id)}
            className={cn(
              'w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-colors',
              'hover:bg-gray-100',
              level > 0 && 'pl-6'
            )}
          >
            <div className="flex items-center space-x-3">
              <span className="text-lg">{item.icon}</span>
              <span>{item.label}</span>
            </div>
            <div className="flex items-center space-x-2">
              {item.badge && (
                <span className="bg-gray-200 text-gray-600 text-xs px-2 py-1 rounded-full">
                  {item.badge}
                </span>
              )}
              <span className={cn(
                'text-gray-400 transition-transform',
                isExpanded && 'rotate-90'
              )}>
                ▶
              </span>
            </div>
          </button>
        ) : (
          <Link
            to={item.path}
            className={cn(
              'w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-colors',
              'hover:bg-gray-100',
              item.isActive && 'bg-blue-50 text-blue-600',
              level > 0 && 'pl-6'
            )}
          >
            <div className="flex items-center space-x-3">
              <span className="text-lg">{item.icon}</span>
              <span>{item.label}</span>
            </div>
            <div className="flex items-center space-x-2">
              {item.badge && (
                <span className="bg-gray-200 text-gray-600 text-xs px-2 py-1 rounded-full">
                  {item.badge}
                </span>
              )}
            </div>
          </Link>
        )}
        
        {hasChildren && isExpanded && (
          <div className="mt-1 space-y-1">
            {item.children!.map(child => renderNavigationItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  const recentProjects = projects.slice(0, 3);

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-full flex flex-col">
      {/* Logo */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">CA</span>
          </div>
          <div>
            <h1 className="font-bold text-gray-900">CodeAuto</h1>
            <p className="text-xs text-gray-500">Workflow Automation</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-2">
          {navigationItems.map(item => renderNavigationItem(item))}
        </div>

        {/* Recent Projects */}
        {recentProjects.length > 0 && (
          <div className="mt-8">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Recent Projects
            </h3>
            <div className="space-y-2">
              {recentProjects.map(project => (
                <Link
                  key={project.id}
                  to="/workflow-designer"
                  className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="truncate">{project.name}</span>
                    </div>
                    <span className="text-xs text-gray-400">
                      {project.workflows.length}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-gray-200 space-y-2">
        <Link
          to="/settings"
          className="w-full flex items-center space-x-3 px-3 py-2 text-sm rounded-lg hover:bg-gray-100 transition-colors"
        >
          <span>⚙️</span>
          <span>Settings</span>
        </Link>
        <Link
          to="/help"
          className="w-full flex items-center space-x-3 px-3 py-2 text-sm rounded-lg hover:bg-gray-100 transition-colors"
        >
          <span>❓</span>
          <span>Help & Support</span>
        </Link>
      </div>
    </div>
  );
};
