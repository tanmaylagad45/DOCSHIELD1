import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Files, 
  UploadCloud, 
  ShieldAlert, 
  Scale, 
  FileSpreadsheet, 
  History, 
  Settings, 
  ShieldCheck,
  ArrowLeft
} from 'lucide-react';

interface SidebarProps {
  openCasesCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({ openCasesCount }) => {
  const navItems = [
    {
      to: '/dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard className="w-4 h-4" />,
      badge: null,
    },
    {
      to: '/documents',
      label: 'Documents',
      icon: <Files className="w-4 h-4" />,
      badge: null,
    },
    {
      to: '/upload',
      label: 'Upload Ingestion',
      icon: <UploadCloud className="w-4 h-4" />,
      badge: 'Sandbox',
      badgeColor: 'bg-sky-500/10 text-sky-600 dark:text-sky-400',
    },
    {
      to: '/cases',
      label: 'Cases & Review',
      icon: <ShieldAlert className="w-4 h-4" />,
      badge: openCasesCount > 0 ? openCasesCount : null,
      badgeColor: 'bg-rose-500 text-white',
    },
    {
      to: '/compliance',
      label: 'Compliance Rules',
      icon: <Scale className="w-4 h-4" />,
      badge: '5 Active',
      badgeColor: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
    },
    {
      to: '/reports',
      label: 'Reports & Export',
      icon: <FileSpreadsheet className="w-4 h-4" />,
      badge: null,
    },
    {
      to: '/audit',
      label: 'Audit Trail',
      icon: <History className="w-4 h-4" />,
      badge: null,
    },
    {
      to: '/settings',
      label: 'Settings',
      icon: <Settings className="w-4 h-4" />,
      badge: null,
    },
  ];

  return (
    <aside className="w-64 shrink-0 hidden md:flex flex-col justify-between border-r border-slate-200/80 dark:border-slate-800/80 bg-white/50 dark:bg-slate-950/50 p-4 min-h-[calc(100vh-4rem)]">
      {/* Navigation Links */}
      <div className="space-y-6">
        <div>
          <p className="px-3 text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
            Verification Modules
          </p>
          <nav className="space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                    isActive
                      ? 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900/60 hover:text-slate-900 dark:hover:text-slate-200'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${item.badgeColor || 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>
                    {item.badge}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Intelligence Status Card */}
        <div className="p-3 rounded-2xl bg-gradient-to-br from-slate-100/80 via-white to-slate-50/50 dark:from-slate-900/80 dark:via-slate-900/50 dark:to-slate-950 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-800 dark:text-slate-200">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Simulated Engine</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
            Operating in client sandbox with deterministic synthetic ground-truth fixtures.
          </p>
          <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 dark:border-slate-800/60 text-[10px] text-slate-400">
            <span>OCR: Tesseract Mock</span>
            <span className="text-emerald-500 font-semibold">Active</span>
          </div>
        </div>
      </div>

      {/* Footer Info & Back to Landing */}
      <div className="pt-4 border-t border-slate-200/80 dark:border-slate-800/80 space-y-2">
        <Link
          to="/"
          className="flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-sky-500 transition-colors py-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Landing Page</span>
        </Link>
        <p className="text-[10px] text-slate-400 dark:text-slate-500">
          DocShield AI Platform © 2026
        </p>
      </div>
    </aside>
  );
};
