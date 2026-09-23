'use client';

import { Bell, Settings, X, CheckCircle, AlertCircle, Clock, Menu } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

const DUMMY_NOTIFICATIONS = [
  { id: 1, title: 'Payroll processing started', desc: 'September payroll run has been initiated.', time: '10 mins ago', type: 'info', icon: Clock },
  { id: 2, title: 'New employee joined', desc: 'Alice Smith has completed onboarding.', time: '2 hours ago', type: 'success', icon: CheckCircle },
  { id: 3, title: 'Compliance alert', desc: 'Missing PAN details for 3 employees.', time: '1 day ago', type: 'warning', icon: AlertCircle },
];

export default function TopNavbar({ onMenuClick }: { onMenuClick?: () => void }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  return (
    <header className="h-14 bg-white border-b border-slate-200 flex items-center px-4 sm:px-6 gap-4 shrink-0 z-10 shadow-sm">
      {/* Mobile Menu Toggle */}
      <button 
        onClick={onMenuClick}
        className="md:hidden p-2 -ml-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Actions */}
      <div className="flex items-center gap-3">
        <div className="relative" ref={notifRef}>
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className={`p-2 rounded-full transition-colors ${showNotifications ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-slate-100 text-slate-500 hover:text-slate-800'}`}
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full border border-white" />
          </button>
          
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden z-50">
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50/50">
                <h3 className="text-sm font-semibold text-slate-800">Notifications</h3>
                <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">{DUMMY_NOTIFICATIONS.length} New</span>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {DUMMY_NOTIFICATIONS.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 text-sm">No new notifications</div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {DUMMY_NOTIFICATIONS.map((n) => (
                      <div key={n.id} className="p-4 hover:bg-slate-50 transition-colors cursor-pointer flex gap-3 group">
                        <div className={`mt-0.5 shrink-0 w-8 h-8 rounded-full flex items-center justify-center
                          ${n.type === 'success' ? 'bg-emerald-50 text-emerald-600' : ''}
                          ${n.type === 'warning' ? 'bg-amber-50 text-amber-600' : ''}
                          ${n.type === 'info' ? 'bg-indigo-50 text-indigo-600' : ''}
                        `}>
                          <n.icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-800 truncate">{n.title}</p>
                          <p className="text-xs text-slate-500 mt-0.5 line-clamp-2 leading-relaxed">{n.desc}</p>
                          <p className="text-[11px] font-medium text-slate-400 mt-1.5">{n.time}</p>
                        </div>
                        <button className="opacity-0 group-hover:opacity-100 p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-all h-fit">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {DUMMY_NOTIFICATIONS.length > 0 && (
                <div className="p-3 border-t border-slate-100 bg-slate-50/50">
                  <button className="w-full py-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-colors">
                    Mark all as read
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <button 
          onClick={() => setShowSettings(true)}
          className="p-2 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors"
        >
          <Settings className="w-5 h-5" />
        </button>
        <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold text-white cursor-pointer">
          HR
        </div>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <Settings className="w-5 h-5 text-slate-400" />
                Settings
              </h3>
              <button 
                onClick={() => setShowSettings(false)}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-8 text-center space-y-4">
              <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto">
                <Clock className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-base font-semibold text-slate-800 mb-1">Coming Soon</h4>
                <p className="text-sm text-slate-500 leading-relaxed">
                  The settings panel is currently under development. Check back later for customization options!
                </p>
              </div>
            </div>
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button 
                onClick={() => setShowSettings(false)}
                className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
