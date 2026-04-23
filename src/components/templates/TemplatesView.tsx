import React, { useState } from 'react';
import { cn } from '../../utils/cn';

interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number; // in minutes
  nodes: number;
  author: string;
  rating: number;
  downloads: number;
  tags: string[];
  preview: string; // base64 encoded image or URL
  createdAt: string;
  isOfficial: boolean;
  isPopular: boolean;
}

export const TemplatesView: React.FC = () => {
  const [templates, setTemplates] = useState<Template[]>([
    {
      id: 'template_1',
      name: 'Employee Onboarding',
      description: 'Complete employee onboarding workflow with document generation and notifications',
      category: 'HR',
      difficulty: 'intermediate',
      estimatedTime: 45,
      nodes: 8,
      author: 'HR Team',
      rating: 4.8,
      downloads: 234,
      tags: ['onboarding', 'hr', 'documents', 'notifications'],
      preview: '📋',
      createdAt: '2024-01-10T10:00:00Z',
      isOfficial: true,
      isPopular: true,
    },
    {
      id: 'template_2',
      name: 'Leave Request Approval',
      description: 'Simple leave request workflow with manager approval and calendar integration',
      category: 'HR',
      difficulty: 'beginner',
      estimatedTime: 20,
      nodes: 5,
      author: 'Jane Smith',
      rating: 4.5,
      downloads: 156,
      tags: ['leave', 'approval', 'calendar'],
      preview: '📅',
      createdAt: '2024-01-05T09:00:00Z',
      isOfficial: false,
      isPopular: true,
    },
    {
      id: 'template_3',
      name: 'Invoice Processing',
      description: 'Automated invoice processing with validation and payment integration',
      category: 'Finance',
      difficulty: 'advanced',
      estimatedTime: 60,
      nodes: 12,
      author: 'Finance Team',
      rating: 4.7,
      downloads: 89,
      tags: ['invoice', 'finance', 'automation', 'validation'],
      preview: '💰',
      createdAt: '2024-01-12T13:00:00Z',
      isOfficial: true,
      isPopular: false,
    },
    {
      id: 'template_4',
      name: 'Customer Support Ticket',
      description: 'Customer support ticket management with escalation and SLA tracking',
      category: 'Support',
      difficulty: 'intermediate',
      estimatedTime: 35,
      nodes: 7,
      author: 'Support Team',
      rating: 4.6,
      downloads: 178,
      tags: ['support', 'ticket', 'escalation', 'sla'],
      preview: '🎧',
      createdAt: '2024-01-08T11:00:00Z',
      isOfficial: false,
      isPopular: true,
    },
    {
      id: 'template_5',
      name: 'Document Review Process',
      description: 'Multi-stage document review with approval workflows and notifications',
      category: 'Legal',
      difficulty: 'advanced',
      estimatedTime: 50,
      nodes: 10,
      author: 'Legal Team',
      rating: 4.9,
      downloads: 67,
      tags: ['document', 'review', 'approval', 'legal'],
      preview: '📄',
      createdAt: '2024-01-15T14:00:00Z',
      isOfficial: true,
      isPopular: false,
    },
  ]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'rating' | 'downloads' | 'created'>('rating');

  const categories = ['All', 'HR', 'Finance', 'Support', 'Legal', 'IT', 'Marketing'];
  const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = filterCategory === 'all' || template.category === filterCategory;
    const matchesDifficulty = filterDifficulty === 'all' || template.difficulty === filterDifficulty.toLowerCase();
    return matchesSearch && matchesCategory && matchesDifficulty;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'rating':
        return b.rating - a.rating;
      case 'downloads':
        return b.downloads - a.downloads;
      case 'created':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      default:
        return 0;
    }
  });

  const handleUseTemplate = (templateId: string) => {
    setTemplates(templates =>
      templates.map(template =>
        template.id === templateId ? { ...template, downloads: template.downloads + 1 } : template
      )
    );
    console.log('Use template:', templateId);
    // Navigate to workflow designer with template
  };

  const handleCreateTemplate = () => {
    console.log('Create new template');
  };

  const getDifficultyColor = (difficulty: string): string => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyIcon = (difficulty: string): string => {
    switch (difficulty) {
      case 'beginner': return '🌟';
      case 'intermediate': return '⭐';
      case 'advanced': return '🔥';
      default: return '📋';
    }
  };

  const renderStars = (rating: number): string => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStar;
    
    return '⭐'.repeat(fullStars) + (halfStar ? '⭐' : '') + '☆'.repeat(emptyStars);
  };

  const stats = {
    total: templates.length,
    official: templates.filter(t => t.isOfficial).length,
    popular: templates.filter(t => t.isPopular).length,
    totalDownloads: templates.reduce((sum, t) => sum + t.downloads, 0),
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Templates</h1>
          <p className="text-gray-600">Browse and use workflow templates to get started quickly</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          + Create Template
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Templates</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-xl">📋</span>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Official</p>
              <p className="text-2xl font-bold text-purple-600">{stats.official}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <span className="text-xl">✨</span>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Popular</p>
              <p className="text-2xl font-bold text-orange-600">{stats.popular}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <span className="text-xl">🔥</span>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Downloads</p>
              <p className="text-2xl font-bold text-green-600">{stats.totalDownloads}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-xl">⬇️</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex items-center space-x-4 mb-6">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search templates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {categories.map(category => (
            <option key={category} value={category === 'All' ? 'all' : category}>
              {category}
            </option>
          ))}
        </select>
        <select
          value={filterDifficulty}
          onChange={(e) => setFilterDifficulty(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {difficulties.map(difficulty => (
            <option key={difficulty} value={difficulty === 'All' ? 'all' : difficulty.toLowerCase()}>
              {difficulty}
            </option>
          ))}
        </select>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="rating">Highest Rated</option>
          <option value="downloads">Most Downloaded</option>
          <option value="created">Newest First</option>
          <option value="name">Name A-Z</option>
        </select>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map(template => (
          <div key={template.id} className="bg-white border border-gray-200 rounded-lg hover:shadow-lg transition-shadow">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="text-3xl">{template.preview}</div>
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-semibold text-gray-900">{template.name}</h3>
                      {template.isOfficial && (
                        <span className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full">
                          Official
                        </span>
                      )}
                      {template.isPopular && (
                        <span className="px-2 py-1 text-xs bg-orange-100 text-orange-800 rounded-full">
                          Popular
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={cn('px-2 py-1 text-xs rounded-full', getDifficultyColor(template.difficulty))}>
                        {getDifficultyIcon(template.difficulty)} {template.difficulty}
                      </span>
                      <span className="text-xs text-gray-500">{template.category}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-600 mb-4 line-clamp-2">
                {template.description}
              </p>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                <div>
                  <p className="text-gray-600">Time</p>
                  <p className="font-medium">{template.estimatedTime} min</p>
                </div>
                <div>
                  <p className="text-gray-600">Nodes</p>
                  <p className="font-medium">{template.nodes}</p>
                </div>
                <div>
                  <p className="text-gray-600">Rating</p>
                  <p className="font-medium">{renderStars(template.rating)} ({template.rating})</p>
                </div>
                <div>
                  <p className="text-gray-600">Downloads</p>
                  <p className="font-medium">{template.downloads}</p>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1 mb-4">
                {template.tags.map(tag => (
                  <span key={tag} className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Author and Date */}
              <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                <span>By {template.author}</span>
                <span>Created {new Date(template.createdAt).toLocaleDateString()}</span>
              </div>

              {/* Actions */}
              <div className="flex space-x-2">
                <button
                  onClick={() => handleUseTemplate(template.id)}
                  className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Use Template
                </button>
                <button
                  className="px-3 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Preview
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📋</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No templates found</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm || filterCategory !== 'all' || filterDifficulty !== 'all'
              ? 'Try adjusting your search or filters'
              : 'No templates available yet'}
          </p>
          {!searchTerm && filterCategory === 'all' && filterDifficulty === 'all' && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              + Create First Template
            </button>
          )}
        </div>
      )}

      {/* Create Template Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Create Template</h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Template Name *
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter template name"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category *
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    {categories.slice(1).map(category => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="Enter template description"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Difficulty *
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estimated Time (min)
                  </label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="30"
                    min="5"
                    max="120"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Number of Nodes
                  </label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="5"
                    min="1"
                    max="20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tags
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter tags separated by commas"
                />
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={handleCreateTemplate}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Template
              </button>
              <button
                onClick={() => setShowCreateModal(false)}
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
