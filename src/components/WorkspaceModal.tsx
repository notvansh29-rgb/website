import React, { useState } from 'react';
import { Building2, Plus, Check, Users, X, Shield, Sparkles } from 'lucide-react';
import { Workspace } from '../types';

interface WorkspaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  workspaces: Workspace[];
  onSelectWorkspace: (id: string) => void;
  onCreateWorkspace: (name: string, type: Workspace['type']) => void;
}

export const WorkspaceModal: React.FC<WorkspaceModalProps> = ({
  isOpen,
  onClose,
  workspaces,
  onSelectWorkspace,
  onCreateWorkspace,
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState('');
  const [newType, setNewType] = useState<Workspace['type']>('Study Group');

  if (!isOpen) return null;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    onCreateWorkspace(newName.trim(), newType);
    setNewName('');
    setIsCreating(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-blue-600" />
            <h3 className="font-bold text-slate-900">Switch Workspace</h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Workspace List */}
        {!isCreating ? (
          <div className="mt-4 space-y-2.5">
            {workspaces.map((ws) => (
              <div
                key={ws.id}
                onClick={() => {
                  onSelectWorkspace(ws.id);
                  onClose();
                }}
                className={`flex items-center justify-between rounded-2xl border p-3.5 cursor-pointer transition-all ${
                  ws.isCurrent
                    ? 'border-blue-600 bg-blue-50/70 shadow-xs'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-xl text-xs font-bold ${
                      ws.isCurrent
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {ws.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">{ws.name}</p>
                    <p className="text-[11px] text-slate-500">
                      {ws.type} • {ws.membersCount} {ws.membersCount === 1 ? 'member' : 'members'}
                    </p>
                  </div>
                </div>

                {ws.isCurrent && (
                  <span className="flex items-center gap-1 text-xs font-bold text-blue-600">
                    <Check className="h-4 w-4" /> Active
                  </span>
                )}
              </div>
            ))}

            <button
              onClick={() => setIsCreating(true)}
              className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-2xl border border-dashed border-slate-300 py-3 text-xs font-bold text-slate-600 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50/40 transition-all"
            >
              <Plus className="h-4 w-4" /> Create New Workspace
            </button>
          </div>
        ) : (
          <form onSubmit={handleCreate} className="mt-4 space-y-3.5">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                Workspace Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. AP Chemistry Study Pod, Science Fair 2026"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                autoFocus
                className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-medium text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                Workspace Type
              </label>
              <select
                value={newType}
                onChange={(e) => setNewType(e.target.value as Workspace['type'])}
                className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-medium text-slate-800 focus:border-blue-500 focus:outline-hidden"
              >
                <option value="Study Group">Study Group (Peers / Friends)</option>
                <option value="Classroom">Classroom / Teacher Cohort</option>
                <option value="Personal">Personal Archive</option>
              </select>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-xl bg-blue-600 px-5 py-2 text-xs font-bold text-white shadow-xs hover:bg-blue-700"
              >
                Create Workspace
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
