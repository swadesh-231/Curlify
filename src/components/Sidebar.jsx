import { useState, useCallback } from 'react';
import useStore from '../store/useStore';

const METHOD_COLORS = {
  GET: 'text-green-600 dark:text-green-400',
  POST: 'text-blue-600 dark:text-blue-400',
  PUT: 'text-amber-600 dark:text-amber-400',
  PATCH: 'text-purple-600 dark:text-purple-400',
  DELETE: 'text-red-600 dark:text-red-400',
};

function truncateUrl(url, max = 28) {
  if (!url) return '';
  try {
    const u = new URL(url);
    const path = u.pathname + u.search;
    return path.length > max ? path.slice(0, max) + '...' : path;
  } catch {
    return url.length > max ? url.slice(0, max) + '...' : url;
  }
}

function formatTime(iso) {
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now - d;
  const diffMin = Math.floor(diffMs / 60000);

  if (diffMin < 1) return 'just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export default function Sidebar({ onNavigate }) {
  const history = useStore((s) => s.history);
  const saved = useStore((s) => s.saved);
  const loadRequest = useStore((s) => s.loadRequest);
  const clearHistory = useStore((s) => s.clearHistory);
  const saveCurrentRequest = useStore((s) => s.saveCurrentRequest);
  const deleteSaved = useStore((s) => s.deleteSaved);
  const url = useStore((s) => s.url);

  const [tab, setTab] = useState('history');
  const [saveName, setSaveName] = useState('');
  const [showSaveInput, setShowSaveInput] = useState(false);

  const handleSave = useCallback(() => {
    if (!saveName.trim()) return;
    saveCurrentRequest(saveName.trim());
    setSaveName('');
    setShowSaveInput(false);
    setTab('saved');
  }, [saveName, saveCurrentRequest]);

  const handleSaveKeyDown = useCallback(
    (e) => {
      if (e.key === 'Enter') handleSave();
      if (e.key === 'Escape') {
        setShowSaveInput(false);
        setSaveName('');
      }
    },
    [handleSave]
  );

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Logo */}
      <div className="px-4 py-3.5 border-b border-zinc-200 dark:border-zinc-700/50">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-blue-600 flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
              <path d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 className="text-sm font-bold text-zinc-800 dark:text-zinc-100 tracking-tight">Curlify</h1>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-zinc-200 dark:border-zinc-700/50">
        <button
          onClick={() => setTab('history')}
          className={`flex-1 py-2 text-xs font-semibold transition-colors ${
            tab === 'history'
              ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
              : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'
          }`}
        >
          History
        </button>
        <button
          onClick={() => setTab('saved')}
          className={`flex-1 py-2 text-xs font-semibold transition-colors ${
            tab === 'saved'
              ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
              : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'
          }`}
        >
          Saved
        </button>
      </div>

      {/* Actions bar */}
      <div className="px-3 py-2 border-b border-zinc-200 dark:border-zinc-700/50 flex gap-2">
        {tab === 'history' && history.length > 0 && (
          <button
            onClick={clearHistory}
            className="text-[11px] text-zinc-400 hover:text-red-500 transition-colors"
          >
            Clear all
          </button>
        )}
        {tab === 'saved' && (
          <>
            {!showSaveInput ? (
              <button
                onClick={() => {
                  if (!url.trim()) return;
                  setShowSaveInput(true);
                }}
                disabled={!url.trim()}
                className="text-[11px] text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                + Save current
              </button>
            ) : (
              <div className="flex gap-1.5 w-full">
                <input
                  type="text"
                  value={saveName}
                  onChange={(e) => setSaveName(e.target.value)}
                  onKeyDown={handleSaveKeyDown}
                  placeholder="Request name"
                  autoFocus
                  className="flex-1 px-2 py-1 text-xs rounded border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-blue-500/40"
                />
                <button
                  onClick={handleSave}
                  className="px-2 py-1 text-xs text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors"
                >
                  Save
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {tab === 'history' && (
          <>
            {history.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <p className="text-xs text-zinc-400 dark:text-zinc-500">No history yet</p>
              </div>
            ) : (
              <div className="py-1">
                {history.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => { loadRequest(item); onNavigate?.(); }}
                    className="w-full text-left px-4 py-2.5 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-colors group"
                  >
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold tracking-wide ${METHOD_COLORS[item.method]} shrink-0 w-10`}>
                        {item.method}
                      </span>
                      <span className="text-xs text-zinc-600 dark:text-zinc-400 font-mono truncate">
                        {truncateUrl(item.url)}
                      </span>
                    </div>
                    <p className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-0.5 pl-12">
                      {formatTime(item.timestamp)}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </>
        )}

        {tab === 'saved' && (
          <>
            {saved.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <p className="text-xs text-zinc-400 dark:text-zinc-500">No saved requests</p>
              </div>
            ) : (
              <div className="py-1">
                {saved.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center px-4 py-2.5 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-colors group"
                  >
                    <button
                      onClick={() => { loadRequest(item); onNavigate?.(); }}
                      className="flex-1 text-left min-w-0"
                    >
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold tracking-wide ${METHOD_COLORS[item.method]} shrink-0 w-10`}>
                          {item.method}
                        </span>
                        <span className="text-xs text-zinc-700 dark:text-zinc-300 font-medium truncate">
                          {item.name}
                        </span>
                      </div>
                      <p className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-0.5 pl-12 font-mono truncate">
                        {truncateUrl(item.url)}
                      </p>
                    </button>
                    <button
                      onClick={() => deleteSaved(item.id)}
                      className="p-1 text-zinc-300 dark:text-zinc-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all shrink-0"
                      title="Delete"
                    >
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="4" y1="4" x2="12" y2="12" />
                        <line x1="12" y1="4" x2="4" y2="12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
