import React, { useState } from 'react';
import { cn } from '../../utils/cn';

interface RepositoryItem {
  id: string;
  name: string;
  description: string;
  type: 'workflow' | 'template' | 'component' | 'document';
  category: string;
  version: string;
  author: string;
  createdAt: string;
  updatedAt: string;
  downloads: number;
  rating: number;
  tags: string[];
  isPublic: boolean;
  isFavorite: boolean;
}

export const RepositoryView: React.FC = () => {
  const [repositoryItems, setRepositoryItems] = useState<RepositoryItem[]>([
    {
      id: 'repo_1',
      name: 'Employee Onboarding Template',
      description: 'Complete employee onboarding workflow template with all necessary steps',
      type: 'template',
      category: 'HR',
      version: '2.1.0',
      author: 'HR Team',
      createdAt: '2024-01-10T10:00:00Z',
      updatedAt: '2024-01-20T14:30:00Z',
      downloads: 145,
      rating: 4.8,
      tags: ['onboarding', 'hr', 'template'],
      isPublic: true,
      isFavorite: true,
    },
    {
      id: 'repo_2',
      name: 'Leave Request Workflow',
      description: 'Automated leave request and approval process',
      type: 'workflow',
      category: 'HR',
      version: '1.3.2',
      author: 'John Doe',
      createdAt: '2024-01-05T09:00:00Z',
      updatedAt: '2024-01-18T16:45:00Z',
      downloads: 89,
      rating: 4.5,
      tags: ['leave', 'approval', 'hr'],
      isPublic: true,
      isFavorite: false,
    },
    {
      id: 'repo_3',
      name: 'Email Notification Component',
      description: 'Reusable email notification component for workflows',
      type: 'component',
      category: 'Utility',
      version: '1.0.0',
      author: 'Dev Team',
      createdAt: '2024-01-12T13:00:00Z',
      updatedAt: '2024-01-15T11:20:00Z',
      downloads: 67,
      rating: 4.2,
      tags: ['email', 'notification', 'component'],
      isPublic: false,
      isFavorite: false,
    },
    {
      id: 'repo_4',
      name: 'Compliance Checklist',
      description: 'Standard compliance checklist document for HR workflows',
      type: 'document',
      category: 'Compliance',
      version: '1.5.0',
      author: 'Legal Team',
      createdAt: '2024-01-08T11:00:00Z',
      updatedAt: '2024-01-22T10:15:00Z',
      downloads: 234,
      rating: 4.9,
      tags: ['compliance', 'checklist', 'document'],
      isPublic: true,
      isFavorite: true,
    },
    {
      id: 'repo_5',
      name: 'Document Generation Workflow',
      description: 'Automated document generation and distribution',
      type: 'workflow',
      category: 'Automation',
      version: '3.0.1',
      author: 'Jane Smith',
      createdAt: '2024-01-03T14:00:00Z',
      updatedAt: '2024-01-19T09:30:00Z',
      downloads: 178,
      rating: 4.6,
      tags: ['document', 'generation', 'automation'],
      isPublic: true,
      isFavorite: false,
    },
  ]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'workflow' | 'template' | 'component' | 'document'>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'updated' | 'downloads' | 'rating'>('updated');

  const categories = ['All', 'HR', 'Automation', 'Utility', 'Compliance', 'Finance', 'IT'];

  const filteredItems = repositoryItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = filterType === 'all' || item.type === filterType;
    const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
    return matchesSearch && matchesType && matchesCategory;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'updated':
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      case 'downloads':
        return b.downloads - a.downloads;
      case 'rating':
        return b.rating - a.rating;
      default:
        return 0;
    }
  });

  const handleCreateItem = () => {
    // Implementation for creating new repository item
    console.log('Create new repository item');
  };

  const handleToggleFavorite = (itemId: string) => {
    setRepositoryItems(items =>
      items.map(item =>
        item.id === itemId ? { ...item, isFavorite: !item.isFavorite } : item
      )
    );
  };

  const handleDownload = (itemId: string) => {
    setRepositoryItems(items =>
      items.map(item =>
        item.id === itemId ? { ...item, downloads: item.downloads + 1 } : item
      )
    );
    console.log('Download item:', itemId);
  };

  const getTypeIcon = (type: string): string => {
    switch (type) {
      case 'workflow': return '⚡';
      case 'template': return '📋';
      case 'component': return '🧩';
      case 'document': return '📄';
      default: return '📦';
    }
  };

  const getTypeColor = (type: string): string => {
    switch (type) {
      case 'workflow': return 'bg-blue-100 text-blue-800';
      case 'template': return 'bg-green-100 text-green-800';
      case 'component': return 'bg-purple-100 text-purple-800';
      case 'document': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const renderStars = (rating: number): string => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStar;
    
    return '⭐'.repeat(fullStars) + (halfStar ? '⭐' : '') + '☆'.repeat(emptyStars);
  };

  const stats = {
    total: repositoryItems.length,
    workflows: repositoryItems.filter(item => item.type === 'workflow').length,
    templates: repositoryItems.filter(item => item.type === 'template').length,
    components: repositoryItems.filter(item => item.type === 'component').length,
    documents: repositoryItems.filter(item => item.type === 'document').length,
    totalDownloads: repositoryItems.reduce((sum, item) => sum + item.downloads, 0),
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Repository</h1>
          <p className="text-gray-600">Browse and manage workflow templates, components, and resources</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          + Add Item
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            <p className="text-sm text-gray-600">Total Items</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">{stats.workflows}</p>
            <p className="text-sm text-gray-600">Workflows</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">{stats.templates}</p>
            <p className="text-sm text-gray-600">Templates</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">{stats.components}</p>
            <p className="text-sm text-gray-600">Components</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-center">
            <p className="text-2xl font-bold text-yellow-600">{stats.documents}</p>
            <p className="text-sm text-gray-600">Documents</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-center">
            <p className="text-2xl font-bold text-indigo-600">{stats.totalDownloads}</p>
            <p className="text-sm text-gray-600">Downloads</p>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex items-center space-x-4 mb-6">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search repository..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value as any)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Types</option>
          <option value="workflow">Workflows</option>
          <option value="template">Templates</option>
          <option value="component">Components</option>
          <option value="document">Documents</option>
        </select>
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
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="updated">Last Updated</option>
          <option value="name">Name</option>
          <option value="downloads">Downloads</option>
          <option value="rating">Rating</option>
        </select>
      </div>

      {/* Repository Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map(item => (
          <div key={item.id} className="bg-white border border-gray-200 rounded-lg hover:shadow-lg transition-shadow">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">{getTypeIcon(item.type)}</div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{item.name}</h3>
                    <div className="flex items-center space-x-2">
                      <span className={cn('px-2 py-1 text-xs rounded-full', getTypeColor(item.type))}>
                        {item.type}
                      </span>
                      <span className="text-xs text-gray-500">v{item.version}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleToggleFavorite(item.id)}
                  className="text-lg"
                >
                  {item.isFavorite ? '⭐' : '☆'}
                </button>
              </div>

              <p className="text-gray-600 mb-4 line-clamp-2">
                {item.description}
              </p>

              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <div>
                  <p>{item.author}</p>
                  <p>{item.category}</p>
                </div>
                <div className="text-right">
                  <p>{renderStars(item.rating)}</p>
                  <p>({item.downloads} downloads)</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-1 mb-4">
                {item.tags.map(tag => (
                  <span key={tag} className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between text-xs text-gray-400 mb-4">
                <span>Updated {formatDate(item.updatedAt)}</span>
                <div className="flex items-center space-x-1">
                  {item.isPublic ? (
                    <>
                      <span>🌍</span>
                      <span>Public</span>
                    </>
                  ) : (
                    <>
                      <span>🔒</span>
                      <span>Private</span>
                    </>
                  )}
                </div>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => handleDownload(item.id)}
                  className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Download
                </button>
                <button
                  className="px-3 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📦</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No items found</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm || filterType !== 'all' || filterCategory !== 'all'
              ? 'Try adjusting your search or filters'
              : 'No items in the repository yet'}
          </p>
          {!searchTerm && filterType === 'all' && filterCategory === 'all' && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              + Add First Item
            </button>
          )}
        </div>
      )}

      {/* Create Item Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Add Repository Item</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Item Name *
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter item name"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type *
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="workflow">Workflow</option>
                  <option value="template">Template</option>
                  <option value="component">Component</option>
                  <option value="document">Document</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="Enter description"
                  rows={3}
                />
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={handleCreateItem}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Item
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
