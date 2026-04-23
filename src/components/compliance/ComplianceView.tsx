import React, { useState } from 'react';
import { ComplianceRule } from '../../types/project.types';
import { cn } from '../../utils/cn';

export const ComplianceView: React.FC = () => {
  const [complianceRules, setComplianceRules] = useState<ComplianceRule[]>([
    {
      id: 'comp_1',
      name: 'GDPR Data Protection',
      description: 'Ensure all workflows comply with GDPR data protection requirements',
      type: 'validation',
      isActive: true,
      appliedTo: ['project_1', 'project_2'],
    },
    {
      id: 'comp_2',
      name: 'SOX Audit Trail',
      description: 'Maintain comprehensive audit trails for all workflow activities',
      type: 'audit',
      isActive: true,
      appliedTo: ['project_1', 'project_3'],
    },
    {
      id: 'comp_3',
      name: 'Security Access Control',
      description: 'Enforce proper access controls and authentication',
      type: 'security',
      isActive: true,
      appliedTo: ['project_1', 'project_2', 'project_3'],
    },
    {
      id: 'comp_4',
      name: 'Data Retention Policy',
      description: 'Ensure data is retained according to company policy',
      type: 'validation',
      isActive: false,
      appliedTo: [],
    },
    {
      id: 'comp_5',
      name: 'Encryption Standards',
      description: 'All sensitive data must be encrypted at rest and in transit',
      type: 'security',
      isActive: true,
      appliedTo: ['project_1'],
    },
  ]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newRule, setNewRule] = useState({
    name: '',
    description: '',
    type: 'validation' as 'validation' | 'audit' | 'security',
  });

  const handleCreateRule = () => {
    if (newRule.name.trim() && newRule.description.trim()) {
      const rule: ComplianceRule = {
        id: `comp_${Date.now()}`,
        name: newRule.name.trim(),
        description: newRule.description.trim(),
        type: newRule.type,
        isActive: true,
        appliedTo: [],
      };
      
      setComplianceRules([...complianceRules, rule]);
      setShowCreateModal(false);
      setNewRule({ name: '', description: '', type: 'validation' });
    }
  };

  const handleToggleRule = (ruleId: string) => {
    setComplianceRules(rules =>
      rules.map(rule =>
        rule.id === ruleId ? { ...rule, isActive: !rule.isActive } : rule
      )
    );
  };

  const handleDeleteRule = (ruleId: string) => {
    if (confirm('Are you sure you want to delete this compliance rule?')) {
      setComplianceRules(rules => rules.filter(rule => rule.id !== ruleId));
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'validation': return '✅';
      case 'audit': return '📋';
      case 'security': return '🔒';
      default: return '📄';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'validation': return 'bg-green-100 text-green-800';
      case 'audit': return 'bg-blue-100 text-blue-800';
      case 'security': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const activeRules = complianceRules.filter(rule => rule.isActive);
  const inactiveRules = complianceRules.filter(rule => !rule.isActive);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Compliance</h1>
          <p className="text-gray-600">Manage compliance rules and regulatory requirements</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          + New Rule
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Rules</p>
              <p className="text-2xl font-bold text-gray-900">{complianceRules.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-xl">📋</span>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Rules</p>
              <p className="text-2xl font-bold text-green-600">{activeRules.length}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-xl">✅</span>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Inactive Rules</p>
              <p className="text-2xl font-bold text-gray-600">{inactiveRules.length}</p>
            </div>
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
              <span className="text-xl">⏸️</span>
            </div>
          </div>
        </div>
      </div>

      {/* Active Rules */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Active Rules</h2>
        <div className="space-y-3">
          {activeRules.map(rule => (
            <div key={rule.id} className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div className="text-2xl">{getTypeIcon(rule.type)}</div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-semibold text-gray-900">{rule.name}</h3>
                      <span className={cn('px-2 py-1 text-xs rounded-full', getTypeColor(rule.type))}>
                        {rule.type}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-2">{rule.description}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>Applied to {rule.appliedTo.length} projects</span>
                      <span>•</span>
                      <span className="text-green-600">Active</span>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleToggleRule(rule.id)}
                    className="px-3 py-1 text-sm bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 transition-colors"
                  >
                    Deactivate
                  </button>
                  <button
                    onClick={() => handleDeleteRule(rule.id)}
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

      {/* Inactive Rules */}
      {inactiveRules.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Inactive Rules</h2>
          <div className="space-y-3">
            {inactiveRules.map(rule => (
              <div key={rule.id} className="bg-white border border-gray-200 rounded-lg p-4 opacity-60">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className="text-2xl grayscale">{getTypeIcon(rule.type)}</div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-semibold text-gray-700">{rule.name}</h3>
                        <span className={cn('px-2 py-1 text-xs rounded-full', getTypeColor(rule.type))}>
                          {rule.type}
                        </span>
                      </div>
                      <p className="text-gray-500 text-sm mb-2">{rule.description}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-400">
                        <span>Applied to {rule.appliedTo.length} projects</span>
                        <span>•</span>
                        <span className="text-gray-500">Inactive</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleToggleRule(rule.id)}
                      className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
                    >
                      Activate
                    </button>
                    <button
                      onClick={() => handleDeleteRule(rule.id)}
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

      {/* Create Rule Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Create Compliance Rule</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rule Name *
                </label>
                <input
                  type="text"
                  value={newRule.name}
                  onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter rule name"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  value={newRule.description}
                  onChange={(e) => setNewRule({ ...newRule, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="Enter rule description"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rule Type *
                </label>
                <select
                  value={newRule.type}
                  onChange={(e) => setNewRule({ ...newRule, type: e.target.value as 'validation' | 'audit' | 'security' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="validation">Validation</option>
                  <option value="audit">Audit</option>
                  <option value="security">Security</option>
                </select>
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={handleCreateRule}
                disabled={!newRule.name.trim() || !newRule.description.trim()}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Create Rule
              </button>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setNewRule({ name: '', description: '', type: 'validation' });
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
