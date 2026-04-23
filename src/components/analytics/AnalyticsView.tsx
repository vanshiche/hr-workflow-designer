import React, { useState } from 'react';
import { cn } from '../../utils/cn';

interface AnalyticsData {
  workflowPerformance: {
    id: string;
    name: string;
    runs: number;
    successRate: number;
    avgDuration: number;
    lastRun: string;
  }[];
  systemMetrics: {
    cpu: number;
    memory: number;
    disk: number;
    network: number;
  };
  trends: {
    period: string;
    workflows: number;
    runs: number;
    errors: number;
  }[];
}

export const AnalyticsView: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');
  const [selectedMetric, setSelectedMetric] = useState<'performance' | 'usage' | 'errors'>('performance');

  const analyticsData: AnalyticsData = {
    workflowPerformance: [
      {
        id: 'workflow_1',
        name: 'New Hire Onboarding',
        runs: 156,
        successRate: 94.2,
        avgDuration: 3.2,
        lastRun: '2024-01-22T14:30:00Z',
      },
      {
        id: 'workflow_2',
        name: 'Leave Request',
        runs: 89,
        successRate: 98.9,
        avgDuration: 1.8,
        lastRun: '2024-01-22T16:45:00Z',
      },
      {
        id: 'workflow_3',
        name: 'Document Generation',
        runs: 45,
        successRate: 91.1,
        avgDuration: 2.1,
        lastRun: '2024-01-22T11:20:00Z',
      },
    ],
    systemMetrics: {
      cpu: 65,
      memory: 78,
      disk: 42,
      network: 23,
    },
    trends: [
      { period: 'Mon', workflows: 12, runs: 45, errors: 2 },
      { period: 'Tue', workflows: 15, runs: 52, errors: 1 },
      { period: 'Wed', workflows: 18, runs: 61, errors: 3 },
      { period: 'Thu', workflows: 14, runs: 48, errors: 0 },
      { period: 'Fri', workflows: 20, runs: 73, errors: 2 },
      { period: 'Sat', workflows: 8, runs: 28, errors: 0 },
      { period: 'Sun', workflows: 6, runs: 22, errors: 1 },
    ],
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getSuccessRateColor = (rate: number): string => {
    if (rate >= 95) return 'text-green-600';
    if (rate >= 90) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getDurationColor = (duration: number): string => {
    if (duration <= 2) return 'text-green-600';
    if (duration <= 5) return 'text-yellow-600';
    return 'text-red-600';
  };

  const totalRuns = analyticsData.workflowPerformance.reduce((sum, wf) => sum + wf.runs, 0);
  const avgSuccessRate = analyticsData.workflowPerformance.reduce((sum, wf) => sum + wf.successRate, 0) / analyticsData.workflowPerformance.length;
  const avgDuration = analyticsData.workflowPerformance.reduce((sum, wf) => sum + wf.avgDuration, 0) / analyticsData.workflowPerformance.length;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600">Monitor workflow performance and system metrics</p>
        </div>
        <div className="flex space-x-2">
          {(['7d', '30d', '90d'] as const).map(range => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={cn(
                'px-3 py-2 text-sm rounded-lg transition-colors',
                timeRange === range
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              )}
            >
              {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : '90 Days'}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Runs</p>
              <p className="text-2xl font-bold text-gray-900">{totalRuns}</p>
              <p className="text-xs text-green-600 mt-1">↑ 12% from last period</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-xl">🚀</span>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Success Rate</p>
              <p className="text-2xl font-bold text-green-600">{avgSuccessRate.toFixed(1)}%</p>
              <p className="text-xs text-green-600 mt-1">↑ 2.3% from last period</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-xl">✅</span>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Duration</p>
              <p className="text-2xl font-bold text-blue-600">{avgDuration.toFixed(1)}s</p>
              <p className="text-xs text-green-600 mt-1">↓ 0.5s from last period</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-xl">⏱️</span>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Workflows</p>
              <p className="text-2xl font-bold text-purple-600">{analyticsData.workflowPerformance.length}</p>
              <p className="text-xs text-gray-600 mt-1">No change</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <span className="text-xl">⚡</span>
            </div>
          </div>
        </div>
      </div>

      {/* Metric Tabs */}
      <div className="bg-white border border-gray-200 rounded-lg mb-6">
        <div className="border-b border-gray-200">
          <div className="flex space-x-8 px-6">
            {(['performance', 'usage', 'errors'] as const).map(metric => (
              <button
                key={metric}
                onClick={() => setSelectedMetric(metric)}
                className={cn(
                  'py-3 px-1 border-b-2 text-sm font-medium transition-colors',
                  selectedMetric === metric
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                )}
              >
                {metric === 'performance' ? 'Performance' : metric === 'usage' ? 'Usage' : 'Errors'}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          {selectedMetric === 'performance' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Workflow Performance</h3>
              <div className="space-y-4">
                {analyticsData.workflowPerformance.map(workflow => (
                  <div key={workflow.id} className="border-b border-gray-100 pb-4 last:border-0">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{workflow.name}</h4>
                      <span className="text-sm text-gray-500">Last run: {formatDate(workflow.lastRun)}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Runs</p>
                        <p className="font-semibold">{workflow.runs}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Success Rate</p>
                        <p className={cn('font-semibold', getSuccessRateColor(workflow.successRate))}>
                          {workflow.successRate}%
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Avg Duration</p>
                        <p className={cn('font-semibold', getDurationColor(workflow.avgDuration))}>
                          {workflow.avgDuration}s
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedMetric === 'usage' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Usage Trends</h3>
              <div className="space-y-4">
                {analyticsData.trends.map((trend, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <span className="text-sm font-medium text-gray-700 w-12">{trend.period}</span>
                      <div className="flex space-x-6 text-sm">
                        <span className="text-gray-600">{trend.workflows} workflows</span>
                        <span className="text-blue-600">{trend.runs} runs</span>
                      </div>
                    </div>
                    {trend.errors > 0 && (
                      <span className="text-sm text-red-600">{trend.errors} errors</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedMetric === 'errors' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Error Analysis</h3>
              <div className="space-y-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-red-600">⚠️</span>
                    <h4 className="font-medium text-red-800">Recent Errors</h4>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Authentication failures</span>
                      <span className="text-red-600">3 occurrences</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Timeout errors</span>
                      <span className="text-red-600">2 occurrences</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Data validation errors</span>
                      <span className="text-red-600">1 occurrence</span>
                    </div>
                  </div>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-yellow-600">⚡</span>
                    <h4 className="font-medium text-yellow-800">Performance Warnings</h4>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Slow workflows (&gt;5s)</span>
                      <span className="text-yellow-600">2 workflows</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">High memory usage</span>
                      <span className="text-yellow-600">1 workflow</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* System Metrics */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">System Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">CPU Usage</span>
              <span className="text-sm font-medium">{analyticsData.systemMetrics.cpu}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={cn(
                  'h-2 rounded-full transition-colors',
                  analyticsData.systemMetrics.cpu > 80 ? 'bg-red-500' :
                  analyticsData.systemMetrics.cpu > 60 ? 'bg-yellow-500' : 'bg-green-500'
                )}
                style={{ width: `${analyticsData.systemMetrics.cpu}%` }}
              />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Memory Usage</span>
              <span className="text-sm font-medium">{analyticsData.systemMetrics.memory}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={cn(
                  'h-2 rounded-full transition-colors',
                  analyticsData.systemMetrics.memory > 80 ? 'bg-red-500' :
                  analyticsData.systemMetrics.memory > 60 ? 'bg-yellow-500' : 'bg-green-500'
                )}
                style={{ width: `${analyticsData.systemMetrics.memory}%` }}
              />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Disk Usage</span>
              <span className="text-sm font-medium">{analyticsData.systemMetrics.disk}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={cn(
                  'h-2 rounded-full transition-colors',
                  analyticsData.systemMetrics.disk > 80 ? 'bg-red-500' :
                  analyticsData.systemMetrics.disk > 60 ? 'bg-yellow-500' : 'bg-green-500'
                )}
                style={{ width: `${analyticsData.systemMetrics.disk}%` }}
              />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Network I/O</span>
              <span className="text-sm font-medium">{analyticsData.systemMetrics.network}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={cn(
                  'h-2 rounded-full transition-colors',
                  analyticsData.systemMetrics.network > 80 ? 'bg-red-500' :
                  analyticsData.systemMetrics.network > 60 ? 'bg-yellow-500' : 'bg-green-500'
                )}
                style={{ width: `${analyticsData.systemMetrics.network}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
