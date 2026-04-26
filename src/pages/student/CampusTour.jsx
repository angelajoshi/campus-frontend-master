import React, { useState } from 'react';
import { Maximize2, Globe2, Info, X } from 'lucide-react';

export default function CampusTour() {
  const [fullscreen, setFullscreen] = useState(false);
  const [showInfo,   setShowInfo]   = useState(true);

  const tourSrc = '/campus-tour.html'; // A-Frame tour served as static file

  return (
    <div className="flex flex-col h-full bg-bg">
      {/* Topbar */}
      {!fullscreen && (
        <div className="h-14 glass-sm border-b border-white/[0.07] flex items-center px-4 gap-3 shrink-0">
          <Globe2 size={16} className="text-cyan" />
          <div className="flex-1">
            <p className="text-sm font-display font-700 text-white leading-none">TCET Campus Tour</p>
            <p className="text-xs text-muted">Thakur College of Engineering &amp; Technology</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setShowInfo(s => !s)}
              className="p-2 rounded-lg border border-white/10 text-muted hover:text-white hover:border-white/20 transition-colors">
              <Info size={15} />
            </button>
            <button onClick={() => setFullscreen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-600 text-bg"
              style={{ background: 'linear-gradient(135deg,#00d8ff,#0094b3)' }}>
              <Maximize2 size={13} /> Fullscreen
            </button>
          </div>
        </div>
      )}

      {/* Info panel */}
      {showInfo && !fullscreen && (
        <div className="mx-4 mt-3 p-4 rounded-2xl border border-cyan/15 bg-cyan/5 flex items-start gap-3 animate-slide-up">
          <Info size={16} className="text-cyan mt-0.5 shrink-0" />
          <div className="flex-1 text-sm">
            <p className="font-600 text-white mb-1">How to navigate</p>
            <p className="text-muted text-xs leading-relaxed">
              Use <kbd className="px-1.5 py-0.5 rounded bg-white/10 font-mono text-[10px]">W A S D</kbd> or
              <kbd className="px-1.5 py-0.5 rounded bg-white/10 font-mono text-[10px] ml-1">↑↓←→</kbd> to move.
              Click + drag to look around. Hold <kbd className="px-1.5 py-0.5 rounded bg-white/10 font-mono text-[10px]">Shift</kbd> to sprint.
              Press <kbd className="px-1.5 py-0.5 rounded bg-white/10 font-mono text-[10px]">T</kbd> to start the guided tour.
              On mobile, use the on-screen joystick.
            </p>
          </div>
          <button onClick={() => setShowInfo(false)} className="text-muted hover:text-white shrink-0">
            <X size={14} />
          </button>
        </div>
      )}

      {/* Tour iframe */}
      <div className={`${fullscreen ? 'fixed inset-0 z-50' : 'flex-1 m-4 mt-3 rounded-2xl overflow-hidden border border-white/[0.07]'} relative`}>
        {fullscreen && (
          <button onClick={() => setFullscreen(false)}
            className="absolute top-4 right-4 z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-bg/80 backdrop-blur-sm border border-white/10 text-sm text-white hover:bg-bg transition-colors">
            <X size={14} /> Exit Fullscreen
          </button>
        )}
        <iframe
          src={tourSrc}
          className="w-full h-full border-none"
          allow="xr-spatial-tracking; camera; microphone; gyroscope; accelerometer"
          title="TCET Campus Tour"
          style={{ minHeight: fullscreen ? '100vh' : '500px' }}
        />
      </div>
    </div>
  );
}
