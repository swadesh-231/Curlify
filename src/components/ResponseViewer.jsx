import { useState } from 'react';
import useStore from '../store/useStore';
import JsonTree from './JsonTree';

function StatusBadge({ status, statusText }) {
  let color = 'bg-zinc-100 text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300';
  if (status >= 200 && status < 300) color = 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400';
  else if (status >= 300 && status < 400) color = 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400';
  else if (status >= 400 && status < 500) color = 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400';
  else if (status >= 500) color = 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400';

  return (
    <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${color}`}>
      {status} {statusText}
    </span>
  );
}

function TimeBadge({ ms }) {
  let color = 'text-green-600 dark:text-green-400';
  if (ms > 1000) color = 'text-amber-600 dark:text-amber-400';
  if (ms > 3000) color = 'text-red-600 dark:text-red-400';

  return (
    <span className={`text-xs font-mono font-medium ${color}`}>
      {ms < 1000 ? `${ms}ms` : `${(ms / 1000).toFixed(2)}s`}
    </span>
  );
}

export default function ResponseViewer() {
  const response = useStore((s) => s.response);
  const loading = useStore((s) => s.loading);
  const error = useStore((s) => s.error);
  const responseTime = useStore((s) => s.responseTime);
  const [viewMode, setViewMode] = useState('pretty');
  const [showHeaders, setShowHeaders] = useState(false);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center space-y-3">
          <svg className="animate-spin h-8 w-8 text-blue-500 mx-auto" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Sending request...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full px-6">
        <div className="text-center space-y-2 max-w-sm">
          <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto">
            <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor" className="text-red-500">
              <path d="M8 1a7 7 0 100 14A7 7 0 008 1zm-.75 4a.75.75 0 011.5 0v3a.75.75 0 01-1.5 0V5zm.75 6.5a.75.75 0 100-1.5.75.75 0 000 1.5z" />
            </svg>
          </div>
          <p className="text-sm font-medium text-red-600 dark:text-red-400">{error}</p>
          {responseTime !== null && (
            <p className="text-xs text-zinc-400">after {responseTime}ms</p>
          )}
        </div>
      </div>
    );
  }

  if (!response) {
    return (
      <div className="flex items-center justify-center h-full px-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mx-auto">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-zinc-400">
              <path d="M13 10V3L4 14h7v7l9-11h-7z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <p className="text-sm text-zinc-400 dark:text-zinc-500">Send a request to see the response</p>
          <p className="text-xs text-zinc-300 dark:text-zinc-600">Ctrl+Enter to send</p>
        </div>
      </div>
    );
  }

  const prettyJson = response.isJson ? JSON.stringify(response.data, null, 2) : null;
  const rawText = response.isJson ? JSON.stringify(response.data) : String(response.data);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Status bar */}
      <div className="px-5 py-3 border-b border-zinc-200 dark:border-zinc-700/50 flex items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3">
          <StatusBadge status={response.status} statusText={response.statusText} />
          {responseTime !== null && <TimeBadge ms={responseTime} />}
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setShowHeaders(!showHeaders)}
            className={`px-2.5 py-1 text-xs rounded-md transition-colors ${
              showHeaders
                ? 'bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-200'
                : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
            }`}
          >
            Headers
          </button>
          <button
            onClick={() => setViewMode('pretty')}
            className={`px-2.5 py-1 text-xs rounded-md transition-colors ${
              viewMode === 'pretty'
                ? 'bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-200'
                : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
            }`}
          >
            Pretty
          </button>
          <button
            onClick={() => setViewMode('raw')}
            className={`px-2.5 py-1 text-xs rounded-md transition-colors ${
              viewMode === 'raw'
                ? 'bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-200'
                : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
            }`}
          >
            Raw
          </button>
          <button
            onClick={() => setViewMode('tree')}
            disabled={!response.isJson}
            className={`px-2.5 py-1 text-xs rounded-md transition-colors disabled:opacity-30 disabled:cursor-not-allowed ${
              viewMode === 'tree'
                ? 'bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-200'
                : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
            }`}
          >
            Tree
          </button>
        </div>
      </div>

      {/* Response headers */}
      {showHeaders && (
        <div className="px-5 py-3 border-b border-zinc-200 dark:border-zinc-700/50 bg-zinc-50/50 dark:bg-zinc-800/30 shrink-0 max-h-48 overflow-y-auto">
          <div className="space-y-1">
            {Object.entries(response.headers).map(([key, value]) => (
              <div key={key} className="flex gap-2 text-xs font-mono">
                <span className="text-purple-600 dark:text-purple-400 shrink-0">{key}:</span>
                <span className="text-zinc-600 dark:text-zinc-400 break-all">{value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Body */}
      <div className="flex-1 overflow-auto p-5">
        {viewMode === 'pretty' && response.isJson && (
          <pre className="text-xs font-mono text-zinc-800 dark:text-zinc-200 whitespace-pre-wrap break-words leading-5">
            {prettyJson}
          </pre>
        )}
        {viewMode === 'pretty' && !response.isJson && (
          <pre className="text-xs font-mono text-zinc-800 dark:text-zinc-200 whitespace-pre-wrap break-words leading-5">
            {rawText}
          </pre>
        )}
        {viewMode === 'raw' && (
          <pre className="text-xs font-mono text-zinc-600 dark:text-zinc-400 whitespace-pre-wrap break-all leading-5">
            {rawText}
          </pre>
        )}
        {viewMode === 'tree' && response.isJson && <JsonTree data={response.data} />}
      </div>
    </div>
  );
}
