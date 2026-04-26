import React, { useState, useEffect } from 'react';
import { Users, Search, Loader2, Mail } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import api from '../../lib/api';

export default function AdminStudents() {
  const [students, setStudents] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [search,   setSearch]   = useState('');

  useEffect(() => {
    setLoading(true);
    api.get('/users', { params: { role: 'student', search: search || undefined } })
      .then(r => setStudents(r.data.users))
      .catch(() => toast.error('Failed to load'))
      .finally(() => setLoading(false));
  }, [search]);

  const toggleActive = async (id, active) => {
    try {
      await api.patch(`/users/${id}`, { isActive: !active });
      toast.success(!active ? 'Account activated' : 'Account deactivated');
      setStudents(p => p.map(s => s._id === id ? { ...s, isActive: !active } : s));
    } catch { toast.error('Update failed'); }
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="font-display font-800 text-2xl text-white">Students</h1>
        <p className="text-muted text-sm mt-0.5">{students.length} registered</p>
      </div>

      <div className="relative mb-6">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
        <input className="input-field pl-10" placeholder="Search by name, email, roll number…"
          value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48"><Loader2 size={24} className="animate-spin text-gold" /></div>
      ) : (
        <div className="glass rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-white/[0.07]">
                <tr className="text-left">
                  {['Student','Roll No.','Dept','Year','Joined','Status'].map(h => (
                    <th key={h} className="px-5 py-3.5 text-xs font-mono text-muted uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {students.map(s => (
                  <tr key={s._id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-cyan/10 border border-cyan/20 flex items-center justify-center text-cyan font-700 text-xs shrink-0">
                          {s.name?.[0]?.toUpperCase()}
                        </div>
                        <div>
                          <p className="font-500 text-white">{s.name}</p>
                          <p className="text-xs text-muted flex items-center gap-1"><Mail size={10}/>{s.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 font-mono text-xs text-muted">{s.rollNumber || '—'}</td>
                    <td className="px-5 py-4 text-muted text-xs">{s.department || '—'}</td>
                    <td className="px-5 py-4 text-muted text-xs">{s.year ? `Year ${s.year}` : '—'}</td>
                    <td className="px-5 py-4 text-muted text-xs font-mono">{format(new Date(s.createdAt), 'dd MMM yy')}</td>
                    <td className="px-5 py-4">
                      <button onClick={() => toggleActive(s._id, s.isActive)}
                        className={`badge cursor-pointer ${s.isActive ? 'bg-green/10 text-green border border-green/20' : 'bg-red/10 text-red border border-red/20'}`}>
                        {s.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {students.length === 0 && (
              <div className="text-center py-12 text-muted">
                <Users size={32} className="mx-auto mb-3 opacity-30" />
                <p>No students found.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
