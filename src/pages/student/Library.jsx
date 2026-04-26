import React, { useState, useEffect } from 'react';
import {
  BookOpen, Search, Download, Eye, X,
  Loader2, ExternalLink, Tag, ChevronLeft, ChevronRight,
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../lib/api';

/* ===================== Book Reader ===================== */
function BookReader({ book, onClose }) {
  const [iframeLoading, setIframeLoading] = useState(true);
  const [iframeError, setIframeError] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  const apiBase = import.meta.env.VITE_API_URL || '/api';
  const streamUrl = `${apiBase}/books/${book._id}/stream`;
  const dlUrl = `${apiBase}/books/${book._id}/download-file`;

  useEffect(() => {
    setIframeLoading(true);
    setIframeError(false);
    setReloadKey(prev => prev + 1);
  }, [book._id]);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const a = document.createElement('a');
      a.href = dlUrl;
      a.download = `${book.title}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      toast.success('Download started!');
    } catch {
      toast.error('Download failed');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-bg">

      {/* Topbar */}
      <div className="h-14 flex items-center px-4 gap-3 border-b border-white/10">
        <button onClick={onClose}><X /></button>
        <p className="text-white font-semibold truncate">{book.title}</p>

        <div className="ml-auto flex gap-2">
          <a href={streamUrl} target="_blank" rel="noreferrer">
            <ExternalLink size={16} />
          </a>
          <button onClick={handleDownload}>
            {downloading ? <Loader2 className="animate-spin" /> : <Download />}
          </button>
        </div>
      </div>

      {/* Viewer */}
      <div className="flex-1 relative">

        {iframeLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="animate-spin text-white" />
          </div>
        )}

        {iframeError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
            <p>Failed to load PDF</p>
            <a href={streamUrl} target="_blank">Open in new tab</a>
          </div>
        )}

        <iframe
          key={reloadKey}
          src={`${streamUrl}#toolbar=1&navpanes=0`}
          className="w-full h-full"
          onLoad={() => setIframeLoading(false)}
          onError={() => {
            setIframeLoading(false);
            setIframeError(true);
          }}
        />
      </div>
    </div>
  );
}

/* ===================== Library ===================== */
export default function Library() {
  const [books, setBooks] = useState([]);
  const [reader, setReader] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/books');
      setBooks(data.books);
    } catch {
      toast.error('Failed to load books');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBooks(); }, []);

  if (reader) return <BookReader book={reader} onClose={() => setReader(null)} />;

  return (
    <div className="p-6">

      <h1 className="text-white text-xl font-bold mb-6">Library</h1>

      {loading ? (
        <Loader2 className="animate-spin text-white" />
      ) : (
        <div className="grid grid-cols-3 gap-4">

          {books.map((book) => (
            <div
              key={book._id}   
              onClick={() => setReader(book)}
              className="p-4 bg-gray-800 cursor-pointer rounded"
            >
              <p className="text-white font-semibold">{book.title}</p>
              <p className="text-gray-400 text-sm">{book.author}</p>
            </div>
          ))}

        </div>
      )}
    </div>
  );
}