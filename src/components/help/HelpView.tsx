import React, { useState } from 'react';
import { cn } from '../../utils/cn';

interface HelpArticle {
  id: string;
  title: string;
  category: string;
  content: string;
  tags: string[];
  views: number;
  helpful: number;
  notHelpful: number;
}

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  views: number;
}

export const HelpView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showContactForm, setShowContactForm] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
  });

  const categories = ['All', 'Getting Started', 'Workflows', 'Troubleshooting', 'API', 'Account', 'Billing'];

  const helpArticles: HelpArticle[] = [
    {
      id: 'help_1',
      title: 'Getting Started with Workflows',
      category: 'Getting Started',
      content: 'This comprehensive guide will help you understand the basics of creating and managing workflows...',
      tags: ['beginner', 'workflow', 'tutorial'],
      views: 234,
      helpful: 45,
      notHelpful: 2,
    },
    {
      id: 'help_2',
      title: 'Creating Your First Workflow',
      category: 'Getting Started',
      content: 'Learn how to create your first workflow from scratch with our step-by-step guide...',
      tags: ['beginner', 'workflow', 'tutorial'],
      views: 189,
      helpful: 38,
      notHelpful: 1,
    },
    {
      id: 'help_3',
      title: 'Workflow Node Types',
      category: 'Workflows',
      content: 'Understand the different types of nodes available in the workflow designer...',
      tags: ['nodes', 'workflow', 'reference'],
      views: 156,
      helpful: 32,
      notHelpful: 0,
    },
    {
      id: 'help_4',
      title: 'Troubleshooting Common Issues',
      category: 'Troubleshooting',
      content: 'Find solutions to the most common workflow issues and errors...',
      tags: ['troubleshooting', 'errors', 'support'],
      views: 412,
      helpful: 67,
      notHelpful: 3,
    },
    {
      id: 'help_5',
      title: 'API Documentation',
      category: 'API',
      content: 'Complete API reference for developers integrating with our platform...',
      tags: ['api', 'developer', 'integration'],
      views: 89,
      helpful: 21,
      notHelpful: 0,
    },
  ];

  const faqs: FAQ[] = [
    {
      id: 'faq_1',
      question: 'How do I create a new workflow?',
      answer: 'To create a new workflow, navigate to the Workflows section and click the "+ New Workflow" button. You can then drag and drop nodes onto the canvas to build your workflow.',
      category: 'Getting Started',
      views: 156,
    },
    {
      id: 'faq_2',
      question: 'What are the different node types?',
      answer: 'We offer several node types: Start (workflow initiation), Task (manual actions), Approval (decision points), Automated (system actions), and End (workflow completion).',
      category: 'Workflows',
      views: 98,
    },
    {
      id: 'faq_3',
      question: 'How do I connect nodes together?',
      answer: 'Click and drag from the handle of one node to another node to create a connection. The connection represents the flow of data or actions between nodes.',
      category: 'Workflows',
      views: 124,
    },
    {
      id: 'faq_4',
      question: 'Can I save my workflows?',
      answer: 'Yes! All workflows are automatically saved. You can also manually save by clicking the "Save Current" button in the Workflows view.',
      category: 'Workflows',
      views: 67,
    },
    {
      id: 'faq_5',
      question: 'How do I export my workflows?',
      answer: 'Use the Export button in the workflow designer to download your workflow as a JSON file. You can also import workflows from JSON files.',
      category: 'Workflows',
      views: 45,
    },
    {
      id: 'faq_6',
      question: 'What is the difference between a project and a workflow?',
      answer: 'A project is a container for related workflows, while a workflow is the actual automation logic. Projects help you organize multiple workflows together.',
      category: 'Getting Started',
      views: 89,
    },
  ];

  const filteredArticles = helpArticles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleContactSubmit = () => {
    console.log('Contact form submitted:', contactForm);
    alert('Your support request has been submitted. We\'ll get back to you within 24 hours.');
    setShowContactForm(false);
    setContactForm({
      name: '',
      email: '',
      subject: '',
      message: '',
      priority: 'medium',
    });
  };

  const handleHelpfulVote = (articleId: string, isHelpful: boolean) => {
    console.log('Vote:', articleId, isHelpful);
    // In a real app, this would update the database
  };

  const getPriorityColor = (priority: string): string => {
    switch (priority) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Help & Support</h1>
          <p className="text-gray-600">Find answers and get help with your workflows</p>
        </div>
        <button
          onClick={() => setShowContactForm(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Contact Support
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center space-x-4 mb-6">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search for help articles, FAQs, or topics..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {categories.map(category => (
            <option key={category} value={category === 'All' ? 'all' : category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {/* Quick Links */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
        <h2 className="text-lg font-semibold text-blue-900 mb-4">Quick Links</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a href="#" className="flex items-center space-x-3 text-blue-700 hover:text-blue-900">
            <span className="text-xl">📚</span>
            <span>Getting Started Guide</span>
          </a>
          <a href="#" className="flex items-center space-x-3 text-blue-700 hover:text-blue-900">
            <span className="text-xl">🎥</span>
            <span>Video Tutorials</span>
          </a>
          <a href="#" className="flex items-center space-x-3 text-blue-700 hover:text-blue-900">
            <span className="text-xl">📖</span>
            <span>API Documentation</span>
          </a>
        </div>
      </div>

      {/* Help Articles */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Help Articles</h2>
        <div className="space-y-4">
          {filteredArticles.map(article => (
            <div key={article.id} className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-2">{article.title}</h3>
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                      {article.category}
                    </span>
                    <div className="flex space-x-1">
                      {article.tags.map(tag => (
                        <span key={tag} className="px-2 py-1 text-xs bg-blue-100 text-blue-600 rounded">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4 line-clamp-2">{article.content}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>{article.views} views</span>
                      <span>•</span>
                      <span>{article.helpful} found helpful</span>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleHelpfulVote(article.id, true)}
                        className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
                      >
                        👍 Helpful
                      </button>
                      <button
                        onClick={() => handleHelpfulVote(article.id, false)}
                        className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                      >
                        👎 Not Helpful
                      </button>
                      <button className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors">
                        Read More
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQs */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {filteredFAQs.map(faq => (
            <div key={faq.id} className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-start space-x-4">
                <div className="text-2xl">❓</div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-2">{faq.question}</h3>
                  <p className="text-gray-600 mb-3">{faq.answer}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>{faq.views} views</span>
                    <span>•</span>
                    <span>{faq.category}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Support Modal */}
      {showContactForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Contact Support</h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Your name"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subject *
                </label>
                <input
                  type="text"
                  value={contactForm.subject}
                  onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Brief description of your issue"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priority
                </label>
                <select
                  value={contactForm.priority}
                  onChange={(e) => setContactForm({ ...contactForm, priority: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="low">Low - General question</option>
                  <option value="medium">Medium - Need assistance</option>
                  <option value="high">High - Critical issue</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message *
                </label>
                <textarea
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="Please describe your issue in detail"
                  rows={5}
                />
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={handleContactSubmit}
                disabled={!contactForm.name.trim() || !contactForm.email.trim() || !contactForm.subject.trim() || !contactForm.message.trim()}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Submit Request
              </button>
              <button
                onClick={() => setShowContactForm(false)}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Additional Resources */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Additional Resources</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-3xl mb-2">📚</div>
            <h3 className="font-medium text-gray-900">Documentation</h3>
            <p className="text-sm text-gray-600 mt-1">Comprehensive guides and references</p>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-2">🎥</div>
            <h3 className="font-medium text-gray-900">Video Tutorials</h3>
            <p className="text-sm text-gray-600 mt-1">Step-by-step video guides</p>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-2">💬</div>
            <h3 className="font-medium text-gray-900">Community Forum</h3>
            <p className="text-sm text-gray-600 mt-1">Get help from other users</p>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-2">📧</div>
            <h3 className="font-medium text-gray-900">Email Support</h3>
            <p className="text-sm text-gray-600 mt-1">support@company.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};
