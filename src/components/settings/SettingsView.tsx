import React, { useState } from 'react';
import { cn } from '../../utils/cn';

interface SettingsSection {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export const SettingsView: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('general');
  const [settings, setSettings] = useState({
    // General Settings
    companyName: 'ACME Corporation',
    timezone: 'UTC',
    language: 'en',
    dateFormat: 'MM/DD/YYYY',
    theme: 'light',
    
    // Notification Settings
    emailNotifications: true,
    pushNotifications: false,
    workflowCompletionAlerts: true,
    errorAlerts: true,
    weeklyDigest: false,
    
    // Security Settings
    twoFactorAuth: false,
    sessionTimeout: 30,
    passwordExpiry: 90,
    apiAccessEnabled: true,
    
    // Workflow Settings
    autoSave: true,
    autoSaveInterval: 5,
    defaultWorkflowTimeout: 60,
    maxConcurrentWorkflows: 10,
    
    // Integration Settings
    slackEnabled: false,
    slackWebhook: '',
    emailProvider: 'sendgrid',
    smtpSettings: {
      host: '',
      port: 587,
      username: '',
      password: '',
    },
  });

  const sections: SettingsSection[] = [
    {
      id: 'general',
      title: 'General',
      description: 'Basic application settings',
      icon: '⚙️',
    },
    {
      id: 'notifications',
      title: 'Notifications',
      description: 'Email and push notification preferences',
      icon: '🔔',
    },
    {
      id: 'security',
      title: 'Security',
      description: 'Security and authentication settings',
      icon: '🔒',
    },
    {
      id: 'workflows',
      title: 'Workflows',
      description: 'Workflow execution and behavior settings',
      icon: '⚡',
    },
    {
      id: 'integrations',
      title: 'Integrations',
      description: 'External service integrations',
      icon: '🔗',
    },
    {
      id: 'advanced',
      title: 'Advanced',
      description: 'Advanced system settings',
      icon: '🔧',
    },
  ];

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSaveSettings = () => {
    console.log('Saving settings:', settings);
    // Show success message
    alert('Settings saved successfully!');
  };

