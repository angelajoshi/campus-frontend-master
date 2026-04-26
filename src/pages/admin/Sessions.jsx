import React, { useState, useEffect } from 'react';
import { Plus, ClipboardList, Unlock, Lock, Trash2, X, Loader2, Calendar, Clock } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import api from '../../lib/api';

const LABS = ['Lab 1','Lab 2','Lab 3','Lab 4','Lab 5','Lab 6','Lab 7','Lab 8'];

function CreateModal({ onClose, onSuccess }) {
  const [form, setForm] = useState({
    name: '', lab: 'Lab 1', subject: '', department: '', year: '',
    instructor: '', date: '', startTime: '09:00', endTime: '11:00', isOpen: false,
  });
  const [busy, setBusy] = useState(false);
  const f = k => e => setForm(p => ({ ...p, [k]: e.target.value }));

  const submit = async e => {
    e.preventDefault();
    if (!form.name || !form.subject || !form.date) return toast.error('Name, subject & date required');
    setBusy(true);
    try {
      await api.post('/attendance/sessions', form);
      toast.success('Session created!');
      onSuccess();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setBusy(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bg/70 backdrop-blur-sm">
      <div className="glass rounded-2xl w-full max-w-lg shadow-card animate-slide-up">
        <div className="flex items-center justify-between p-6 border-b border-white/[0.07]">
          <div className="flex items-center gap-2">
            <ClipboardList size={18} className="text-green" />
            <h2 className="font-display font-700 text-white">Create Lab Session</h2>
          </div>
          <button onClick={onClose} className="text-muted hover:text-white"><X size={18} /></button>
        </div>

        <form onSubmit={submit} className="p-6 space-y-4">
          <div>
            <label className="text-xs font-mono text-muted uppercase tracking-wider block mb-1.5">Session Name *</label>
            <input className="input-field" placeholder="DBMS Lab — Experiment 5" value={form.name} onChange={f('name')} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-mono text-muted uppercase tracking-wider block mb-1.5">Lab *</label>
              <select className="input-field" value={form.lab} onChange={f('lab')}>
                {LABS.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-mono text-muted uppercase tracking-wider block mb-1.5">Subject *</label>
              <input className="input-field" placeholder="DBMS" value={form.subject} onChange={f('subject')} />
            </div>
            <div>
              <label className="text-xs font-mono text-muted uppercase tracking-wider block mb-1.5">Department</label>
              <input className="input-field" placeholder="Computer Engineering" value={form.department} onChange={f('department')} />
            </div>
            <div>
              <label className="text-xs font-mono text-muted uppercase tracking-wider block mb-1.5">Year</label>
              <select className="input-field" value={form.year} onChange={f('year')}>
                <option value="">All</option>
                {[1,2,3,4].map(y => <option key={y} value={y}>Year {y}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-mono text-muted uppercase tracking-wider block mb-1.5">Instructor</label>
              <input className="input-field" placeholder="Prof. Sharma" value={form.instructor} onChange={f('instructor')} />
            </div>
            <div>
              <label className="text-xs font-mono text-muted uppercase tracking-wider block mb-1.5">Date *</label>
              <input className="input-field" type="date" value={form.date} onChange={f('date')} />
            </div>
            <div>
              <label className="text-xs font-mono text-muted uppercase tracking-wider block mb-1.5">Start Time</label>
              <input className="input-field" type="time" value={form.startTime} onChange={f('startTime')} />
            </div>
            <div>
              <label className="text-xs font-mono text-muted uppercase tracking-wider block mb-1.5">End Time</label>
              <input className="input-field" type="time" value={form.endTime} onChange={f('endTime')} />
            </div>
          </div>
          <label className="flex items-center gap-3 cursor-pointer">
            <div className={`w-11 h-6 rounded-full transition-colors relative ${form.isOpen ? 'bg-green' : 'bg-surface border border-white/10'}`}
              onClick={() => setForm(p => ({ ...p, isOpen: !p.isOpen }))}>
              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${form.isOpen ? 'left-6' : 'left-1'}`} />
            </div>
            <span className="text-sm text-muted">Open for attendance immediately</span>
          </label>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-ghost flex-1">Cancel</button>
            <button type="submit" disabled={busy}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-display font-700 text-bg text-sm"
              style={{ background: 'linear-gradient(135deg,#00ff88,#00c86a)' }}>
              {busy ? <Loader2 size={15} className="animate-spin" /> : <Plus size={15} />}
              {busy ? 'Creating…' : 'Create Session'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AdminSessions() {
  const [sessions, setSessions] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [showCreate, setShowCreate] = useState(false);

  const fetchSessions = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/attendance/sessions');
      setSessions(data.sessions);
    } catch { toast.error('Failed to load sessions'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchSessions(); }, []);

  const toggleOpen = async (id, current) => {
    try {
      await api.patch(`/attendance/sessions/${id}`, { isOpen: !current });
      toast.success(!current ? '🔓 Session opened' : '🔒 Session closed');
      fetchSessions();
    } catch { toast.error('Update failed'); }
  };

  const deleteSession = async id => {
    if (!confirm('Delete this session and all its attendance records?')) return;
    try {
      await api.delete(`/attendance/sessions/${id}`);
      toast.success('Session deleted');
      fetchSessions();
    } catch { toast.error('Delete failed'); }
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display font-800 text-2xl text-white">Lab Sessions</h1>
          <p className="text-muted text-sm mt-0.5">{sessions.length} total sessions</p>
        </div>
        <button onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-display font-700 text-bg text-sm"
          style={{ background: 'linear-gradient(135deg,#00ff88,#00c86a)' }}>
          <Plus size={16} /> New Session
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48"><Loader2 size={24} className="animate-spin text-gold" /></div>
      ) : sessions.length === 0 ? (
        <div className="text-center py-16 text-muted"><ClipboardList size={40} className="mx-auto mb-3 opacity-30" /><p>No sessions yet.</p></div>
      ) : (
        <div className="space-y-3">
          {sessions.map(s => (
            <div key={s._id} className={`glass rounded-2xl p-5 flex items-center gap-4 transition-all ${s.isOpen ? 'border-green/20' : ''}`}>
              <div className={`w-3 h-3 rounded-full shrink-0 ${s.isOpen ? 'bg-green animate-pulse' : 'bg-muted'}`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-display font-700 text-white text-sm">{s.name}</p>
                  {s.isOpen && <span className="badge bg-green/10 text-green border border-green/20">OPEN</span>}
                </div>
                <div className="flex items-center gap-3 text-xs text-muted flex-wrap">
                  <span className="flex items-center gap-1"><ClipboardList size={11}/>{s.lab}</span>
                  <span>{s.subject}</span>
                  {s.department && <span>{s.department}</span>}
                  {s.year && <span>Year {s.year}</span>}
                  <span className="flex items-center gap-1"><Calendar size={11}/>{s.date ? format(new Date(s.date), 'dd MMM yyyy') : ''}</span>
                  <span className="flex items-center gap-1"><Clock size={11}/>{s.startTime} – {s.endTime}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button onClick={() => toggleOpen(s._id, s.isOpen)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-600 transition-all ${
                    s.isOpen
                      ? 'bg-red/10 text-red border border-red/20 hover:bg-red/20'
                      : 'bg-green/10 text-green border border-green/20 hover:bg-green/20'
                  }`}>
                  {s.isOpen ? <><Lock size={12}/>Close</> : <><Unlock size={12}/>Open</>}
                </button>
                <button onClick={() => deleteSession(s._id)}
                  className="p-1.5 text-muted hover:text-red transition-colors">
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showCreate && <CreateModal onClose={() => setShowCreate(false)} onSuccess={() => { setShowCreate(false); fetchSessions(); }} />}
    </div>
  );
}
