import React, { useState, useEffect, useCallback } from 'react';
import {
  CheckSquare, Clock, Loader2, CheckCircle2,
  AlertCircle, Calendar, RefreshCw, Info,
} from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import api from '../../lib/api';

/* ── small helpers ── */
const statusBadge = (status) =>
  status === 'present'
    ? 'bg-green/10 text-green border-green/20'
    : 'bg-gold/10 text-gold border-gold/20';

function SessionCard({ session, onMark, marking, alreadyMarked }) {
  const dateStr = session.date
    ? format(new Date(session.date), 'dd MMM yyyy')
    : '—';

  return (
    <div className="glass rounded-2xl p-5 flex flex-col gap-4 hover:border-green/20 transition-all">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-green animate-pulse shrink-0" />
            <p className="font-display font-700 text-white text-sm truncate">{session.name}</p>
          </div>
          <p className="text-xs text-muted">{session.subject}</p>
        </div>
        <span className="badge bg-green/10 text-green border border-green/20 text-[10px] shrink-0">
          OPEN
        </span>
      </div>

      {/* Details grid */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="flex items-center gap-1.5 text-muted">
          <Calendar size={11} />
          {dateStr}
        </div>
        <div className="flex items-center gap-1.5 text-muted">
          <Clock size={11} />
          {session.startTime} – {session.endTime}
        </div>
        <div className="text-muted col-span-2">
          🏛 {session.lab}
          {session.department && <span className="ml-2">· {session.department}</span>}
          {session.year && <span className="ml-2">· Year {session.year}</span>}
        </div>
        {session.instructor && (
          <div className="text-muted col-span-2">👤 {session.instructor}</div>
        )}
      </div>

      {/* Action */}
      {alreadyMarked ? (
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-green/5 border border-green/15 text-green text-sm">
          <CheckCircle2 size={14} />
          Attendance already marked
        </div>
      ) : (
        <button
          onClick={() => onMark(session._id)}
          disabled={marking === session._id}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-600 transition-all disabled:opacity-60"
          style={{ background: 'linear-gradient(135deg,#00ff88,#00cc6a)', color: '#040a18' }}
        >
          {marking === session._id
            ? <Loader2 size={14} className="animate-spin" />
            : <CheckSquare size={14} />}
          {marking === session._id ? 'Marking…' : 'Mark Present'}
        </button>
      )}
    </div>
  );
}

export default function StudentAttendance() {
  const [tab,       setTab]      = useState('open');
  const [sessions,  setSessions] = useState([]);
  const [myRecords, setMyRecords] = useState([]);
  const [loading,   setLoading]  = useState(true);
  const [refreshing,setRefreshing] = useState(false);
  const [marking,   setMarking]  = useState(null);

  /* IDs the student has already marked (for quick look-up) */
  const markedIds = new Set(myRecords.map(r =>
    typeof r.session === 'object' ? r.session?._id : r.session
  ));

  const fetchOpen = useCallback(async () => {
    const { data } = await api.get('/attendance/sessions?open=true');
    setSessions(data.sessions || []);
  }, []);

  const fetchMy = useCallback(async () => {
    const { data } = await api.get('/attendance/my');
    setMyRecords(data.records || []);
  }, []);

  const fetchAll = useCallback(async (quiet = false) => {
    if (!quiet) setLoading(true);
    else setRefreshing(true);
    try {
      await Promise.all([fetchOpen(), fetchMy()]);
    } catch {
      toast.error('Failed to load attendance data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [fetchOpen, fetchMy]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const markAttendance = async (sessionId) => {
    setMarking(sessionId);
    try {
      const { data } = await api.post('/attendance/mark', { sessionId });
      if (data.status === 'late') {
        toast('⏰ Marked as Late — you were more than 30 min after session start.', { icon: '⚠️' });
      } else {
        toast.success('✅ Attendance marked — Present!');
      }
      await fetchAll(true);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not mark attendance');
    } finally {
      setMarking(null);
    }
  };

  const openCount = sessions.length;
  const myTotal   = myRecords.length;
  const myPresent = myRecords.filter(r => r.status === 'present').length;
  const myLate    = myRecords.filter(r => r.status === 'late').length;

  return (
    <div className="p-6 lg:p-8">

      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display font-800 text-2xl text-white">Lab Attendance</h1>
          <p className="text-muted text-sm mt-0.5">Mark your presence for open lab sessions</p>
        </div>
        <button
          onClick={() => fetchAll(true)}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 text-sm text-muted hover:text-white hover:border-white/20 transition-all disabled:opacity-40"
        >
          <RefreshCw size={13} className={refreshing ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* ── Stats row ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Open Now',  value: openCount,  color: 'text-green' },
          { label: 'Total',     value: myTotal,    color: 'text-white' },
          { label: 'Present',   value: myPresent,  color: 'text-green' },
          { label: 'Late',      value: myLate,     color: 'text-gold'  },
        ].map(({ label, value, color }) => (
          <div key={label} className="glass rounded-xl p-4 text-center">
            <p className={`font-display font-800 text-2xl ${color}`}>{value}</p>
            <p className="text-xs text-muted mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* ── Tabs ── */}
      <div className="flex gap-1 p-1 rounded-xl bg-surface/50 border border-white/[0.06] mb-6 w-fit">
        {[
          { key: 'open', label: `Open Sessions${openCount ? ` (${openCount})` : ''}` },
          { key: 'my',   label: 'My History' },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`px-5 py-2 rounded-lg text-sm font-600 transition-all ${
              tab === key
                ? 'bg-green/15 text-green border border-green/20'
                : 'text-muted hover:text-white'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ── Content ── */}
      {loading ? (
        <div className="flex items-center justify-center h-48">
          <Loader2 size={24} className="animate-spin text-gold" />
        </div>

      ) : tab === 'open' ? (
        /* Open Sessions */
        sessions.length === 0 ? (
          <div className="text-center py-20">
            <Clock size={48} className="mx-auto mb-4 text-muted opacity-30" />
            <p className="font-display font-600 text-white text-lg">No open sessions right now</p>
            <p className="text-muted text-sm mt-1">Sessions are opened by your instructor. Check back later.</p>
            <div className="flex items-center justify-center gap-2 mt-4 text-xs text-muted bg-surface/40 border border-white/[0.06] rounded-xl px-4 py-3 w-fit mx-auto">
              <Info size={12} />
              Sessions auto-close based on the lab end time.
            </div>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sessions.map(s => (
              <SessionCard
                key={s._id}
                session={s}
                onMark={markAttendance}
                marking={marking}
                alreadyMarked={markedIds.has(s._id)}
              />
            ))}
          </div>
        )

      ) : (
        /* My Attendance History */
        myRecords.length === 0 ? (
          <div className="text-center py-20">
            <CheckSquare size={48} className="mx-auto mb-4 text-muted opacity-30" />
            <p className="font-display font-600 text-white text-lg">No records yet</p>
            <p className="text-muted text-sm mt-1">Your attendance history will appear here.</p>
          </div>
        ) : (
          <div className="glass rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-white/[0.07]">
                  <tr>
                    {['Session','Lab','Subject','Date','Marked At','Status'].map(h => (
                      <th key={h} className="px-5 py-3.5 text-left text-xs font-mono text-muted uppercase tracking-wider">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {myRecords.map(r => (
                    <tr key={r._id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-5 py-4 font-500 text-white whitespace-nowrap">
                        {r.session?.name || '—'}
                      </td>
                      <td className="px-5 py-4 text-muted text-xs">{r.session?.lab || '—'}</td>
                      <td className="px-5 py-4 text-muted text-xs">{r.session?.subject || '—'}</td>
                      <td className="px-5 py-4 text-muted font-mono text-xs">
                        {r.session?.date ? format(new Date(r.session.date), 'dd MMM yyyy') : '—'}
                      </td>
                      <td className="px-5 py-4 text-muted font-mono text-xs">
                        {r.markedAt ? format(new Date(r.markedAt), 'HH:mm') : '—'}
                      </td>
                      <td className="px-5 py-4">
                        <span className={`badge border ${statusBadge(r.status)}`}>
                          {r.status === 'present'
                            ? <CheckCircle2 size={10} className="mr-1" />
                            : <AlertCircle  size={10} className="mr-1" />}
                          {r.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      )}
    </div>
  );
}