import React, { useState } from 'react';
import { cn } from '../../utils/cn';

interface DocumentationItem {
  id: string;
  title: string;
  description: string;
  category: string;
  type: 'guide' | 'api' | 'tutorial' | 'faq' | 'reference';
  content: string;
  author: string;
  updatedAt: string;
  views: number;
  tags: string[];
  isPublic: boolean;
}

export const DocumentationView: React.FC = () => {
  const [documentation, setDocumentation] = useState<DocumentationItem[]>([
    {
      id: 'doc_1',
      title: 'Getting Started with Workflows',
      description: 'Complete guide to creating your first workflow',
      category: 'User Guide',
      type: 'guide',
      content: '# Getting Started\n\nThis guide will help you create your first workflow...',
      author: 'Documentation Team',
      updatedAt: '2024-01-20T14:30:00Z',
      views: 456,
      tags: ['beginner', 'workflow', 'tutorial'],
      isPublic: true,
    },
    {
      id: 'doc_2',
      title: 'API Reference',
      description: 'Complete API documentation for developers',
      category: 'Developer',
      type: 'api',
      content: '# API Reference\n\n## Authentication\n\nAll API requests require authentication...',
      author: 'Dev Team',
      updatedAt: '2024-01-22T10:15:00Z',
      views: 234,
      tags: ['api', 'developer', 'reference'],
      isPublic: true,
    },
    {
      id: 'doc_3',
      title: 'Troubleshooting Common Issues',
      description: 'FAQ and solutions for common workflow problems',
      category: 'Support',
      type: 'faq',
      content: '# Troubleshooting\n\n## Common Issues\n\n### Workflow not executing\n\n1. Check your triggers...',
      author: 'Support Team',
      updatedAt: '2024-01-21T16:45:00Z',
      views: 789,
      tags: ['troubleshooting', 'faq', 'support'],
      isPublic: true,
    },
    {
      id: 'doc_4',
      title: 'Advanced Workflow Techniques',
      description: 'Learn advanced workflow patterns and best practices',
      category: 'Advanced',
      type: 'tutorial',
      content: '# Advanced Techniques\n\n## Conditional Logic\n\nYou can implement complex conditions...',
      author: 'Expert Team',
      updatedAt: '2024-01-19T11:20:00Z',
      views: 123,
      tags: ['advanced', 'patterns', 'best-practices'],
      isPublic: true,
    },
    {
      id: 'doc_5',
      title: 'Node Types Reference',
      description: 'Complete reference for all available node types',
      category: 'Reference',
      type: 'reference',
      content: '# Node Types\n\n## Start Node\n\nThe start node initiates a workflow...',
      author: 'Documentation Team',
      updatedAt: '2024-01-18T09:30:00Z',
      views: 567,
      tags: ['nodes', 'reference', 'types'],
      isPublic: true,
    },
  ]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<DocumentationItem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'title' | 'updated' | 'views'>('views');

  const categories = ['All', 'User Guide', 'Developer', 'Support', 'Advanced', 'Reference'];
  const types = ['All', 'Guide', 'API', 'Tutorial', 'FAQ', 'Reference'];

  const filteredDocs = documentation.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = filterCategory === 'all' || doc.category === filterCategory;
    const matchesType = filterType === 'all' || doc.type.toLowerCase() === filterType.toLowerCase();
    return matchesSearch && matchesCategory && matchesType;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'title':
        return a.title.localeCompare(b.title);
      case 'updated':
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      case 'views':
        return b.views - a.views;
      default:
        return 0;
    }
  });

  const handleViewDocument = (doc: DocumentationItem) => {
    setSelectedDoc(doc);
    setDocumentation(docs =>
      docs.map(d => d.id === doc.id ? { ...d, views: d.views + 1 } : d)
    );
  };

  const handleCreateDocument = () => {
    console.log('Create new document');
  };

  const getTypeIcon = (type: string): string => {
    switch (type) {
      case 'guide': return '📖';
      case 'api': return '🔧';
      case 'tutorial': return '🎓';
      case 'faq': return '❓';
      case 'reference': return '📚';
      default: return '📄';
    }
  };

  const getTypeColor = (type: string): string => {
    switch (type) {
      case 'guide': return 'bg-blue-100 text-blue-800';
      case 'api': return 'bg-green-100 text-green-800';
      case 'tutorial': return 'bg-purple-100 text-purple-800';
      case 'faq': return 'bg-yellow-100 text-yellow-800';
      case 'reference': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const formatContent = (content: string): string => {
    // Simple markdown to HTML conversion for preview
    return content
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
      .replace(/\*(.*)\*/gim, '<em>$1</em>')
      .replace(/\n/gim, '<br>')
      .substring(0, 200) + '...';
  };

  const stats = {
    total: documentation.length,
    totalViews: documentation.reduce((sum, doc) => sum + doc.views, 0),
    guides: documentation.filter(d => d.type === 'guide').length,
    apiDocs: documentation.filter(d => d.type === 'api').length,
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Documentation</h1>
          <p className="text-gray-600">Comprehensive guides, API docs, and tutorials</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          + Add Document
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Documents</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-xl">📚</span>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Views</p>
              <p className="text-2xl font-bold text-green-600">{stats.totalViews}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-xl">👁️</span>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Guides</p>
              <p className="text-2xl font-bold text-blue-600">{stats.guides}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-xl">📖</span>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">API Docs</p>
              <p className="text-2xl font-bold text-purple-600">{stats.apiDocs}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <span className="text-xl">🔧</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex items-center space-x-4 mb-6">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search documentation..."
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
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {types.map(type => (
            <option key={type} value={type === 'All' ? 'all' : type.toLowerCase()}>
              {type}
            </option>
          ))}
        </select>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="views">Most Viewed</option>
          <option value="updated">Recently Updated</option>
          <option value="title">Title A-Z</option>
        </select>
      </div>

      {/* Documentation List */}
      <div className="space-y-4">
        {filteredDocs.map(doc => (
          <div key={doc.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="text-2xl">{getTypeIcon(doc.type)}</div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{doc.title}</h3>
                    <div className="flex items-center space-x-2">
                      <span className={cn('px-2 py-1 text-xs rounded-full', getTypeColor(doc.type))}>
                        {doc.type}
                      </span>
                      <span className="text-xs text-gray-500">{doc.category}</span>
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-600 mb-3">{doc.description}</p>
                
                <div className="prose prose-sm max-w-none mb-4">
                  <div dangerouslySetInnerHTML={{ __html: formatContent(doc.content) }} />
                </div>
                
                <div className="flex flex-wrap gap-1 mb-3">
                  {doc.tags.map(tag => (
                    <span key={tag} className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                      #{tag}
                    </span>
                  ))}
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-4">
                    <span>By {doc.author}</span>
                    <span>Updated {formatDate(doc.updatedAt)}</span>
                    <span>{doc.views} views</span>
                  </div>
                  {doc.isPublic && (
                    <span className="flex items-center space-x-1">
                      <span>🌍</span>
                      <span>Public</span>
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex space-x-2 ml-6">
                <button
                  onClick={() => handleViewDocument(doc)}
                  className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Read More
                </button>
                <button
                  className="px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Edit
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredDocs.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📚</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No documentation found</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm || filterCategory !== 'all' || filterType !== 'all'
              ? 'Try adjusting your search or filters'
              : 'No documentation available yet'}
          </p>
          {!searchTerm && filterCategory === 'all' && filterType === 'all' && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              + Add First Document
            </button>
          )}
        </div>
      )}

      {/* Document Detail Modal */}
      {selectedDoc && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="text-2xl">{getTypeIcon(selectedDoc.type)}</div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{selectedDoc.title}</h2>
                  <div className="flex items-center space-x-2">
                    <span className={cn('px-2 py-1 text-xs rounded-full', getTypeColor(selectedDoc.type))}>
                      {selectedDoc.type}
                    </span>
                    <span className="text-xs text-gray-500">{selectedDoc.category}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedDoc(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="mb-4">
              <p className="text-gray-600 mb-2">{selectedDoc.description}</p>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span>By {selectedDoc.author}</span>
                <span>Updated {formatDate(selectedDoc.updatedAt)}</span>
                <span>{selectedDoc.views} views</span>
              </div>
            </div>
            
            <div className="prose prose-sm max-w-none">
              <div dangerouslySetInnerHTML={{ __html: selectedDoc.content.replace(/\n/gim, '<br>') }} />
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex justify-between">
                <button
                  onClick={() => setSelectedDoc(null)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Close
                </button>
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Edit Document
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Document Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Add Documentation</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter document title"
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type *
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    {types.slice(1).map(type => (
                      <option key={type} value={type.toLowerCase()}>
                        {type}
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
                  placeholder="Enter document description"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Content *
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="Enter document content (supports markdown)"
                  rows={8}
                />
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
                onClick={handleCreateDocument}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Document
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
