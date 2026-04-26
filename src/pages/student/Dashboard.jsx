import React, { useEffect, useState } from 'react';
import { BookOpen, Globe2, CheckSquare, Clock, Star, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/api';

const STOPS = [
  { id: 'entrance',   label: 'Main Entrance',    icon: '🏛' },
  { id: 'library',    label: 'Central Library',   icon: '📚' },
  { id: 'labs',       label: 'Computer Labs',     icon: '💻' },
  { id: 'auditorium', label: 'Auditorium',        icon: '🎭' },
  { id: 'canteen',    label: 'Central Canteen',   icon: '🍱' },
  { id: 'sports',     label: 'Sports Complex',    icon: '⚽' },
];

export default function StudentDashboard() {
  const { user }  = useAuth();
  const navigate  = useNavigate();
  const [counts, setCounts] = useState({ books: 0, sessions: 0, myAttendance: 0 });

  useEffect(() => {
    Promise.all([
      api.get('/books?limit=1'),
      api.get('/attendance/sessions?open=true'),
      api.get('/attendance/my'),
    ]).then(([b, s, a]) => {
      setCounts({ books: b.data.total, sessions: s.data.sessions?.length, myAttendance: a.data.records?.length });
    }).catch(() => {});
  }, []);

  return (
    <div className="p-6 lg:p-8 max-w-6xl">
      {/* Hero greeting */}
      <div className="mb-8 animate-fade-in">
        <p className="font-mono text-xs text-muted tracking-widest uppercase mb-1">Student Portal</p>
        <h1 className="font-display font-800 text-3xl text-white mb-1">
          Hey, <span style={{ background: 'linear-gradient(135deg,#00d8ff,#0094b3)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{user?.name?.split(' ')[0]}</span> 👋
        </h1>
        <p className="text-muted text-sm">Explore the campus, read books, and mark your lab attendance.</p>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { icon: BookOpen, label: 'Books Available', value: counts.books, color: 'text-gold' },
          { icon: CheckSquare, label: 'Open Sessions', value: counts.sessions, color: 'text-green' },
          { icon: Star, label: 'My Attendances', value: counts.myAttendance, color: 'text-cyan' },
        ].map(({ icon: Icon, label, value, color }, i) => (
          <div key={label} className="glass rounded-2xl p-4 animate-slide-up" style={{ animationDelay: `${i * 60}ms` }}>
            <Icon size={18} className={`${color} mb-3`} />
            <p className="text-2xl font-display font-800 text-white">{value ?? '—'}</p>
            <p className="text-xs text-muted mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Main navigation cards */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        {[
          {
            to: '/student/library',
            icon: BookOpen,
            label: 'Library',
            desc: 'Browse, read, and download academic PDFs',
            gradient: 'from-gold/15 to-gold/5',
            border: 'border-gold/15',
            accent: 'text-gold',
            cta: 'Open Library',
          },
          {
            to: '/student/tour',
            icon: Globe2,
            label: 'Campus Tour',
            desc: 'Explore TCET campus in immersive 3D/AR/VR',
            gradient: 'from-cyan/15 to-cyan/5',
            border: 'border-cyan/15',
            accent: 'text-cyan',
            cta: 'Start Tour',
          },
          {
            to: '/student/attendance',
            icon: CheckSquare,
            label: 'Lab Attendance',
            desc: 'Mark your presence for lab sessions',
            gradient: 'from-green/15 to-green/5',
            border: 'border-green/15',
            accent: 'text-green',
            cta: 'Mark Attendance',
          },
        ].map(({ to, icon: Icon, label, desc, gradient, border, accent, cta }) => (
          <button key={to} onClick={() => navigate(to)}
            className={`text-left p-6 rounded-2xl border bg-gradient-to-br ${gradient} ${border} hover:scale-[1.02] transition-transform group animate-slide-up`}>
            <Icon size={24} className={`${accent} mb-4`} />
            <h2 className="font-display font-700 text-white text-lg mb-2">{label}</h2>
            <p className="text-sm text-muted mb-5 leading-relaxed">{desc}</p>
            <div className={`flex items-center gap-2 text-sm font-600 ${accent}`}>
              {cta} <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        ))}
      </div>

      {/* Campus Stops preview */}
      <div className="glass rounded-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Globe2 size={16} className="text-cyan" />
            <h2 className="font-display font-700 text-white">Campus Highlights</h2>
          </div>
          <button onClick={() => navigate('/student/tour')} className="text-xs text-cyan hover:underline">Take the tour →</button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {STOPS.map(s => (
            <button key={s.id} onClick={() => navigate('/student/tour')}
              className="flex items-center gap-3 p-3 rounded-xl border border-white/[0.06] hover:bg-white/[0.04] hover:border-cyan/20 transition-all text-left group">
              <span className="text-xl">{s.icon}</span>
              <span className="text-sm text-muted group-hover:text-white transition-colors">{s.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
