import React, { useState, useEffect, useRef } from 'react';
import { Upload, BookOpen, Trash2, Edit3, Eye, Download, X, Plus, Search, Loader2, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../lib/api';

function UploadModal({ onClose, onSuccess }) {
  const [form, setForm] = useState({
    title: '', author: '', description: '', subject: '',
    department: 'General', year: '', isbn: '', edition: '', tags: '', pages: '',
  });
  const [pdfFile,   setPdfFile]   = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [busy, setBusy] = useState(false);
  const pdfRef   = useRef();
  const coverRef = useRef();

  const submit = async e => {
    e.preventDefault();
    if (!pdfFile) return toast.error('PDF is required');
    if (!form.title || !form.author || !form.subject) return toast.error('Title, author, subject required');

    setBusy(true);
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => { if (v) fd.append(k, v); });
    fd.append('pdf', pdfFile);
    if (coverFile) fd.append('cover', coverFile);

    try {
      await api.post('/books', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Book uploaded successfully!');
      onSuccess();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    } finally {
      setBusy(false);
    }
  };

  const f = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bg/70 backdrop-blur-sm">
      <div className="glass rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-card animate-slide-up">
        <div className="flex items-center justify-between p-6 border-b border-white/[0.07]">
          <div className="flex items-center gap-2">
            <Upload size={18} className="text-gold" />
            <h2 className="font-display font-700 text-white">Upload Book</h2>
          </div>
          <button onClick={onClose} className="text-muted hover:text-white"><X size={18} /></button>
        </div>

        <form onSubmit={submit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="text-xs font-mono text-muted uppercase tracking-wider block mb-1.5">Title *</label>
              <input className="input-field" placeholder="Introduction to Data Structures" value={form.title} onChange={f('title')} />
            </div>
            <div>
              <label className="text-xs font-mono text-muted uppercase tracking-wider block mb-1.5">Author *</label>
              <input className="input-field" placeholder="Mark Allen Weiss" value={form.author} onChange={f('author')} />
            </div>
            <div>
              <label className="text-xs font-mono text-muted uppercase tracking-wider block mb-1.5">Subject *</label>
              <input className="input-field" placeholder="Data Structures" value={form.subject} onChange={f('subject')} />
            </div>
            <div>
              <label className="text-xs font-mono text-muted uppercase tracking-wider block mb-1.5">Department</label>
              <select className="input-field" value={form.department} onChange={f('department')}>
                {['General','Computer Engineering','IT','Electronics','Mechanical','Civil'].map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-mono text-muted uppercase tracking-wider block mb-1.5">Year</label>
              <select className="input-field" value={form.year} onChange={f('year')}>
                <option value="">All Years</option>
                {[1,2,3,4].map(y => <option key={y} value={y}>Year {y}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-mono text-muted uppercase tracking-wider block mb-1.5">ISBN</label>
              <input className="input-field" placeholder="978-3-16-148410-0" value={form.isbn} onChange={f('isbn')} />
            </div>
            <div>
              <label className="text-xs font-mono text-muted uppercase tracking-wider block mb-1.5">Edition</label>
              <input className="input-field" placeholder="3rd Edition" value={form.edition} onChange={f('edition')} />
            </div>
            <div>
              <label className="text-xs font-mono text-muted uppercase tracking-wider block mb-1.5">Pages</label>
              <input className="input-field" type="number" placeholder="350" value={form.pages} onChange={f('pages')} />
            </div>
            <div>
              <label className="text-xs font-mono text-muted uppercase tracking-wider block mb-1.5">Tags (comma-separated)</label>
              <input className="input-field" placeholder="algorithms, cs, fundamentals" value={form.tags} onChange={f('tags')} />
            </div>
            <div className="col-span-2">
              <label className="text-xs font-mono text-muted uppercase tracking-wider block mb-1.5">Description</label>
              <textarea className="input-field resize-none" rows={3} placeholder="Brief description of the book…" value={form.description} onChange={f('description')} />
            </div>
          </div>

          {/* File uploads */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-mono text-muted uppercase tracking-wider block mb-1.5">PDF File *</label>
              <div onClick={() => pdfRef.current.click()}
                className="border-2 border-dashed border-white/10 hover:border-gold/30 rounded-xl p-4 text-center cursor-pointer transition-colors">
                <input ref={pdfRef} type="file" accept=".pdf" className="hidden" onChange={e => setPdfFile(e.target.files[0])} />
                <BookOpen size={20} className="mx-auto text-muted mb-2" />
                <p className="text-xs text-muted">{pdfFile ? pdfFile.name : 'Click to select PDF'}</p>
                {pdfFile && <p className="text-xs text-gold mt-1">{(pdfFile.size/1024/1024).toFixed(1)} MB</p>}
              </div>
            </div>
            <div>
              <label className="text-xs font-mono text-muted uppercase tracking-wider block mb-1.5">Cover Image (optional)</label>
              <div onClick={() => coverRef.current.click()}
                className="border-2 border-dashed border-white/10 hover:border-gold/30 rounded-xl p-4 text-center cursor-pointer transition-colors">
                <input ref={coverRef} type="file" accept="image/*" className="hidden" onChange={e => setCoverFile(e.target.files[0])} />
                {coverFile
                  ? <img src={URL.createObjectURL(coverFile)} className="h-16 mx-auto object-cover rounded" alt="cover" />
                  : <><Upload size={20} className="mx-auto text-muted mb-2" /><p className="text-xs text-muted">Click to select image</p></>
                }
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-ghost flex-1">Cancel</button>
            <button type="submit" disabled={busy}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-display font-700 text-bg"
              style={{ background: 'linear-gradient(135deg,#e8b84b,#ffd87a)' }}>
              {busy ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
              {busy ? 'Uploading…' : 'Upload Book'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AdminBooks() {
  const [books,  setBooks]  = useState([]);
  const [total,  setTotal]  = useState(0);
  const [page,   setPage]   = useState(1);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/books', { params: { page, search: search || undefined, limit: 12 } });
      setBooks(data.books);
      setTotal(data.total);
    } catch { toast.error('Failed to load books'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchBooks(); }, [page, search]);

  const deleteBook = async (id) => {
    if (!confirm('Delete this book? This cannot be undone.')) return;
    try {
      await api.delete(`/books/${id}`);
      toast.success('Book deleted');
      fetchBooks();
    } catch { toast.error('Delete failed'); }
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display font-800 text-2xl text-white">Library Books</h1>
          <p className="text-muted text-sm mt-0.5">{total} books in collection</p>
        </div>
        <button onClick={() => setShowUpload(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-display font-700 text-bg text-sm"
          style={{ background: 'linear-gradient(135deg,#e8b84b,#ffd87a)' }}>
          <Plus size={16} /> Upload Book
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
        <input className="input-field pl-10" placeholder="Search books by title, author, subject…"
          value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
      </div>

      {/* Books grid */}
      {loading ? (
        <div className="flex items-center justify-center h-48">
          <Loader2 size={24} className="animate-spin text-gold" />
        </div>
      ) : books.length === 0 ? (
        <div className="text-center py-16 text-muted">
          <BookOpen size={40} className="mx-auto mb-3 opacity-30" />
          <p>No books found. Upload your first book!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {books.map(book => (
            <div key={book._id} className="glass rounded-2xl overflow-hidden group hover:border-gold/20 transition-colors">
              {/* Cover */}
              <div className="h-36 bg-gradient-to-br from-gold/10 to-surface flex items-center justify-center relative">
                {book.coverUrl
                  ? <img src={book.coverUrl} className="h-full w-full object-cover" alt={book.title} />
                  : <BookOpen size={32} className="text-gold/40" />
                }
                <div className="absolute inset-0 bg-bg/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <a href={book.pdfUrl} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-gold/20 border border-gold/30 flex items-center justify-center hover:bg-gold/40 transition-colors">
                    <ExternalLink size={13} className="text-gold" />
                  </a>
                  <button onClick={() => deleteBook(book._id)} className="w-8 h-8 rounded-full bg-red/20 border border-red/30 flex items-center justify-center hover:bg-red/40 transition-colors">
                    <Trash2 size={13} className="text-red" />
                  </button>
                </div>
              </div>
              {/* Info */}
              <div className="p-4">
                <p className="font-display font-700 text-sm text-white leading-tight mb-1 line-clamp-2">{book.title}</p>
                <p className="text-xs text-muted mb-3">{book.author}</p>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="badge bg-gold/10 text-gold border border-gold/15">{book.subject}</span>
                  <span className="badge bg-surface text-muted border border-white/[0.06]">{book.department}</span>
                </div>
                <div className="flex items-center gap-3 mt-3 pt-3 border-t border-white/[0.06]">
                  <span className="text-xs text-muted flex items-center gap-1"><Eye size={11} />{book.viewCount}</span>
                  <span className="text-xs text-muted flex items-center gap-1"><Download size={11} />{book.downloadCount}</span>
                  {book.pages && <span className="text-xs text-muted">{book.pages}p</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {total > 12 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="btn-ghost disabled:opacity-30 text-sm">← Prev</button>
          <span className="text-muted text-sm font-mono">Page {page}</span>
          <button disabled={page * 12 >= total} onClick={() => setPage(p => p + 1)} className="btn-ghost disabled:opacity-30 text-sm">Next →</button>
        </div>
      )}

      {showUpload && <UploadModal onClose={() => setShowUpload(false)} onSuccess={() => { setShowUpload(false); fetchBooks(); }} />}
    </div>
  );
}