  const handleResetSettings = () => {
    if (confirm('Are you sure you want to reset all settings to default values?')) {
      // Reset to default values
      setSettings({
        companyName: 'ACME Corporation',
        timezone: 'UTC',
        language: 'en',
        dateFormat: 'MM/DD/YYYY',
        theme: 'light',
        emailNotifications: true,
        pushNotifications: false,
        workflowCompletionAlerts: true,
        errorAlerts: true,
        weeklyDigest: false,
        twoFactorAuth: false,
        sessionTimeout: 30,
        passwordExpiry: 90,
        apiAccessEnabled: true,
        autoSave: true,
        autoSaveInterval: 5,
        defaultWorkflowTimeout: 60,
        maxConcurrentWorkflows: 10,
        slackEnabled: false,
        slackWebhook: '',
        emailProvider: 'sendgrid',
        smtpSettings: {
          host: '',
          port: 587,
          username: '',
          password: '',
        },
      });
    }
  };

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Company Name
        </label>
        <input
          type="text"
          value={settings.companyName}
          onChange={(e) => handleSettingChange('companyName', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Timezone
          </label>
          <select
            value={settings.timezone}
            onChange={(e) => handleSettingChange('timezone', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="UTC">UTC</option>
            <option value="EST">EST</option>
            <option value="PST">PST</option>
            <option value="CET">CET</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Language
          </label>
          <select
            value={settings.language}
            onChange={(e) => handleSettingChange('language', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
          </select>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date Format
          </label>
          <select
            value={settings.dateFormat}
            onChange={(e) => handleSettingChange('dateFormat', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Theme
          </label>
          <select
            value={settings.theme}
            onChange={(e) => handleSettingChange('theme', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="auto">Auto</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-gray-900">Email Notifications</h4>
            <p className="text-sm text-gray-600">Receive email updates about your workflows</p>
          </div>
          <button
            onClick={() => handleSettingChange('emailNotifications', !settings.emailNotifications)}
            className={cn(
              'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
              settings.emailNotifications ? 'bg-blue-600' : 'bg-gray-200'
            )}
          >
            <span
              className={cn(
                'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                settings.emailNotifications ? 'translate-x-6' : 'translate-x-1'
              )}
            />
          </button>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-gray-900">Push Notifications</h4>
            <p className="text-sm text-gray-600">Receive browser push notifications</p>
          </div>
          <button
            onClick={() => handleSettingChange('pushNotifications', !settings.pushNotifications)}
            className={cn(
              'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
              settings.pushNotifications ? 'bg-blue-600' : 'bg-gray-200'
            )}
          >
            <span
              className={cn(
                'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                settings.pushNotifications ? 'translate-x-6' : 'translate-x-1'
              )}
            />
          </button>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-gray-900">Workflow Completion Alerts</h4>
            <p className="text-sm text-gray-600">Get notified when workflows complete</p>
          </div>
          <button
            onClick={() => handleSettingChange('workflowCompletionAlerts', !settings.workflowCompletionAlerts)}
            className={cn(
              'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
              settings.workflowCompletionAlerts ? 'bg-blue-600' : 'bg-gray-200'
            )}
          >
            <span
              className={cn(
                'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                settings.workflowCompletionAlerts ? 'translate-x-6' : 'translate-x-1'
              )}
            />
          </button>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-gray-900">Error Alerts</h4>
            <p className="text-sm text-gray-600">Get notified when workflows encounter errors</p>
          </div>
          <button
            onClick={() => handleSettingChange('errorAlerts', !settings.errorAlerts)}
            className={cn(
              'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
              settings.errorAlerts ? 'bg-blue-600' : 'bg-gray-200'
            )}
          >
            <span
              className={cn(
                'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                settings.errorAlerts ? 'translate-x-6' : 'translate-x-1'
              )}
            />
          </button>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-gray-900">Weekly Digest</h4>
            <p className="text-sm text-gray-600">Receive weekly summary of workflow activity</p>
          </div>
          <button
            onClick={() => handleSettingChange('weeklyDigest', !settings.weeklyDigest)}
            className={cn(
              'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
              settings.weeklyDigest ? 'bg-blue-600' : 'bg-gray-200'
            )}
          >
            <span
              className={cn(
                'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                settings.weeklyDigest ? 'translate-x-6' : 'translate-x-1'
              )}
            />
          </button>
        </div>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-gray-900">Two-Factor Authentication</h4>
            <p className="text-sm text-gray-600">Require 2FA for all admin users</p>
          </div>
          <button
            onClick={() => handleSettingChange('twoFactorAuth', !settings.twoFactorAuth)}
            className={cn(
              'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
              settings.twoFactorAuth ? 'bg-blue-600' : 'bg-gray-200'
            )}
          >
            <span
              className={cn(
                'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                settings.twoFactorAuth ? 'translate-x-6' : 'translate-x-1'
              )}
            />
          </button>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Session Timeout (minutes)
          </label>
          <input
            type="number"
            value={settings.sessionTimeout}
            onChange={(e) => handleSettingChange('sessionTimeout', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="5"
            max="120"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Password Expiry (days)
          </label>
          <input
            type="number"
            value={settings.passwordExpiry}
            onChange={(e) => handleSettingChange('passwordExpiry', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="30"
            max="365"
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-gray-900">API Access</h4>
            <p className="text-sm text-gray-600">Enable API access for external integrations</p>
          </div>
          <button
            onClick={() => handleSettingChange('apiAccessEnabled', !settings.apiAccessEnabled)}
            className={cn(
              'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
              settings.apiAccessEnabled ? 'bg-blue-600' : 'bg-gray-200'
            )}
          >
            <span
              className={cn(
                'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                settings.apiAccessEnabled ? 'translate-x-6' : 'translate-x-1'
              )}
            />
          </button>
        </div>
      </div>
    </div>
  );

  const renderWorkflowSettings = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-gray-900">Auto-save Workflows</h4>
            <p className="text-sm text-gray-600">Automatically save workflow changes</p>
          </div>
          <button
            onClick={() => handleSettingChange('autoSave', !settings.autoSave)}
            className={cn(
              'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
              settings.autoSave ? 'bg-blue-600' : 'bg-gray-200'
            )}
          >
            <span
              className={cn(
                'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                settings.autoSave ? 'translate-x-6' : 'translate-x-1'
              )}
            />
          </button>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Auto-save Interval (minutes)
          </label>
          <input
            type="number"
            value={settings.autoSaveInterval}
            onChange={(e) => handleSettingChange('autoSaveInterval', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="1"
            max="30"
            disabled={!settings.autoSave}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Default Workflow Timeout (minutes)
          </label>
          <input
            type="number"
            value={settings.defaultWorkflowTimeout}
            onChange={(e) => handleSettingChange('defaultWorkflowTimeout', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="1"
            max="120"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Maximum Concurrent Workflows
          </label>
          <input
            type="number"
            value={settings.maxConcurrentWorkflows}
            onChange={(e) => handleSettingChange('maxConcurrentWorkflows', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="1"
            max="50"
          />
        </div>
      </div>
    </div>
  );

  const renderIntegrationSettings = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-gray-900">Slack Integration</h4>
            <p className="text-sm text-gray-600">Send notifications to Slack channels</p>
          </div>
          <button
            onClick={() => handleSettingChange('slackEnabled', !settings.slackEnabled)}
            className={cn(
              'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
              settings.slackEnabled ? 'bg-blue-600' : 'bg-gray-200'
            )}
          >
            <span
              className={cn(
                'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                settings.slackEnabled ? 'translate-x-6' : 'translate-x-1'
              )}
            />
          </button>
        </div>
        
        {settings.slackEnabled && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Slack Webhook URL
            </label>
            <input
              type="url"
              value={settings.slackWebhook}
              onChange={(e) => handleSettingChange('slackWebhook', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://hooks.slack.com/services/..."
            />
          </div>
        )}
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Provider
          </label>
          <select
            value={settings.emailProvider}
            onChange={(e) => handleSettingChange('emailProvider', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="sendgrid">SendGrid</option>
            <option value="ses">Amazon SES</option>
            <option value="smtp">Custom SMTP</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderAdvancedSettings = () => (
    <div className="space-y-6">
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h4 className="font-medium text-yellow-800 mb-2">⚠️ Advanced Settings</h4>
        <p className="text-sm text-yellow-700 mb-4">
          These settings are for advanced users only. Incorrect configuration may cause system instability.
        </p>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Debug Mode
          </label>
          <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="off">Off</option>
            <option value="basic">Basic</option>
            <option value="verbose">Verbose</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Log Level
          </label>
          <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="error">Error</option>
            <option value="warn">Warning</option>
            <option value="info">Info</option>
            <option value="debug">Debug</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cache TTL (seconds)
          </label>
          <input
            type="number"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            defaultValue="300"
            min="60"
            max="3600"
          />
        </div>
      </div>
    </div>
  );

  const renderSection = () => {
    switch (activeSection) {
      case 'general':
        return renderGeneralSettings();
      case 'notifications':
        return renderNotificationSettings();
      case 'security':
        return renderSecuritySettings();
      case 'workflows':
        return renderWorkflowSettings();
      case 'integrations':
        return renderIntegrationSettings();
      case 'advanced':
        return renderAdvancedSettings();
      default:
        return renderGeneralSettings();
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600">Manage your application preferences and configuration</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handleResetSettings}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Reset to Default
          </button>
          <button
            onClick={handleSaveSettings}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Save Settings
          </button>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Sidebar */}
        <div className="w-64">
          <nav className="space-y-1">
            {sections.map(section => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={cn(
                  'w-full flex items-center space-x-3 px-3 py-2 text-sm rounded-lg transition-colors',
                  activeSection === section.id
                    ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600'
                    : 'text-gray-700 hover:bg-gray-50'
                )}
              >
                <span className="text-lg">{section.icon}</span>
                <div className="text-left">
                  <div className="font-medium">{section.title}</div>
                  <div className="text-xs text-gray-500">{section.description}</div>
                </div>
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              {sections.find(s => s.id === activeSection)?.title}
            </h2>
            {renderSection()}
          </div>
        </div>
      </div>
    </div>
  );
};
