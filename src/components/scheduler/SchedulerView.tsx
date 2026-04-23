import React, { useState } from 'react';
import { ScheduledItem } from '../../types/project.types';
import { cn } from '../../utils/cn';

export const SchedulerView: React.FC = () => {
  const [scheduledItems, setScheduledItems] = useState<ScheduledItem[]>([
    {
      id: 'schedule_1',
      name: 'Daily Onboarding Report',
      workflowId: 'workflow_1',
      schedule: '0 9 * * *',
      nextRun: '2024-01-23T09:00:00Z',
      lastRun: '2024-01-22T09:00:00Z',
      isActive: true,
    },
    {
      id: 'schedule_2',
      name: 'Weekly Backup',
      workflowId: 'workflow_2',
      schedule: '0 2 * * 0',
      nextRun: '2024-01-28T02:00:00Z',
      lastRun: '2024-01-21T02:00:00Z',
      isActive: true,
    },
    {
      id: 'schedule_3',
      name: 'Monthly Compliance Check',
      workflowId: 'workflow_3',
      schedule: '0 6 1 * *',
      nextRun: '2024-02-01T06:00:00Z',
      lastRun: '2024-01-01T06:00:00Z',
      isActive: false,
    },
    {
      id: 'schedule_4',
      name: 'Hourly Health Check',
      workflowId: 'workflow_1',
      schedule: '0 * * * *',
      nextRun: '2024-01-22T15:00:00Z',
      lastRun: '2024-01-22T14:00:00Z',
      isActive: true,
    },
  ]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newSchedule, setNewSchedule] = useState({
    name: '',
    workflowId: '',
    schedule: '',
  });

  const workflows = [
    { id: 'workflow_1', name: 'New Hire Onboarding' },
    { id: 'workflow_2', name: 'Leave Request' },
    { id: 'workflow_3', name: 'Document Generation' },
  ];

  const handleCreateSchedule = () => {
    if (newSchedule.name.trim() && newSchedule.workflowId && newSchedule.schedule.trim()) {
      const schedule: ScheduledItem = {
        id: `schedule_${Date.now()}`,
        name: newSchedule.name.trim(),
        workflowId: newSchedule.workflowId,
        schedule: newSchedule.schedule.trim(),
        nextRun: calculateNextRun(newSchedule.schedule.trim()),
        isActive: true,
      };
      
      setScheduledItems([...scheduledItems, schedule]);
      setShowCreateModal(false);
      setNewSchedule({ name: '', workflowId: '', schedule: '' });
    }
  };

  const handleToggleSchedule = (scheduleId: string) => {
    setScheduledItems(items =>
      items.map(item =>
        item.id === scheduleId ? { ...item, isActive: !item.isActive } : item
      )
    );
  };

  const handleDeleteSchedule = (scheduleId: string) => {
    if (confirm('Are you sure you want to delete this scheduled item?')) {
      setScheduledItems(items => items.filter(item => item.id !== scheduleId));
    }
  };

  const calculateNextRun = (cronExpression: string): string => {
    // Simple mock calculation - in real app, use a cron parser library
    const now = new Date();
    const nextRun = new Date(now.getTime() + 24 * 60 * 60 * 1000); // Add 1 day
    return nextRun.toISOString();
  };

  const formatSchedule = (cronExpression: string): string => {
    // Simple cron to human readable conversion
    if (cronExpression === '0 9 * * *') return 'Daily at 9:00 AM';
    if (cronExpression === '0 2 * * 0') return 'Weekly on Sunday at 2:00 AM';
    if (cronExpression === '0 6 1 * *') return 'Monthly on 1st at 6:00 AM';
    if (cronExpression === '0 * * * *') return 'Hourly';
    return cronExpression;
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const getWorkflowName = (workflowId: string): string => {
    const workflow = workflows.find(w => w.id === workflowId);
    return workflow?.name || 'Unknown Workflow';
  };

  const activeSchedules = scheduledItems.filter(item => item.isActive);
  const inactiveSchedules = scheduledItems.filter(item => !item.isActive);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Scheduler</h1>
          <p className="text-gray-600">Manage scheduled workflow executions</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          + New Schedule
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Schedules</p>
              <p className="text-2xl font-bold text-gray-900">{scheduledItems.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-xl">⏰</span>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Schedules</p>
              <p className="text-2xl font-bold text-green-600">{activeSchedules.length}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-xl">▶️</span>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Next 24 Hours</p>
              <p className="text-2xl font-bold text-blue-600">
                {activeSchedules.filter(item => {
                  const nextRun = new Date(item.nextRun);
                  const now = new Date();
                  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
                  return nextRun <= tomorrow;
                }).length}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-xl">📅</span>
            </div>
          </div>
        </div>
      </div>

      {/* Active Schedules */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Active Schedules</h2>
        <div className="space-y-3">
          {activeSchedules.map(item => (
            <div key={item.id} className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="font-semibold text-gray-900">{item.name}</h3>
                    <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                      Active
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Workflow:</p>
                      <p className="font-medium">{getWorkflowName(item.workflowId)}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Schedule:</p>
                      <p className="font-medium">{formatSchedule(item.schedule)}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Next Run:</p>
                      <p className="font-medium">{formatDate(item.nextRun)}</p>
                    </div>
                  </div>
                  {item.lastRun && (
                    <div className="mt-2 text-sm text-gray-500">
                      Last run: {formatDate(item.lastRun)}
                    </div>
                  )}
                </div>
                <div className="flex space-x-2 ml-4">
                  <button
                    onClick={() => handleToggleSchedule(item.id)}
                    className="px-3 py-1 text-sm bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 transition-colors"
                  >
                    Pause
                  </button>
                  <button
                    onClick={() => handleDeleteSchedule(item.id)}
                    className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Inactive Schedules */}
      {inactiveSchedules.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Paused Schedules</h2>
          <div className="space-y-3">
            {inactiveSchedules.map(item => (
              <div key={item.id} className="bg-white border border-gray-200 rounded-lg p-4 opacity-60">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-semibold text-gray-700">{item.name}</h3>
                      <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                        Paused
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Workflow:</p>
                        <p className="font-medium">{getWorkflowName(item.workflowId)}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Schedule:</p>
                        <p className="font-medium">{formatSchedule(item.schedule)}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Next Run:</p>
                        <p className="font-medium">{formatDate(item.nextRun)}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={() => handleToggleSchedule(item.id)}
                      className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
                    >
                      Resume
                    </button>
                    <button
                      onClick={() => handleDeleteSchedule(item.id)}
                      className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Create Schedule Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Create Schedule</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Schedule Name *
                </label>
                <input
                  type="text"
                  value={newSchedule.name}
                  onChange={(e) => setNewSchedule({ ...newSchedule, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter schedule name"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Workflow *
                </label>
                <select
                  value={newSchedule.workflowId}
                  onChange={(e) => setNewSchedule({ ...newSchedule, workflowId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a workflow</option>
                  {workflows.map(workflow => (
                    <option key={workflow.id} value={workflow.id}>
                      {workflow.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cron Expression *
                </label>
                <input
                  type="text"
                  value={newSchedule.schedule}
                  onChange={(e) => setNewSchedule({ ...newSchedule, schedule: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 0 9 * * * (daily at 9 AM)"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Use cron format: minute hour day month weekday
                </p>
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={handleCreateSchedule}
                disabled={!newSchedule.name.trim() || !newSchedule.workflowId || !newSchedule.schedule.trim()}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Create Schedule
              </button>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setNewSchedule({ name: '', workflowId: '', schedule: '' });
                }}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
