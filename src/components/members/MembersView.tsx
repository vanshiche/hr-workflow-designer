import React, { useState } from 'react';
import { TeamMember } from '../../types/project.types';
import { cn } from '../../utils/cn';

export const MembersView: React.FC = () => {
  const [members, setMembers] = useState<TeamMember[]>([
    {
      id: 'member_1',
      name: 'John Doe',
      email: 'john.doe@company.com',
      role: 'admin',
      avatar: '👨‍💼',
      lastActive: '2024-01-22T16:30:00Z',
      permissions: ['read', 'write', 'delete', 'admin'],
    },
    {
      id: 'member_2',
      name: 'Jane Smith',
      email: 'jane.smith@company.com',
      role: 'editor',
      avatar: '👩‍💼',
      lastActive: '2024-01-22T15:45:00Z',
      permissions: ['read', 'write'],
    },
    {
      id: 'member_3',
      name: 'Bob Johnson',
      email: 'bob.johnson@company.com',
      role: 'viewer',
      avatar: '👨‍💻',
      lastActive: '2024-01-21T14:20:00Z',
      permissions: ['read'],
    },
    {
      id: 'member_4',
      name: 'Alice Brown',
      email: 'alice.brown@company.com',
      role: 'editor',
      avatar: '👩‍💻',
      lastActive: '2024-01-22T17:00:00Z',
      permissions: ['read', 'write'],
    },
    {
      id: 'member_5',
      name: 'Charlie Wilson',
      email: 'charlie.wilson@company.com',
      role: 'viewer',
      avatar: '👨‍🔧',
      lastActive: '2024-01-20T11:15:00Z',
      permissions: ['read'],
    },
  ]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [newMember, setNewMember] = useState({
    name: '',
    email: '',
    role: 'viewer' as 'admin' | 'editor' | 'viewer',
  });

  const handleCreateMember = () => {
    if (newMember.name.trim() && newMember.email.trim()) {
      const member: TeamMember = {
        id: `member_${Date.now()}`,
        name: newMember.name.trim(),
        email: newMember.email.trim(),
        role: newMember.role,
        avatar: '👤',
        lastActive: new Date().toISOString(),
        permissions: newMember.role === 'admin' 
          ? ['read', 'write', 'delete', 'admin']
          : newMember.role === 'editor'
          ? ['read', 'write']
          : ['read'],
      };
      
      setMembers([...members, member]);
      setShowCreateModal(false);
      setNewMember({ name: '', email: '', role: 'viewer' });
    }
  };

  const handleUpdateMember = () => {
    if (selectedMember && newMember.name.trim() && newMember.email.trim()) {
      const updatedMember: TeamMember = {
        ...selectedMember,
        name: newMember.name.trim(),
        email: newMember.email.trim(),
        role: newMember.role,
        permissions: newMember.role === 'admin' 
          ? ['read', 'write', 'delete', 'admin']
          : newMember.role === 'editor'
          ? ['read', 'write']
          : ['read'],
      };
      
      setMembers(members.map(member => 
        member.id === selectedMember.id ? updatedMember : member
      ));
      setShowEditModal(false);
      setSelectedMember(null);
      setNewMember({ name: '', email: '', role: 'viewer' });
    }
  };

  const handleDeleteMember = (memberId: string) => {
    if (confirm('Are you sure you want to remove this member?')) {
      setMembers(members.filter(member => member.id !== memberId));
    }
  };

  const handleEditMember = (member: TeamMember) => {
    setSelectedMember(member);
    setNewMember({
      name: member.name,
      email: member.email,
      role: member.role,
    });
    setShowEditModal(true);
  };

  const getRoleColor = (role: string): string => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'editor': return 'bg-blue-100 text-blue-800';
      case 'viewer': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleIcon = (role: string): string => {
    switch (role) {
      case 'admin': return '👑';
      case 'editor': return '✏️';
      case 'viewer': return '👁️';
      default: return '👤';
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const getPermissionBadge = (permission: string): string => {
    switch (permission) {
      case 'read': return '📖 Read';
      case 'write': return '✏️ Write';
      case 'delete': return '🗑️ Delete';
      case 'admin': return '👑 Admin';
      default: return permission;
    }
  };

  const adminCount = members.filter(m => m.role === 'admin').length;
  const editorCount = members.filter(m => m.role === 'editor').length;
  const viewerCount = members.filter(m => m.role === 'viewer').length;
  const activeToday = members.filter(m => {
    const today = new Date().toDateString();
    return new Date(m.lastActive).toDateString() === today;
  }).length;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Team Members</h1>
          <p className="text-gray-600">Manage team members and their permissions</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          + Add Member
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Members</p>
              <p className="text-2xl font-bold text-gray-900">{members.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-xl">👥</span>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Admins</p>
              <p className="text-2xl font-bold text-red-600">{adminCount}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <span className="text-xl">👑</span>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Editors</p>
              <p className="text-2xl font-bold text-blue-600">{editorCount}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-xl">✏️</span>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Today</p>
              <p className="text-2xl font-bold text-green-600">{activeToday}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-xl">🟢</span>
            </div>
          </div>
        </div>
      </div>

      {/* Members Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Member
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Permissions
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Active
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {members.map(member => (
                <tr key={member.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">{member.avatar}</div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{member.name}</div>
                        <div className="text-sm text-gray-500">{member.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{getRoleIcon(member.role)}</span>
                      <span className={cn('px-2 py-1 text-xs rounded-full', getRoleColor(member.role))}>
                        {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-wrap gap-1">
                      {member.permissions.map(permission => (
                        <span key={permission} className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                          {getPermissionBadge(permission)}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(member.lastActive)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditMember(member)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteMember(member.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Remove
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Member Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Add Team Member</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  value={newMember.name}
                  onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter member name"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  value={newMember.email}
                  onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter email address"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role *
                </label>
                <select
                  value={newMember.role}
                  onChange={(e) => setNewMember({ ...newMember, role: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="viewer">Viewer - Can only view workflows</option>
                  <option value="editor">Editor - Can view and edit workflows</option>
                  <option value="admin">Admin - Full access and user management</option>
                </select>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-800">
                  <strong>Permissions:</strong>
                </p>
                <ul className="text-xs text-blue-700 mt-1 space-y-1">
                  {newMember.role === 'admin' && (
                    <>
                      <li>• Read, write, delete workflows</li>
                      <li>• Manage team members</li>
                      <li>• System administration</li>
                    </>
                  )}
                  {newMember.role === 'editor' && (
                    <>
                      <li>• Read and edit workflows</li>
                      <li>• Create new workflows</li>
                      <li>• Cannot delete workflows</li>
                    </>
                  )}
                  {newMember.role === 'viewer' && (
                    <>
                      <li>• View workflows only</li>
                      <li>• Cannot edit or create</li>
                      <li>• Read-only access</li>
                    </>
                  )}
                </ul>
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={handleCreateMember}
                disabled={!newMember.name.trim() || !newMember.email.trim()}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Add Member
              </button>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setNewMember({ name: '', email: '', role: 'viewer' });
                }}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Member Modal */}
      {showEditModal && selectedMember && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Edit Team Member</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  value={newMember.name}
                  onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter member name"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  value={newMember.email}
                  onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter email address"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role *
                </label>
                <select
                  value={newMember.role}
                  onChange={(e) => setNewMember({ ...newMember, role: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="viewer">Viewer - Can only view workflows</option>
                  <option value="editor">Editor - Can view and edit workflows</option>
                  <option value="admin">Admin - Full access and user management</option>
                </select>
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={handleUpdateMember}
                disabled={!newMember.name.trim() || !newMember.email.trim()}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Update Member
              </button>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedMember(null);
                  setNewMember({ name: '', email: '', role: 'viewer' });
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
