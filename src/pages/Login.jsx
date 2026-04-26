import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, GraduationCap, Shield, Loader2, Building2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Login() {
  const [form, setForm]   = useState({ email: '', password: '' });
  const [show, setShow]   = useState(false);
  const [busy, setBusy]   = useState(false);
  const { login }         = useAuth();
  const navigate          = useNavigate();

  const handle = async e => {
    e.preventDefault();
    if (!form.email || !form.password) return toast.error('All fields required');
    setBusy(true);
    try {
      const user = await login(form.email, form.password);
      toast.success(`Welcome, ${user.name}!`);
      navigate(user.role === 'admin' ? '/admin' : '/student', { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background grid */}
      <div className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(232,184,75,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(232,184,75,0.04) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />

      {/* Glows */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-gold/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan/5 rounded-full blur-3xl pointer-events-none" />

      {/* Card */}
      <div className="w-full max-w-md animate-slide-up">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-gold/20 bg-gold/5 mb-6">
            <Building2 size={13} className="text-gold" />
            <span className="text-gold font-mono text-xs tracking-widest uppercase">TCET Campus</span>
          </div>
          <h1 className="font-display font-800 text-4xl text-white mb-2"
            style={{ background: 'linear-gradient(135deg,#e8b84b,#ffd87a,#fff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Smart Campus
          </h1>
          <p className="text-muted text-sm">Sign in to your portal</p>
        </div>

        {/* Form */}
        <div className="glass rounded-2xl p-8 shadow-card">
          <form onSubmit={handle} className="space-y-5">
            <div>
              <label className="block text-xs font-mono text-muted mb-2 uppercase tracking-wider">Email Address</label>
              <input
                type="email"
                className="input-field"
                placeholder="you@tcet.ac.in"
                value={form.email}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                autoComplete="email"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-muted mb-2 uppercase tracking-wider">Password</label>
              <div className="relative">
                <input
                  type={show ? 'text' : 'password'}
                  className="input-field pr-11"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                  autoComplete="current-password"
                />
                <button type="button"
                  onClick={() => setShow(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-white transition-colors">
                  {show ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={busy}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-display font-700 text-bg transition-all duration-200 disabled:opacity-60"
              style={{ background: 'linear-gradient(135deg,#e8b84b,#ffd87a)' }}>
              {busy ? <Loader2 size={18} className="animate-spin" /> : null}
              {busy ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          {/* Role hints */}
          <div className="mt-7 grid grid-cols-2 gap-3">
            {[
              { icon: Shield, label: 'Admin Portal', hint: 'Manage library & sessions', color: 'text-gold', bg: 'bg-gold/5 border-gold/15' },
              { icon: GraduationCap, label: 'Student Portal', hint: 'Library & campus tour', color: 'text-cyan', bg: 'bg-cyan/5 border-cyan/15' },
            ].map(({ icon: Icon, label, hint, color, bg }) => (
              <div key={label} className={`border rounded-xl p-3.5 ${bg}`}>
                <Icon size={18} className={`${color} mb-2`} />
                <p className={`text-xs font-600 ${color}`}>{label}</p>
                <p className="text-xs text-muted mt-0.5">{hint}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="text-center text-muted text-xs mt-6">
          Thakur College of Engineering &amp; Technology — FyreGig Campus Platform
        </p>
      </div>
    </div>
  );
}
