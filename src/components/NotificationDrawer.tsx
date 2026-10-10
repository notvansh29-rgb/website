import React from 'react';
import { Bell, CheckCheck, Trash2, X, Flame, CheckSquare, Sparkles, Info } from 'lucide-react';
import { AppNotification } from '../types';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: AppNotification[];
  onMarkAllRead: () => void;
  onClearAll: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllRead,
  onClearAll,
}) => {
  if (!isOpen) return null;

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getIcon = (type: AppNotification['type']) => {
    switch (type) {
      case 'streak':
        return <Flame className="h-4 w-4 text-amber-500" />;
      case 'assignment':
        return <CheckSquare className="h-4 w-4 text-rose-500" />;
      case 'quiz':
        return <Sparkles className="h-4 w-4 text-indigo-500" />;
      default:
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end bg-slate-900/30 p-4 pt-16 backdrop-blur-2xs">
      <div className="w-full max-w-sm rounded-3xl bg-white shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 p-4">
          <div className="flex items-center gap-2">
            <Bell className="h-4.5 w-4.5 text-blue-600" />
            <h3 className="font-bold text-slate-900 text-sm">Notifications</h3>
            {unreadCount > 0 && (
              <span className="rounded-full bg-blue-600 px-2 py-0.2 text-[10px] font-bold text-white">
                {unreadCount} new
              </span>
            )}
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={onMarkAllRead}
              className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              title="Mark all as read"
            >
              <CheckCheck className="h-4 w-4" />
            </button>
            <button
              onClick={onClearAll}
              className="rounded-lg p-1 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
              title="Clear all notifications"
            >
              <Trash2 className="h-4 w-4" />
            </button>
            <button
              onClick={onClose}
              className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* List */}
        <div className="max-h-96 overflow-y-auto divide-y divide-slate-100 p-2">
          {notifications.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400">
              No new notifications. You're all caught up!
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                className={`flex items-start gap-3 rounded-2xl p-3 transition-colors ${
                  notif.read ? 'bg-white opacity-70' : 'bg-blue-50/40'
                }`}
              >
                <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-slate-100">
                  {getIcon(notif.type)}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <p className="text-xs font-bold text-slate-900 truncate">{notif.title}</p>
                    <span className="text-[10px] text-slate-400 shrink-0">{notif.timestamp}</span>
                  </div>
                  <p className="mt-0.5 text-xs text-slate-600 leading-snug">{notif.message}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-100 bg-slate-50/60 p-2.5 text-center text-[11px] text-slate-500">
          Stay on top of your study milestones with instant alerts.
        </div>
      </div>
    </div>
  );
};
