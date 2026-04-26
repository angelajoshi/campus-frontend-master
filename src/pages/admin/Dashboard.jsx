import React, { useEffect, useState } from 'react';
import { BookOpen, Users, CheckSquare, ClipboardList, TrendingUp, Activity } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/api';

function StatCard({ icon: Icon, label, value, sub, color = 'gold', delay = 0 }) {
  const colors = {
    gold:  'from-gold/10 to-gold/5 border-gold/15 text-gold',
    cyan:  'from-cyan/10 to-cyan/5 border-cyan/15 text-cyan',
    green: 'from-green/10 to-green/5 border-green/15 text-green',
    red:   'from-red/10 to-red/5 border-red/15 text-red',
  };
  return (
    <div className={`rounded-2xl border bg-gradient-to-br p-5 animate-slide-up ${colors[color]}`}
      style={{ animationDelay: `${delay}ms` }}>
      <div className="flex items-start justify-between mb-4">
        <Icon size={20} className="opacity-70" />
        <span className="text-xs font-mono text-muted">LIVE</span>
      </div>
      <p className="text-3xl font-display font-800 text-white mb-1">{value ?? '—'}</p>
      <p className="text-sm font-500 opacity-80">{label}</p>
      {sub && <p className="text-xs text-muted mt-1">{sub}</p>}
    </div>
  );
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    Promise.all([
      api.get('/books?limit=1'),
      api.get('/users?role=student'),
      api.get('/attendance/stats'),
    ]).then(([b, u, a]) => {
      setStats({
        books:     b.data.total,
        students:  u.data.total,
        sessions:  a.data.totalSessions,
        attendance: a.data.totalAttendance,
        openSessions: a.data.openSessions,
      });
    }).catch(() => {});
  }, []);

  return (
    <div className="p-6 lg:p-8 max-w-6xl">
      {/* Header */}
      <div className="mb-8 animate-fade-in">
        <p className="font-mono text-xs text-muted tracking-widest uppercase mb-1">Welcome back</p>
        <h1 className="font-display font-800 text-3xl text-white">{user?.name} <span className="text-muted">👋</span></h1>
        <p className="text-muted text-sm mt-1">Here's what's happening on campus today.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={BookOpen}     label="Library Books"   value={stats?.books}      color="gold"  delay={0}   sub="Total uploaded" />
        <StatCard icon={Users}        label="Students"        value={stats?.students}   color="cyan"  delay={60}  sub="Registered" />
        <StatCard icon={ClipboardList} label="Lab Sessions"  value={stats?.sessions}   color="green" delay={120} sub="All time" />
        <StatCard icon={CheckSquare}  label="Attendances"    value={stats?.attendance} color="gold"  delay={180} sub="Records logged" />
      </div>

      {/* Quick Actions */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-5">
            <TrendingUp size={16} className="text-gold" />
            <h2 className="font-display font-700 text-white">Quick Actions</h2>
          </div>
          <div className="space-y-2">
            {[
              { href: '/admin/books',    label: 'Upload a new book',       desc: 'Add PDFs to the library' },
              { href: '/admin/sessions', label: 'Create lab session',      desc: 'Open a new attendance window' },
              { href: '/admin/students', label: 'Manage students',         desc: 'View and edit registrations' },
              { href: '/admin/attendance', label: 'View attendance logs', desc: 'See who attended which session' },
            ].map(({ href, label, desc }) => (
              <a key={href} href={href}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/[0.04] transition-colors group">
                <div className="w-2 h-2 rounded-full bg-gold/40 group-hover:bg-gold transition-colors shrink-0" />
                <div>
                  <p className="text-sm font-500 text-white group-hover:text-gold transition-colors">{label}</p>
                  <p className="text-xs text-muted">{desc}</p>
                </div>
              </a>
            ))}
          </div>
        </div>

        <div className="glass rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-5">
            <Activity size={16} className="text-cyan" />
            <h2 className="font-display font-700 text-white">System Status</h2>
          </div>
          <div className="space-y-3">
            {[
              { label: 'API Server',     status: 'Online',  color: 'bg-green' },
              { label: 'Database',       status: 'Healthy', color: 'bg-green' },
              { label: 'File Storage',   status: 'Active',  color: 'bg-green' },
              { label: 'Open Sessions',  status: stats?.openSessions ? `${stats.openSessions} active` : 'None', color: stats?.openSessions ? 'bg-gold animate-pulse' : 'bg-muted' },
            ].map(({ label, status, color }) => (
              <div key={label} className="flex items-center justify-between py-2 border-b border-white/[0.04] last:border-0">
                <span className="text-sm text-muted">{label}</span>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${color}`} />
                  <span className="text-xs font-mono text-white">{status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
