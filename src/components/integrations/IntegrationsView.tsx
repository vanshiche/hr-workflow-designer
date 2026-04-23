import React, { useState } from 'react';
import { Integration } from '../../types/project.types';
import { cn } from '../../utils/cn';

export const IntegrationsView: React.FC = () => {
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: 'integration_1',
      name: 'HRIS System',
      type: 'hris',
      status: 'connected',
      lastSync: '2024-01-22T08:00:00Z',
      config: {
        apiKey: '•••••••••••••••',
        endpoint: 'https://api.hris.company.com',
        version: 'v2.1',
      },
    },
    {
      id: 'integration_2',
      name: 'Email Service',
      type: 'email',
      status: 'connected',
      lastSync: '2024-01-22T09:00:00Z',
      config: {
        provider: 'SendGrid',
        apiKey: '•••••••••••••••',
        fromEmail: 'noreply@company.com',
      },
    },
    {
      id: 'integration_3',
      name: 'Slack',
      type: 'slack',
      status: 'disconnected',
      config: {
        webhookUrl: '',
        channel: '#workflow-alerts',
      },
    },
    {
      id: 'integration_4',
      name: 'Document Management',
      type: 'document',
      status: 'connected',
      lastSync: '2024-01-22T07:30:00Z',
      config: {
        provider: 'SharePoint',
        siteUrl: 'https://company.sharepoint.com',
        library: 'Workflows',
      },
    },
    {
      id: 'integration_5',
      name: 'Calendar Service',
      type: 'calendar',
      status: 'error',
      lastSync: '2024-01-21T16:45:00Z',
      config: {
        provider: 'Google Calendar',
        calendarId: 'company@company.com',
      },
    },
  ]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);
  const [newIntegration, setNewIntegration] = useState({
    name: '',
    type: 'hris' as 'hris' | 'email' | 'document' | 'calendar' | 'slack' | 'api',
  });

  const handleCreateIntegration = () => {
    if (newIntegration.name.trim() && newIntegration.type) {
      const integration: Integration = {
        id: `integration_${Date.now()}`,
        name: newIntegration.name.trim(),
        type: newIntegration.type,
        status: 'disconnected',
        config: {},
      };
      
      setIntegrations([...integrations, integration]);
      setShowCreateModal(false);
      setNewIntegration({ name: '', type: 'hris' });
    }
  };

  const handleConnectIntegration = (integrationId: string) => {
    // Simulate connection process
    setIntegrations(items =>
      items.map(item =>
        item.id === integrationId
          ? { ...item, status: 'connected', lastSync: new Date().toISOString() }
          : item
      )
    );
  };

  const handleDisconnectIntegration = (integrationId: string) => {
    if (confirm('Are you sure you want to disconnect this integration?')) {
      setIntegrations(items =>
        items.map(item =>
          item.id === integrationId
            ? { ...item, status: 'disconnected' }
            : item
        )
      );
    }
  };

  const handleDeleteIntegration = (integrationId: string) => {
    if (confirm('Are you sure you want to delete this integration? This action cannot be undone.')) {
      setIntegrations(items => items.filter(item => item.id !== integrationId));
    }
  };

  const handleSyncIntegration = (integrationId: string) => {
    // Simulate sync process
    setIntegrations(items =>
      items.map(item =>
        item.id === integrationId
          ? { ...item, lastSync: new Date().toISOString() }
          : item
      )
    );
  };

  const getTypeIcon = (type: string): string => {
    switch (type) {
      case 'hris': return '👥';
      case 'email': return '📧';
      case 'document': return '📄';
      case 'calendar': return '📅';
      case 'slack': return '💬';
      case 'api': return '🔌';
      default: return '📦';
    }
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'connected': return 'bg-green-100 text-green-800';
      case 'disconnected': return 'bg-gray-100 text-gray-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string): string => {
    switch (status) {
      case 'connected': return '✅';
      case 'disconnected': return '⚪';
      case 'error': return '❌';
      default: return '⚪';
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const connectedIntegrations = integrations.filter(item => item.status === 'connected');
  const disconnectedIntegrations = integrations.filter(item => item.status === 'disconnected');
  const errorIntegrations = integrations.filter(item => item.status === 'error');

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Integrations</h1>
          <p className="text-gray-600">Manage external system connections and APIs</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          + Add Integration
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{integrations.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-xl">🔗</span>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Connected</p>
              <p className="text-2xl font-bold text-green-600">{connectedIntegrations.length}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-xl">✅</span>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Disconnected</p>
              <p className="text-2xl font-bold text-gray-600">{disconnectedIntegrations.length}</p>
            </div>
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
              <span className="text-xl">⚪</span>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Errors</p>
              <p className="text-2xl font-bold text-red-600">{errorIntegrations.length}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <span className="text-xl">❌</span>
            </div>
          </div>
        </div>
      </div>

      {/* Connected Integrations */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Connected Integrations</h2>
        <div className="space-y-3">
          {connectedIntegrations.map(integration => (
            <div key={integration.id} className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div className="text-2xl">{getTypeIcon(integration.type)}</div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-semibold text-gray-900">{integration.name}</h3>
                      <span className={cn('px-2 py-1 text-xs rounded-full', getStatusColor(integration.status))}>
                        {integration.status}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 mb-2">
                      Type: {integration.type.charAt(0).toUpperCase() + integration.type.slice(1)}
                    </div>
                    {integration.lastSync && (
                      <div className="text-sm text-gray-500">
                        Last sync: {formatDate(integration.lastSync)}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleSyncIntegration(integration.id)}
                    className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                  >
                    Sync
                  </button>
                  <button
                    onClick={() => handleDisconnectIntegration(integration.id)}
                    className="px-3 py-1 text-sm bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 transition-colors"
                  >
                    Disconnect
                  </button>
                  <button
                    onClick={() => handleDeleteIntegration(integration.id)}
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

      {/* Disconnected Integrations */}
      {disconnectedIntegrations.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Disconnected Integrations</h2>
          <div className="space-y-3">
            {disconnectedIntegrations.map(integration => (
              <div key={integration.id} className="bg-white border border-gray-200 rounded-lg p-4 opacity-60">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className="text-2xl grayscale">{getTypeIcon(integration.type)}</div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-semibold text-gray-700">{integration.name}</h3>
                        <span className={cn('px-2 py-1 text-xs rounded-full', getStatusColor(integration.status))}>
                          {integration.status}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500">
                        Type: {integration.type.charAt(0).toUpperCase() + integration.type.slice(1)}
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleConnectIntegration(integration.id)}
                      className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
                    >
                      Connect
                    </button>
                    <button
                      onClick={() => handleDeleteIntegration(integration.id)}
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

      {/* Error Integrations */}
      {errorIntegrations.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Integration Errors</h2>
          <div className="space-y-3">
            {errorIntegrations.map(integration => (
              <div key={integration.id} className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className="text-2xl">{getTypeIcon(integration.type)}</div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-semibold text-red-800">{integration.name}</h3>
                        <span className={cn('px-2 py-1 text-xs rounded-full', getStatusColor(integration.status))}>
                          {integration.status}
                        </span>
                      </div>
                      <div className="text-sm text-red-600 mb-1">
                        Connection failed. Please check your configuration.
                      </div>
                      {integration.lastSync && (
                        <div className="text-sm text-red-500">
                          Last attempt: {formatDate(integration.lastSync)}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleConnectIntegration(integration.id)}
                      className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
                    >
                      Retry
                    </button>
                    <button
                      onClick={() => handleDeleteIntegration(integration.id)}
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

      {/* Create Integration Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Add Integration</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Integration Name *
                </label>
                <input
                  type="text"
                  value={newIntegration.name}
                  onChange={(e) => setNewIntegration({ ...newIntegration, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter integration name"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Integration Type *
                </label>
                <select
                  value={newIntegration.type}
                  onChange={(e) => setNewIntegration({ ...newIntegration, type: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="hris">HRIS System</option>
                  <option value="email">Email Service</option>
                  <option value="document">Document Management</option>
                  <option value="calendar">Calendar Service</option>
                  <option value="slack">Slack</option>
                  <option value="api">Custom API</option>
                </select>
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={handleCreateIntegration}
                disabled={!newIntegration.name.trim()}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Add Integration
              </button>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setNewIntegration({ name: '', type: 'hris' });
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
