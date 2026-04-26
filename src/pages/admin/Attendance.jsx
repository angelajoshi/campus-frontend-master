import React, { useState, useEffect } from 'react';
import { CheckSquare, Users, Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import api from '../../lib/api';

export default function AdminAttendance() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [expanded, setExpanded] = useState(null);
  const [records,  setRecords]  = useState({});
  const [fetching, setFetching] = useState(null);

  useEffect(() => {
    api.get('/attendance/sessions').then(r => setSessions(r.data.sessions)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const expand = async (id) => {
    if (expanded === id) { setExpanded(null); return; }
    setExpanded(id);
    if (records[id]) return;
    setFetching(id);
    try {
      const { data } = await api.get(`/attendance/session/${id}`);
      setRecords(p => ({ ...p, [id]: data }));
    } catch { toast.error('Failed to load records'); }
    finally { setFetching(null); }
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="font-display font-800 text-2xl text-white">Attendance Logs</h1>
        <p className="text-muted text-sm mt-0.5">Click a session to view who attended</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48"><Loader2 size={24} className="animate-spin text-gold" /></div>
      ) : (
        <div className="space-y-3">
          {sessions.map(s => (
            <div key={s._id} className="glass rounded-2xl overflow-hidden">
              <button onClick={() => expand(s._id)}
                className="w-full flex items-center gap-4 p-5 text-left hover:bg-white/[0.02] transition-colors">
                <div className={`w-3 h-3 rounded-full shrink-0 ${s.isOpen ? 'bg-green animate-pulse' : 'bg-muted'}`} />
                <div className="flex-1 min-w-0">
                  <p className="font-display font-700 text-white text-sm">{s.name}</p>
                  <p className="text-xs text-muted mt-0.5">{s.lab} · {s.subject} · {s.date ? format(new Date(s.date), 'dd MMM yyyy') : ''} · {s.startTime}–{s.endTime}</p>
                </div>
                {expanded === s._id ? <ChevronUp size={16} className="text-muted" /> : <ChevronDown size={16} className="text-muted" />}
              </button>

              {expanded === s._id && (
                <div className="border-t border-white/[0.06] px-5 pb-5">
                  {fetching === s._id ? (
                    <div className="flex items-center justify-center py-8"><Loader2 size={20} className="animate-spin text-gold" /></div>
                  ) : records[s._id] ? (
                    <>
                      <div className="flex items-center gap-2 pt-4 mb-4">
                        <Users size={14} className="text-muted" />
                        <span className="text-sm text-muted">{records[s._id].total} students attended</span>
                      </div>
                      {records[s._id].total === 0 ? (
                        <p className="text-muted text-sm text-center py-4">No attendance recorded yet.</p>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="text-left border-b border-white/[0.06]">
                                {['Name','Roll No.','Department','Year','Status','Time'].map(h => (
                                  <th key={h} className="pb-2 pr-4 text-xs font-mono text-muted uppercase tracking-wider">{h}</th>
                                ))}
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-white/[0.04]">
                              {records[s._id].records.map(r => (
                                <tr key={r._id}>
                                  <td className="py-2.5 pr-4 text-white font-500">{r.student?.name}</td>
                                  <td className="py-2.5 pr-4 text-muted font-mono text-xs">{r.student?.rollNumber || '—'}</td>
                                  <td className="py-2.5 pr-4 text-muted text-xs">{r.student?.department || '—'}</td>
                                  <td className="py-2.5 pr-4 text-muted text-xs">{r.student?.year || '—'}</td>
                                  <td className="py-2.5 pr-4">
                                    <span className={`badge ${r.status === 'present' ? 'bg-green/10 text-green border-green/20' : 'bg-gold/10 text-gold border-gold/20'}`}>
                                      {r.status}
                                    </span>
                                  </td>
                                  <td className="py-2.5 text-muted font-mono text-xs">{format(new Date(r.markedAt), 'HH:mm:ss')}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </>
                  ) : null}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
