import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, BookOpen, Globe2, CheckSquare,
  LogOut, Menu, GraduationCap, ChevronRight,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const NAV = [
  { to: '/student',            icon: LayoutDashboard, label: 'Dashboard',    end: true },
  { to: '/student/library',    icon: BookOpen,         label: 'Library' },
  { to: '/student/tour',       icon: Globe2,           label: 'Campus Tour' },
  { to: '/student/attendance', icon: CheckSquare,      label: 'Lab Attendance' },
];

export default function StudentLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('See you later!');
    navigate('/login');
  };

  const Sidebar = () => (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-white/[0.07]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-grad-cyan flex items-center justify-center shadow-glow-cyan">
            <GraduationCap size={18} className="text-bg" />
          </div>
          <div>
            <p className="font-display font-700 text-sm text-white leading-none">TCET Campus</p>
            <p className="text-xs text-muted mt-0.5 font-mono">Student Portal</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {NAV.map(({ to, icon: Icon, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-150 group ${
                isActive
                  ? 'bg-cyan/10 text-cyan border border-cyan/15'
                  : 'text-muted hover:text-white hover:bg-white/[0.04]'
              }`
            }
          >
            <Icon size={16} />
            <span className="flex-1 font-500">{label}</span>
            <ChevronRight size={12} className="opacity-0 group-hover:opacity-40 transition-opacity" />
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-white/[0.07]">
        {/* Student info */}
        <div className="glass-sm rounded-xl p-3 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-grad-cyan flex items-center justify-center text-bg font-700 text-sm shrink-0">
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-500 text-white truncate">{user?.name}</p>
              <p className="text-xs text-muted">{user?.rollNumber || user?.department || 'Student'}</p>
            </div>
          </div>
        </div>
        <button onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-muted hover:text-red hover:bg-red/5 transition-all">
          <LogOut size={14} />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-bg overflow-hidden">
      <aside className="hidden lg:flex flex-col w-60 glass-sm border-r border-white/[0.07] shrink-0">
        <Sidebar />
      </aside>

      {open && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-bg/80 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <aside className="relative z-10 w-60 glass border-r border-white/[0.07] flex flex-col">
            <Sidebar />
          </aside>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="lg:hidden h-14 glass-sm border-b border-white/[0.07] flex items-center px-4 gap-3">
          <button onClick={() => setOpen(true)} className="text-muted hover:text-white">
            <Menu size={20} />
          </button>
          <span className="font-display font-700 text-cyan text-sm tracking-wide">TCET Student</span>
        </header>
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
